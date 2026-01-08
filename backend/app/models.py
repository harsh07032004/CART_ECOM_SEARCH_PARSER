from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    brand: str
    price: float
    image_url: Optional[str] = None  # NEW: Image URL support
    gender: Optional[str] = "unisex"
    color: Optional[str] = None
    synonyms: Optional[List[str]] = [] # NEW: Synonyms for the product (e.g. ["kicks", "trainers"])

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
