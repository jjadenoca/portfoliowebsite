"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What is Jaden currently working on?",
  "Tell me about his work at No Dice.",
  "What does he post about on LinkedIn?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  // Focus textarea when opened — desktop only (avoid keyboard pop on mobile)
  useEffect(() => {
    if (!open) return;
    const isDesktop =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 640px)").matches;
    if (isDesktop) inputRef.current?.focus();
  }, [open]);

  // Lock body scroll while open on mobile
  useEffect(() => {
    if (!open) return;
    const isMobile =
      typeof window !== "undefined" &&
      !window.matchMedia("(min-width: 640px)").matches;
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "" },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open chat with Jaden's AI assistant"
          className="fixed z-50 bg-accent text-accent-ink shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200
            right-5 sm:right-5
            bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:bottom-5
            h-12 w-12 rounded-full flex items-center justify-center
            sm:h-auto sm:w-auto sm:rounded-full sm:px-5 sm:py-2.5 sm:flex sm:items-center sm:gap-2"
        >
          {/* Chat bubble icon */}
          <svg
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6l-4 4V5z"
              clipRule="evenodd"
            />
          </svg>
          <span className="hidden sm:inline font-sans text-sm font-semibold">
            Ask about Jaden
          </span>
        </button>
      )}

      {/* Backdrop (mobile only) */}
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="sm:hidden fixed inset-0 z-40 bg-text/30 backdrop-blur-sm animate-in fade-in duration-200"
        />
      )}

      {/* Panel / Sheet */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Jaden's AI assistant"
          className="fixed z-50 flex flex-col bg-surface shadow-2xl shadow-text/10 overflow-hidden
            inset-x-0 bottom-0 h-[85dvh] rounded-t-2xl border-t border-x border-border
            sm:inset-x-auto sm:bottom-4 sm:right-4 sm:left-auto sm:top-auto sm:w-[380px] sm:h-[520px] sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl sm:border"
        >
          {/* Drag handle (mobile only) */}
          <div className="sm:hidden flex justify-center pt-2 pb-1">
            <span className="h-1 w-10 rounded-full bg-border" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border bg-surface-2">
            <div className="min-w-0">
              <p className="font-display text-base font-semibold text-text-strong leading-tight truncate">
                Ask about my background
              </p>
              <p className="font-sans text-xs text-muted mt-0.5">
                Powered by Claude · trained on Jaden&apos;s résumé
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="shrink-0 h-10 w-10 sm:h-8 sm:w-8 rounded-full hover:bg-bg-alt flex items-center justify-center text-muted hover:text-text transition-colors"
            >
              <span aria-hidden className="text-xl sm:text-lg leading-none">×</span>
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-bg"
          >
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-surface p-3.5">
                  <p className="font-sans text-[15px] sm:text-sm text-text leading-relaxed">
                    Hi! I&apos;m an AI assistant trained on Jaden&apos;s
                    résumé. Ask me about his experience, projects, or skills.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="eyebrow text-[10px]">
                    Try asking
                  </p>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="w-full text-left font-sans text-sm sm:text-xs rounded-xl border border-border bg-surface hover:border-accent hover:bg-surface-2 px-3.5 py-3 sm:py-2.5 text-text transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 font-sans text-[15px] sm:text-sm leading-relaxed whitespace-pre-wrap " +
                    (m.role === "user"
                      ? "bg-accent text-accent-ink rounded-br-sm"
                      : "bg-surface border border-border text-text rounded-bl-sm")
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted/60 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted/60 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted/60 animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="font-sans text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-border p-3 bg-surface"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask about Jaden's experience…"
                inputMode="text"
                autoCapitalize="sentences"
                enterKeyHint="send"
                className="flex-1 resize-none rounded-xl border border-border bg-bg px-3 py-2 font-sans text-base sm:text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 max-h-32 transition-colors"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="shrink-0 h-11 w-11 sm:h-9 sm:w-9 rounded-full bg-accent text-accent-ink hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all flex items-center justify-center"
              >
                <span aria-hidden className="text-base sm:text-sm leading-none">↑</span>
              </button>
            </div>
            <p className="mt-1.5 font-sans text-[10px] text-muted">
              Press Enter to send · Shift+Enter for newline
            </p>
          </form>
        </div>
      )}
    </>
  );
}
