import Link from "next/link";
import type { ReactNode } from "react";
import { profile, experiences } from "@/lib/content";
import { gitSha, formatUptime, briefsCount } from "@/lib/buildInfo";

// Earliest experience start date — used as the "career uptime" anchor.
function earliestStart(): string {
  const monthMap: Record<string, number> = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
  };
  let earliest = new Date();
  for (const e of experiences) {
    const [m, y] = e.start.split(" ");
    if (m == null || y == null || monthMap[m] === undefined) continue;
    const d = new Date(Number(y), monthMap[m], 1);
    if (d < earliest) earliest = d;
  }
  return earliest.toISOString();
}

async function StatusBar() {
  const uptime = formatUptime(earliestStart());
  const briefs = await briefsCount();
  return (
    <header className="sticky top-0 z-50 border-b border-border-strong/60 bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-4 px-3 sm:px-5 h-9 text-[11px] uppercase tracking-[0.1em] text-signal-dim font-mono">
        <span className="phosphor font-medium">jaden@portfolio</span>
        <span className="text-muted">:</span>
        <span className="text-link">~/2026</span>
        <span className="text-muted">$</span>
        <span className="hidden sm:inline text-muted-foreground">
          uptime <span className="text-foreground">{uptime}</span>
        </span>
        <span className="hidden md:inline text-muted-foreground">
          · briefs <span className="text-foreground">{briefs}</span>
        </span>
        <span className="hidden lg:inline text-muted-foreground">
          · build <span className="text-link">{gitSha}</span>
        </span>
        <span className="ml-auto flex items-center gap-3">
          <Link
            href="/ai-daily"
            className="text-link hover:phosphor transition-colors"
          >
            /ai-daily
          </Link>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link hover:phosphor transition-colors"
          >
            /resume.pdf
          </a>
          <span className="hidden sm:flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-signal shadow-[0_0_6px_var(--signal)] animate-pulse" />
            <span className="text-foreground">live</span>
          </span>
        </span>
      </div>
      <div className="scroll-progress-h" aria-hidden />
    </header>
  );
}

export default function TerminalShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative font-mono">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-3 focus:py-1.5 focus:bg-background-elevated focus:border focus:border-signal focus:text-signal focus:rounded-sm focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.16em]"
      >
        skip to main
      </a>
      <StatusBar />
      <div id="main">{children}</div>
    </div>
  );
}
