import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our services
from app.services.cohere_service import CohereService
from app.services.qdrant_service import QdrantService
from app.services.openrouter_service import OpenRouterService
from app.services.rag_service import RAGService
from app.config.settings import settings

def test_services():
    print("Testing service initializations...")

    # Test Cohere service
    try:
        cohere_service = CohereService()
        print("[SUCCESS] Cohere service initialized successfully")

        # Test embedding a sample text
        embeddings = cohere_service.get_embeddings(["Hello, world!"])
        print(f"[SUCCESS] Embedding generated, dimension: {len(embeddings[0])}")
    except Exception as e:
        print(f"[ERROR] Error with Cohere service: {e}")

    # Test Qdrant service
    try:
        qdrant_service = QdrantService()
        print("[SUCCESS] Qdrant service initialized successfully")
    except Exception as e:
        print(f"[ERROR] Error with Qdrant service: {e}")

    # Test OpenRouter service
    try:
        openrouter_service = OpenRouterService()
        print("[SUCCESS] OpenRouter service initialized successfully")
    except Exception as e:
        print(f"[ERROR] Error with OpenRouter service: {e}")

    # Test RAG service
    try:
        rag_service = RAGService()
        print("[SUCCESS] RAG service initialized successfully")

        # Test adding a sample document
        doc_id = rag_service.add_document("This is a test document for the chatbot.")
        print(f"[SUCCESS] Document added with ID: {doc_id}")

        # Test querying
        response = rag_service.query("What is this document about?")
        print(f"[SUCCESS] Query response: {response[:100]}...")  # Print first 100 chars
    except Exception as e:
        print(f"[ERROR] Error with RAG service: {e}")

if __name__ == "__main__":
    test_services()