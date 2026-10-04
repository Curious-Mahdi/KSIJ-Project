import { z } from "zod";

export const ChatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(1000, "Message is too long"),
  conversationId: z.string().optional(),
  currentPage: z.string().optional(),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string()
  })).optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
