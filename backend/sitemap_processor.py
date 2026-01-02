import os
import requests
from bs4 import BeautifulSoup
import cohere
from qdrant_client import QdrantClient
from qdrant_client.http import models
from dotenv import load_dotenv
import xml.etree.ElementTree as ET
from typing import List, Dict
import time
import logging
import math

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SitemapProcessor:
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
    
    def fetch_sitemap(self, sitemap_url: str) -> List[str]:
        """Fetch and parse sitemap to extract URLs"""
        try:
            response = requests.get(sitemap_url)
            response.raise_for_status()

            # Parse the XML sitemap
            root = ET.fromstring(response.content)

            # Extract URLs from the sitemap
            urls = []
            for url in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
                urls.append(url.text)

            logger.info(f"Extracted {len(urls)} URLs from sitemap")
            return urls
        except requests.RequestException as e:
            logger.error(f"Error fetching sitemap: {e}")
            # If sitemap fails, try to manually construct documentation URLs
            base_url = "https://jasmineshamim.github.io/hackathon-physical-ai-textbook/"
            manual_urls = [
                base_url,
                base_url + "docs/module1-intro/",
                base_url + "docs/module2-ros2/",
                base_url + "docs/module3-digital-twin/",
                base_url + "docs/module4-ai-robot-brain/",
                base_url + "docs/module5-advanced-topics/"
            ]
            logger.info(f"Sitemap fetch failed, using manual URLs: {manual_urls}")
            return manual_urls
        except Exception as e:
            logger.error(f"Unexpected error fetching sitemap: {e}")
            raise
    
    def fetch_page_content(self, url: str) -> str:
        """Fetch content from a given URL"""
        try:
            response = requests.get(url)
            response.raise_for_status()

            # Parse HTML content and extract text
            soup = BeautifulSoup(response.content, 'html.parser')

            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()

            # Try to find main content containers first (for documentation sites)
            # Common selectors for documentation content
            main_content = (
                soup.find('main') or
                soup.find('article') or
                soup.find('div', class_='content') or
                soup.find('div', class_='container') or
                soup.find('div', class_='doc') or
                soup.find('div', id='content') or
                soup.find('div', id='documentation') or
                soup.find('div', {'role': 'main'}) or
                soup
            )

            # Get text content from the main content area
            text = main_content.get_text()

            # Clean up text
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = ' '.join(chunk for chunk in chunks if chunk)

            logger.info(f"Fetched content from {url} (length: {len(text)} chars)")
            return text
        except Exception as e:
            logger.error(f"Error fetching content from {url}: {e}")
            return ""
    
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
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
    
    def chunk_text(self, text: str, chunk_size: int = 1000) -> List[str]:
        """Split text into chunks of specified size, trying to break at sentence boundaries"""
        import re

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
    
    def store_embeddings(self, urls: List[str], contents: List[str]):
        """Store embeddings in Qdrant"""
        try:
            # Process each URL and its content
            all_points = []
            point_id = 0

            for url, content in zip(urls, contents):
                # Extract module name from URL
                module_name = self._extract_module_name(url)

                # Chunk the content
                text_chunks = self.chunk_text(content)

                for chunk_idx, chunk in enumerate(text_chunks):
                    if chunk.strip():  # Only process non-empty chunks
                        # Add the chunk to our list to process in batches
                        all_points.append({
                            "id": point_id,
                            "url": url,
                            "content": chunk,
                            "chunk_index": chunk_idx,
                            "module_name": module_name
                        })
                        point_id += 1

            # Process points in batches to manage Cohere API calls
            batch_size = 20  # Reduce batch size to avoid timeouts
            total_chunks = len(all_points)
            logger.info(f"Processing {total_chunks} total chunks from {len(urls)} URLs")

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
                import time
                time.sleep(1)

            logger.info(f"Total: {total_chunks} chunks stored in Qdrant collection '{self.collection_name}'")
        except Exception as e:
            logger.error(f"Error storing embeddings: {e}")
            raise

    def _extract_module_name(self, url: str) -> str:
        """Extract module name from URL"""
        import re
        # Look for patterns like /docs/module1-intro/, /docs/module2-ros2/, etc.
        match = re.search(r'/docs/([^/]+)/', url)
        if match:
            return match.group(1)
        else:
            # If no module pattern found, return a default value
            return "general"
    
    def process_sitemap(self, sitemap_url: str):
        """Main method to process the entire sitemap"""
        logger.info(f"Starting sitemap processing for: {sitemap_url}")
        
        # Fetch URLs from sitemap
        urls = self.fetch_sitemap(sitemap_url)
        
        # Fetch content for each URL
        contents = []
        for url in urls:
            content = self.fetch_page_content(url)
            contents.append(content)
            
            # Add a small delay to be respectful to the server
            time.sleep(0.1)
        
        # Filter out empty contents
        valid_data = [(url, content) for url, content in zip(urls, contents) if content.strip()]
        if not valid_data:
            logger.warning("No valid content found to process")
            return
        
        valid_urls, valid_contents = zip(*valid_data)
        
        # Store embeddings in Qdrant
        self.store_embeddings(list(valid_urls), list(valid_contents))
        
        logger.info("Sitemap processing completed successfully")


def main():
    # Initialize the processor
    processor = SitemapProcessor()

    # Sitemap URL
    sitemap_url = "https://jasmineshamim.github.io/hackathon-physical-ai-textbook/sitemap.xml"

    # Process the sitemap
    processor.process_sitemap(sitemap_url)

    # Also process the main documentation pages in case they're not in the sitemap
    base_url = "https://jasmineshamim.github.io/hackathon-physical-ai-textbook/"
    additional_docs = [
        "docs/module1-intro/",
        "docs/module2-ros2/",
        "docs/module3-digital-twin/",
        "docs/module4-ai-robot-brain/",
        "docs/module5-advanced-topics/"
    ]

    logger.info("Processing additional documentation pages...")
    additional_urls = [base_url + doc_path for doc_path in additional_docs]

    # Fetch content for additional URLs
    contents = []
    valid_urls = []
    for url in additional_urls:
        content = processor.fetch_page_content(url)
        if content.strip():
            contents.append(content)
            valid_urls.append(url)
            logger.info(f"Successfully fetched content from {url}")
        else:
            logger.warning(f"Failed to fetch content from {url}")

        # Add a small delay to be respectful to the server
        time.sleep(0.1)

    if valid_urls:
        # Store embeddings for additional content
        processor.store_embeddings(valid_urls, contents)
        logger.info("Additional documentation pages processed successfully")


if __name__ == "__main__":
    main()