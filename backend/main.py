import uvicorn
from app.config.settings import settings


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",  # Listen on all available interfaces
        port=8000,       # Default port, can be changed as needed
        reload=True,     # Enable auto-reload during development
        log_level="info" # Set logging level
    )