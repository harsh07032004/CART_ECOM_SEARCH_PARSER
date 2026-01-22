from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
if not hasattr(np, 'float_'):
    np.float_ = np.float64
from app.routes import product_routes
from app.routes import analytics_routes
from app.routes import recommendation_routes
from app.db import init_es_index

app = FastAPI(
    title="Cartella - Smart E-Commerce Search",
    description="NLP-powered e-commerce search engine with Elasticsearch, built by Harsh Kumar",
    version="2.0.0"
)

# CORS - Allow all origins for development and deployment
origins = [
    "*", # Allow all origins for production (Render)
    "*"  # Allow all for Render deployment
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import asyncio

async def load_nlp_data():
    """Background task to load Synonyms and Entities."""
    print("Startup: Initializing NLP Knowledge Base in background...")
    try:
        from app.db import es_client, settings
        from app.utils.query_parser import update_entities, load_synonyms_from_db
        
        # 1. Load Synonyms
        load_synonyms_from_db()
        
        # 2. Load Brands/Categories
        res = es_client.search(
            index=settings.ES_INDEX,
            body={
                "size": 0,
                "aggs": {
                    "unique_brands": {"terms": {"field": "brand", "size": 1000}},
                    "unique_categories": {"terms": {"field": "category", "size": 100}}
                }
            }
        )
        
        brands = [b["key"] for b in res["aggregations"]["unique_brands"]["buckets"]]
        categories = [c["key"] for c in res["aggregations"]["unique_categories"]["buckets"]]
        
        if brands or categories:
            print(f"Startup: Loading {len(brands)} brands and {len(categories)} categories into NLP engine.")
            update_entities(new_brands=brands, new_categories=categories)
            
    except Exception as e:
        print(f"Warning: Failed to load dynamic entities on startup: {e}")

@app.on_event("startup")
async def startup_event():
    init_es_index()
    # Run NLP update in background so it doesn't block startup
    asyncio.create_task(load_nlp_data())

# Register Routes
app.include_router(product_routes.router)
app.include_router(analytics_routes.router)
app.include_router(recommendation_routes.router)

@app.get("/")
def read_root():
    return {
        "message": "Cartella API is running!",
        "developer": "Harsh Kumar",
        "features": ["NLP Search", "Elasticsearch", "Analytics", "Hybrid Search"]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
