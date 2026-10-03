import { PrismaClient } from '@prisma/client';
import { getEmbeddingProvider } from './embeddings';

const prisma = new PrismaClient();
const embedder = getEmbeddingProvider();

export interface RetrievedChunk {
  id: string;
  documentId: string;
  title: string;
  content: string;
  section: string | null;
  pageNumber: number | null;
  similarity: number;
}

export async function retrieveRelevantChunks(query: string, limit: number = 8, threshold: number = 0.5): Promise<RetrievedChunk[]> {
  const queryEmbedding = await embedder.embedText(query);
  const embeddingStr = `[${queryEmbedding.join(',')}]`;

  // Cosine distance operator is <=>. Similarity is 1 - distance
  const results = await prisma.$queryRaw<any[]>`
    SELECT 
      c.id, 
      c."documentId", 
      c.content, 
      c.section, 
      c."pageNumber",
      d.title,
      1 - (c.embedding <=> ${embeddingStr}::vector) as similarity
    FROM "KnowledgeChunk" c
    JOIN "KnowledgeDocument" d ON c."documentId" = d.id
    WHERE d.status = 'active'
      AND 1 - (c.embedding <=> ${embeddingStr}::vector) >= ${threshold}
    ORDER BY c.embedding <=> ${embeddingStr}::vector
    LIMIT ${limit}
  `;

  return results.map(r => ({
    id: r.id,
    documentId: r.documentId,
    title: r.title,
    content: r.content,
    section: r.section,
    pageNumber: r.pageNumber,
    similarity: r.similarity
  }));
}
