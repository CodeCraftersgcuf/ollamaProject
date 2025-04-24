from pymongo import MongoClient
from .config import settings

client = MongoClient(settings.MONGO_URI)
db = client["ollama_assistant"]
