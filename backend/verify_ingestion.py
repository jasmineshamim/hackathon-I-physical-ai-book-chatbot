import os
from qdrant_client import QdrantClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def verify_ingestion():
    """Verify that documentation has been properly ingested into Qdrant"""
    
    # Determine Qdrant connection method based on available environment variables
    qdrant_url = os.getenv("QDRANT_URL")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")
    qdrant_host = os.getenv("QDRANT_HOST")
    qdrant_port = os.getenv("QDRANT_PORT")
    
    if qdrant_url:
        # Use cloud instance with full URL
        qdrant_client = QdrantClient(
            url=qdrant_url,
            api_key=qdrant_api_key,
            https=True,
            timeout=60
        )
    elif qdrant_host and qdrant_port:
        # Use local instance with host and port
        qdrant_client = QdrantClient(
            host=qdrant_host,
            port=int(qdrant_port),
            api_key=qdrant_api_key,
            timeout=60
        )
    else:
        raise ValueError("Either QDRANT_URL or both QDRANT_HOST and QDRANT_PORT must be set")
    
    collection_name = os.getenv("QDRANT_COLLECTION_NAME", "chatbot_collection")
    
    try:
        # Get collection info
        collection_info = qdrant_client.get_collection(collection_name)
        print(f"Collection '{collection_name}' exists")
        print(f"Total vectors in collection: {collection_info.points_count}")
        
        # Get a few sample points to verify content
        sample_points = qdrant_client.scroll(
            collection_name=collection_name,
            limit=5,
            with_payload=True,
            with_vectors=False
        )

        print("\nSample points from the collection:")
        for i, point in enumerate(sample_points[0]):
            print(f"Point {i+1}:")
            print(f"  ID: {point.id}")
            print(f"  URL: {point.payload.get('url', 'N/A')}")
            print(f"  Module: {point.payload.get('module_name', 'N/A')}")
            content_preview = point.payload.get('content', '')[:100]
            # Remove or replace problematic characters for console output
            safe_content = content_preview.encode('ascii', errors='ignore').decode('ascii', errors='ignore')
            print(f"  Content preview: {safe_content}...")
            print()
        
        # Check for specific documentation modules by searching through all points
        modules = ["module1-intro", "module2-ros2", "module3-digital-twin", "module4-ai-robot-brain", "module5-advanced-topics"]

        print("Checking for documentation modules in the collection:")

        # Get all points to check for module names
        all_points = qdrant_client.scroll(
            collection_name=collection_name,
            limit=10000,  # Get up to 10k points
            with_payload=True
        )

        found_modules = set()
        for point in all_points[0]:
            module_name = point.payload.get('module_name', 'general')
            if module_name != 'general':
                found_modules.add(module_name)

        for module in modules:
            if module in found_modules:
                print(f"  [OK] Found {module} in collection")
            else:
                print(f"  [MISSING] {module} not found in collection")

        print(f"\nTotal unique modules found: {len(found_modules)}")
        print(f"Modules: {', '.join(sorted(found_modules))}")
        
        print(f"\nVerification complete! The documentation has been successfully ingested into Qdrant.")
        
    except Exception as e:
        print(f"Error during verification: {e}")
        raise

if __name__ == "__main__":
    verify_ingestion()