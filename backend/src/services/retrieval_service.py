from typing import List, Dict, Any
from qdrant_client.http import models
from src.config.vector_db import get_qdrant_client
from src.config.settings import settings
from src.services.embedding_service import generate_single_embedding


def retrieve_relevant_chunks(query: str, book_id: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Retrieve the most relevant chunks for a given query from the specified book
    """
    client = get_qdrant_client()
    
    # Generate embedding for the query
    query_embedding = generate_single_embedding(query)
    
    # Perform semantic search in Qdrant
    search_results = client.search(
        collection_name=settings.qdrant_collection_name,
        query_vector=query_embedding,
        query_filter=models.Filter(
            must=[
                models.FieldCondition(
                    key="book_id",
                    match=models.MatchValue(value=book_id)
                )
            ]
        ),
        limit=top_k
    )
    
    # Extract relevant information from search results
    relevant_chunks = []
    for result in search_results:
        chunk_data = {
            "id": result.id,
            "content": result.payload.get("content", ""),
            "page_number": result.payload.get("page_number"),
            "section_title": result.payload.get("section_title"),
            "score": result.score
        }
        relevant_chunks.append(chunk_data)
    
    return relevant_chunks


def retrieve_chunks_by_selection(selected_text: str, book_id: str) -> List[Dict[str, Any]]:
    """
    Retrieve chunks that match the selected text context
    """
    client = get_qdrant_client()
    
    # Generate embedding for the selected text
    selected_text_embedding = generate_single_embedding(selected_text)
    
    # Perform semantic search in Qdrant for the specific book
    search_results = client.search(
        collection_name=settings.qdrant_collection_name,
        query_vector=selected_text_embedding,
        query_filter=models.Filter(
            must=[
                models.FieldCondition(
                    key="book_id",
                    match=models.MatchValue(value=book_id)
                )
            ]
        ),
        limit=10  # Retrieve more chunks to ensure we get the relevant context
    )
    
    # Extract relevant information from search results
    relevant_chunks = []
    for result in search_results:
        chunk_data = {
            "id": result.id,
            "content": result.payload.get("content", ""),
            "page_number": result.payload.get("page_number"),
            "section_title": result.payload.get("section_title"),
            "score": result.score
        }
        relevant_chunks.append(chunk_data)
    
    return relevant_chunks