import { creator } from "@/lib/content";

export default function UgcHero() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">UGC Portfolio</p>

          <h1
            className="font-display text-text-strong mb-6"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              fontFamily: "var(--font-display)",
            }}
          >
            Content that{" "}
            <em
              className="not-italic"
              style={{ color: "var(--color-accent)" }}
            >
              converts.
            </em>
          </h1>

          <p className="text-muted text-lg leading-relaxed mb-8" style={{ maxWidth: "56ch" }}>
            Hi, I&apos;m Jaden Oca ({creator.handle}) — a short-form content creator
            based in Dallas, TX making videos on stats, psychology, mindset, AI, and a
            slice of personal finance. I produce authentic, high-retention Instagram Reels
            that connect brands with audiences who are ready to think — and act.
          </p>

          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex flex-col gap-0.5">
              <span className="stat-num" style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)" }}>
                {creator.followers}
              </span>
              <span className="eyebrow text-xs">followers</span>
            </div>
            <div
              className="w-px h-8 hidden sm:block"
              style={{ backgroundColor: "var(--color-border)" }}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-0.5">
              <span className="stat-num" style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)" }}>
                {creator.platformCount}
              </span>
              <span className="eyebrow text-xs">platforms</span>
            </div>
            <div
              className="w-px h-8 hidden sm:block"
              style={{ backgroundColor: "var(--color-border)" }}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-0.5">
              <span className="stat-num" style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)" }}>
                {creator.brandCount}+
              </span>
              <span className="eyebrow text-xs">brand partners</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
