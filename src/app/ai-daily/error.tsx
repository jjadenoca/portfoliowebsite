"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ai-daily] render error:", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl px-6 flex-1 w-full pt-16 pb-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
        AI Daily
      </p>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
        Brief unavailable
      </h1>
      <p className="text-base text-foreground/85 leading-relaxed max-w-xl mb-6">
        Couldn&apos;t load today&apos;s briefing. The pipeline may not have run
        yet, or the archive file is malformed.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded-full text-sm font-medium hover:border-accent hover:text-accent transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
