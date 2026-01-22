import spacy
import re
import json
from rapidfuzz import process, fuzz

nlp = spacy.load("en_core_web_sm")

# Load synonyms from DB (initially empty, loaded on startup)
SYNONYM_MAP = {
    "categories": {
        "shoes": ["footwear", "sneakers", "kicks", "trainers", "runners", "sports shoes", "running shoes"],
        "shirts": ["shirt", "tshirt", "t-shirt", "top", "tee", "polo", "formal shirt", "casual shirt", "shirst", "shirsts"],
        "phone": ["mobile", "smartphone", "cellphone", "handset", "iphone", "android"],
        "earphone": ["earphones", "earbuds", "headphones", "headset", "airpods", "tws", "wireless earbuds"],
        "laptop": ["laptops", "notebook", "computer", "macbook", "chromebook", "ultrabook"],
        "watches": ["watch", "smartwatch", "wristwatch", "timepiece", "fitness band"],
    },
    "brands": {
        "nike": ["nikes"],
        "adidas": ["addidas", "adiddas"],
        "samsung": ["samung", "samsng"],
        "apple": ["iphone", "macbook", "airpods"],
        "oneplus": ["one plus", "1+"],
        "xiaomi": ["mi", "redmi", "poco"],
    }
}

MULTIWORD_SYNONYM_PATTERNS = [
    (r"smart phones?", "smartphone"),
    (r"running shoes?", "sports shoes"),
    (r"t-?shirts?", "shirts"),
    (r"ear ?phones?", "earphone"),
    (r"ear ?buds?", "earphone"),
    (r"head ?phones?", "earphone"),
    (r"wrist ?watch", "watches"),
    (r"smart ?watch", "watches"),
    (r"lap ?top", "laptop"),
]


STOP_WORDS = {"suggest", "sugges", "show", "tell", "find", "give", "want", "need", "looking", "for", "me", "i", "a", "an", "the", "some", "thsi", "this", "search", "please", "can", "you", "best", "good", "nice", "great", "suggested", "suggestion"}

# All categories from seeded products
RAW_CATEGORIES = [
    # Seeded product categories
    "shoes", "phone", "earphone", "shirts", "watches", "laptop",
    # Additional footwear
    "sandals", "boots", "heels", "flats", "slippers", "sneakers",
    # Additional clothing
    "pants", "jeans", "jackets", "dresses",
    # Additional electronics  
    "mobile", "smartphone", "tablet", "camera",
    # Accessories
    "bags", "wallets", "belts"
]

COLORS = ["red", "blue", "black", "white", "green", "yellow", "pink", "brown", "grey", "gray", "orange", "purple", "silver", "gold", "navy", "maroon", "beige"]
GENDERS = ["men", "women", "boys", "girls", "unisex", "male", "female", "mens", "womens", "kids"]

# All brands from seeded products + common typos
BRANDS = [
    # Shoes brands
    "nike", "adidas", "puma", "reebok", "campus", "sparx", "bata", "woodland",
    # Phone brands
    "apple", "samsung", "oneplus", "xiaomi", "realme", "vivo", "oppo", "motorola",
    # Earphone brands
    "sony", "boat", "jbl", "noise", "boult",
    # Shirt brands
    "allen solly", "peter england", "van heusen", "louis philippe", "arrow", "ucb",
    # Watch brands
    "titan", "fastrack", "casio", "fossil", "sonata", "timex",
    # Laptop brands
    "hp", "dell", "lenovo", "asus", "acer", "msi",
    # Other common
    "skechers", "new balance", "asics", "fila", "converse", "vans", "red tape", "h&m", "zara", "crocs"
]


def lemmatize_list(word_list):
    return list(set([token.lemma_ for token in nlp(" ".join(word_list))]))

CATEGORIES = lemmatize_list(RAW_CATEGORIES)

def update_entities(new_brands=None, new_categories=None):
    global BRANDS, RAW_CATEGORIES, CATEGORIES
    
    if new_brands:
        # Add new brands if not present
        normalized_brands = [b.lower() for b in new_brands]
        BRANDS = list(set(BRANDS + normalized_brands))
        print(f"NLP Knowledge Base Updated: {len(BRANDS)} brands.")
        
    if new_categories:
        normalized_cats = [c.lower() for c in new_categories]
        RAW_CATEGORIES = list(set(RAW_CATEGORIES + normalized_cats))
        CATEGORIES = lemmatize_list(RAW_CATEGORIES)
        print(f"NLP Knowledge Base Updated: {len(RAW_CATEGORIES)} categories.")

def add_synonyms(field, key, new_synonyms):
    """
    field: 'categories', 'brands'
    key: 'shoes', 'nike'
    new_synonyms: ['kicks']
    """
    global SYNONYM_MAP
    from app.db import synonym_collection
    
    if field not in SYNONYM_MAP:
        SYNONYM_MAP[field] = {}
        
    current_list = SYNONYM_MAP[field].get(key, [])
    # Add only new unique synonyms
    updated_list = list(set(current_list + [s.lower() for s in new_synonyms]))
    
    if len(updated_list) > len(current_list):
        SYNONYM_MAP[field][key] = updated_list
        print(f"InMemory Synonyms updated for {field}/{key}: {new_synonyms}")
        
        # Persist to MongoDB
        try:
            synonym_collection.update_one(
                {"_id": field},
                {"$addToSet": {f"data.{key}": {"$each": [s.lower() for s in new_synonyms]}}},
                upsert=True
            )
            print(f"MongoDB Synonyms updated for {field}/{key}")
        except Exception as e:
            print(f"Failed to save synonyms to DB: {e}")

