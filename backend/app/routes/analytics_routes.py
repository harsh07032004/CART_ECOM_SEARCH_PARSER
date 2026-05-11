from fastapi import APIRouter, Query, Depends
from app.services.analytics_service import AnalyticsService
from app.dependencies import require_admin

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/stats")
async def get_search_stats(
    days: int = Query(default=7, ge=1, le=90),
    _=Depends(require_admin),
):
    """Get overall search statistics for the specified period."""
    return AnalyticsService.get_search_stats(days)


@router.get("/top-searches")
async def get_top_searches(
    days: int = Query(default=7, ge=1, le=90),
    limit: int = Query(default=20, ge=1, le=100),
    _=Depends(require_admin),
):
    """Get most popular search queries."""
    return AnalyticsService.get_top_searches(days, limit)


@router.get("/zero-results")
async def get_zero_result_queries(
    days: int = Query(default=7, ge=1, le=90),
    limit: int = Query(default=20, ge=1, le=100),
    _=Depends(require_admin),
):
    """Get queries that returned no results (inventory gaps)."""
    return AnalyticsService.get_zero_result_queries(days, limit)


@router.get("/hourly")
async def get_hourly_distribution(
    days: int = Query(default=7, ge=1, le=90),
    _=Depends(require_admin),
):
    """Get search volume distribution by hour of day."""
    return AnalyticsService.get_hourly_distribution(days)


@router.post("/click")
async def log_click(query: str, product_id: str, position: int = 0):
    """Log a click on a search result. Public — no admin key required."""
    AnalyticsService.log_click(query, product_id, position)
    return {"status": "logged"}
