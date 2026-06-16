import TerminalShell from "@/components/terminal/TerminalShell";

export default function Loading() {
  return (
    <TerminalShell>
      <main className="mx-auto max-w-3xl px-5 sm:px-8 flex-1 w-full pt-10 pb-20 sm:pt-14">
        <header className="mb-10 sm:mb-14">
          <p className="cmd-prompt mb-4">
            <span className="user">jaden</span>
            <span className="at">@portfolio</span>
            <span className="at">:</span>
            <span className="path">~</span>
            <span className="sigil">$ </span>
            <span className="text">cat /var/log/ai-daily/today.md</span>
          </p>
          <div className="h-12 w-64 rounded bg-foreground/5 animate-pulse" />
        </header>
        <div className="space-y-14">
          <div className="space-y-5">
            <div className="h-8 w-full rounded bg-foreground/5 animate-pulse" />
            <div className="h-8 w-5/6 rounded bg-foreground/5 animate-pulse" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-5 w-full rounded bg-foreground/5 animate-pulse"
              />
            ))}
          </div>
          <div className="border-t border-border-strong/40 pt-12 space-y-4">
            <div className="h-9 w-3/4 rounded bg-foreground/5 animate-pulse" />
            <div className="h-5 w-full rounded bg-foreground/5 animate-pulse" />
            <div className="h-5 w-full rounded bg-foreground/5 animate-pulse" />
            <div className="h-5 w-2/3 rounded bg-foreground/5 animate-pulse" />
          </div>
        </div>
      </main>
    </TerminalShell>
  );
}
