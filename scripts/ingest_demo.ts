import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { getEmbeddingProvider } from '../src/lib/rag/embeddings';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting knowledge ingestion...");
  
  const filePath = path.join(process.cwd(), 'knowledge', 'demo', 'Jamaat_AI_Chatbot_Knowledge_Base_Demo.md');
  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Clean up any existing demo documents so we don't duplicate
  await prisma.knowledgeDocument.deleteMany({
    where: { title: "Jamaat AI Chatbot Knowledge Base (Demo)" }
  });

  const doc = await prisma.knowledgeDocument.create({
    data: {
      title: "Jamaat AI Chatbot Knowledge Base (Demo)",
      description: "Provisional knowledge base for testing chatbot",
      category: "General",
      documentType: "Markdown",
      status: "active",
      fileName: "Jamaat_AI_Chatbot_Knowledge_Base_Demo.md",
    }
  });

  // Simple chunking by headings (## )
  const rawSections = content.split(/(?=\n## )/g);
  
  const provider = getEmbeddingProvider();
  
  let chunkIndex = 0;
  for (const section of rawSections) {
    if (section.trim().length < 20) continue; // Skip empty/too short sections
    
    // Attempt to extract a section title
    const lines = section.trim().split('\n');
    let sectionTitle = "General";
    if (lines[0].startsWith('## ')) {
      sectionTitle = lines[0].replace(/#+/g, '').trim();
    }

    console.log(`Embedding chunk ${chunkIndex + 1}: ${sectionTitle} (${section.length} bytes)`);
    const embedding = await provider.embedText(section);
    
    // pgvector requires strings in format "[0.1, 0.2, ...]"
    const embeddingJson = `[${embedding.join(',')}]`;

    await prisma.knowledgeChunk.create({
      data: {
        documentId: doc.id,
        content: section.trim(),
        chunkIndex,
        section: sectionTitle,
        embeddingJson,
      }
    });

    chunkIndex++;
  }

  console.log(`Successfully ingested document with ${chunkIndex} chunks.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
