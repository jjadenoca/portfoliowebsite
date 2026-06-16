import Image from "next/image";
import { profile } from "@/lib/content";

const stackSkills = [
  "Python",
  "SQL",
  "R",
  "PyTorch",
  "scikit-learn",
  "Snowflake",
  "Tableau",
  "Power BI",
  "Azure",
];

const aiSkills = [
  "Claude",
  "Gemini",
  "GPT-2",
  "BERT",
  "LLM Fine-tuning",
  "RAG",
  "Prompt Engineering",
];

const tickerSegments = [
  { label: "currently", value: "Capital One" },
  { label: "building", value: "ML pipelines" },
  { label: "shipped", value: "95% claims auto-classifier" },
  { label: "based", value: "Dallas · CT" },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative pt-20 sm:pt-28 pb-16 sm:pb-20 grid md:grid-cols-[1fr_500px] gap-10 md:gap-14 items-center"
    >
      {/* Always-visible ambient bloom — anchors the hero with motion + color */}
      <div
        aria-hidden
        className="hero-bloom absolute -top-20 -right-32 w-[700px] h-[700px] pointer-events-none -z-10"
      />
      <div>
        <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
          <span className="status-dot inline-block w-2 h-2 rounded-full bg-signal" />
          {profile.location} · {profile.openTo}
        </div>
        <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-[-0.04em] leading-[0.95]">
          {profile.name}.
        </h1>
        <p className="mt-4 text-xl sm:text-2xl text-muted-foreground font-light tracking-tight">
          {profile.title}
        </p>
        <p className="mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-foreground/85">
          {profile.bio}
        </p>

        {/* Status-line ticker — the one anchor motion on first paint */}
        <div
          className="mt-8 max-w-2xl font-mono text-[11px] sm:text-xs leading-[1.8] text-muted-foreground border-l-2 border-signal/40 pl-4"
          aria-label="Current status"
        >
          {tickerSegments.map((s, i) => (
            <span
              key={s.label}
              className="ticker-segment block"
              style={{ animationDelay: `${i * 110 + 220}ms` }}
            >
              <span className="text-signal">›</span>{" "}
              <span className="uppercase tracking-[0.18em] text-muted-foreground/80">
                {s.label}
              </span>
              <span className="mx-2 opacity-40">/</span>
              <span className="text-foreground">{s.value}</span>
            </span>
          ))}
          <span
            className="ticker-segment block mt-0.5"
            style={{ animationDelay: `${tickerSegments.length * 110 + 220}ms` }}
          >
            <span className="ticker-cursor inline-block w-[7px] h-[14px] -mb-[2px] bg-signal/70" />
          </span>
        </div>

        <div className="mt-8 max-w-2xl space-y-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mr-1 w-12 shrink-0">
              Stack
            </span>
            {stackSkills.map((s, i) => (
              <span
                key={s}
                className="chip-in font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-border text-muted-foreground"
                style={{ animationDelay: `${i * 35 + 700}ms` }}
              >
                {s}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mr-1 w-12 shrink-0">
              AI
            </span>
            {aiSkills.map((s, i) => (
              <span
                key={s}
                className="chip-in font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-accent/40 bg-accent/10 text-accent"
                style={{ animationDelay: `${i * 35 + 1020}ms` }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#experience"
            className="group inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            See my work
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 border border-border px-5 py-2.5 rounded-full text-sm font-medium hover:border-signal hover:text-signal transition-colors"
          >
            Get in touch
          </a>
        </div>
      </div>

      {profile.headshot && (
        <div className="md:justify-self-end order-first md:order-none relative">
          {/* Signal bloom — saturated teal halo */}
          <div
            aria-hidden
            className="signal-bloom absolute -bottom-16 -left-16 w-96 h-96 pointer-events-none"
          />
          {/* Stacked duotone offsets — two layers, one teal, one amber */}
          <div
            aria-hidden
            className="absolute inset-0 translate-x-[10px] translate-y-[10px] rounded-2xl bg-signal/30 pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute inset-0 translate-x-[20px] translate-y-[20px] rounded-2xl bg-accent/20 pointer-events-none"
          />
          <div className="relative aspect-[4/5] w-72 sm:w-96 md:w-[500px] rounded-2xl overflow-hidden border-2 border-border-strong/90 shadow-xl">
            <Image
              src={profile.headshot}
              alt={`${profile.name} portrait`}
              fill
              priority
              sizes="(max-width: 768px) 384px, 500px"
              className="object-cover"
              style={{ objectPosition: "45% center" }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
