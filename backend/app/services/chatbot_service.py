from typing import Dict, List
from app.services.cohere_service import CohereService
from app.services.qdrant_service import QdrantService
from app.services.openrouter_service import OpenRouterService
from app.utils.exceptions import EmbeddingException, VectorDBException, LLMException
from app.utils.logger import logger


class ChatbotService:
    """
    Main service class that orchestrates the RAG flow
    """
    def __init__(self):
        self.cohere_service = CohereService()
        self.qdrant_service = QdrantService()
        self.openrouter_service = OpenRouterService()
    
    def process_query(self, query: str, top_k: int = 5, temperature: float = 0.7) -> Dict:
        """
        Process a user query using the RAG flow
        """
        try:
            logger.info(f"Processing query: {query[:50]}...")
            
            # Step 1: Generate embedding for the user query
            query_embedding = self.cohere_service.get_single_embedding(query)
            
            # Step 2: Search for similar documents in Qdrant
            similar_docs = self.qdrant_service.search_similar(
                query_embedding=query_embedding,
                top_k=top_k
            )
            
            # Check if we found any similar documents
            if not similar_docs:
                logger.warning("No similar documents found in Qdrant")
                # Return a response indicating no context was found
                return {
                    "answer": "I couldn't find any relevant information to answer your question.",
                    "context": [],
                    "sources": []
                }
            
            # Extract context texts from the search results
            context_texts = [doc["text"] for doc in similar_docs]
            
            # Step 3: Generate response using OpenRouter with the retrieved context
            answer = self.openrouter_service.generate_response(
                prompt=query,
                context=context_texts,
                temperature=temperature
            )
            
            # Prepare the result
            result = {
                "answer": answer,
                "context": context_texts,
                "sources": [doc.get("metadata", {}).get("source") for doc in similar_docs if "source" in doc.get("metadata", {})]
            }
            
            logger.info("Query processed successfully")
            return result
        except EmbeddingException as e:
            logger.error(f"Embedding error in process_query: {str(e)}")
            raise e
        except VectorDBException as e:
            logger.error(f"VectorDB error in process_query: {str(e)}")
            raise e
        except LLMException as e:
            logger.error(f"LLM error in process_query: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"Unexpected error in process_query: {str(e)}")
            raise LLMException(f"Error processing query: {str(e)}")
    
    def add_document(self, text: str, metadata: Dict = None) -> str:
        """
        Add a single document to the vector database
        """
        try:
            logger.info(f"Adding document to vector database, text length: {len(text)}")
            document_id = self.qdrant_service.store_embedding(text, metadata)
            logger.info(f"Successfully added document with ID: {document_id}")
            return document_id
        except Exception as e:
            logger.error(f"Error adding document: {str(e)}")
            raise VectorDBException(f"Error adding document: {str(e)}")
    
    def add_documents_batch(self, texts: List[str], metadatas: List[Dict] = None) -> List[str]:
        """
        Add multiple documents to the vector database in a batch
        """
        try:
            logger.info(f"Adding {len(texts)} documents to vector database in batch")
            document_ids = self.qdrant_service.store_embeddings_batch(texts, metadatas)
            logger.info(f"Successfully added {len(texts)} documents in batch")
            return document_ids
        except Exception as e:
            logger.error(f"Error adding documents in batch: {str(e)}")
            raise VectorDBException(f"Error adding documents in batch: {str(e)}")
    
    def get_collection_info(self) -> Dict:
        """
        Get information about the vector database collection
        """
        try:
            info = self.qdrant_service.get_collection_info()
            logger.info(f"Retrieved collection info: {info}")
            return info
        except Exception as e:
            logger.error(f"Error getting collection info: {str(e)}")
            raise VectorDBException(f"Error getting collection info: {str(e)}")
    
    def clear_collection(self):
        """
        Clear all documents from the vector database
        """
        try:
            logger.info("Clearing collection")
            self.qdrant_service.clear_collection()
            logger.info("Collection cleared successfully")
        except Exception as e:
            logger.error(f"Error clearing collection: {str(e)}")
            raise VectorDBException(f"Error clearing collection: {str(e)}")