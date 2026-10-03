export type Citation = {
  id: string;
  filename: string;
  title?: string;
  section?: string;
  page?: number;
  sourceUrl?: string;
};

export type ChatResponse = {
  answer: string;
  grounded: boolean;
  citations: Citation[];
  confidence?: "high" | "medium" | "low";
  requestId: string;
};
