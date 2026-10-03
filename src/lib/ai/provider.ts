export interface LLMProvider {
  generate(systemPrompt: string, userMessage: string, context: string): Promise<string>;
}

export class OllamaProvider implements LLMProvider {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl = 'http://localhost:11434', model = 'llama3') {
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

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  }
}

// Fallback Mock Provider for hackathon demo if Ollama isn't running locally
export class MockProvider implements LLMProvider {
  async generate(systemPrompt: string, userMessage: string, context: string): Promise<string> {
    if (!context || context.trim() === '') {
      return "I couldn't find sufficient information about that in the approved community documents.";
    }
    
    // Simple extraction mock for demo purposes if no real LLM is running
    return `Based on the provided documents:\n\n${context}\n\n*(Note: This is a mock response because no LLM is currently connected).*`;
  }
}

// Select provider based on env
export function getLLMProvider(): LLMProvider {
  if (process.env.USE_MOCK_LLM === 'true') {
    return new MockProvider();
  }
  return new OllamaProvider(
    process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    process.env.OLLAMA_MODEL || 'llama3'
  );
}
