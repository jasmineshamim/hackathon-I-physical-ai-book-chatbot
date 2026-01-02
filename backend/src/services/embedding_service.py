from typing import List
import time
import hashlib
from functools import lru_cache
from src.config.llm_client import get_cohere_client
from src.config.settings import settings
import logging

logger = logging.getLogger(__name__)

# Simple in-memory cache for embeddings
_embedding_cache = {}


def _get_cache_key(text: str, input_type: str) -> str:
    """Generate a cache key for the given text and input type"""
    return hashlib.md5(f"{text}_{input_type}".encode()).hexdigest()


def generate_embeddings(texts: List[str], input_type: str = "search_document", max_retries: int = 3) -> List[List[float]]:
    """
    Generate embeddings for a list of texts using Cohere's embedding API with retry logic
    """
    client = get_cohere_client()

    for attempt in range(max_retries):
        try:
            response = client.embed(
                texts=texts,
                model=settings.embedding_model,
                input_type=input_type
            )
            return response.embeddings
        except Exception as e:
            error_str = str(e)

            # Check if it's a rate limit error (429)
            if "429" in error_str or "rate limit" in error_str.lower():
                if attempt < max_retries - 1:
                    # Exponential backoff: 1s, 2s, 4s
                    wait_time = 2 ** attempt
                    logger.warning(f"Rate limit hit, waiting {wait_time}s before retry {attempt + 1}/{max_retries}")
                    time.sleep(wait_time)
                    continue
                else:
                    logger.error(f"Rate limit exceeded after {max_retries} retries")
                    raise Exception("Cohere API rate limit exceeded. Please try again in a moment.")
            else:
                # For other errors, raise immediately
                logger.error(f"Error generating embeddings: {error_str}")
                raise

    raise Exception("Failed to generate embeddings after multiple retries")


def generate_single_embedding(text: str, input_type: str = "search_query") -> List[float]:
    """
    Generate embedding for a single text with caching
    """
    # Check cache first
    cache_key = _get_cache_key(text, input_type)
    if cache_key in _embedding_cache:
        logger.debug(f"Cache hit for embedding")
        return _embedding_cache[cache_key]

    # Generate embedding
    embeddings = generate_embeddings([text], input_type=input_type)
    embedding = embeddings[0]

    # Store in cache (limit cache size to prevent memory issues)
    if len(_embedding_cache) > 1000:
        # Clear oldest entries (simple FIFO)
        keys_to_remove = list(_embedding_cache.keys())[:100]
        for key in keys_to_remove:
            del _embedding_cache[key]

    _embedding_cache[cache_key] = embedding
    return embedding