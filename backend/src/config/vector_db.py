from qdrant_client import QdrantClient
from qdrant_client.http import models
from src.config.settings import settings


def get_qdrant_client():
    """
    Creates and returns a Qdrant client instance configured with settings
    """
    client = QdrantClient(
        url=settings.qdrant_url,
        api_key=settings.qdrant_api_key,
        timeout=30
    )
    return client


def ensure_collection_exists():
    """
    Ensures that the required Qdrant collection exists with proper configuration
    """
    client = get_qdrant_client()
    
    # Check if collection already exists
    try:
        client.get_collection(settings.qdrant_collection_name)
        # Collection exists, no need to create
        return
    except:
        # Collection doesn't exist, create it
        client.create_collection(
            collection_name=settings.qdrant_collection_name,
            vectors_config=models.VectorParams(
                size=1024,  # Cohere's embedding dimension
                distance=models.Distance.COSINE
            )
        )
        
        # Create payload index for metadata search
        client.create_payload_index(
            collection_name=settings.qdrant_collection_name,
            field_name="book_id",
            field_schema=models.PayloadSchemaType.KEYWORD
        )