# KSIJ One: RAG Architecture & Workflow Guide

## What is RAG?
RAG stands for **Retrieval-Augmented Generation**. Instead of relying purely on an AI's pre-trained memory (which can hallucinate or be outdated), RAG allows the AI to "read" specific, trusted documents right before it answers a question.

## The KSIJ One RAG Workflow (In Excruciating Detail)

### 1. Ingestion (Preparing the Data)
Before a user ever asks a question, data must be prepared and stored.
* **Structured Data:** Live data like Services, Events, Facilities, and Announcements are pulled directly from your PostgreSQL relational tables.
* **Unstructured Data (Markdown/PDFs):** Documents (like your new `Jamaat_AI_Chatbot_Knowledge_Base_Demo.md`) are broken down into smaller pieces called **Chunks** (e.g., a few paragraphs each).
* **Embedding Generation:** Each chunk is passed through an Embedding Model (we are currently using `@xenova/transformers` locally in Node.js). This model converts the text into a dense vector (an array of numbers, typically 384 dimensions) that represents the semantic meaning of the text.
* **Storage:** These vectors are saved into PostgreSQL using the `pgvector` extension in the `KnowledgeChunk` table.

### 2. User Query Processing
When a user types: *"I am a student studying in 10th standard, I have fees to pay of 1lakh..."*
* The Next.js API route (`src/app/api/chat/route.ts`) receives the question.
* The query is cleaned, and stop words are removed to identify key search terms.
* The query itself is converted into a vector using the exact same Embedding Model used in step 1.

### 3. Hybrid Retrieval (The "R" in RAG)
The system searches the database for the most relevant information to answer the question (`src/lib/rag/retriever.ts`). We use a **Hybrid Search** approach:
* **Vector Search (Semantic):** PostgreSQL `pgvector` calculates the cosine similarity between the user's question vector and all document chunk vectors. It finds chunks that *mean* the same thing, even if they don't use the exact same words.
* **Keyword Search (Exact Match):** The system scans the live Services and Events tables for exact keyword matches.
* **Contextual Boosting:** If the user is currently on the `/services` page, the system artificially boosts the relevance score of Service documents.
* **Deduplication:** The top results (e.g., top 8) are merged, deduplicated, and ranked.

### 4. Prompt Construction
The retrieved chunks are assembled into a giant text string called the `Context`. 
We combine this with a strict **System Prompt** (`src/lib/rag/system-prompt.ts`) that acts as the "rules of engagement" for the AI (e.g., *"Do not invent deadlines," "Start eligibility answers with Yes/No," "Always provide a redirect link"*).

The final payload sent to the LLM looks like this:
\`\`\`text
[SYSTEM PROMPT]
You are KSIJ One... (strict rules)

[CONTEXT]
Document: Education Support Scheme
URL: /services/education
Content: Enrolled community students with family income under threshold guidelines...

[USER QUESTION]
I am a student studying in 10th standard...
\`\`\`

### 5. LLM Generation (The "G" in RAG)
This entire payload is securely sent to **Groq's API** (`openai/gpt-oss-120b`). 
Because the LLM sees the trusted context directly in its prompt, it generates an answer based *only* on your community rules. It ignores its general internet knowledge.

### 6. Response & Citations
As the LLM replies, the backend tracks exactly which documents were provided in the context and attaches them as clickable "Sources" below the chat bubble.

---

## Current Shortcomings vs. Enterprise "Real World" RAG

While your current implementation is an excellent hackathon MVP, here is how it compares to an enterprise-grade RAG pipeline (and how to improve it):

### 1. Ingestion & Chunking
* **Current:** We have no automated pipeline to ingest your newly uploaded `.md` file into the `KnowledgeDocument` vector table.
* **Real World:** You would have a cron job, webhook, or admin panel button that automatically parses the `.md` file, chunks it semantically by headings (using LangChain or LlamaIndex), embeds it, and upserts it into `pgvector`.
* **Fix:** Build an admin API route that reads the file, splits it by `##` headers, and inserts it into the database.

### 2. Embedding Model Quality
* **Current:** We are using `@xenova/transformers` locally. It is fast and free, but it uses `all-MiniLM-L6-v2` (384 dimensions), which is lightweight and sometimes misses nuanced semantic connections.
* **Real World:** Enterprises use massive models like OpenAI's `text-embedding-3-small` (1536 dimensions) or Cohere's `embed-english-v3`.
* **Fix:** Swap the Xenova local embedding for Groq embeddings (if available) or a cheap cloud provider.

### 3. Keyword Search is Naive
* **Current:** We are using simple JavaScript string `.includes()` for keyword matching over active database rows. This fails on typos or pluralization (e.g., "plumbers" vs "plumber").
* **Real World:** Uses Full-Text Search engines like ElasticSearch, Meilisearch, or PostgreSQL's native `tsvector` with BM25 ranking.
* **Fix:** Update the Prisma queries to use Postgres Full Text Search instead of Javascript filtering.

### 4. Query Rewriting / Intent Routing
* **Current:** We pass the user's raw query directly to the vector database. If they say "Can you help me?", the vector search looks for chunks related to the concept of "help", which is too vague.
* **Real World:** The system first passes the user's query to a fast, cheap LLM to rewrite it (e.g., "Can you help me with fees?" -> "Education fee financial assistance schemes").
* **Fix:** Add a pre-processing LLM call to rewrite vague queries.

## Summary: Are these answers REAL?
**YES.** You are currently getting REAL answers generated by Groq (GPT-OSS-120b), securely grounded in whatever data currently lives in your PostgreSQL database. The LLM is actively reading your data and applying the strict constraints we defined.
