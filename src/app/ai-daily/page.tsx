import TerminalShell from "@/components/terminal/TerminalShell";
import InlineMarkdown from "@/components/dashboard/InlineMarkdown";
import {
  loadBrief,
  listArchiveDates,
  relativeTime,
  isStale,
  formatDate,
  type Story,
} from "@/lib/aiDaily";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Daily — Jaden Oca",
  description:
    "A once-a-day briefing on what shipped, what mattered, and what's next in AI. Curated by Jaden Oca, written with Claude.",
};

export const dynamic = "force-dynamic";

type PageSearch = { date?: string };

export default async function AIDailyPage({
  searchParams,
}: {
  searchParams: Promise<PageSearch>;
}) {
  const sp = await searchParams;
  const [brief, dates] = await Promise.all([
    loadBrief(sp.date),
    listArchiveDates(),
  ]);

  return (
    <TerminalShell>
      <main className="mx-auto max-w-3xl px-5 sm:px-8 flex-1 w-full pt-10 pb-20 sm:pt-14">
        <Header brief={brief} />
        {brief ? (
          <BriefContent brief={brief} />
        ) : (
          <EmptyState />
        )}
        {dates.length > 1 && <Archive dates={dates} current={brief?.date} />}
        <Colophon />
      </main>
    </TerminalShell>
  );
}

function Colophon() {
  return (
    <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
      Curated daily · written with Claude · summaries link to original sources
    </p>
  );
}

function Header({
  brief,
}: {
  brief: Awaited<ReturnType<typeof loadBrief>>;
}) {
  const path = brief
    ? `/var/log/ai-daily/${brief.date}.md`
    : "/var/log/ai-daily/today.md";
  return (
    <header className="mb-10 sm:mb-14">
      <p className="cmd-prompt mb-4">
        <span className="user">jaden</span>
        <span className="at">@portfolio</span>
        <span className="at">:</span>
        <span className="path">~</span>
        <span className="sigil">$ </span>
        <span className="text">cat {path}</span>
      </p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.025em] leading-[1.05]">
          {brief ? formatDate(brief.date) : "AI Daily"}
        </h1>
        {brief && <SyncChip mtime={brief.fileMtime} />}
      </div>
      <p className="mt-3 text-base text-muted-foreground max-w-xl leading-relaxed">
        A once-a-day briefing on what shipped, what mattered, and what&apos;s
        next in AI. Curated, summarized by Claude.
      </p>
    </header>
  );
}

function SyncChip({ mtime }: { mtime: number }) {
  const stale = isStale(mtime);
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground border border-border-strong/60 rounded-sm px-3 py-1">
      <span
        className={
          stale
            ? "inline-block w-1.5 h-1.5 rounded-full bg-accent"
            : "inline-block w-1.5 h-1.5 rounded-full bg-signal animate-pulse"
        }
      />
      {stale ? "Cached · " : "Synced · "}
      {relativeTime(mtime)}
    </span>
  );
}

