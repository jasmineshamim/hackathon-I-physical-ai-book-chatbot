from pydantic import BaseModel
from typing import List, Optional


class QueryRequest(BaseModel):
    """
    Schema for the query request
    """
    query: str
    top_k: Optional[int] = 5  # Number of similar documents to retrieve
    temperature: Optional[float] = 0.7  # Temperature for the LLM response


class QueryResponse(BaseModel):
    """
    Schema for the query response
    """
    answer: str
    context: List[str]  # Retrieved context from Qdrant
    query: str  # Echo the original query
    sources: Optional[List[str]] = None  # Optional sources of the information


class HealthResponse(BaseModel):
    """
    Schema for the health check response
    """
    status: str
    message: str
    details: Optional[dict] = None