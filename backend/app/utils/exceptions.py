from fastapi import HTTPException, status
from typing import Optional


class ChatbotException(HTTPException):
    """
    Custom exception for chatbot-related errors
    """
    def __init__(self, detail: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        super().__init__(status_code=status_code, detail=detail)


class EmbeddingException(ChatbotException):
    """
    Exception raised when there's an error with embedding generation
    """
    def __init__(self, detail: str = "Error generating embeddings"):
        super().__init__(detail=detail, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VectorDBException(ChatbotException):
    """
    Exception raised when there's an error with vector database operations
    """
    def __init__(self, detail: str = "Error with vector database operation"):
        super().__init__(detail=detail, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LLMException(ChatbotException):
    """
    Exception raised when there's an error with LLM operations
    """
    def __init__(self, detail: str = "Error with LLM operation"):
        super().__init__(detail=detail, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)