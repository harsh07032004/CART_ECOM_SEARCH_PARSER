"""
Recommendation Service
Provides similar products and trending items using Elasticsearch queries.
"""

from typing import List, Dict, Any
from app.db import es_client, settings, product_collection


class RecommendationService:

    @staticmethod
    def get_similar_products(product_id: str, limit: int = 6) -> List[Dict[str, Any]]:
        """Get similar products based on category, brand, and description."""
        try:
            source = es_client.get(index=settings.ES_INDEX, id=product_id)
            source_doc = source["_source"]

            search_body = {
                "size": limit + 1,
                "query": {
                    "bool": {
                        "should": [
                            {"term": {"category": {"value": source_doc.get("category", ""), "boost": 3.0}}},
                            {"term": {"brand": {"value": source_doc.get("brand", ""), "boost": 2.0}}},
                            {
                                "more_like_this": {
                                    "fields": ["name", "description"],
                                    "like": f"{source_doc.get('name', '')} {source_doc.get('description', '')}",
                                    "min_term_freq": 1,
                                    "min_doc_freq": 1,
                                    "max_query_terms": 12,
                                }
                            },
                        ],
                        "must_not": [{"ids": {"values": [product_id]}}],
                    }
                },
                "sort": [
                    {"_score": "desc"},
                    {"rating": {"order": "desc", "missing": 0}},
                ],
            }

            res = es_client.search(index=settings.ES_INDEX, body=search_body)
            results = []
            for hit in res["hits"]["hits"]:
                if hit["_id"] != product_id:
                    data = hit["_source"].copy()
                    data["id"] = hit["_id"]
                    data["similarity_score"] = round(hit["_score"], 3)
                    results.append(data)

            return results[:limit]

        except Exception as e:
            print(f"Error getting similar products: {e}")
            return []

    @staticmethod
    def get_frequently_bought_together(product_id: str, limit: int = 4) -> List[Dict[str, Any]]:
        """Get complementary products — same category, different price point."""
        try:
            source = es_client.get(index=settings.ES_INDEX, id=product_id)
            source_doc = source["_source"]
            source_price = float(source_doc.get("price", 0))

            search_body = {
                "size": limit + 2,
                "query": {
                    "bool": {
                        "should": [
                            {"term": {"category": {"value": source_doc.get("category", ""), "boost": 2.0}}}
                        ],
                        "must_not": [
                            {"ids": {"values": [product_id]}},
                            # Skip products within ±20% of the same price
                            {"range": {"price": {
                                "gte": source_price * 0.8,
                                "lte": source_price * 1.2,
                            }}},
                        ],
                    }
                },
                "sort": [{"rating": {"order": "desc", "missing": 0}}],
            }

            res = es_client.search(index=settings.ES_INDEX, body=search_body)
            results = []
            for hit in res["hits"]["hits"]:
                if hit["_id"] != product_id:
                    data = hit["_source"].copy()
                    data["id"] = hit["_id"]
                    results.append(data)

            return results[:limit]

        except Exception as e:
            print(f"Error getting frequently bought together: {e}")
            return []

    @staticmethod
    def get_trending_products(limit: int = 10) -> List[Dict[str, Any]]:
        """Get trending products — boosted by rating and discount using field_value_factor."""
        try:
            search_body = {
                "size": limit,
                "query": {
                    "function_score": {
                        "query": {"match_all": {}},
                        "functions": [
                            {
                                # Boost by rating (0–5 scale)
                                "field_value_factor": {
                                    "field": "rating",
                                    "factor": 1.5,
                                    "modifier": "sqrt",
                                    "missing": 1,
                                }
                            },
                            {
                                # Additional boost for discounted items
                                "field_value_factor": {
                                    "field": "discount",
                                    "factor": 0.5,
                                    "modifier": "log1p",
                                    "missing": 0,
                                }
                            },
                        ],
                        "score_mode": "sum",
                        "boost_mode": "multiply",
                    }
                },
            }

            res = es_client.search(index=settings.ES_INDEX, body=search_body)
            results = []
            for hit in res["hits"]["hits"]:
                data = hit["_source"].copy()
                data["id"] = hit["_id"]
                results.append(data)

            return results

        except Exception as e:
            print(f"Error getting trending products: {e}")
            # Hard fallback — sort by rating desc
            try:
                fallback = es_client.search(
                    index=settings.ES_INDEX,
                    body={
                        "size": limit,
                        "query": {"match_all": {}},
                        "sort": [{"rating": {"order": "desc", "missing": 0}}],
                    },
                )
                results = []
                for hit in fallback["hits"]["hits"]:
                    data = hit["_source"].copy()
                    data["id"] = hit["_id"]
                    results.append(data)
                return results
            except Exception:
                return []
