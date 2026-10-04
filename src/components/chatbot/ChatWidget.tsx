"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, RotateCcw, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ChatWindow } from "./ChatWindow";

interface ChatWidgetProps {
  pathname?: string;
}

function getSuggestions(pathname: string): string[] {
  if (pathname.startsWith("/services"))
    return ["Education Scheme eligibility", "Required documents", "Application process"];
  if (pathname.startsWith("/events"))
    return ["What events are coming up?", "How do I register?", "Where is the next event?"];
  if (pathname.startsWith("/directory"))
    return ["How do I list my business?", "Find a service provider"];
  if (pathname.startsWith("/marketplace"))
    return ["How do I post a listing?", "Marketplace guidelines"];
  return ["What services are available?", "How do I list my business?", "Community guidelines"];
}

export function ChatWidget({ pathname: propPathname }: ChatWidgetProps = {}) {
  const currentPathname = usePathname();
  const pathname = propPathname ?? currentPathname ?? "";
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(0); // bump to start a fresh chat

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* ─── Panel (stays mounted so history survives close) ─── */}
      <motion.section
        role="dialog"
        aria-label="KSIJ One assistant"
        aria-hidden={!isOpen}
        initial={false}
        animate={isOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        style={{ pointerEvents: isOpen ? "auto" : "none", visibility: isOpen ? "visible" : "hidden" }}
        className="absolute inset-0 flex flex-col overflow-hidden bg-white
                   sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[640px] sm:max-h-[calc(100vh-7rem)] sm:w-[400px]
                   sm:rounded-3xl sm:border sm:border-black/5
                   sm:shadow-[0_24px_64px_rgba(11,77,54,0.22),0_4px_16px_rgba(0,0,0,0.08)]"
      >
        {/* Header */}
        <header 
          className="relative shrink-0 overflow-hidden px-5 py-4 text-white"
          style={{ background: "linear-gradient(135deg, #0B4D36 0%, #0d5c40 100%)" }}
        >
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#D4AF37]/20 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white p-1 ring-2 ring-white/30">
                <Image src="/ksij-logo.jpg" alt="KSIJ logo" width={36} height={36} className="h-full w-full rounded-full object-contain" />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0B4D36] bg-emerald-400" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[15px] font-semibold leading-tight">KSIJ One</h2>
              <p className="mt-0.5 text-[12px] leading-tight text-white/70">Community Assistant · Online</p>
            </div>

            <button
              onClick={() => setSession((s) => s + 1)}
              className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Start new chat"
              title="New chat"
            >
              <RotateCcw size={17} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Close assistant"
            >
              <X size={19} />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1">
          <ChatWindow key={session} isWidget currentPage={pathname} suggestions={getSuggestions(pathname)} isActive={isOpen} />
        </div>
      </motion.section>

      {/* ─── Launcher ─── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto absolute bottom-5 right-5 flex items-center gap-3 rounded-full py-2.5 pl-2.5 pr-5 text-white shadow-[0_10px_30px_rgba(11,77,54,0.4)] sm:bottom-6 sm:right-6"
            style={{ background: "linear-gradient(135deg, #0B4D36 0%, #0d5c40 100%)" }}
            aria-label="Open KSIJ One assistant"
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white p-1">
              <Image src="/ksij-logo.jpg" alt="" width={32} height={32} className="h-full w-full rounded-full object-contain" />
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-[#D4AF37]" />
              </span>
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold">Ask KSIJ One</span>
              <span className="text-[11px] text-white/70">Typically replies instantly</span>
            </span>
            <MessageCircle size={18} className="opacity-70" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
