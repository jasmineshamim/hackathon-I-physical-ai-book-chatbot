import cohere
from typing import List
import time
import random
import hashlib
from app.config.settings import settings
from app.services.embedding_fallback import FallbackEmbeddingService
import logging

logger = logging.getLogger(__name__)


class CohereService:
    def __init__(self):
        if not settings.cohere_api_key:
            raise ValueError("COHERE_API_KEY environment variable is not set")

        self.client = cohere.Client(settings.cohere_api_key)
        self.model = settings.cohere_embedding_model
        self.fallback_service = None  # Initialize only if needed
        self._embedding_cache = {}  # In-memory cache for embeddings

    def _get_fallback_service(self):
        """
        Lazy initialization of the fallback service
        """
        if self.fallback_service is None:
            try:
                self.fallback_service = FallbackEmbeddingService()
            except Exception as e:
                logger.error(f"Failed to initialize fallback embedding service: {e}")
                raise
        return self.fallback_service

    def _make_request_with_retry(self, embed_func, use_fallback_on_rate_limit=True):
        """
        Make a Cohere embedding request with retry logic and exponential backoff
        """
        max_retries = 3
        base_delay = 1  # Start with 1 second delay

        for attempt in range(max_retries):
            try:
                return embed_func()
            except Exception as e:
                error_str = str(e)
                is_rate_limit = False

                # Check if it's a rate limit error
                if "429" in error_str or "Too Many Requests" in error_str or "rate limit" in error_str.lower():
                    is_rate_limit = True

                if is_rate_limit:
                    if attempt == max_retries - 1:  # Last attempt
                        if use_fallback_on_rate_limit:
                            logger.warning("Cohere API rate limited after retries, using fallback embedding service")
                            return None  # Signal to use fallback
                        else:
                            raise e

                    # Calculate delay with exponential backoff and jitter
                    delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
                    logger.info(f"Rate limit hit, retrying in {delay:.2f} seconds... (attempt {attempt + 1}/{max_retries})")
                    time.sleep(delay)
                else:
                    # For other types of errors, don't retry
                    logger.error(f"Cohere API error (non-rate-limit): {error_str}")
                    raise e

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a list of texts using Cohere API with fallback
        """
        def embed_request():
            return self.client.embed(
                texts=texts,
                model=self.model,
                input_type="search_document"  # Using search_document for knowledge base content
            )

        try:
            response = self._make_request_with_retry(embed_request)
            if response is None:  # Use fallback
                fallback_service = self._get_fallback_service()
                return fallback_service.get_embeddings(texts)

            return [embedding for embedding in response.embeddings]
        except Exception as e:
            # If Cohere fails completely, try fallback
            try:
                logger.warning(f"Cohere failed, using fallback embedding service: {e}")
                fallback_service = self._get_fallback_service()
                return fallback_service.get_embeddings(texts)
            except Exception as fallback_error:
                logger.error(f"Fallback embedding service also failed: {fallback_error}")
                raise Exception(f"Error generating embeddings with Cohere and fallback: {str(e)}, fallback error: {str(fallback_error)}")

    def _get_cache_key(self, text: str, input_type: str) -> str:
        """Generate a cache key for the given text and input type"""
        return hashlib.md5(f"{text}_{input_type}".encode()).hexdigest()

    def embed_query(self, query: str) -> List[float]:
        """
        Generate embedding for a single query with caching and fallback
        """
        # Check cache first
        cache_key = self._get_cache_key(query, "search_query")
        if cache_key in self._embedding_cache:
            logger.debug("Cache hit for query embedding")
            return self._embedding_cache[cache_key]

        def embed_request():
            return self.client.embed(
                texts=[query],
                model=self.model,
                input_type="search_query"  # Using search_query for user queries
            )

        try:
            response = self._make_request_with_retry(embed_request)
            if response is None:  # Use fallback
                fallback_service = self._get_fallback_service()
                embedding = fallback_service.embed_query(query)
            else:
                embedding = response.embeddings[0]

            # Store in cache (limit cache size to prevent memory issues)
            if len(self._embedding_cache) > 1000:
                # Clear oldest entries (simple FIFO)
                keys_to_remove = list(self._embedding_cache.keys())[:100]
                for key in keys_to_remove:
                    del self._embedding_cache[key]

            self._embedding_cache[cache_key] = embedding
            return embedding

        except Exception as e:
            # If Cohere fails completely, try fallback
            try:
                logger.warning(f"Cohere failed, using fallback embedding service: {e}")
                fallback_service = self._get_fallback_service()
                embedding = fallback_service.embed_query(query)

                # Cache fallback result too
                self._embedding_cache[cache_key] = embedding
                return embedding
            except Exception as fallback_error:
                logger.error(f"Fallback embedding service also failed: {fallback_error}")
                raise Exception(f"Error generating query embedding with Cohere and fallback: {str(e)}, fallback error: {str(fallback_error)}")