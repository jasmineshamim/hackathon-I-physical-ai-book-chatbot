from typing import List
import numpy as np
import hashlib
import logging

logger = logging.getLogger(__name__)


class FallbackEmbeddingService:
    """
    A fallback embedding service that uses a simple hash-based approach
    when the Cohere API is unavailable or rate limited.
    This creates deterministic embeddings based on text content.
    """

    def __init__(self, embedding_dim: int = 1024):
        # Use a fixed dimension for embeddings (default 1024 to match Cohere embed-english-v3.0)
        self.embedding_dim = embedding_dim

    def _text_to_vector(self, text: str) -> List[float]:
        """
        Convert text to a vector using a hash-based approach
        """
        # Create a consistent vector representation using hash functions
        vector = np.zeros(self.embedding_dim, dtype=np.float32)

        # Use multiple hash functions to populate the vector
        text_bytes = text.encode('utf-8')

        for i in range(self.embedding_dim):
            # Create a unique seed for each dimension by combining text and index
            seed_text = f"{text_bytes}_{i}".encode('utf-8')

            # Use SHA256 to generate a hash
            hash_obj = hashlib.sha256(seed_text)
            hash_hex = hash_obj.hexdigest()

            # Convert the hash to a float value between -1 and 1
            # Take first 8 hex chars and convert to int, then normalize
            hash_int = int(hash_hex[:8], 16)
            normalized_value = (hash_int % 2000000000) / 1000000000.0 - 1.0  # Range: [-1, 1]

            vector[i] = normalized_value

        return vector.tolist()

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a list of texts using hash-based approach
        """
        try:
            embeddings = []
            for text in texts:
                embedding = self._text_to_vector(text)
                embeddings.append(embedding)
            return embeddings
        except Exception as e:
            logger.error(f"Error generating fallback embeddings: {e}")
            raise Exception(f"Error generating fallback embeddings: {str(e)}")

    def embed_query(self, query: str) -> List[float]:
        """
        Generate embedding for a single query
        """
        try:
            return self._text_to_vector(query)
        except Exception as e:
            logger.error(f"Error generating fallback query embedding: {e}")
            raise Exception(f"Error generating fallback query embedding: {str(e)}")