# Quickstart Guide: Integrated RAG Chatbot for a Published Book

## Prerequisites

- Python 3.11+
- Docker and Docker Compose (for containerized deployment)
- Cohere API key
- Qdrant Cloud account and API key
- Neon Serverless PostgreSQL account and connection details

## Environment Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables by creating a `.env` file:
   ```env
   COHERE_API_KEY=your_cohere_api_key
   QDRANT_URL=your_qdrant_cloud_url
   QDRANT_API_KEY=your_qdrant_api_key
   DATABASE_URL=your_neon_postgresql_connection_string
   ```

## Running the Application

### Option 1: Direct Python Execution

1. Install dependencies as shown above
2. Run the application:
   ```bash
   cd backend
   uvicorn src.api.main:app --reload --port 8000
   ```

### Option 2: Docker Compose

1. Build and run the containers:
   ```bash
   docker-compose up --build
   ```

The application will be available at `http://localhost:8000`.

## API Endpoints

### Health Check
- `GET /health` - Check if the service is running

### Query Endpoints
- `POST /query` - Ask a question about the book content
- `POST /query-with-selection` - Ask a question about selected text only

### Ingestion Endpoints
- `POST /ingest-book` - Upload and process a book for RAG
- `GET /books` - List available books

## Testing

Run unit tests:
```bash
pytest tests/unit/
```

Run integration tests:
```bash
pytest tests/integration/
```

Run all tests:
```bash
pytest
```

## Book Ingestion

To add a new book to the RAG system:

1. Prepare your book content in plain text format
2. Make a POST request to `/ingest-book` with the book content:
   ```bash
   curl -X POST http://localhost:8000/ingest-book \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Book Title",
       "content": "Full book content here...",
       "metadata": {"author": "Author Name", "year": "2024"}
     }'
   ```

The system will automatically:
- Process and chunk the content
- Generate embeddings using Cohere
- Store chunks in Qdrant
- Store metadata in PostgreSQL

## Example Usage

Query the chatbot:
```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the main theme of this book?",
    "book_id": "book-identifier"
  }'
```

Query with selected text only:
```bash
curl -X POST http://localhost:8000/query-with-selection \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Explain this concept",
    "selected_text": "The concept is described in this selected text...",
    "book_id": "book-identifier"
  }'
```

## Configuration

The application behavior can be configured through environment variables:

- `COHERE_MODEL`: Cohere model to use for generation (default: command-r-plus)
- `EMBEDDING_MODEL`: Cohere model to use for embeddings (default: embed-multilingual-v3.0)
- `QDRANT_COLLECTION_NAME`: Name of the Qdrant collection (default: book_chunks)
- `MAX_CONCURRENT_USERS`: Maximum number of concurrent users (default: 50)
- `RESPONSE_TIMEOUT`: Timeout for Cohere API calls (default: 30 seconds)