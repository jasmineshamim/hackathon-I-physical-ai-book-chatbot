from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat import router as chat_router
from app.api.router import router as api_router


app = FastAPI(
    title="RAG Chatbot API",
    description="API for RAG chatbot integration with Physical AI & Humanoid Robotics book",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "server is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

app.include_router(chat_router, prefix="/api/v1")
app.include_router(api_router, prefix="/api")  # For direct API access without versioning
