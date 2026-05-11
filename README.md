# CART — AI-Powered E-Commerce Search Engine

> **A placement-grade full-stack project** built to demonstrate NLP, Elasticsearch, and modern React development.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react)](https://react.dev/)
[![Elasticsearch](https://img.shields.io/badge/Search-Elasticsearch_7-005571?logo=elasticsearch)](https://www.elastic.co/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)

---

## 🚀 What Makes This Stand Out

| Feature | Details |
|---|---|
| **NLP Query Parser** | Extracts category, brand, color, gender, price range, sort intent, sale/discount intent from free-text |
| **Hybrid Search** | Elasticsearch multi-match + filter + sort, fully driven by parsed intent |
| **Sort Intent** | "cheapest shoes" → sorted by price ASC; "best rated laptops" → sorted by rating DESC |
| **Real-time Autocomplete** | Entity suggestions + product name prefix matches on every keystroke |
| **Voice Search** | Web Speech API microphone button — speak your query aloud |
| **"Did You Mean?"** | Fuzzy spell-correction hints for misspelled brands/categories |
| **Dual-Write Safety** | Every product write goes to MongoDB (primary) + Elasticsearch (secondary) with retry & failure logging |
| **Product Detail Page** | Full PDP with tabs, quantity picker, wishlist, share, buy-now, user ratings, related products |
| **3-Step Checkout** | Shipping → Payment (Card/UPI/COD) → Order Confirmation |
| **Analytics Dashboard** | Top searches, zero-result queries, search volume trends |
| **Keep-Alive** | Self-pinging daemon thread keeps Render free-tier warm |
| **Result Caching** | In-memory TTL cache (2 min search, 5 min product list) |

---

## 🧠 NLP Engine — How It Works

The heart of CART is `backend/app/utils/query_parser.py`. Given a raw user query, it returns a structured intent object:

```
Query: "cheapest red nike shoes for men under ₹3000"

Parsed: {
  category: "shoes",
  brand:    "nike",
  color:    "red",
  gender:   "men",
  price_max: 3000,
  sort_by:  "price_asc",
  keywords: []
}
```

**Pipeline:**
1. Multi-word synonym normalisation (regex pre-processing)
2. Sort intent extraction (price_asc, rating_desc, newest, discount_desc)
3. Sale/discount/in-stock intent detection
4. Percentage discount pattern (`50% off`)
5. Price range extraction (₹, Rs, INR, word-based operators)
6. spaCy tokenisation + lemmatisation
7. Color → gender → category → brand extraction (exact, then fuzzy via rapidfuzz)
8. "Did you mean?" spelling correction

---

## 🗂 Project Structure

```
CART_ECOM_SEARCH_PARSER/
├── backend/
│   ├── main.py                   # FastAPI app, startup events, keep-alive
│   ├── requirements.txt
│   ├── app/
│   │   ├── config.py             # Environment settings
│   │   ├── db.py                 # MongoDB + Elasticsearch clients
│   │   ├── models.py             # Pydantic schemas
│   │   ├── cache.py              # In-memory TTL cache
│   │   ├── dependencies.py       # Admin auth dependency
│   │   ├── routes/
│   │   │   ├── product_routes.py       # /products, /search, /search/meta,
│   │   │   │                           #   /search/autocomplete, /search/parse
│   │   │   ├── analytics_routes.py     # /analytics/stats, /top-searches
│   │   │   ├── recommendation_routes.py # /recommendations/similar, /trending
│   │   │   └── admin_routes.py         # /admin/*
│   │   ├── services/
│   │   │   ├── product_service.py      # CRUD + search + autocomplete
│   │   │   ├── analytics_service.py    # Search logging
│   │   │   └── recommendation_service.py
│   │   └── utils/
│   │       ├── query_parser.py         # ⭐ NLP engine
│   │       ├── auto_synonyms.py        # Auto-discovers synonyms
│   │       └── vector_search.py        # SentenceTransformers embeddings
│   └── seed_fast.py              # Fast product seeder
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Index.jsx         # Home — hero + carousels
    │   │   ├── Products.jsx      # Listing with filter sidebar
    │   │   ├── ProductDetail.jsx # ⭐ Full product page
    │   │   ├── Cart.jsx          # Shopping cart
    │   │   ├── Checkout.jsx      # ⭐ 3-step checkout
    │   │   ├── Wishlist.jsx
    │   │   ├── Analytics.jsx     # Admin dashboard
    │   │   ├── Admin.jsx
    │   │   ├── Login.jsx
    │   │   ├── About.jsx
    │   │   └── Contact.jsx
    │   ├── components/
    │   │   ├── SmartSearchBar.jsx  # ⭐ Voice + autocomplete + entity chips
    │   │   ├── ProductCard.jsx     # Click → ProductDetail, discount badge
    │   │   ├── Header.jsx          # Debounced search, auth, cart badge
    │   │   ├── FilterPanel.jsx
    │   │   ├── ProductGrid.jsx
    │   │   ├── ProductCarousel.jsx
    │   │   └── HeroImageCarousel.jsx
    │   ├── contexts/
    │   │   ├── ProductsContext.jsx  # Global products + search state
    │   │   ├── CartContext.jsx      # Cart + wishlist state
    │   │   └── AuthContext.jsx      # Firebase auth
    │   ├── lib/
    │   │   └── api.js              # All API calls (search, autocomplete, parse)
    │   └── hooks/
    │       ├── useDebounce.js
    │       └── useKeepAlive.js
    └── package.json
```

---

## 🛠 Setup & Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB (local or Atlas)
- Elasticsearch 7.x (local or cloud)

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm   # NLP model

# Create .env
cp .env.example .env   # Fill in MONGO_URI, ES_URL, ADMIN_KEY

uvicorn main:app --reload --port 8000
```

### Seed Products

```bash
cd backend
python seed_fast.py
```

### Frontend

```bash
cd frontend
npm install

# Create .env.local
echo "VITE_API_URL=http://localhost:8000" > .env.local

npm run dev   # Opens at http://localhost:5173
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/search?q=...` | NLP-powered search |
| GET | `/search/meta?q=...` | Search + parsed entity metadata |
| GET | `/search/parse?q=...` | Parse query (no search) |
| GET | `/search/autocomplete?q=...` | Keystroke suggestions |
| GET | `/products` | All products (cached) |
| GET | `/products/:id` | Single product |
| POST | `/products` | Create product (admin) |
| PUT | `/products/:id` | Update product (admin) |
| DELETE | `/products/:id` | Delete product (admin) |
| GET | `/recommendations/similar/:id` | Similar products |
| GET | `/recommendations/trending` | Trending products |
| GET | `/analytics/stats` | Search analytics |
| GET | `/analytics/top-searches` | Top query terms |
| GET | `/health` | Health check |
| GET | `/nlp-status` | NLP engine status |

---

## 📊 Key Technical Concepts (For Interviews)

- **Elasticsearch Bool Query** — `must` clauses for text relevance + `filter` for structured attributes (zero scoring overhead)
- **Sort Intent Routing** — the sort clause in the ES query is dynamically chosen based on the NLP-parsed `sort_by` field
- **Fuzzy Matching with rapidfuzz** — handles typos in brand/category names with configurable edit distance thresholds
- **spaCy Lemmatization** — normalises word forms ("running shoes" → "shoe") before entity matching
- **Dual-write with Retry** — MongoDB is the source of truth; ES is the search index. Failures are logged to `sync_failures` for later resync via `/resync` endpoint
- **In-memory TTL Cache** — avoids repeated ES queries for identical search strings within 2-minute windows

---

## 👨‍💻 Author

**Harsh Kumar** — [GitHub](https://github.com/harsh07032004)

*Built as a showcase project for placements — demonstrating full-stack development, NLP, and search engineering.*
