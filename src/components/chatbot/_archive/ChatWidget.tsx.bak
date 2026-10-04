"use client";

import { useState } from "react";
import { Sparkles, Minus, ChevronUp } from "lucide-react";
import { ChatWindow } from "./ChatWindow";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" style={{ zIndex: 9999 }}>
      {isOpen && (
        <div
          className="shadow-lg overflow-hidden bg-white border border-gray-200"
          style={{
            width: "400px",
            maxWidth: "calc(100vw - 32px)",
            height: "620px",
            maxHeight: "calc(100vh - 120px)",
            borderRadius: "16px",
          }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center px-4 py-3"
            style={{ backgroundColor: "#0B4D36" }}
          >
            <div className="flex items-center gap-2 text-white">
              <Sparkles size={16} />
              <span className="font-semibold text-sm">Community Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white focus:outline-none transition-colors"
              aria-label="Minimize assistant"
            >
              <Minus size={18} />
            </button>
          </div>

          {/* Suggested Questions */}
          <div className="px-4 pt-3 pb-2 bg-gray-50 border-b border-gray-100">
            <p className="text-xs text-gray-500 mb-2 font-medium">Suggested questions</p>
            <div className="flex flex-wrap gap-1.5">
              {["Education Scheme", "Required Documents", "Application Process", "Eligibility Criteria"].map((q) => (
                <button
                  key={q}
                  className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:border-[#0B4D36] hover:text-[#0B4D36] transition-colors"
                  style={{ borderRadius: "20px" }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window container */}
          <div style={{ height: "calc(100% - 120px)" }}>
            <ChatWindow isWidget={true} />
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-white font-semibold text-sm shadow-lg transition-all hover:shadow-xl"
          style={{
            backgroundColor: "#0B4D36",
            padding: "12px 20px",
            borderRadius: "28px",
          }}
        >
          <Sparkles size={16} />
          <span>Ask Assistant</span>
          <ChevronUp size={14} />
        </button>
      )}
    </div>
  );
}
