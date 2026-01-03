from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat import router as chat_router
from app.api.router import router as api_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="RAG Chatbot API",
        description="A RAG-based chatbot API using Qdrant vector storage and Gemini LLM",
        version="1.0.0"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "https://hackathon-i-physical-ai-book-chatbot.vercel.app",  # fixed typo
            "http://localhost:3000"
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    

    # Include API routers
    app.include_router(chat_router, prefix="/api/v1")
    app.include_router(api_router, prefix="/api")  # For direct API access without versioning

    return app


app = create_app()


@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "RAG Chatbot API is running"}