import sys
import os
from pathlib import Path

# Add the project root directory to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Now import and run the FastAPI app
from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("run_server:app", host="127.0.0.1", port=8000, reload=True)