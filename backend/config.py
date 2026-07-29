import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "postgresql://app:changeme@localhost:5432/resource_db")
    debug: bool = os.getenv("DEBUG", "False").lower() == "true"
    env: str = os.getenv("ENV", "development")

    class Config:
        env_file = ".env"

settings = Settings()
