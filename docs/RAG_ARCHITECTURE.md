# RAG Architecture

This document describes the architectural flow of the Community Knowledge Assistant RAG system.

## Overview

The system uses OpenAI's Responses API and File Search tools to provide a source-grounded assistant.

1. **Documents**: Community guidelines, schemes, and procedures are stored as markdown/PDF files.
2. **OpenAI Vector Store**: The documents are uploaded and indexed by OpenAI.
3. **File Search**: When a user asks a query, the File Search tool retrieves relevant semantic chunks.
4. **Grounded Response**: The LLM synthesizes an answer strictly from the retrieved chunks.
5. **Citations**: The system extracts the source file citations.
6. **Abstention**: If evidence is missing, the LLM abstains from answering.

## Data Flow
User -> Next.js Chat UI -> POST /api/chat -> Validation -> OpenAI Responses API -> Vector Store Search -> LLM Generation -> Formatted JSON Response -> UI.
