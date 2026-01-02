# CORS Configuration for RAG Chatbot Integration

## Frontend to Backend Communication

The frontend (Docusaurus on http://localhost:3000) needs to communicate with the backend (FastAPI on http://127.0.0.1:8000).

## Backend CORS Setup

To enable CORS on the FastAPI backend, ensure the following is in your backend's main application file (likely main.py):

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Docusaurus development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Alternative Backend Configuration

If you're running the backend on a different port during development, update the allow_origins accordingly:

```python
# For development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Docusaurus dev server
        "http://127.0.0.1:3000",  # Alternative Docusaurus dev server
        "http://localhost:3001",  # Alternative port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Frontend Considerations

The frontend component handles API requests properly using the fetch API with appropriate error handling. No special CORS configuration is needed on the frontend side.

## Production Considerations

For production deployments, update the allow_origins to include your actual domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Your production domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

If you encounter CORS errors:
1. Verify the backend server is running
2. Check that the port numbers match between frontend and backend
3. Ensure the CORS middleware is properly configured on the backend
4. Restart both servers after making changes