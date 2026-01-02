from qdrant_client import QdrantClient
from qdrant_client.http import models
from typing import List, Dict, Any
from app.config.settings import settings


class QdrantService:
    def __init__(self):
        # Use the collection name from .env if available, otherwise default
        self.collection_name = getattr(settings, 'qdrant_collection_name', settings.qdrant_collection)

        # Check if we have a full URL (cloud instance) or need to construct from host/port
        if settings.qdrant_url:
            # Cloud instance with full URL
            if settings.qdrant_api_key:
                self.client = QdrantClient(
                    url=settings.qdrant_url,
                    api_key=settings.qdrant_api_key,
                    timeout=10
                )
            else:
                self.client = QdrantClient(
                    url=settings.qdrant_url,
                    timeout=10
                )
        elif settings.qdrant_host and settings.qdrant_port:
            # Local instance with host and port
            if settings.qdrant_api_key:
                self.client = QdrantClient(
                    host=settings.qdrant_host,
                    port=settings.qdrant_port,
                    api_key=settings.qdrant_api_key,
                    timeout=10
                )
            else:
                self.client = QdrantClient(
                    host=settings.qdrant_host,
                    port=settings.qdrant_port,
                    timeout=10
                )
        else:
            raise ValueError("Either QDRANT_URL or both QDRANT_HOST and QDRANT_PORT must be set")

        self._create_collection_if_not_exists()

    def _create_collection_if_not_exists(self):
        """
        Create the collection if it doesn't exist
        """
        try:
            # Check if collection exists
            self.client.get_collection(self.collection_name)
        except:
            # Create collection if it doesn't exist
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=1024,  # Cohere's embedding dimension for embed-english-v3.0
                    distance=models.Distance.COSINE
                )
            )

    def add_texts(self, texts: List[str], metadatas: List[Dict[str, Any]] = None) -> List[str]:
        """
        Add texts to the Qdrant collection
        """
        try:
            # Generate IDs for the new points
            import uuid
            ids = [str(uuid.uuid4()) for _ in texts]

            # Prepare the payload
            payloads = []
            for i, text in enumerate(texts):
                payload = {"text": text}
                if metadatas and i < len(metadatas):
                    payload.update(metadatas[i])
                payloads.append(payload)

            # Add points to the collection
            # Note: Since our collection was created with Cohere embeddings,
            # Qdrant will need the vectors to be provided explicitly
            from app.services.cohere_service import CohereService
            cohere_service = CohereService()
            embeddings = cohere_service.get_embeddings(texts)

            points = []
            for i, (id, embedding, payload) in enumerate(zip(ids, embeddings, payloads)):
                points.append(models.PointStruct(
                    id=id,
                    vector=embedding,
                    payload=payload
                ))

            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )

            return ids
        except Exception as e:
            raise Exception(f"Error adding texts to Qdrant: {str(e)}")

    def search(self, query_vector: List[float], limit: int = 5) -> List[Dict[str, Any]]:
        """
        Search for similar vectors in the collection
        """
        try:
            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=limit,
                with_payload=True
            )
            
            return [
                {
                    "id": result.id,
                    "text": result.payload.get("text", ""),
                    "metadata": {k: v for k, v in result.payload.items() if k != "text"},
                    "score": result.score
                }
                for result in results
            ]
        except Exception as e:
            raise Exception(f"Error searching in Qdrant: {str(e)}")