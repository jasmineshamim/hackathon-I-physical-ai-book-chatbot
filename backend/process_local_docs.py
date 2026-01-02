import os
import glob
from pathlib import Path
import markdown
from bs4 import BeautifulSoup
import cohere
from qdrant_client import QdrantClient
from qdrant_client.http import models
from dotenv import load_dotenv
import logging
import time
import re

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LocalDocsProcessor:
    def __init__(self):
        # Initialize API clients
        self.cohere_client = cohere.Client(os.getenv("COHERE_API_KEY"))

        # Determine Qdrant connection method based on available environment variables
        qdrant_url = os.getenv("QDRANT_URL")
        qdrant_api_key = os.getenv("QDRANT_API_KEY")
        qdrant_host = os.getenv("QDRANT_HOST")
        qdrant_port = os.getenv("QDRANT_PORT")

        if qdrant_url:
            # Use cloud instance with full URL
            self.qdrant_client = QdrantClient(
                url=qdrant_url,
                api_key=qdrant_api_key,
                https=True,
                timeout=60  # Increase timeout to handle large uploads
            )
        elif qdrant_host and qdrant_port:
            # Use local instance with host and port
            self.qdrant_client = QdrantClient(
                host=qdrant_host,
                port=int(qdrant_port),
                api_key=qdrant_api_key,
                timeout=60  # Increase timeout to handle large uploads
            )
        else:
            raise ValueError("Either QDRANT_URL or both QDRANT_HOST and QDRANT_PORT must be set")

        self.collection_name = os.getenv("QDRANT_COLLECTION_NAME", "chatbot_collection")

        # Create collection if it doesn't exist
        self._create_collection()

    def _create_collection(self):
        """Create Qdrant collection if it doesn't exist"""
        try:
            # Check if collection exists
            collections = self.qdrant_client.get_collections()
            collection_names = [collection.name for collection in collections.collections]

            if self.collection_name not in collection_names:
                # Create collection with vector configuration
                self.qdrant_client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=1024,  # Cohere embeddings are 1024-dimensional
                        distance=models.Distance.COSINE
                    )
                )
                logger.info(f"Created collection: {self.collection_name}")
            else:
                logger.info(f"Collection {self.collection_name} already exists")

            # Create payload index for module_name to enable efficient filtering
            self.qdrant_client.create_payload_index(
                collection_name=self.collection_name,
                field_name="module_name",
                field_schema=models.PayloadSchemaType.KEYWORD
            )
            logger.info("Created payload index for module_name")

            # Create payload index for url to enable efficient filtering
            self.qdrant_client.create_payload_index(
                collection_name=self.collection_name,
                field_name="url",
                field_schema=models.PayloadSchemaType.TEXT
            )
            logger.info("Created payload index for url")

        except Exception as e:
            logger.error(f"Error creating collection or indexes: {e}")
            raise

    def extract_module_name(self, file_path: str) -> str:
        """Extract module name from file path"""
        path_parts = Path(file_path).parts
        # Look for the docs directory and extract the next folder as module name
        docs_index = -1
        for i, part in enumerate(path_parts):
            if part == 'docs':
                docs_index = i
                break
        
        if docs_index != -1 and docs_index + 1 < len(path_parts):
            return path_parts[docs_index + 1]
        else:
            # If no module pattern found, return a default value
            return "general"

    def read_markdown_file(self, file_path: str) -> str:
        """Read and extract text content from a markdown file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
                
            # Convert markdown to HTML, then extract text
            html = markdown.markdown(content)
            soup = BeautifulSoup(html, 'html.parser')
            
            # Extract text content
            text = soup.get_text()
            
            # Clean up text
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = ' '.join(chunk for chunk in chunks if chunk)
            
            logger.info(f"Processed markdown file: {file_path} (length: {len(text)} chars)")
            return text
        except Exception as e:
            logger.error(f"Error reading markdown file {file_path}: {e}")
            return ""

    def chunk_text(self, text: str, chunk_size: int = 1000) -> list[str]:
        """Split text into chunks of specified size, trying to break at sentence boundaries"""
        # Split text into sentences
        sentences = re.split(r'(?<=[.!?]) +', text)

        chunks = []
        current_chunk = ""

        for sentence in sentences:
            # If adding the next sentence would exceed chunk size
            if len(current_chunk) + len(sentence) > chunk_size and current_chunk:
                # Add the current chunk to the list
                chunks.append(current_chunk.strip())
                # Start a new chunk with the current sentence
                current_chunk = sentence
            else:
                # Add the sentence to the current chunk
                if current_chunk:
                    current_chunk += " " + sentence
                else:
                    current_chunk = sentence

        # Add the last chunk if it's not empty
        if current_chunk:
            chunks.append(current_chunk.strip())

        # If the intelligent chunking didn't work, fall back to simple chunking
        if not chunks:
            for i in range(0, len(text), chunk_size):
                chunks.append(text[i:i + chunk_size])

        return chunks

    def generate_embeddings(self, texts: list[str]) -> list[list[float]]:
        """Generate embeddings for a list of texts using Cohere with rate limiting"""
        try:
            # Cohere trial key has a limit of 100 requests per minute
            # To stay within limits, we'll batch requests and add delays
            all_embeddings = []

            # Process in batches of up to 95 to stay under the limit (with some buffer)
            batch_size = 95
            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]

                response = self.cohere_client.embed(
                    texts=batch,
                    model="embed-english-v3.0",
                    input_type="search_document"
                )
                all_embeddings.extend(response.embeddings)

                # Add a delay to stay within rate limits (100 requests per minute)
                # So we sleep for 1 minute after every 95 requests to be safe
                if len(batch) == batch_size:
                    logger.info("Approaching rate limit, sleeping for 60 seconds...")
                    time.sleep(60)

            return all_embeddings
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            raise

    def process_markdown_files(self, docs_directory: str):
        """Process all markdown files in the specified directory and its subdirectories"""
        # Find all markdown files in the directory and subdirectories
        pattern = os.path.join(docs_directory, "**", "*.md")
        md_files = glob.glob(pattern, recursive=True)
        
        logger.info(f"Found {len(md_files)} markdown files to process")
        
        # Process each markdown file
        all_points = []
        point_id = 0
        
        for file_path in md_files:
            logger.info(f"Processing file: {file_path}")
            
            # Extract module name from the file path
            module_name = self.extract_module_name(file_path)
            
            # Read and extract content from the markdown file
            content = self.read_markdown_file(file_path)
            
            if not content.strip():
                logger.warning(f"Skipping empty file: {file_path}")
                continue
            
            # Chunk the content
            text_chunks = self.chunk_text(content)
            
            for chunk_idx, chunk in enumerate(text_chunks):
                if chunk.strip():  # Only process non-empty chunks
                    # Add the chunk to our list to process in batches
                    all_points.append({
                        "id": point_id,
                        "url": f"file://{file_path}",  # Using file:// URL scheme for local files
                        "content": chunk,
                        "chunk_index": chunk_idx,
                        "module_name": module_name
                    })
                    point_id += 1

        # Process points in batches to manage Cohere API calls
        batch_size = 20  # Reduce batch size to avoid timeouts
        total_chunks = len(all_points)
        logger.info(f"Processing {total_chunks} total chunks from {len(md_files)} markdown files")

        for i in range(0, len(all_points), batch_size):
            batch = all_points[i:i + batch_size]

            # Extract content from the batch
            batch_contents = [point["content"] for point in batch]

            # Generate embeddings for the batch
            embeddings = self.generate_embeddings(batch_contents)

            # Create Qdrant points with the embeddings
            qdrant_points = []
            for idx, point_data in enumerate(batch):
                qdrant_point = models.PointStruct(
                    id=point_data["id"],
                    vector=embeddings[idx],
                    payload={
                        "url": point_data["url"],
                        "content": point_data["content"],
                        "chunk_index": point_data["chunk_index"],
                        "module_name": point_data["module_name"]
                    }
                )
                qdrant_points.append(qdrant_point)

            # Upload points to Qdrant
            self.qdrant_client.upload_points(
                collection_name=self.collection_name,
                points=qdrant_points
            )
            logger.info(f"Successfully uploaded {len(qdrant_points)} points to Qdrant (batch {i//batch_size + 1})")

            # Add a small delay between batches to avoid overwhelming the API
            time.sleep(1)

        logger.info(f"Total: {total_chunks} chunks from markdown files stored in Qdrant collection '{self.collection_name}'")


def main():
    # Initialize the processor
    processor = LocalDocsProcessor()

    # Path to the docs directory
    docs_directory = os.path.join(os.path.dirname(__file__), "..", "physical-ai-book", "docs")
    
    # Process all markdown files in the docs directory
    processor.process_markdown_files(docs_directory)

    logger.info("Local documentation processing completed successfully")


if __name__ == "__main__":
    main()