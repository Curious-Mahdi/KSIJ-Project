"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { CheckCheck, ChevronDown, AlertCircle, RotateCcw } from "lucide-react";
import { Citation } from "@/lib/rag/types";
import { SourceCard } from "./SourceCard";

export type MessageProps = {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  isThinking?: boolean;
  isError?: boolean;
  retryText?: string;
  timestamp?: string;
  onRetry?: () => void;
};

export function ChatMessage({ role, content, citations = [], isThinking, isError, timestamp, onRetry }: MessageProps) {
  const isUser = role === "user";
  const [showSources, setShowSources] = useState(false);

  // De-duplicate sources by title + section
  const uniqueCitations = useMemo(() => {
    const seen = new Set<string>();
    return citations.filter((c) => {
      const key = `${c.title || c.filename}|${c.section ?? ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [citations]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`flex w-full items-end gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="mb-5 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#0B4D36]/15 bg-white p-0.5 shadow-sm">
          <Image src="/ksij-logo.jpg" alt="KSIJ One" width={28} height={28} className="h-full w-full rounded-full object-contain" />
        </div>
      )}

      <div className={`flex min-w-0 max-w-[82%] flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 text-[14.5px] leading-relaxed shadow-sm ${
            isUser
              ? "rounded-2xl rounded-br-md bg-gradient-to-br from-[#0B4D36] to-[#0f6a4a] text-white"
              : isError
              ? "rounded-2xl rounded-bl-md border border-red-200 bg-red-50 text-red-800"
              : "rounded-2xl rounded-bl-md border border-gray-200/80 bg-white text-gray-800"
          }`}
        >
          {isThinking ? (
            <div className="flex items-center gap-1.5 py-2" aria-label="Assistant is typing">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-[#0B4D36]/40" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          ) : (
            <>
              {isError && (
                <div className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold">
                  <AlertCircle size={14} /> Error
                </div>
              )}
              <div className="break-words">
                <ReactMarkdown
                  components={{
                    p: (p) => <p className="my-1 first:mt-0 last:mb-0" {...p} />,
                    ul: (p) => <ul className="my-1.5 list-disc space-y-1 pl-5" {...p} />,
                    ol: (p) => <ol className="my-1.5 list-decimal space-y-1 pl-5" {...p} />,
                    strong: (p) => <strong className="font-semibold" {...p} />,
                    code: (p) => <code className="rounded bg-black/5 px-1 py-0.5 text-[13px]" {...p} />,
                    a: ({ node, ...p }) => (
                      <a
                        {...p}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-1 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[13px] font-semibold no-underline shadow-sm transition ${
                          isUser ? "bg-white/20 text-white hover:bg-white/30" : "bg-[#D4AF37] text-[#0B4D36] hover:bg-[#e2c15a]"
                        }`}
                      />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>

              {isError && onRetry && (
                <button onClick={onRetry} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-red-700">
                  <RotateCcw size={13} /> Retry
                </button>
              )}
            </>
          )}
        </div>

        {/* Meta row */}
        {!isThinking && timestamp && (
          <div className="mx-1 mt-1 flex items-center gap-1 text-[10.5px] text-gray-400">
            <span>{timestamp}</span>
            {isUser && <CheckCheck size={13} className="text-[#0B4D36]/60" />}
          </div>
        )}

        {/* Sources */}
        {!isUser && !isError && uniqueCitations.length > 0 && (
          <div className="mt-1.5 w-full">
            <button
              onClick={() => setShowSources((s) => !s)}
              className="flex items-center gap-1 rounded-full px-2 py-1 text-[11.5px] font-medium text-[#0B4D36]/80 transition hover:bg-[#0B4D36]/5"
              aria-expanded={showSources}
            >
              Sources ({uniqueCitations.length})
              <ChevronDown size={13} className={`transition-transform ${showSources ? "rotate-180" : ""}`} />
            </button>
            {showSources && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-1.5 flex flex-wrap gap-1.5 overflow-hidden">
                {uniqueCitations.map((c, i) => (
                  <SourceCard key={c.id || i} citation={c} index={i + 1} />
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
