import random
from datetime import datetime, timedelta
import numpy as np
if not hasattr(np, 'float_'):
    np.float_ = np.float64
from app.db import product_collection, es_client, settings
from bson import ObjectId

COUNT = 500

# Indian Rupee pricing
CATEGORIES = {
    "shoes": {
        "brands": ["nike", "adidas", "puma", "reebok", "campus", "sparx", "bata", "woodland"],
        "names": ["Running Shoes", "Sports Sneakers", "Casual Trainers", "Lifestyle Kicks", "Walking Shoes", "Training Shoes"],
        "base_price": (1500, 8000)
    },
    "phone": {
        "brands": ["apple", "samsung", "oneplus", "xiaomi", "realme", "vivo", "oppo", "motorola"],
        "names": ["Smartphone", "Pro Max", "Ultra", "Lite Edition", "5G Phone", "Gaming Phone"],
        "base_price": (12000, 150000)
    },
    "earphone": {
        "brands": ["sony", "boat", "jbl", "noise", "oneplus", "samsung", "realme", "boult"],
        "names": ["Wireless Earbuds", "Neckband", "Over-Ear Headphones", "TWS Earphones", "Bass Boost"],
        "base_price": (500, 15000)
    },
    "shirts": {
        "brands": ["allen solly", "peter england", "van heusen", "louis philippe", "arrow", "ucb"],
        "names": ["Casual Shirt", "Formal Shirt", "Polo T-Shirt", "Cotton Tee", "Slim Fit Shirt"],
        "base_price": (500, 3000)
    },
    "watches": {
        "brands": ["titan", "fastrack", "casio", "fossil", "sonata", "timex", "samsung", "apple"],
        "names": ["Analog Watch", "Digital Watch", "Smartwatch", "Chronograph", "Sports Watch"],
        "base_price": (1000, 50000)
    },
    "laptop": {
        "brands": ["hp", "dell", "lenovo", "asus", "acer", "apple", "msi"],
        "names": ["Gaming Laptop", "Business Laptop", "Ultrabook", "Chromebook", "Workstation"],
        "base_price": (35000, 200000)
    }
}

ADJECTIVES = ["Premium", "Classic", "Pro", "Max", "Ultra", "Lite", "Elite", "Sport", "Air", "Flex", "Neo", "X"]
COLORS = ["black", "white", "blue", "red", "silver", "gold", "grey", "navy"]
GENDERS = ["men", "women", "unisex"]

IMAGE_URLS = {
    "shoes": [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400",
        "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    ],
    "phone": [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
        "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400",
    ],
    "earphone": [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    ],
    "shirts": [
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400",
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400",
    ],
    "watches": [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
        "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400",
    ],
    "laptop": [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    ],
}

def generate_ratings():
    """Generate realistic user ratings (3-10 ratings per product)"""
    num_ratings = random.randint(3, 10)
    ratings = []
    for i in range(num_ratings):
        # Most ratings between 3-5 stars (realistic distribution)
        rating = random.choices([1, 2, 3, 4, 5], weights=[5, 10, 20, 35, 30])[0]
        ratings.append({
            "userId": f"user{random.randint(1000, 9999)}",
            "rating": rating,
            "timestamp": datetime.utcnow() - timedelta(days=random.randint(1, 90))
        })
    return ratings

def generate_product(i):
    cat_key = random.choice(list(CATEGORIES.keys()))
    cat_data = CATEGORIES[cat_key]
    
    brand = random.choice(cat_data["brands"])
    name_base = random.choice(cat_data["names"])
    adjective = random.choice(ADJECTIVES)
    color = random.choice(COLORS)
    gender = random.choice(GENDERS)
    
    name = f"{brand.title()} {adjective} {name_base}"
    if random.random() > 0.5:
        name += f" {random.randint(1, 99)}"
    
    description = f"{name} - Perfect for {gender}. Available in {color}. Category: {cat_key}."
    if cat_key in ["phone", "earphone", "laptop", "watches"]:
        description += " electronics"
    
    price_range = cat_data["base_price"]
    price = random.randint(price_range[0], price_range[1])
    
    return {
        "name": name,
        "description": description,
        "category": cat_key,
        "brand": brand,
        "price": price,
        "image_url": random.choice(IMAGE_URLS[cat_key]),
        "gender": gender,
        "color": color,
        "userRatings": generate_ratings(),
        "created_at": datetime.utcnow()
    }

def seed():
    print(f"\n{'='*50}")
    print(f"FAST SEEDING {COUNT} PRODUCTS WITH RATINGS")
    print(f"{'='*50}\n")
    
    # Clear existing
    print("Clearing existing products...")
    product_collection.delete_many({})
    try:
        es_client.delete_by_query(index=settings.ES_INDEX, body={"query": {"match_all": {}}})
    except:
        pass
    
    print(f"Generating and inserting {COUNT} products...")
    products = []
    for i in range(COUNT):
        products.append(generate_product(i))
        if (i + 1) % 100 == 0:
            print(f"Generated {i+1}/{COUNT}...")
    
    # Bulk insert to MongoDB
    result = product_collection.insert_many(products)
    print(f"Inserted {len(result.inserted_ids)} products to MongoDB")
    
    # Bulk index to Elasticsearch
    print("Indexing to Elasticsearch...")
    bulk_body = []
    for product in products:
        doc_id = str(product["_id"]) if "_id" in product else str(ObjectId())
        bulk_body.append({"index": {"_index": settings.ES_INDEX, "_id": doc_id}})
        # Remove _id from ES doc
        es_doc = {k: v for k, v in product.items() if k != "_id"}
        # Convert datetime to string
        if "created_at" in es_doc:
            es_doc["created_at"] = es_doc["created_at"].isoformat()
        bulk_body.append(es_doc)
    
    response = es_client.bulk(body=bulk_body)
    print(f"Elasticsearch bulk index complete. Errors: {response.get('errors', False)}")
    
    print(f"\n{'='*50}")
    print(f"SEEDING COMPLETE! {COUNT} products with ratings added.")
    print(f"{'='*50}")

if __name__ == "__main__":
    seed()
