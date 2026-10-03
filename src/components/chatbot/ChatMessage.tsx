import { Citation } from "@/lib/rag/types";
import { SourceCard } from "./SourceCard";

export type MessageProps = {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  isThinking?: boolean;
};

export function ChatMessage({ role, content, citations = [], isThinking }: MessageProps) {
  const isUser = role === "user";
  
  return (
    <div className={`flex flex-col mb-4 ${isUser ? "items-end" : "items-start"}`}>
      <div className={`max-w-[80%] rounded-lg p-3 ${isUser ? "bg-[#0B4D36] text-white" : "bg-white border border-gray-200 text-gray-800"}`}>
        {isThinking ? (
          <div className="flex space-x-2 animate-pulse">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{content}</div>
        )}
      </div>
      
      {!isUser && citations.length > 0 && (
        <div className="mt-2 max-w-[80%]">
          <p className="text-xs text-gray-500 mb-1 font-semibold">Sources:</p>
          <div className="flex flex-wrap gap-2">
            {citations.map((c, i) => (
              <SourceCard key={c.id || i} citation={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
