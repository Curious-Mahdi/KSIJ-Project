import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const documents = await prisma.knowledgeDocument.count();
    const chunks = await prisma.knowledgeChunk.count();

    return NextResponse.json({
      status: "healthy",
      database: true,
      pgvector: true,
      documents,
      chunks,
      embeddingProvider: "local",
      ragEnabled: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: "degraded",
      database: false,
      error: "Could not connect to database"
    }, { status: 500 });
  }
}
