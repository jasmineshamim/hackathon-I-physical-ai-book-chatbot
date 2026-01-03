from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.chat import router as chat_router
from app.api.router import router as api_router

app = FastAPI(
    title="RAG Chatbot API",
    description="API for RAG chatbot integration with Physical AI & Humanoid Robotics book",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev/testing; replace with frontend domain in prod
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat_router, prefix="/api/v1")
app.include_router(api_router, prefix="/api")

# ✅ Manual OPTIONS handler with explicit CORS headers
@app.options("/api/{rest_of_path:path}")
async def preflight_api(rest_of_path: str, request: Request):
    """
    Handle OPTIONS preflight for all /api/* routes.
    Explicitly set CORS headers to satisfy browser.
    """
    return JSONResponse(
        status_code=200,
        content={"message": "preflight OK"},
        headers={
            "Access-Control-Allow-Origin": "*",  # Replace * with frontend URL in prod
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    )

# Root & health
@app.get("/")
async def root():
    return {"status": "server is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
