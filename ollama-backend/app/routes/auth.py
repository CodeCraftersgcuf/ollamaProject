from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db import db
from app.utils.jwt_handler import create_access_token
from app.utils.password_handler import verify_password

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(req: LoginRequest):
    user = db.users.find_one({"username": req.username})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not verify_password(req.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"sub": req.username})
    return {"token": token}
