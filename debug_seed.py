import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))

print("Step 1: Importing numpy...")
import numpy as np
if not hasattr(np, 'float_'):
    np.float_ = np.float64
print("Step 1 Done.")

print("Step 2: Importing app.db...")
try:
    from app.db import product_collection, es_client, settings
    print("Step 2 Done.")
except Exception as e:
    print(f"Step 2 Failed: {e}")
    sys.exit(1)

print("Step 3: Checking Mongo...")
try:
    count = product_collection.count_documents({})
    print(f"Mongo Count: {count}")
    print("Step 3 Done.")
except Exception as e:
    print(f"Step 3 Failed: {e}")
    sys.exit(1)

print("Step 4: Checking ES...")
try:
    info = es_client.info()
    print(f"ES Info: {info['version']['number']}")
    print("Step 4 Done.")
except Exception as e:
    print(f"Step 4 Failed: {e}")
    sys.exit(1)
