"""
Search Analytics Service
Tracks search queries, zero-results, and click-through rates.
Stores data in MongoDB for persistence.
"""

from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from app.db import db

# Create search_logs collection reference
search_logs = db["search_logs"]
click_logs = db["click_logs"]

class AnalyticsService:
    
    @staticmethod
    def log_search(query: str, results_count: int, parsed_query: Dict[str, Any] = None):
        """Log a search query with its result count."""
        search_logs.insert_one({
            "query": query.lower().strip(),
            "results_count": results_count,
            "is_zero_result": results_count == 0,
            "parsed_query": parsed_query,
            "timestamp": datetime.utcnow()
        })
    
    @staticmethod
    def log_click(query: str, product_id: str, position: int):
        """Log when a user clicks on a search result."""
        click_logs.insert_one({
            "query": query.lower().strip(),
            "product_id": product_id,
            "position": position,  # Which position in results was clicked
            "timestamp": datetime.utcnow()
        })
    
    @staticmethod
    def get_top_searches(days: int = 7, limit: int = 20) -> List[Dict[str, Any]]:
        """Get top search queries in the last N days."""
        since = datetime.utcnow() - timedelta(days=days)
        
        pipeline = [
            {"$match": {"timestamp": {"$gte": since}}},
            {"$group": {
                "_id": "$query",
                "count": {"$sum": 1},
                "avg_results": {"$avg": "$results_count"}
            }},
            {"$sort": {"count": -1}},
            {"$limit": limit},
            {"$project": {
                "query": "$_id",
                "count": 1,
                "avg_results": {"$round": ["$avg_results", 0]},
                "_id": 0
            }}
        ]
        
        return list(search_logs.aggregate(pipeline))
    
    @staticmethod
    def get_zero_result_queries(days: int = 7, limit: int = 20) -> List[Dict[str, Any]]:
        """Get queries that returned zero results (inventory gaps)."""
        since = datetime.utcnow() - timedelta(days=days)
        
        pipeline = [
            {"$match": {
                "timestamp": {"$gte": since},
                "is_zero_result": True
            }},
            {"$group": {
                "_id": "$query",
                "count": {"$sum": 1},
                "last_searched": {"$max": "$timestamp"}
            }},
            {"$sort": {"count": -1}},
            {"$limit": limit},
            {"$project": {
                "query": "$_id",
                "count": 1,
                "last_searched": 1,
                "_id": 0
            }}
        ]
        
        return list(search_logs.aggregate(pipeline))
    
    @staticmethod
    def get_search_stats(days: int = 7) -> Dict[str, Any]:
        """Get overall search statistics."""
        since = datetime.utcnow() - timedelta(days=days)
        
        # Total searches
        total_searches = search_logs.count_documents({"timestamp": {"$gte": since}})
        
        # Zero result searches
        zero_results = search_logs.count_documents({
            "timestamp": {"$gte": since},
            "is_zero_result": True
        })
        
        # Total clicks
        total_clicks = click_logs.count_documents({"timestamp": {"$gte": since}})
        
        # Calculate CTR
        ctr = (total_clicks / total_searches * 100) if total_searches > 0 else 0
        
        # Unique queries
        unique_queries = len(search_logs.distinct("query", {"timestamp": {"$gte": since}}))
        
        return {
            "period_days": days,
            "total_searches": total_searches,
            "unique_queries": unique_queries,
            "zero_result_searches": zero_results,
            "zero_result_rate": round((zero_results / total_searches * 100) if total_searches > 0 else 0, 2),
            "total_clicks": total_clicks,
            "click_through_rate": round(ctr, 2)
        }
    
    @staticmethod
    def get_hourly_distribution(days: int = 7) -> List[Dict[str, Any]]:
        """Get search distribution by hour of day."""
        since = datetime.utcnow() - timedelta(days=days)
        
        pipeline = [
            {"$match": {"timestamp": {"$gte": since}}},
            {"$group": {
                "_id": {"$hour": "$timestamp"},
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id": 1}},
            {"$project": {
                "hour": "$_id",
                "count": 1,
                "_id": 0
            }}
        ]
        
        return list(search_logs.aggregate(pipeline))
