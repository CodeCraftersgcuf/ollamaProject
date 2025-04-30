# app/seed_admin.py

from pymongo import MongoClient
from app.utils.password_handler import hash_password
from app.settings import settings  # ✅ Use your configured superadmin username/password

def seed_admins():
    client = MongoClient("mongodb://localhost:27017")
    db = client["ollama_assistant"]

    # Delete existing admins (optional but useful during reset)
    db.admins.delete_many({})
    db.superadmins.delete_many({})

    # Insert Superadmin into a separate `superadmins` collection
    db.superadmins.insert_one({
        "username": settings.SUPERADMIN_USERNAME,
        "password": hash_password(settings.SUPERADMIN_PASSWORD)
    })

    print(f"✅ Superadmin ({settings.SUPERADMIN_USERNAME}) inserted.")

    # Insert Default Admin into `admins` collection
    db.admins.insert_one({
        "username": "admin",
        "password": hash_password("secret123")
    })

    print("✅ Default Admin (admin/secret123) inserted.")

if __name__ == "__main__":
    seed_admins()
