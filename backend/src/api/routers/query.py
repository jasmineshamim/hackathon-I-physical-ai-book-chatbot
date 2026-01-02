from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, Field
from typing import List, Optional
from src.services.rate_limiting import check_rate_limit
from src.services.retrieval_service import retrieve_relevant_chunks, retrieve_chunks_by_selection
from src.services.generation_service import generate_response, validate_response
from src.config.settings import settings


router = APIRouter()


class QueryRequest(BaseModel):
    question: str = Field(..., max_length=settings.max_question_length)
    book_id: str


class QueryWithSelectionRequest(BaseModel):
    question: str = Field(..., max_length=settings.max_question_length)
    selected_text: str = Field(..., max_length=settings.max_selected_text_length)
    book_id: str


class QueryResponse(BaseModel):
    answer: str
    confidence_score: float
    sources: List[dict]


@router.post("/query", response_model=QueryResponse)
async def query_book(request: Request, query_request: QueryRequest):
    # Check rate limit
    client_ip = request.client.host
    if not check_rate_limit(client_ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    
    # Validate input
    if not query_request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    if not query_request.book_id.strip():
        raise HTTPException(status_code=400, detail="Book ID is required")
    
    try:
        # Retrieve relevant chunks
        relevant_chunks = retrieve_relevant_chunks(
            query=query_request.question,
            book_id=query_request.book_id
        )
        
        if not relevant_chunks:
            # If no relevant chunks found, return standard response
            return QueryResponse(
                answer="This information is not available in the provided book content.",
                confidence_score=0.0,
                sources=[]
            )
        
        # Generate response
        response_data = generate_response(
            query=query_request.question,
            context_chunks=relevant_chunks
        )
        
        # Validate response is grounded in context
        is_valid = validate_response(response_data["answer"], relevant_chunks)
        if not is_valid:
            # If validation fails, return standard response
            return QueryResponse(
                answer="This information is not available in the provided book content.",
                confidence_score=0.0,
                sources=[]
            )
        
        return QueryResponse(**response_data)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process question: {str(e)}")


@router.post("/query-with-selection", response_model=QueryResponse)
async def query_with_selection(request: Request, query_request: QueryWithSelectionRequest):
    # Check rate limit
    client_ip = request.client.host
    if not check_rate_limit(client_ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    
    # Validate input
    if not query_request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    if not query_request.selected_text.strip():
        raise HTTPException(status_code=400, detail="Selected text cannot be empty")
    
    if not query_request.book_id.strip():
        raise HTTPException(status_code=400, detail="Book ID is required")
    
    try:
        # Retrieve chunks related to the selected text
        # For selected text queries, we'll use the selected text as the primary context
        # but may still retrieve additional context if needed
        context_chunks = retrieve_chunks_by_selection(
            selected_text=query_request.selected_text,
            book_id=query_request.book_id
        )
        
        # Generate response based only on selected text
        response_data = generate_response(
            query=query_request.question,
            context_chunks=context_chunks,
            selected_text=query_request.selected_text
        )
        
        # Validate response is grounded in context
        is_valid = validate_response(response_data["answer"], context_chunks)
        if not is_valid:
            # If validation fails, return standard response
            return QueryResponse(
                answer="This information is not available in the provided selected text.",
                confidence_score=0.0,
                sources=[]
            )
        
        return QueryResponse(**response_data)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process question: {str(e)}")