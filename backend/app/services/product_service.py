from app import models
from typing import List
from app.db import product_collection, es_client, settings
from datetime import datetime
from bson import ObjectId
from app.utils.query_parser import parse_query
from app.services.analytics_service import AnalyticsService
from app.cache import cache, cache_key
import json

class ProductService:
    @staticmethod
    def create_product(product: models.ProductCreate) -> models.ProductResponse:
        from app.utils.query_parser import update_entities, add_synonyms
        from app.utils.auto_synonyms import fetch_auto_synonyms
        
        # 1. Prepare data
        product_dict = product.model_dump()
        # Normalize fields to lowercase for consistent search
        if product_dict.get("category"): product_dict["category"] = product_dict["category"].lower()
        if product_dict.get("brand"): product_dict["brand"] = product_dict["brand"].lower()
        if product_dict.get("gender"): product_dict["gender"] = product_dict["gender"].lower()
        if product_dict.get("color"): product_dict["color"] = product_dict["color"].lower()
        
        # Dynamic NLP Update
        # 1. Register new Brand/Category entity
        update_entities(new_brands=[product_dict["brand"]], new_categories=[product_dict["category"]])
        
        # 2. Register Synonyms (if provided)
        if product.synonyms:
            # We add synonyms to both Brand and Category to ensure broad coverage
            # e.g. "kicks" -> Category: Shoes
            # e.g. "NK" -> Brand: Nike
            add_synonyms("brands", product_dict["brand"], product.synonyms)
            add_synonyms("categories", product_dict["category"], product.synonyms)
        else:
            # AUTO-DISCOVERY: If no synonyms provided, fetch them from the Web (Datamuse/WordNET)
            print(f"Auto-discovering synonyms for category: {product_dict['category']}...")
            auto_syns = fetch_auto_synonyms(product_dict["category"])
            if auto_syns:
                print(f"Found auto-synonyms: {auto_syns}")
                add_synonyms("categories", product_dict["category"], auto_syns)
                # We optionally save these to the product so the user sees them
                product_dict["synonyms"] = auto_syns


        product_dict["created_at"] = datetime.utcnow()
        
        # 2. Insert into MongoDB (Primary)
        result = product_collection.insert_one(product_dict)
        str_id = str(result.inserted_id)

        # 3. Index into Elasticsearch (Secondary)
        # We store the Mongo ID as the ES ID for easy mapping
        es_doc = product_dict.copy()
        es_doc["mongo_id"] = str_id
        if "_id" in es_doc: del es_doc["_id"] # clean bson id

        try:
            es_client.index(index=settings.ES_INDEX, id=str_id, body=es_doc)
            es_client.indices.refresh(index=settings.ES_INDEX) # Make available immediately
        except Exception as e:
            print(f"Error indexing to ES: {e}")
            # in production, you might queue this for retry
            
        # 4. Return response
        return models.ProductResponse(id=str_id, **product_dict)

    @staticmethod
    def search_products(query: str) -> List[dict]:
        # Search ES
        if not query:
            return []

        parsed_query = parse_query(query)
        print(f"DEBUG: Original Query: '{query}'")
        print(f"DEBUG: Parsed Query: {json.dumps(parsed_query, default=str)}")


        must_clauses = []
        filter_clauses = []

        # 1. Keywords (Text Search)
        if parsed_query["keywords"]:
            # Join keywords to form a cleaner text query
            cleaned_text = " ".join(parsed_query["keywords"])
            must_clauses.append({
                "multi_match": {
                    "query": cleaned_text,
                    "fields": ["name^3", "description", "brand", "category", "color"],
                    "fuzziness": "AUTO"
                }
            })
        else:
            # If no keywords extracted (e.g. only brand/category mentioned like "Nike Shoes")
            # We should still match something if there are filters, otherwise match_all
             if not (parsed_query["category"] or parsed_query["brand"] or parsed_query["color"] or parsed_query["gender"] or parsed_query["price_min"] or parsed_query["price_max"]):
                 must_clauses.append({"match_all": {}})

        # 2. Filters (Structured Search)
        if parsed_query["category"]:
            filter_clauses.append({"term": {"category": parsed_query["category"]}})
        
        if parsed_query["brand"]:
             filter_clauses.append({"term": {"brand": parsed_query["brand"]}})

        if parsed_query["color"]:
             filter_clauses.append({"term": {"color": parsed_query["color"]}})
             
        if parsed_query["gender"]:
             filter_clauses.append({"term": {"gender": parsed_query["gender"]}})

        # Price Range
        if parsed_query["price_min"] is not None or parsed_query["price_max"] is not None:
            range_filter = {}
            if parsed_query["price_min"] is not None:
                range_filter["gte"] = parsed_query["price_min"]
            if parsed_query["price_max"] is not None:
                range_filter["lte"] = parsed_query["price_max"]
            filter_clauses.append({"range": {"price": range_filter}})

        search_body = {
            "size": 500,
            "query": {
                "bool": {
                    "must": must_clauses if must_clauses else [{"match_all": {}}],
                    "filter": filter_clauses
                }
            }
        }

        print(f"DEBUG: Search Body: {json.dumps(search_body, default=str)}")
        res = es_client.search(index=settings.ES_INDEX, body=search_body)
        
        # Transform hits to simple list
        results = []
        for hit in res["hits"]["hits"]:
            data = hit["_source"]
            data["id"] = hit["_id"] # Use ES ID (which is Mongo ID)
            results.append(data)
        
        # Log search for analytics
        try:
            AnalyticsService.log_search(query, len(results), parsed_query)
        except Exception as e:
            print(f"Analytics logging error: {e}")
            
        return results

    @staticmethod
    def get_all_products(limit: int = 50):
        # Fallback to Mongo or Match All in ES. Let's use ES for consistency.
        res = es_client.search(index=settings.ES_INDEX, body={"query": {"match_all": {}}, "size": limit})
        results = []
        for hit in res["hits"]["hits"]:
            data = hit["_source"]
            data["id"] = hit["_id"]
            results.append(data)
        return results
