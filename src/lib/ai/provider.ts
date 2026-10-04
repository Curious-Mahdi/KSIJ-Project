export interface LLMProvider {
  generate(systemPrompt: string, userMessage: string, context: string): Promise<string>;
}

function formatGroundedAnswer(userMessage: string, context: string): string {
  if (!context || context.trim() === "") {
    return "I couldn't find sufficient information about that in the approved community documents.";
  }

  return (
    `Here is the verified information from our community database regarding your enquiry:\n\n` +
    context
      .split("\n---\n")
      .map((block) => {
        const lines = block.trim().split("\n");
        const docLine = lines[0] || "";
        const rest = lines.slice(1).join("\n");
        return `### ${docLine.replace("Document: ", "")}\n${rest}`;
      })
      .join("\n\n") +
    `\n\nFor further guidance or official verification, please feel free to submit an inquiry through our Help Desk or contact the respective department directly.`
  );
}

export class OllamaProvider implements LLMProvider {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl = "http://localhost:11434", model = "llama3") {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async generate(systemPrompt: string, userMessage: string, context: string): Promise<string> {
    const prompt = `
${systemPrompt}

CONTEXT:
${context}

USER QUESTION:
${userMessage}
`;

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
        }),
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response) return data.response;
      }
    } catch (err) {
      // Ollama not running locally; fallback to deterministic grounding
    }

    return formatGroundedAnswer(userMessage, context);
  }
}

export class MockProvider implements LLMProvider {
  async generate(systemPrompt: string, userMessage: string, context: string): Promise<string> {
    return formatGroundedAnswer(userMessage, context);
  }
}

export function getLLMProvider(): LLMProvider {
  if (process.env.USE_MOCK_LLM === "true") {
    return new MockProvider();
  }
  return new OllamaProvider(
    process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    process.env.OLLAMA_MODEL || "llama3"
  );
}
