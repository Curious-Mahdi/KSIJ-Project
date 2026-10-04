export interface LLMProvider {
  generate(systemPrompt: string, userMessage: string, context: string, history?: { role: string, content: string }[]): Promise<string>;
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

// ─── Gemini Provider (Google AI) ───────────────────────────────────────────────
export class GeminiProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "gemini-1.5-flash") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(systemPrompt: string, userMessage: string, context: string, history?: { role: string, content: string }[]): Promise<string> {
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Build conversation history
    if (history && history.length > 0) {
      for (const msg of history) {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
    }

    // Add the current user message
    contents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const requestBody: Record<string, unknown> = {
      contents,
      systemInstruction: {
        parts: [{ text: `${systemPrompt}\n\nCONTEXT:\n${context}` }],
      },
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error:", errText);
      throw new Error(`Gemini API failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract text from Gemini response
    const candidates = data.candidates;
    if (candidates && candidates.length > 0 && candidates[0].content?.parts?.length > 0) {
      return candidates[0].content.parts.map((p: { text?: string }) => p.text || "").join("");
    }

    throw new Error("No valid response from Gemini API");
  }
}

// ─── Groq Provider ─────────────────────────────────────────────────────────────
export class GroqProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "llama3-8b-8192") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(systemPrompt: string, userMessage: string, context: string, history?: { role: string, content: string }[]): Promise<string> {
    const messages = [
      { role: "system", content: `${systemPrompt}\n\nCONTEXT:\n${context}` }
    ];

    if (history && history.length > 0) {
      for (const msg of history) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: "user", content: userMessage });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages,
        temperature: 0.1,
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API Error:", errText);
      throw new Error(`Groq API failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

// ─── OpenAI Provider ───────────────────────────────────────────────────────────
export class OpenAIProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "gpt-4o") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(systemPrompt: string, userMessage: string, context: string, history?: { role: string, content: string }[]): Promise<string> {
    const messages = [
      { role: "system", content: `${systemPrompt}\n\nCONTEXT:\n${context}` }
    ];

    if (history && history.length > 0) {
      for (const msg of history) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: "user", content: userMessage });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages,
        temperature: 0.1,
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API Error:", errText);
      throw new Error(`OpenAI API failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

// ─── Ollama Provider (Local) ───────────────────────────────────────────────────
export class OllamaProvider implements LLMProvider {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl = "http://localhost:11434", model = "llama3") {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async generate(systemPrompt: string, userMessage: string, context: string, history?: { role: string, content: string }[]): Promise<string> {
    const historyStr = history && history.length > 0
      ? `\nCONVERSATION HISTORY:\n${history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}\n`
      : "";

    const prompt = `
${systemPrompt}

CONTEXT:
${context}
${historyStr}
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

// ─── Mock Provider (Fallback) ──────────────────────────────────────────────────
export class MockProvider implements LLMProvider {
  async generate(systemPrompt: string, userMessage: string, context: string, history?: { role: string, content: string }[]): Promise<string> {
    return formatGroundedAnswer(userMessage, context);
  }
}

// ─── Provider Selection ────────────────────────────────────────────────────────
export function getLLMProvider(): LLMProvider {
  if (process.env.USE_MOCK_LLM === "true") {
    return new MockProvider();
  }

  // Prioritize Groq
  if (process.env.GROQ_API_KEY) {
    return new GroqProvider(
      process.env.GROQ_API_KEY,
      process.env.GROQ_MODEL || "openai/gpt-oss-120b"
    );
  }

  // Prioritize Gemini (free tier)
  if (process.env.GEMINI_API_KEY) {
    return new GeminiProvider(
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_MODEL || "gemini-2.0-flash"
    );
  }

  if (process.env.OPENAI_API_KEY) {
    return new OpenAIProvider(process.env.OPENAI_API_KEY, process.env.OPENAI_MODEL || "gpt-4o");
  }

  return new OllamaProvider(
    process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    process.env.OLLAMA_MODEL || "llama3"
  );
}
