import Link from "next/link";
import { loadBrief, formatDate, relativeTime } from "@/lib/aiDaily";

export default async function AiDailyTail() {
  const brief = await loadBrief();
  return (
    <div className="lg:sticky lg:top-9 lg:max-h-[calc(100vh-2.25rem)] lg:overflow-y-auto p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border-strong/40">
        <span className="text-signal">▸</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal-dim">
          tail -f /var/log/ai-daily.log
        </span>
        <span className="ml-auto inline-block w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
      </div>

      {!brief && (
        <p className="text-sm text-muted-foreground">
          No briefings yet · pipeline runs daily 06:30
        </p>
      )}

      {brief && (
        <div className="space-y-6">
          <div>
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] phosphor">
                {formatDate(brief.date)}
              </span>
              <span className="font-mono text-[10px] text-signal-dim">
                synced {relativeTime(brief.fileMtime)}
              </span>
            </div>
            {brief.bigPicture && (
              <p className="mt-3 text-sm text-foreground-soft leading-relaxed">
                {brief.bigPicture
                  .replace(/\*\*([^*]+)\*\*/g, "$1")
                  .slice(0, 220)}
                {brief.bigPicture.length > 220 ? "…" : ""}
              </p>
            )}
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal-dim mb-3">
              Today&apos;s stories
            </p>
            <div className="space-y-3">
              {brief.stories.slice(0, 5).map((s, i) => (
                <div
                  key={i}
                  className="text-sm leading-snug pb-3 border-b border-border-strong/20 last:border-0"
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-mono text-[10px] text-signal-dim">
                      [{String(i + 1).padStart(2, "0")}]
                    </span>
                    {s.isHeadliner && (
                      <span className="badge badge-live">TOP</span>
                    )}
                  </div>
                  <p className="text-foreground-soft">{s.title}</p>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/ai-daily"
            className="inline-flex items-center gap-1.5 text-link hover:phosphor text-sm transition-colors"
          >
            <span className="text-signal">›</span>
            Open full brief
            <span aria-hidden>↗</span>
          </Link>
        </div>
      )}

      <div className="mt-8 pt-5 border-t border-border-strong/30 text-xs text-muted-foreground space-y-1.5">
        <p>Built with Claude · scraped 06:30 daily</p>
        <p className="font-mono text-[10px] flex items-center gap-1.5 pt-1">
          <span>tail -f</span>
          <span className="cursor-block" />
        </p>
      </div>
    </div>
  );
}
