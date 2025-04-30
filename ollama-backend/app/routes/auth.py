from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db import db
from app.utils.jwt_handler import create_access_token
from app.utils.password_handler import verify_password
from app.settings import settings

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login(request: LoginRequest):
    username = request.username
    password = request.password

    if username == settings.SUPERADMIN_USERNAME and password == settings.SUPERADMIN_PASSWORD:
        return {"token": create_access_token(username, role="superadmin")}
    
    admin = db.admins.find_one({"username": username})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"token": create_access_token(username, role="admin")}