function BriefContent({
  brief,
}: {
  brief: NonNullable<Awaited<ReturnType<typeof loadBrief>>>;
}) {
  const stale = isStale(brief.fileMtime);
  const headliner = brief.stories.find((s) => s.isHeadliner);
  const others = brief.stories.filter((s) => s !== headliner);

  return (
    <div className="space-y-14">
      {stale && <StaleBanner />}

      {(brief.bigPicture || brief.whyItMatters) && (
        <section className="space-y-5">
          {brief.bigPicture && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                The big picture
              </p>
              <p className="text-xl sm:text-2xl leading-snug tracking-tight text-foreground">
                <InlineMarkdown text={brief.bigPicture} />
              </p>
            </div>
          )}
          {brief.whyItMatters && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Why it matters
              </p>
              <p className="text-base sm:text-lg leading-relaxed text-foreground/85">
                <InlineMarkdown text={brief.whyItMatters} />
              </p>
            </div>
          )}
        </section>
      )}

      {brief.catchUpQuick.length > 0 && (
        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Catch up quick
          </p>
          <ul className="space-y-2">
            {brief.catchUpQuick.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm sm:text-base text-foreground/85 leading-relaxed"
              >
                <span
                  className="font-mono text-xs text-accent shrink-0 w-6 pt-1"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <InlineMarkdown text={item} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {headliner && (
        <section className="border-t border-border pt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-4">
            Today&apos;s top story
          </p>
          <StoryBlock story={headliner} headline />
        </section>
      )}

      {others.length > 0 && (
        <section className="space-y-12 border-t border-border pt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            More from today
          </p>
          {others.map((s, i) => (
            <StoryBlock key={i} story={s} />
          ))}
        </section>
      )}

      {(brief.whatsNext.length > 0 || brief.bottomLine) && (
        <section className="border-t border-border pt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            What&apos;s next
          </p>
          {brief.whatsNext.length > 0 && (
            <ul className="space-y-2 mb-6">
              {brief.whatsNext.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm sm:text-base text-foreground/85 leading-relaxed"
                >
                  <span
                    className="text-accent shrink-0 pt-1.5"
                    aria-hidden
                  >
                    →
                  </span>
                  <span>
                    <InlineMarkdown text={item} />
                  </span>
                </li>
              ))}
            </ul>
          )}
          {brief.bottomLine && (
            <p className="text-base sm:text-lg leading-relaxed text-foreground border-l-2 border-accent pl-4">
              <span className="font-semibold">The bottom line: </span>
              <InlineMarkdown text={brief.bottomLine} />
            </p>
          )}
        </section>
      )}
    </div>
  );
}

function StoryBlock({
  story,
  headline = false,
}: {
  story: Story;
  headline?: boolean;
}) {
  const titleClass = headline
    ? "text-2xl sm:text-3xl font-semibold tracking-tight leading-tight"
    : "text-xl sm:text-2xl font-semibold tracking-tight leading-snug";
  return (
    <article className="space-y-4">
      <h2 className={titleClass}>{story.title}</h2>
      <p className="text-base sm:text-lg leading-relaxed text-foreground/85">
        <InlineMarkdown text={story.lead} />
      </p>
      {story.whyItMatters && (
        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
          <span className="text-foreground font-semibold">Why it matters: </span>
          <InlineMarkdown text={story.whyItMatters} />
        </p>
      )}
      {story.tryThis && (
        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
          <span className="text-foreground font-semibold">Try this: </span>
          <InlineMarkdown text={story.tryThis} />
        </p>
      )}
      {story.yesBut && (
        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
          <span className="text-foreground font-semibold">Yes, but: </span>
          <InlineMarkdown text={story.yesBut} />
        </p>
      )}
      {story.goDeeper.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Go deeper
          </span>
          {story.goDeeper.map((l, i) => (
            <a
              key={i}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline underline-offset-4 inline-flex items-center gap-1"
            >
              {l.text}
              <span aria-hidden className="text-xs">↗</span>
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

function StaleBanner() {
  return (
    <div className="border border-border bg-accent/5 rounded-lg px-4 py-3 text-sm text-foreground/85">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mr-2">
        Cached
      </span>
      Today&apos;s update is delayed — showing the most recent briefing.
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-border rounded-lg px-6 py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
        No briefings yet
      </p>
      <p className="text-base text-foreground/85 max-w-md mx-auto">
        The AI Daily pipeline checks in every morning at 7:00. Once it runs,
        the latest brief will land here.
      </p>
    </div>
  );
}

function Archive({
  dates,
  current,
}: {
  dates: string[];
  current?: string;
}) {
  const recent = dates.slice(0, 7);
  return (
    <section className="mt-16 border-t border-border pt-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
        Archive
      </p>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {recent.map((d) => {
          const isCurrent = d === current;
          return (
            <li key={d}>
              <a
                href={`/ai-daily?date=${d}`}
                className={`font-mono text-xs uppercase tracking-[0.15em] ${
                  isCurrent
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                } transition-colors`}
                aria-current={isCurrent ? "page" : undefined}
              >
                {formatDate(d)}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
