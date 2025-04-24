from pymongo import MongoClient
from app.utils.password_handler import hash_password

client = MongoClient("mongodb://localhost:27017")
db = client["ollama_assistant"]

db.users.insert_one({
    "username": "admin",
    "password": hash_password("secret123")  # hashed password
})
