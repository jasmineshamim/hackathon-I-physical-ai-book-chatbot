import cohere
from src.config.settings import settings


def get_cohere_client():
    """
    Creates and returns a Cohere client instance configured with settings
    """
    client = cohere.Client(
        api_key=settings.cohere_api_key
    )
    return client