from fastapi import APIRouter, HTTPException, Depends
from app.schemas.schemas import QueryRequest, QueryResponse, AddDocumentRequest, AddDocumentResponse
from app.services.rag_service import RAGService
from app.config.settings import settings
from typing import List
import logging

router = APIRouter()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_rag_service():
    """
    Dependency function to get RAG service instance.
    This allows lazy initialization only when needed.
    """
    try:
        return RAGService()
    except Exception as e:
        logger.error(f"Error initializing RAG service: {e}")
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")


@router.post("/query", response_model=QueryResponse)
async def query_endpoint(request: QueryRequest, rag_service: RAGService = Depends(get_rag_service)):
    try:
        # Process the query through the RAG service
        response = rag_service.query(
            user_question=request.question,
            chat_history=request.chat_history
        )

        # For now, we're not returning the context in the response
        # but we could modify this to return the retrieved documents
        return QueryResponse(
            response=response,
            context=[]  # We can enhance this to return context if needed
        )
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")


@router.post("/documents", response_model=AddDocumentResponse)
async def add_document_endpoint(request: AddDocumentRequest, rag_service: RAGService = Depends(get_rag_service)):
    try:
        # Add the document to the vector store
        doc_id = rag_service.add_document(
            text=request.text,
            metadata=request.metadata
        )

        return AddDocumentResponse(document_id=doc_id)
    except Exception as e:
        logger.error(f"Error adding document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error adding document: {str(e)}")


@router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Chatbot API is running"}