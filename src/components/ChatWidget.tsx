"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What's Jaden working on at Capital One?",
  "Tell me about his ML projects.",
  "What are his strongest skills?",
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
          className="fixed z-50 bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105 active:scale-95 transition-all duration-200 border border-accent/40
            right-5 sm:right-5
            bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:bottom-5
            h-14 w-14 rounded-full flex items-center justify-center
            sm:h-auto sm:w-auto sm:rounded-full sm:px-5 sm:py-3 sm:flex sm:items-center sm:gap-2"
        >
          <span aria-hidden className="text-xl sm:text-base">💬</span>
          <span className="hidden sm:inline font-mono text-xs uppercase tracking-[0.15em]">
            Ask about Jaden
          </span>
        </button>
      )}

      {/* Backdrop (mobile only) */}
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="sm:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        />
      )}

      {/* Panel / Sheet */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Jaden's AI assistant"
          className="fixed z-50 flex flex-col bg-background shadow-2xl shadow-black/30 overflow-hidden
            inset-x-0 bottom-0 h-[85dvh] rounded-t-2xl border-t border-x border-border
            sm:inset-x-auto sm:bottom-4 sm:right-4 sm:left-auto sm:top-auto sm:w-[380px] sm:h-[520px] sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl sm:border"
        >
          {/* Drag handle (mobile only) */}
          <div className="sm:hidden flex justify-center pt-2 pb-1">
            <span className="h-1 w-10 rounded-full bg-border" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Ask my resume
              </p>
              <p className="text-sm font-semibold leading-tight truncate">
                Chat about Jaden&apos;s background
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="shrink-0 h-10 w-10 sm:h-8 sm:w-8 rounded-full hover:bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <span aria-hidden className="text-xl sm:text-lg leading-none">×</span>
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          >
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-card p-3">
                  <p className="text-[15px] sm:text-sm text-foreground/85 leading-relaxed">
                    Hi! I&apos;m an AI assistant trained on Jaden&apos;s
                    resume. Ask me about his experience, projects, or skills.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Try asking
                  </p>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="w-full text-left text-sm sm:text-xs rounded-lg border border-border bg-card hover:border-accent/50 hover:bg-accent/5 px-3 py-3 sm:py-2 transition-colors"
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
                    "max-w-[85%] rounded-2xl px-3.5 py-2 text-[15px] sm:text-sm leading-relaxed whitespace-pre-wrap " +
                    (m.role === "user"
                      ? "bg-accent text-accent-foreground rounded-br-sm"
                      : "bg-card border border-border text-foreground/90 rounded-bl-sm")
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-border p-3 bg-card/30"
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
                className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-base sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent/60 max-h-32"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="shrink-0 h-11 w-11 sm:h-9 sm:w-9 rounded-full bg-accent text-accent-foreground hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all flex items-center justify-center"
              >
                <span aria-hidden className="text-base sm:text-sm">↑</span>
              </button>
            </div>
            <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
              Powered by Claude · Press Enter to send
            </p>
          </form>
        </div>
      )}
    </>
  );
}
