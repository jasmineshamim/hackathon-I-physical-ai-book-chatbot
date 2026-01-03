from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.chat import router as chat_router
from app.api.router import router as api_router

app = FastAPI(
    title="RAG Chatbot API",
    description="API for RAG chatbot integration",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://hackathon-i-physical-ai-book-chatbo.vercel.app/"],  # Dev/testing, replace with frontend domain for production
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Routers
app.include_router(chat_router, prefix="/api/v1")
app.include_router(api_router, prefix="/api")

# ✅ Manual preflight for all /api/* routes with headers
@app.options("/api/{rest_of_path:path}")
async def preflight_api(rest_of_path: str, request: Request):
    return JSONResponse(
        status_code=200,
        content={"message": "preflight OK"},
        headers={
            "Access-Control-Allow-Origin": "*",  # replace * with frontend domain in prod
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
