# Physical AI RAG Chatbot

A RAG-based AI chatbot that uses Qdrant vector storage and Google's Gemini AI to answer questions about physical AI concepts.

## 🏗️ Project Structure

```
project-root/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   └── chat.py
│   │   ├── rag/
│   │   │   ├── ingest.py
│   │   │   ├── query.py
│   │   │   └── vector_store.py
│   │   ├── core/
│   │   │   └── config.py
│   │   └── utils/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── app/ (Next.js App Router)
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── chat/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   └── InputBox.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- Qdrant vector database
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```bash
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Set up your environment variables in `.env`:
   ```env
   GEMINI_API_KEY=your-gemini-api-key-here
   QDRANT_API_KEY=your-qdrant-api-key-here
   QDRANT_URL=http://localhost:6333
   QDRANT_COLLECTION_NAME=documents
   GEMINI_MODEL_NAME=gemini-pro
   RETRIEVAL_LIMIT=5
   ```

6. Run the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to [http://localhost:3000](http://localhost:3000) to view the app.

## 🛠️ API Endpoints

- `GET /health` - Check if the API is running
- `POST /api/v1/chat` - Send a message and get a response from the AI

## 🤖 Features

- RAG (Retrieval Augmented Generation) powered by Qdrant and Gemini
- Chat interface with message history
- Loading indicators
- Source attribution for AI responses

## 📁 What Was Fixed

1. **Separated backend and frontend completely** - No more mixing of files
2. **Backend** - FastAPI with RAG functionality using Qdrant and Gemini
3. **Frontend** - Next.js with clean, responsive chat UI
4. **Proper folder structure** - Following industry standards
5. **Environment configuration** - Proper .env handling

## 🧪 Testing

To test the backend API, you can use curl:

```bash
curl -X POST "http://localhost:8000/api/v1/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is physical AI?",
    "history": []
  }'
```

## 🚧 Troubleshooting

- Make sure Qdrant is running at the specified URL
- Verify your Gemini API key is valid and has the necessary permissions
- Check that both backend and frontend are running on their respective ports