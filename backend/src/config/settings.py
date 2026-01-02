from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # API Keys and URLs
    cohere_api_key: str
    qdrant_url: str
    qdrant_api_key: Optional[str] = None
    database_url: str

    # Model Configuration
    cohere_model: str = "command-r-plus"
    embedding_model: str = "embed-multilingual-v3.0"

    # Qdrant Configuration
    qdrant_collection_name: str = "book_chunks"

    # Performance Configuration
    max_concurrent_users: int = 50
    response_timeout: int = 30  # seconds
    max_question_length: int = 500
    max_selected_text_length: int = 10000

    # Chunking Configuration
    chunk_size: int = 512  # tokens
    chunk_overlap: float = 0.25  # 25% overlap

    class Config:
        env_file = ".env"


settings = Settings()