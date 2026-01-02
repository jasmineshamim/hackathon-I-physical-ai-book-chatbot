from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class QueryRequest(BaseModel):
    question: str
    chat_history: Optional[List[Dict[str, str]]] = None


class QueryResponse(BaseModel):
    response: str
    context: List[Dict[str, Any]]


class AddDocumentRequest(BaseModel):
    text: str
    metadata: Optional[Dict[str, Any]] = None


class AddDocumentResponse(BaseModel):
    document_id: str


class HealthResponse(BaseModel):
    status: str
    message: str