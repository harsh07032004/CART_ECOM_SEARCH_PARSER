"""
Script to generate vector embeddings for all existing products in Elasticsearch.
Run this once to enable hybrid search.
"""
import sys
import os

# Add root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db import es_client, settings
from app.utils.vector_search import generate_embedding
import time

def vectorize_products():
    print(f"Starting vectorization for index: {settings.ES_INDEX}")
    
    # 1. Fetch all products
    query = {"query": {"match_all": {}}, "size": 1000}
    res = es_client.search(index=settings.ES_INDEX, body=query)
    hits = res["hits"]["hits"]
    
    print(f"Found {len(hits)} products to vectorize.")
    
    count = 0
    for hit in hits:
        product_id = hit["_id"]
        source = hit["_source"]
        
        # Combine name and description for better semantic context
        text_to_embed = f"{source.get('name', '')} {source.get('description', '')}"
        
        try:
            # Generate embedding
            vector = generate_embedding(text_to_embed)
            
            # Update ES document
            es_client.update(
                index=settings.ES_INDEX,
                id=product_id,
                body={"doc": {"product_vector": vector}}
            )
            
            count += 1
            if count % 50 == 0:
                print(f"Progress: {count}/{len(hits)} vectorized...")
                
        except Exception as e:
            print(f"Error vectorizing product {product_id}: {e}")
            
    print(f"Completed! Vectorized {count} products.")
    es_client.indices.refresh(index=settings.ES_INDEX)

if __name__ == "__main__":
    start_time = time.time()
    vectorize_products()
    print(f"Done in {time.time() - start_time:.2f} seconds.")
