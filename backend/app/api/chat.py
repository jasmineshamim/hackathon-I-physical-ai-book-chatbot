from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging

from app.rag.query import RAGQueryService

router = APIRouter()
logger = logging.getLogger(__name__)


class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []


class ChatResponse(BaseModel):
    response: str
    sources: List[Dict[str, Any]] = []


def get_rag_service():
    """
    Dependency function to get RAG service instance.
    """
    try:
        return RAGQueryService()
    except Exception as e:
        logger.error(f"Error initializing RAG service: {e}")
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    rag_service: RAGQueryService = Depends(get_rag_service)
):
    """
    Main chat endpoint that processes user queries through the RAG pipeline
    """
    try:
        # Process the query through the RAG service
        response, sources = rag_service.query_with_sources(
            user_question=request.message,
            chat_history=request.history
        )

        return ChatResponse(
            response=response,
            sources=sources
        )
    except Exception as e:
        logger.error(f"Error processing chat query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")


@router.post("/query", response_model=ChatResponse)  # Added for compatibility with existing frontend
async def query_endpoint(
    request: ChatRequest,
    rag_service: RAGQueryService = Depends(get_rag_service)
):
    """
    Query endpoint that processes user queries through the RAG pipeline (for compatibility)
    """
    try:
        # Process the query through the RAG service
        response, sources = rag_service.query_with_sources(
            user_question=request.message,
            chat_history=request.history
        )

        return ChatResponse(
            response=response,
            sources=sources
        )
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")


@router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Chat API is running"}