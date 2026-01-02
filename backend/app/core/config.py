from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # API Keys
    GEMINI_API_KEY: Optional[str] = None
    QDRANT_API_KEY: Optional[str] = None
    COHERE_API_KEY: Optional[str] = None
    OPENROUTER_API_KEY: Optional[str] = None
    OPENAPI_KEY: Optional[str] = None

    # URLs
    QDRANT_URL: Optional[str] = "http://localhost:6333"
    NEON_DATABASE_URL: Optional[str] = None
    OPENROUTER_BASE_URL: Optional[str] = "https://openrouter.ai/api/v1"

    # Application Configuration
    APP_TITLE: str = "Chatbot API"
    APP_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "FastAPI Chatbot Backend"
    QDRANT_COLLECTION_NAME: str = "documents"
    GEMINI_MODEL_NAME: str = "gemini-pro"
    OPENROUTER_MODEL_NAME: str = "xiaomi/mimo-v2-flash:free"

    # Qdrant Configuration
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333

    # Number of results to retrieve from Qdrant
    RETRIEVAL_LIMIT: int = 5

    class Config:
        env_file = ".env"


# Create a single instance of settings
settings = Settings()