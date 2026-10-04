'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User as UserIcon } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

const QUICK_PROMPTS = [
  'How to apply for education aid?',
  'Emergency mayyat helpline',
  'Facility booking rules',
  'Marriage registration procedure',
  'Office contact hours',
];

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Salam! I am the Jamaat Knowledge Assistant. Ask me anything about KSIJ Mumbai services, scholarships, procedures, or hall bookings.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || data.response || 'Thank you for your question. You can also raise an official query at the Jamaat office.',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Our knowledge base is currently processing requests. You can submit an official query directly via the "Raise a Query" button or contact the office.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Jamaat Knowledge Assistant"
            className="flex items-center gap-2.5 bg-[#098231] hover:bg-[#076b28] text-white px-4 py-3 rounded-[10px] border border-[#098231] shadow-md transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#098231] focus:ring-offset-2"
          >
            <Sparkles size={18} />
            <span className="text-[14px] font-semibold">Jamaat Assistant</span>
          </button>
        )}

        {/* Chat Popover Window */}
        {isOpen && (
          <div className="w-[360px] sm:w-[400px] h-[520px] max-h-[85vh] bg-white rounded-[14px] border border-[#09231F]/15 shadow-xl flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Header */}
            <div className="bg-[#09231F] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[6px] bg-[#098231] flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold leading-tight">
                    Jamaat Assistant
                  </h4>
                  <p className="text-[11px] text-[#c4c2be]">
                    Information & Services Guide
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
                className="text-[#c4c2be] hover:text-white p-1 rounded-[4px] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#faf9f7]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-[10px] p-3 text-[13.5px] leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-[#098231] text-white'
                        : 'bg-white text-[#09231F] border border-[#09231F]/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#09231F]/10 rounded-[10px] px-3.5 py-2.5 text-[13px] text-[#09231F]/70 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#098231] animate-ping" />
                    Searching community knowledge base...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 bg-white border-t border-[#09231F]/10 flex gap-1.5 overflow-x-auto text-[11.5px] no-scrollbar">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="shrink-0 px-2.5 py-1 bg-[#E1DFDA] hover:bg-[#d5d2cc] text-[#09231F] rounded-[6px] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-[#09231F]/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about guidelines, booking, or aid..."
                className="flex-1 px-3 py-2 text-[13.5px] border border-[#09231F]/15 rounded-[8px] focus:outline-none focus:border-[#098231]"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="w-9 h-9 rounded-[8px] bg-[#098231] hover:bg-[#076b28] disabled:opacity-40 text-white flex items-center justify-center transition-colors"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
