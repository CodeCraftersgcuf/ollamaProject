from pydantic_settings import BaseSettings  # ✅ correct for Pydantic v2

class Settings(BaseSettings):
    MONGO_URI: str
    SECRET_KEY: str = "super-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"

settings = Settings()
