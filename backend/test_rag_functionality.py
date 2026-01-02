import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app.services.rag_service import RAGService

def test_rag_service():
    """Test the RAG service to see if it can retrieve and generate responses"""
    try:
        print("Initializing RAG Service...")
        rag_service = RAGService()
        print("RAG Service initialized successfully!")
        
        # Test query
        test_query = "What is physical AI?"
        print(f"\nTesting query: '{test_query}'")
        
        # Try to get a response
        response = rag_service.query(
            user_question=test_query,
            chat_history=[]
        )
        
        print(f"Response: {response}")
        return True
        
    except Exception as e:
        print(f"Error testing RAG service: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_rag_service()