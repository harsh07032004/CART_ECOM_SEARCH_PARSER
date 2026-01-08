"""
Vector Search Module
Uses Sentence Transformers for semantic embedding of products and queries.
Enables hybrid search (keyword + vector) for better relevance.
"""

from sentence_transformers import SentenceTransformer
import numpy as np
if not hasattr(np, 'float_'):
    np.float_ = np.float64
from typing import List, Dict, Any

# Load model once (cached)
_model = None

def get_model():
    global _model
    if _model is None:
        print("Loading Sentence Transformer model...")
        _model = SentenceTransformer('all-MiniLM-L6-v2')
        print("Model loaded successfully!")
    return _model

def generate_embedding(text: str) -> List[float]:
    """Generate vector embedding for a text string."""
    model = get_model()
    embedding = model.encode(text, convert_to_numpy=True)
    return embedding.tolist()

def generate_product_embedding(product: Dict[str, Any]) -> List[float]:
    """Generate embedding for a product (combines name + description + category)."""
    text_parts = [
        product.get("name", ""),
        product.get("description", ""),
        product.get("category", ""),
        product.get("brand", "")
    ]
    combined_text = " ".join(filter(None, text_parts))
    return generate_embedding(combined_text)

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two vectors."""
    a = np.array(vec1)
    b = np.array(vec2)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def get_embedding_dimension() -> int:
    """Get the dimension of embeddings from the model."""
    model = get_model()
    return model.get_sentence_embedding_dimension()

if __name__ == "__main__":
    # Test the module
    test_query = "comfortable running shoes for jogging"
    embedding = generate_embedding(test_query)
    print(f"Query: {test_query}")
    print(f"Embedding dimension: {len(embedding)}")
    print(f"First 5 values: {embedding[:5]}")
