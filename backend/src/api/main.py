from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routers import health, query
from src.api.middleware.security import add_security_headers


def create_app():
    app = FastAPI(
        title="Integrated RAG Chatbot API",
        description="API for a Retrieval-Augmented Generation chatbot that answers questions based on book content",
        version="1.0.0"
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins="http://localhost:3000",  # In production, replace with specific origins
        allow_credentials=True,
        allow_methods=["Get", "Post", "Put", "Delete", "Options"],
        allow_headers=["X-API-Key", "Content-Type"," Authorization"],
    )

    # Add security headers
    app.middleware("http")(add_security_headers)

    # Root endpoint
    @app.get("/")
    async def root():
        return {"message": "Server is running successfully"}

    # Include routers
    app.include_router(health.router, prefix="/health", tags=["health"])
    app.include_router(query.router, prefix="/api", tags=["query"])

    return app


app = create_app()