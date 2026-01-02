from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # API Keys
    cohere_api_key: Optional[str] = None
    openrouter_api_key: Optional[str] = None
    qdrant_api_key: Optional[str] = None
    openapi_key: Optional[str] = None  # Added from .env
    gemini_api_key: Optional[str] = None

    # URLs
    qdrant_url: Optional[str] = None
    neon_database_url: Optional[str] = None  # Added from .env
    openrouter_base_url: Optional[str] = "https://openrouter.ai/api/v1"  # Added from .env

    # Application Configuration
    app_title: str = "Chatbot API"  # Added from .env
    app_version: str = "1.0.0"  # Added from .env
    api_v1_str: str = "/api/v1"  # Added from .env
    project_name: str = "FastAPI Chatbot Backend"  # Added from .env

    # Qdrant Configuration
    qdrant_collection_name: str = "chatbot_collection"  # Added from .env
    qdrant_host: str = "localhost"  # Added from .env
    qdrant_port: int = 6333  # Added from .env

    # OpenRouter Configuration
    openrouter_model_name: str = "xiaomi/mimo-v2-flash:free"  # Added from .env

    # Default OpenRouter model (using the one from .env if available)
    openrouter_model: str = "openai/gpt-3.5-turbo"

    # Qdrant collection name (using the one from .env if available)
    qdrant_collection: str = "chatbot_collection"

    # Cohere embedding model
    cohere_embedding_model: str = "embed-english-v3.0"

    # Gemini Configuration
    gemini_model_name: str = "gemini-pro"

    # Number of results to retrieve from Qdrant
    retrieval_limit: int = 5

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'


# Create a single instance of settings
settings = Settings()