from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class DocumentRequest(BaseModel):
    """
    Schema for adding a single document
    """
    text: str
    metadata: Optional[Dict[str, Any]] = None


class DocumentBatchRequest(BaseModel):
    """
    Schema for adding multiple documents
    """
    texts: List[str]
    metadatas: Optional[List[Dict[str, Any]]] = None


class DocumentResponse(BaseModel):
    """
    Schema for document addition response
    """
    document_id: str
    message: str


class DocumentBatchResponse(BaseModel):
    """
    Schema for batch document addition response
    """
    document_ids: List[str]
    message: str


class CollectionInfoResponse(BaseModel):
    """
    Schema for collection information response
    """
    name: str
    vector_size: int
    distance: str
    points_count: int