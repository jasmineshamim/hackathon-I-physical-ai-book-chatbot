import os
from qdrant_client import QdrantClient
from qdrant_client.http import models
from dotenv import load_dotenv
import cohere

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

def test_search():
    """Test similarity search in the collection"""
    # Generate an embedding for a test query
    query_text = "What is physical AI?"
    response = cohere_client.embed(
        texts=[query_text],
        model="embed-english-v3.0",
        input_type="search_query"
    )
    query_embedding = response.embeddings[0]
    
    # Perform similarity search
    search_results = qdrant_client.search(
        collection_name=collection_name,
        query_vector=query_embedding,
        limit=5,
        with_payload=True
    )
    
    print(f"Search results for query: '{query_text}'")
    print("="*50)
    
    for idx, result in enumerate(search_results, 1):
        print(f"Result {idx}:")
        print(f"  URL: {result.payload['url']}")
        print(f"  Content snippet: {result.payload['content'][:200]}...")
        print(f"  Score: {result.score}")
        print("-" * 30)

def check_collection_info():
    """Check collection information"""
    collection_info = qdrant_client.get_collection(collection_name)
    print(f"Collection: {collection_name}")
    print(f"Points count: {collection_info.points_count}")
    print(f"Vector size: {collection_info.config.params.vectors.size}")

if __name__ == "__main__":
    print("Checking collection info...")
    check_collection_info()
    print()
    
    print("Testing similarity search...")
    test_search()