import { NextResponse } from "next/server";
import { ChatRequestSchema } from "@/lib/validation/chat";
import { SYSTEM_PROMPT } from "@/lib/rag/system-prompt";
import { ChatResponse, Citation } from "@/lib/rag/types";
import { retrieveRelevantChunks } from "@/lib/rag/retriever";
import { getLLMProvider } from "@/lib/ai/provider";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const requestId = randomUUID();
  const startTime = Date.now();

  try {
    const body = await request.json();
    const result = ChatRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", details: result.error.issues },
        { status: 400 }
      );
    }

    const { message } = result.data;
    
    // Retrieve context from Postgres via pgvector
    const maxResults = parseInt(process.env.RAG_MAX_RESULTS || "8", 10);
    const retrievedChunks = await retrieveRelevantChunks(message, maxResults, 0.5);

    // Build context block
    let contextStr = retrievedChunks.map(chunk => 
      `Document: ${chunk.title}\nSection: ${chunk.section || 'General'}\nContent: ${chunk.content}\n`
    ).join('\n---\n');

    // Get LLM response
    const llm = getLLMProvider();
    const answer = await llm.generate(SYSTEM_PROMPT, message, contextStr);
    
    const isAbstention = answer.includes("I couldn't find sufficient information") || 
                         answer.includes("does not have sufficient information") ||
                         retrievedChunks.length === 0;

    // Generate citations from retrieved chunks
    const citations: Citation[] = [];
    const seenDocs = new Set<string>();

    for (const chunk of retrievedChunks) {
      if (!seenDocs.has(chunk.documentId)) {
        seenDocs.add(chunk.documentId);
        citations.push({
          id: chunk.documentId,
          filename: chunk.title,
          sourceUrl: chunk.sourceUrl || `/library/${chunk.documentId}`,
          title: chunk.title,
          section: chunk.section || undefined,
          page: chunk.pageNumber || undefined
        });
      }
    }

    const grounded = citations.length > 0 && !isAbstention;

    const chatResponse: ChatResponse = {
      answer: isAbstention && retrievedChunks.length === 0 
        ? "I couldn't find sufficient information about that in the approved community documents." 
        : answer,
      grounded,
      citations: isAbstention ? [] : citations,
      requestId,
    };

    const latencyMs = Date.now() - startTime;
    console.log(JSON.stringify({
      level: "info",
      type: "chat_telemetry",
      request_id: requestId,
      latency_ms: latencyMs,
      question_length: message.length,
      retrieval_used: true,
      retrieved_chunks_count: retrievedChunks.length,
      success: true,
      grounded
    }));

    return NextResponse.json(chatResponse);

  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.error(JSON.stringify({
      level: "error",
      type: "chat_telemetry",
      request_id: requestId,
      latency_ms: latencyMs,
      success: false,
      error_type: error.name || "UnknownError",
      message: error.message
    }));

    return NextResponse.json(
      { error: "Sorry, the community assistant is temporarily unable to access the knowledge base. Please try again shortly." },
      { status: 500 }
    );
  }
}
