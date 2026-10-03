# RAG Setup Guide

1. Install dependencies:
   \`\`\`bash
   npm install openai zod
   npm install -D tsx dotenv
   \`\`\`

2. Configure environment variables in \`.env\`:
   \`\`\`env
   OPENAI_API_KEY="your-api-key"
   OPENAI_MODEL="gpt-4o"
   RAG_MAX_RESULTS=8
   RAG_ENABLED=true
   \`\`\`

3. Create the vector store:
   \`\`\`bash
   npx tsx scripts/create-vector-store.ts
   \`\`\`
   Copy the ID and add to \`.env\`:
   \`\`\`env
   OPENAI_VECTOR_STORE_ID="vs_xxxx"
   \`\`\`

4. Upload documents:
   \`\`\`bash
   npx tsx scripts/upload-knowledge.ts
   \`\`\`

5. Run the dev server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Navigate to \`http://localhost:3000/chatbot\` to test the UI.
