# app/utils/jwt_handler.py

from datetime import datetime, timedelta
from jose import jwt
from app.config import settings

def create_access_token(username: str, role: str, expires_delta: timedelta = None):
    to_encode = {"sub": username, "role": role}

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt
