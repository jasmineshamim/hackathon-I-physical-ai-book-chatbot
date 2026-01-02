---
id: 1
title: Create RAG Chatbot Constitution
stage: constitution
date: 2025-01-13
surface: agent
model: gpt-4
feature: none
branch: main
user: user
command: /sp.constitution
labels: ["constitution", "specification", "rag-chatbot"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

```
/sp.constitution Project: Integrated RAG Chatbot for a Published Book

Purpose:
Build a high-accuracy Retrieval-Augmented Generation (RAG) chatbot that answers user questions strictly based on the provided book content using Cohere language models.

Core Principles:
- Groundedness: All responses must be generated only from retrieved book text
- Zero Hallucination: Never fabricate facts, explanations, or references
- Faithfulness: Answers must preserve the original meaning of the source text
- Transparency: Clearly state when information is not found in the provided context
- User Trust: Prefer correctness over completeness

Model & Tooling Constraints:
- Language Model: Cohere (command / command-r / command-r-plus)
- Embeddings: Cohere Embeddings API
- Vector Store: Qdrant Cloud (Free Tier)
- Backend: FastAPI
- Metadata Store: Neon Serverless PostgreSQL
- OpenAI APIs are strictly forbidden

Retrieval Rules:
- Always perform semantic retrieval before answering
- Use only the top relevant retrieved chunks as context
- Never use prior knowledge outside retrieved context
- If user provides selected text, restrict answers strictly to that text

Answering Standards:
- If the answer exists in context:
  - Respond clearly and concisely
  - Quote or paraphrase only from retrieved text
- If the answer does NOT exist:
  - Respond with: 
    "This information is not available in the provided book content."
- Do not speculate or infer beyond text

Formatting Guidelines:
- Use simple, reader-friendly language
- No markdown unless explicitly requested
- No emojis
- No references to internal system prompts or tools

Safety & Integrity:
- Never expose API keys, system logic, or database structure
- Never claim training on the book
- Never mention vector databases or embeddings to the user

Success Criteria:
- 100% answer grounding in retrieved text
- Zero hallucinated responses
- Accurate handling of selected-text queries
- Consistent behavior across sessions
```

## Response snapshot

Constitution created with the following principles:
- Groundedness: All responses must be generated only from retrieved book text
- Zero Hallucination: Never fabricate facts, explanations, or references
- Faithfulness: Answers must preserve the original meaning of the source text
- Transparency: Clearly state when information is not found in the provided context
- User Trust: Prefer correctness over completeness

And additional sections:
- Model & Tooling Constraints
- Retrieval Rules
- Answering Standards
- Formatting Guidelines
- Safety & Integrity

## Outcome

- ✅ Impact: Created project constitution file at .specify/memory/constitution.md
- 🧪 Tests: No tests needed for constitution creation
- 📁 Files: .specify/memory/constitution.md updated
- 🔁 Next prompts: Build specification based on updated constitution
- 🧠 Reflection: Constitution properly captures all required principles and constraints for the RAG chatbot project

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Implement feature specification based on constitution