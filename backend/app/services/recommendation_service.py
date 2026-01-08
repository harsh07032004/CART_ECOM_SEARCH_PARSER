"""
Recommendation Service
Provides similar products based on category and brand matching.
Uses Elasticsearch's more_like_this functionality for lightweight recommendations.
"""

from typing import List, Dict, Any
from app.db import es_client, settings, product_collection

class RecommendationService:
    
    @staticmethod
    def get_similar_products(product_id: str, limit: int = 6) -> List[Dict[str, Any]]:
        """
        Get similar products based on category, brand, and description.
        Uses Elasticsearch's more_like_this query for relevance.
        """
        try:
            # First get the source product
            source = es_client.get(index=settings.ES_INDEX, id=product_id)
            source_doc = source["_source"]
            
            # Build a more_like_this query
            search_body = {
                "size": limit + 1,  # +1 to exclude the source product
                "query": {
                    "bool": {
                        "should": [
                            # Same category gets high boost
                            {"term": {"category": {"value": source_doc.get("category", ""), "boost": 3.0}}},
                            # Same brand gets medium boost
                            {"term": {"brand": {"value": source_doc.get("brand", ""), "boost": 2.0}}},
                            # Similar description
                            {
                                "more_like_this": {
                                    "fields": ["name", "description"],
                                    "like": source_doc.get("name", "") + " " + source_doc.get("description", ""),
                                    "min_term_freq": 1,
                                    "min_doc_freq": 1,
                                    "max_query_terms": 12
                                }
                            }
                        ],
                        "must_not": [
                            {"term": {"_id": product_id}}  # Exclude source product
                        ]
                    }
                }
            }
            
            res = es_client.search(index=settings.ES_INDEX, body=search_body)
            
            results = []
            for hit in res["hits"]["hits"]:
                if hit["_id"] != product_id:  # Double-check exclusion
                    data = hit["_source"]
                    data["id"] = hit["_id"]
                    data["similarity_score"] = hit["_score"]
                    results.append(data)
                    
            return results[:limit]
            
        except Exception as e:
            print(f"Error getting similar products: {e}")
            return []
    
    @staticmethod
    def get_frequently_bought_together(product_id: str, limit: int = 4) -> List[Dict[str, Any]]:
        """
        Get products frequently bought with this product.
        For now, uses a mock implementation based on category + different price range.
        In production, this would analyze order history.
        """
        try:
            source = es_client.get(index=settings.ES_INDEX, id=product_id)
            source_doc = source["_source"]
            source_price = source_doc.get("price", 0)
            
            # Find complementary products: same category, different price point
            search_body = {
                "size": limit + 1,
                "query": {
                    "bool": {
                        "should": [
                            {"term": {"category": {"value": source_doc.get("category", ""), "boost": 2.0}}}
                        ],
                        "must_not": [
                            {"term": {"_id": product_id}},
                            # Exclude products in similar price range (within 20%)
                            {"range": {"price": {"gte": source_price * 0.8, "lte": source_price * 1.2}}}
                        ]
                    }
                }
            }
            
            res = es_client.search(index=settings.ES_INDEX, body=search_body)
            
            results = []
            for hit in res["hits"]["hits"]:
                if hit["_id"] != product_id:
                    data = hit["_source"]
                    data["id"] = hit["_id"]
                    results.append(data)
                    
            return results[:limit]
            
        except Exception as e:
            print(f"Error getting frequently bought together: {e}")
            return []
    
    @staticmethod
    def get_trending_products(limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get trending products based on recent high ratings and views.
        Uses a function_score query to boost products with more ratings.
        """
        try:
            search_body = {
                "size": limit,
                "query": {
                    "function_score": {
                        "query": {"match_all": {}},
                        "functions": [
                            {
                                "script_score": {
                                    "script": {
                                        "source": "doc['userRatings'].size() * 0.5 + 1"
                                    }
                                }
                            }
                        ],
                        "boost_mode": "multiply"
                    }
                }
            }
            
            res = es_client.search(index=settings.ES_INDEX, body=search_body)
            
            results = []
            for hit in res["hits"]["hits"]:
                data = hit["_source"]
                data["id"] = hit["_id"]
                results.append(data)
                
            return results
            
        except Exception as e:
            print(f"Error getting trending products: {e}")
            # Fallback to random products
            return []
