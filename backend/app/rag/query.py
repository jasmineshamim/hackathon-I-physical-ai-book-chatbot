from typing import List, Dict, Any
from app.core.config import settings
from app.services.qdrant_service import QdrantService
from app.services.cohere_service import CohereService
import openai
import os


class RAGQueryService:
    def __init__(self):
        # Initialize Qdrant service
        self.qdrant_service = QdrantService()
        # Initialize Cohere service for embeddings
        self.cohere_service = CohereService()

        # Configure OpenAI client for LLM responses
        openrouter_api_key = settings.OPENROUTER_API_KEY or os.getenv("OPENROUTER_API_KEY")
        if not openrouter_api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is not set")

        self.openai_client = openai.OpenAI(
            base_url=settings.OPENROUTER_BASE_URL,
            api_key=openrouter_api_key,
        )
        self.model_name = settings.OPENROUTER_MODEL_NAME

    def query_with_sources(self, user_question: str, chat_history: List[Dict[str, str]] = None):
        """
        Main RAG flow: search Qdrant for relevant chunks -> send context + question to LLM -> return answer with sources
        """
        try:
            # 1. Generate embedding for the user question
            query_embedding = self.cohere_service.embed_query(user_question)

            # 2. Search Qdrant for relevant chunks using the proper service
            relevant_chunks = self.qdrant_service.search(query_embedding, limit=settings.RETRIEVAL_LIMIT)

            # 3. Format context from retrieved chunks
            context_str = "\n\n".join([chunk["text"] for chunk in relevant_chunks])

            # 4. Prepare the prompt for the LLM with context and user question
            system_prompt = f"""You are a helpful AI assistant. Use the following context to answer the user's question.
            If the context doesn't contain relevant information, respond based on your general knowledge but mention that the information is not in the provided context.

            Context: {context_str}"""

            # Prepare messages for the chat model
            messages = [
                {"role": "system", "content": system_prompt},
            ]

            # Add chat history if available
            if chat_history:
                for msg in chat_history:
                    messages.append({"role": msg["role"], "content": msg["content"]})

            # Add the current user question
            messages.append({"role": "user", "content": user_question})

            # 5. Get response from the LLM
            response = self.openai_client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                temperature=0.7,
                max_tokens=1024
            )

            llm_response = response.choices[0].message.content

            # 6. Extract sources from relevant chunks
            sources = []
            for chunk in relevant_chunks:
                sources.append({
                    "id": chunk["id"],
                    "text": chunk["text"][:200] + "..." if len(chunk["text"]) > 200 else chunk["text"],
                    "metadata": chunk["metadata"]
                })

            return llm_response, sources
        except Exception as e:
            raise Exception(f"Error in RAG query: {str(e)}")