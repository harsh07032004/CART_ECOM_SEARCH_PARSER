"""
Admin routes — protected by X-Admin-Key header.
Includes: resync failed ES docs, cache stats, NLP status.
"""

from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import require_admin
from app.services.product_service import ProductService
from app.cache import cache

router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(require_admin)])


@router.post("/resync")
async def resync_failed_docs():
    """Re-index any documents that previously failed to sync to Elasticsearch."""
    try:
        result = ProductService.resync_failed()
        return {"status": "ok", **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/cache-stats")
async def cache_stats():
    """Return in-memory cache health."""
    return cache.stats()


@router.post("/cache-clear")
async def clear_cache():
    """Clear the entire in-memory cache (use after bulk product updates)."""
    cache.clear()
    return {"status": "cleared"}
