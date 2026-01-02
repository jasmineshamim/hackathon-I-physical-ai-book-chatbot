from typing import List, Dict, Any
from app.services.cohere_service import CohereService
from app.services.qdrant_service import QdrantService
from app.services.openrouter_service import OpenRouterService
from app.config.settings import settings


class RAGService:
    def __init__(self):
        self.cohere_service = CohereService()
        self.qdrant_service = QdrantService()
        self.openrouter_service = OpenRouterService()

    def query(self, user_question: str, chat_history: List[Dict[str, str]] = None) -> str:
        """
        Main RAG flow: embed question -> retrieve context -> generate response
        """
        try:
            # 1. Embed the user question using Cohere
            query_embedding = self.cohere_service.embed_query(user_question)

            # 2. Retrieve relevant documents from Qdrant
            retrieved_docs = self.qdrant_service.search(
                query_vector=query_embedding,
                limit=settings.retrieval_limit
            )

            # 3. Format the context from retrieved documents
            context_str = "\n\n".join([doc["text"] for doc in retrieved_docs])

            # 4. Prepare messages for the LLM
            messages = []
            
            # Add chat history if provided
            if chat_history:
                messages.extend(chat_history)
            
            # Add the user's current question
            messages.append({
                "role": "user",
                "content": user_question
            })

            # 5. Generate response using OpenRouter with context
            response = self.openrouter_service.generate_response(
                messages=messages,
                context=context_str
            )

            return response
        except Exception as e:
            raise Exception(f"Error in RAG flow: {str(e)}")

    def add_document(self, text: str, metadata: Dict[str, Any] = None) -> str:
        """
        Add a document to the vector store
        """
        try:
            # Embed the text using Cohere
            embeddings = self.cohere_service.get_embeddings([text])
            
            # Add to Qdrant with the pre-computed embeddings
            # Note: In this implementation, Qdrant will compute embeddings automatically
            # but we're using Cohere for consistency
            doc_id = self.qdrant_service.add_texts([text], [metadata or {}])[0]
            
            return doc_id
        except Exception as e:
            raise Exception(f"Error adding document: {str(e)}")