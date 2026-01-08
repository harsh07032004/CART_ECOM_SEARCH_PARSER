from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.models import ProductCreate, ProductResponse
from app.services.product_service import ProductService

router = APIRouter()

@router.post("/products", response_model=ProductResponse, status_code=201)
async def create_product(product: ProductCreate):
    """
    Shopkeeper endpoint to add a new product.
    Syncs to both MongoDB and Elasticsearch.
    """
    try:
        return ProductService.create_product(product)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search", response_model=List[dict])  # Returning dict to be flexible with ES response
async def search_products(q: str = Query(None, min_length=1)):
    """
    Search products using Elasticsearch.
    """
    try:
        return ProductService.search_products(q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh-nlp")
async def refresh_nlp():
    """Manually trigger reload of brands/categories from DB into NLP parser."""
    try:
        from app.db import es_client, settings
        from app.utils.query_parser import update_entities
        
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
        
        updated_info = {}
        if brands or categories:
            update_entities(new_brands=brands, new_categories=categories)
            updated_info = {"brands": len(brands), "categories": len(categories)}
            
        return {"status": "success", "message": "NLP Knowledge Base Refreshed", "details": updated_info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/products", response_model=List[dict])
async def get_products():
    """
    Get all (or latest) products.
    """
    try:
        return ProductService.get_all_products()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
