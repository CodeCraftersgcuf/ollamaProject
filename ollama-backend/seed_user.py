# scripts/add_admin.py

from pymongo import MongoClient
from app.utils.password_handler import hash_password

# Connect to your MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["ollama_assistant"]  # replace with your db name if different

# Insert an Admin user (admin will login normally)
db.admins.insert_one({
    "username": "admin1",
    "password": hash_password("password123")  # hashed password
})

print("✅ Admin user 'admin1' added successfully!")
