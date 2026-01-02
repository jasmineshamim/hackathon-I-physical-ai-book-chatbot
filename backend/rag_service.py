import os
from qdrant_client import QdrantClient
from qdrant_client.http import models
from dotenv import load_dotenv
import cohere
import requests
import json

# Load environment variables
load_dotenv()

# Initialize clients
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
    https=True
)
cohere_client = cohere.Client(os.getenv("COHERE_API_KEY"))

collection_name = os.getenv("QDRANT_COLLECTION_NAME", "chatbot_collection")
openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
openrouter_model_name = os.getenv("OPENROUTER_MODEL_NAME", "xiaomi/mimo-v2-flash:free")
openrouter_base_url = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")


class RAGService:
    def __init__(self):
        self.qdrant_client = qdrant_client
        self.cohere_client = cohere_client
        self.collection_name = collection_name
        self.openrouter_api_key = openrouter_api_key
        self.openrouter_model_name = openrouter_model_name
        self.openrouter_base_url = openrouter_base_url

    def retrieve(self, query: str, top_k: int = 5) -> list:
        """Retrieve relevant documents from Qdrant based on the query"""
        # Generate embedding for the query
        response = self.cohere_client.embed(
            texts=[query],
            model="embed-english-v3.0",
            input_type="search_query"
        )
        query_embedding = response.embeddings[0]

        # Perform similarity search
        search_results = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=top_k,
            with_payload=True
        )

        # Extract content from results
        retrieved_docs = []
        for result in search_results:
            retrieved_docs.append({
                "content": result.payload["content"],
                "url": result.payload["url"],
                "score": result.score
            })

        return retrieved_docs

    def generate_response(self, query: str, context: str) -> str:
        """Generate a response using OpenRouter API with the provided context"""
        headers = {
            "Authorization": f"Bearer {self.openrouter_api_key}",
            "Content-Type": "application/json"
        }

        prompt = f"""
        Context information is below.
        ---------------------
        {context}
        ---------------------
        Given the context information and not prior knowledge, answer the query.
        Query: {query}
        Answer:
        """

        data = {
            "model": self.openrouter_model_name,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }

        response = requests.post(
            f"{self.openrouter_base_url}/chat/completions",
            headers=headers,
            data=json.dumps(data)
        )

        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content']
        else:
            raise Exception(f"OpenRouter API error: {response.status_code} - {response.text}")

    def query(self, user_query: str, top_k: int = 5) -> dict:
        """Main RAG query function that retrieves and generates"""
        # Retrieve relevant documents
        retrieved_docs = self.retrieve(user_query, top_k)
        
        # Combine the content of retrieved documents as context
        context = "\n\n".join([doc["content"] for doc in retrieved_docs])
        
        # Generate response using the context
        response = self.generate_response(user_query, context)
        
        return {
            "response": response,
            "sources": retrieved_docs
        }


def main():
    rag_service = RAGService()
    
    # Example query
    query = "What is physical AI and how is it different from traditional AI?"
    print(f"Query: {query}")
    print("="*50)
    
    result = rag_service.query(query)
    
    print(f"Response: {result['response']}")
    print("\nSources:")
    for i, source in enumerate(result['sources'], 1):
        print(f"{i}. {source['url']} (Score: {source['score']:.3f})")


if __name__ == "__main__":
    main()