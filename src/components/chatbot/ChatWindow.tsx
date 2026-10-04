"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SendHorizonal, Sparkles, ArrowUpRight } from "lucide-react";
import { ChatMessage, MessageProps } from "./ChatMessage";

interface ChatWindowProps {
  isWidget?: boolean;
  currentPage?: string;
  suggestions?: string[];
  isActive?: boolean; // widget open → focus input
}

type Msg = MessageProps & { id: string };

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const nowStr = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const GREETING: Msg = {
  id: "greeting",
  role: "assistant",
  content: "Hello! I'm **KSIJ One**, your community assistant. Ask me about services, events, the directory or the marketplace.",
};

export function ChatWindow({ isWidget = false, currentPage = "/", suggestions = [], isActive = true }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const showWelcome = messages.length === 1;

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  // Focus when opened
  useEffect(() => {
    if (isActive) setTimeout(() => textareaRef.current?.focus(), 250);
  }, [isActive]);

  // Cancel in-flight request on unmount
  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (text: string, opts: { retry?: boolean } = {}) => {
      const userMsg = text.trim();
      if (!userMsg || isLoading) return;

      const history = messages
        .filter((m) => !m.isError && m.id !== "greeting")
        .map((m) => ({ role: m.role, content: m.content }))
        .slice(-6);

      setInput("");
      setMessages((prev) => {
        // on retry, drop the failed bubble and don't duplicate the user message
        const base = opts.retry ? prev.filter((m) => !m.isError) : [...prev, { id: uid(), role: "user" as const, content: userMsg, timestamp: nowStr() }];
        return base;
      });
      setIsLoading(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg, history, currentPage }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "assistant", content: data.answer, citations: data.citations ?? [], timestamp: nowStr() },
        ]);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            isError: true,
            retryText: userMsg,
            content: "Something went wrong while fetching your answer. Please try again.",
            timestamp: nowStr(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, currentPage]
  );

  return (
    <div className={`flex h-full min-h-0 w-full flex-col bg-[#f6f8f7] ${isWidget ? "" : "mx-auto h-[600px] max-w-3xl overflow-hidden rounded-2xl border border-gray-200 shadow-sm"}`}>
      {/* ─── Messages ─── */}
      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 [scrollbar-width:thin]">
        {messages.map((m) => (
          <ChatMessage key={m.id} {...m} onRetry={m.isError && m.retryText ? () => send(m.retryText!, { retry: true }) : undefined} />
        ))}
        {isLoading && <ChatMessage role="assistant" content="" isThinking />}

        {/* Welcome suggestions */}
        {showWelcome && suggestions.length > 0 && (
          <div className="mt-1 space-y-2">
            <p className="flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              <Sparkles size={12} className="text-[#D4AF37]" /> Suggested
            </p>
            {suggestions.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="group flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-[13.5px] font-medium text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0B4D36]/30 hover:text-[#0B4D36] hover:shadow-md"
              >
                {q}
                <ArrowUpRight size={15} className="shrink-0 text-gray-300 transition group-hover:text-[#0B4D36]" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Composer ─── */}
      <div className="shrink-0 border-t border-gray-200/70 bg-white px-3.5 pb-3 pt-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 rounded-2xl border border-gray-300 bg-gray-50 py-1.5 pl-4 pr-1.5 transition focus-within:border-[#0B4D36]/60 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0B4D36]/10"
        >
          <textarea
            ref={textareaRef}
            value={input}
            rows={1}
            maxLength={1000}
            placeholder="Ask me anything…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            className="max-h-[120px] min-h-[36px] flex-1 resize-none bg-transparent py-2 text-[14.5px] leading-snug text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0B4D36] text-white transition enabled:hover:bg-[#0f6a4a] enabled:active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
          >
            <SendHorizonal size={17} />
          </button>
        </form>
        <p className="mt-2 text-center text-[10.5px] text-gray-400">
          Answers come from approved community documents. Please verify important details.
        </p>
      </div>
    </div>
  );
}
