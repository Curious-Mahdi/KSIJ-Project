import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { getEmbeddingProvider } from '../src/lib/rag/embeddings';

const prisma = new PrismaClient();
const embedder = getEmbeddingProvider();

async function main() {
  console.log('Starting ingestion pipeline...');
  const knowledgeDir = path.join(process.cwd(), 'knowledge', 'demo');
  
  if (!fs.existsSync(knowledgeDir)) {
    console.error(`Knowledge directory not found: ${knowledgeDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} documents.`);

  // Create extension if it doesn't exist
  try {
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);
    console.log('Verified pgvector extension.');
  } catch (err) {
    console.warn('Could not verify pgvector extension (might require superuser). Proceeding anyway...', err);
  }

  for (const file of files) {
    console.log(`\nProcessing ${file}...`);
    const content = fs.readFileSync(path.join(knowledgeDir, file), 'utf-8');
    
    // Naive frontmatter/metadata extraction
    let title = file.replace('.md', '').split('-').slice(1).join(' ');
    title = title.charAt(0).toUpperCase() + title.slice(1);
    
    // Create Document
    const doc = await prisma.knowledgeDocument.create({
      data: {
        title: title,
        fileName: file,
        documentType: 'scheme',
        status: 'active'
      }
    });
    
    console.log(`Created document record ${doc.id}`);

    // Chunking logic (split by headers)
    const chunks = splitIntoChunks(content);
    console.log(`Generated ${chunks.length} chunks.`);

    let chunkIndex = 0;
    for (const chunk of chunks) {
      if (chunk.content.trim().length < 10) continue; // skip tiny chunks
      
      const embedding = await embedder.embedText(chunk.content);
      
      const embeddingStr = `[${embedding.join(',')}]`;
      
      // Store in DB using raw query to handle the vector type correctly
      await prisma.$executeRaw`
        INSERT INTO "KnowledgeChunk" (
          "id", "documentId", "content", "chunkIndex", "section", "createdAt", "embedding"
        ) VALUES (
          gen_random_uuid()::text, 
          ${doc.id}, 
          ${chunk.content}, 
          ${chunkIndex}, 
          ${chunk.section || ''},
          now(),
          ${embeddingStr}::vector
        )
      `;
      chunkIndex++;
    }
    console.log(`Completed ingestion for ${file}.`);
  }

  console.log('\nIngestion complete!');
}

function splitIntoChunks(text: string) {
  // Simple structure-aware chunking based on markdown headers
  const lines = text.split('\n');
  const chunks = [];
  let currentSection = 'Overview';
  let currentContent = '';

  for (const line of lines) {
    if (line.startsWith('# ')) {
      if (currentContent.trim()) {
        chunks.push({ section: currentSection, content: currentContent.trim() });
      }
      currentSection = line.replace('# ', '').trim();
      currentContent = line + '\n';
    } else if (line.startsWith('## ')) {
      if (currentContent.trim()) {
        chunks.push({ section: currentSection, content: currentContent.trim() });
      }
      currentSection = line.replace('## ', '').trim();
      currentContent = line + '\n';
    } else {
      currentContent += line + '\n';
    }
  }
  
  if (currentContent.trim()) {
    chunks.push({ section: currentSection, content: currentContent.trim() });
  }

  return chunks;
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
