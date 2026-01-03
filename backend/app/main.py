from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.chat import router as chat_router
from app.api.router import router as api_router

# Create FastAPI app
app = FastAPI(
    title="RAG Chatbot API",
    description="API for RAG chatbot integration with Physical AI & Humanoid Robotics book",
    version="1.0.0"
)

# Robust CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],         # Temporary for dev/testing
    allow_credentials=True,
    allow_methods=["*"],         # GET, POST, OPTIONS etc.
    allow_headers=["*"],
)

# Root route
@app.get("/")
async def root():
    return {"status": "server is running"}

# Health check
@app.get("/health")
async def health():
    return {"status": "healthy"}

# Include routers
app.include_router(chat_router, prefix="/api/v1")
app.include_router(api_router, prefix="/api")  # For direct API access

# === Manual OPTIONS handler for preflight requests ===
@app.options("/{full_path:path}")
async def preflight_handler(full_path: str, request: Request):
    """
    Handle OPTIONS preflight requests for any route.
    Returns 200 OK so browser CORS checks pass.
    """
    return JSONResponse(
        status_code=200,
        content={"message": "preflight OK"}
    )
