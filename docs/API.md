# API Reference

## POST `/api/chat`
Handles conversational RAG queries.

**Request Body:**
\`\`\`json
{
  "message": "What is the education scheme?"
}
\`\`\`

**Response:**
\`\`\`json
{
  "answer": "The Education Support Scheme provides financial support...",
  "grounded": true,
  "citations": [
    {
      "id": "file-xyz",
      "filename": "03-education-support-scheme.md"
    }
  ],
  "requestId": "uuid"
}
\`\`\`

## GET `/api/rag/health`
Checks the system status.

**Response:**
\`\`\`json
{
  "status": "healthy",
  "ragEnabled": true,
  "vectorStoreConfigured": true,
  "timestamp": "2026-10-03T00:00:00Z"
}
\`\`\`
