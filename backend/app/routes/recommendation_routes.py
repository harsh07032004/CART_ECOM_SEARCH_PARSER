from fastapi import APIRouter, Query, HTTPException
from app.services.recommendation_service import RecommendationService

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("/similar/{product_id}")
async def get_similar_products(
    product_id: str,
    limit: int = Query(default=6, ge=1, le=20)
):
    """Get products similar to the specified product."""
    results = RecommendationService.get_similar_products(product_id, limit)
    return {
        "product_id": product_id,
        "similar_products": results,
        "count": len(results)
    }

@router.get("/bought-together/{product_id}")
async def get_frequently_bought_together(
    product_id: str,
    limit: int = Query(default=4, ge=1, le=10)
):
    """Get products frequently bought with the specified product."""
    results = RecommendationService.get_frequently_bought_together(product_id, limit)
    return {
        "product_id": product_id,
        "frequently_bought_together": results,
        "count": len(results)
    }

@router.get("/trending")
async def get_trending_products(limit: int = Query(default=10, ge=1, le=50)):
    """Get currently trending products."""
    results = RecommendationService.get_trending_products(limit)
    return {
        "trending_products": results,
        "count": len(results)
    }
