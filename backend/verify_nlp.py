import sys
import os

# Add backend to path to import app items
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.utils.query_parser import parse_query

def verify_nlp():
    queries = [
        "suggest me shirsts under 2000",
        "black puma sneakers for men under 3000",
        "i want to buy mobile phone",
        "sugges me applle"
    ]
    
    print("NLP Parser Verification Results:\n")
    for q in queries:
        print(f"Query: '{q}'")
        parsed = parse_query(q)
        print(f"Parsed: {parsed}\n")

if __name__ == "__main__":
    verify_nlp()