def load_synonyms_from_db():
    global SYNONYM_MAP
    from app.db import synonym_collection
    
    print("Loading synonyms from MongoDB...")
    try:
        docs = list(synonym_collection.find({}))
        for doc in docs:
            _id = doc["_id"] # 'categories', 'brands'
            data = doc.get("data", {})
            SYNONYM_MAP[_id] = data
        print(f"Loaded synonyms for {list(SYNONYM_MAP.keys())}")
    except Exception as e:
        print(f"Error loading synonyms from DB: {e}")

PRICE_PATTERNS = [
    (r"between (\d+) and (\d+)", "between"),
    (r"(?:under|below|less than)\s*\$?(\d+)", "<"),
    (r"(?:above|over|greater than)\s*\$?(\d+)", ">"),
    (r"(?:upto|up to)\s*\$?(\d+)", "<="),
]

def fuzzy_match(token, choices, threshold=75):
    match, score, _ = process.extractOne(token, choices, scorer=fuzz.ratio)
    return match if score >= threshold else None

def normalize_token(token):
    token = token.lower()
    for field in ["categories", "brands", "colors", "genders"]:
        if field in SYNONYM_MAP:
            for key, synonyms in SYNONYM_MAP[field].items():
                if token in synonyms:
                    return key
    return token

def apply_multiword_synonyms(query):
    for pattern, replacement in MULTIWORD_SYNONYM_PATTERNS:
        query = re.sub(pattern, replacement, query, flags=re.IGNORECASE)
    return query

def parse_query(query):
    query = query.lower()
    query = apply_multiword_synonyms(query)
    doc = nlp(query)

    result = {
        "keywords": [],
        "category": None,
        "brand": None,
        "color": None,
        "gender": None,
        "price_min": None,
        "price_max": None
    }

    for pattern, op in PRICE_PATTERNS:
        m = re.search(pattern, query)
        if m:
            if op == "between":
                result["price_min"] = int(m.group(1))
                result["price_max"] = int(m.group(2))
            else:
                val = int(m.group(1))
                if op in ("<", "<="):
                    result["price_max"] = val
                elif op in (">", ">="):
                    result["price_min"] = val
            break

    seen_keywords = set()

    for token in doc:
        raw_text = token.text.lower()
        lemma_text = token.lemma_.lower()

        norm_token = normalize_token(raw_text)
        norm_lemma = normalize_token(lemma_text)

        # Skip stop words immediately to prevent fuzzy matching them (e.g. "me" -> "men")
        if token.is_stop or token.is_punct or token.like_num or raw_text in STOP_WORDS:
            continue

        # 👇 Category: normalize + lemmatize
        if result["category"] is None:
            cat_token = nlp(norm_token)[0].lemma_
            cat_lemma = nlp(norm_lemma)[0].lemma_
            
            # Check original token first (e.g. "shoes")
            if norm_token in RAW_CATEGORIES:
                 result["category"] = norm_token
                 continue

            cat_lemma = nlp(norm_token)[0].lemma_
            
            # Check if this lemma matches any RAW_CATEGORY's lemma
            # This handles "shoe" -> "shoes" mapping
            found_raw_cat = None
            for raw_cat in RAW_CATEGORIES:
                 if nlp(raw_cat)[0].lemma_ == cat_lemma:
                      found_raw_cat = raw_cat
                      break
            
            if found_raw_cat:
                 result["category"] = found_raw_cat
                 continue

            # Fuzzy Match against LEMMAS (CATEGORIES)
            # If we match a lemma, we must map it back to the RAW_CATEGORY
            cat_fuzzy_lemma = fuzzy_match(cat_lemma, CATEGORIES)
            if cat_fuzzy_lemma:
                # Map back to raw
                found_raw_cat = None
                for raw_cat in RAW_CATEGORIES:
                     if nlp(raw_cat)[0].lemma_ == cat_fuzzy_lemma:
                          found_raw_cat = raw_cat
                          break
                
                result["category"] = found_raw_cat if found_raw_cat else cat_fuzzy_lemma
                continue

        # Color
        if result["color"] is None:
            if norm_token in COLORS:
                result["color"] = norm_token
                continue
            col = fuzzy_match(norm_token, COLORS)
            if col:
                result["color"] = col
                continue

        # Gender
        if result["gender"] is None:
            if norm_token in GENDERS:
                result["gender"] = norm_token
                continue
            gen = fuzzy_match(norm_token, GENDERS)
            if gen:
                result["gender"] = gen
                continue

        # Brand
        if result["brand"] is None:
            if norm_token in BRANDS:
                result["brand"] = norm_token
                continue
            br = fuzzy_match(norm_token, BRANDS)
            if br:
                result["brand"] = br
                continue

        # Since we already skipped stop words at the start, we just add to keywords
        # if it wasn't used as an entity
        if not (result["category"] and normalize_token(lemma_text) == result["category"]) and \
           not (result["brand"] and normalize_token(lemma_text) == result["brand"]) and \
           not (result["color"] and normalize_token(lemma_text) == result["color"]) and \
           not (result["gender"] and normalize_token(lemma_text) == result["gender"]):
             seen_keywords.add(token.text)

    result["keywords"] = list(seen_keywords)
    return result

# Optional: test
if __name__ == "__main__":
    sample_queries = [
        "black puma sneakers for men under 3000"
    ]

    for q in sample_queries:
        print(f"Query: {q}")
        print(parse_query(q))
        print("-" * 40)
