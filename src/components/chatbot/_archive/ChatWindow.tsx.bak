"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { ChatMessage, MessageProps } from "./ChatMessage";

export function ChatWindow({ isWidget = false }: { isWidget?: boolean }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([
    { role: "assistant", content: "Hi! How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.answer,
        citations: data.citations
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col w-full h-full ${isWidget ? 'bg-gray-50' : 'h-[600px] max-w-2xl mx-auto border border-gray-200 rounded-xl overflow-hidden bg-gray-50'}`}>
      {!isWidget && (
        <div className="bg-white border-b border-gray-200 p-4 text-center">
          <h2 className="font-bold text-lg text-gray-800">Community Assistant</h2>
          <p className="text-xs text-gray-500">Source-grounded answers from approved docs</p>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {messages.map((msg, i) => (
          <ChatMessage key={i} {...msg} />
        ))}
        {isLoading && <ChatMessage role="assistant" content="" isThinking={true} />}
      </div>
      
      <div className="px-3 py-3 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a community scheme..." 
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-[#0B4D36] focus:ring-1 focus:ring-[#0B4D36]"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-[#0B4D36] text-white p-2 w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#083a28] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="text-center mt-2" style={{ fontSize: '0.625rem', color: '#9CA3AF' }}>Answers are based on approved community documents</p>
      </div>
    </div>
  );
}
