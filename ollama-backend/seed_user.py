from pymongo import MongoClient
from app.utils.password_handler import hash_password

# Connect to local MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["ollama_assistant"]

# Insert user with hashed password
db.users.insert_one({
    "username": "admin",
    "password": hash_password("secret123")  # Use your secure password
})

print("✅ Admin user added to MongoDB.")
