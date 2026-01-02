from typing import List, Dict, Any
from app.core.config import settings
from app.utils.qdrant_client import QdrantClient
import uuid


class VectorStoreService:
    def __init__(self):
        self.qdrant_client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY,
            collection_name=settings.QDRANT_COLLECTION_NAME
        )

    def add_texts(self, texts: List[str], metadatas: List[Dict[str, Any]] = None):
        """
        Add texts to the vector store
        """
        if metadatas is None:
            metadatas = [{}] * len(texts)
        
        ids = []
        points = []
        
        for i, (text, metadata) in enumerate(zip(texts, metadatas)):
            doc_id = str(uuid.uuid4())
            ids.append(doc_id)
            
            point = {
                "id": doc_id,
                "payload": {
                    "text": text,
                    "metadata": metadata
                }
            }
            points.append(point)
        
        # Add points to Qdrant collection
        self.qdrant_client.client.upload_points(
            collection_name=self.qdrant_client.collection_name,
            points=points
        )
        
        return ids

    def similarity_search(self, query: str, k: int = 5):
        """
        Perform similarity search in the vector store
        """
        results = self.qdrant_client.search(query_text=query, limit=k)
        return results