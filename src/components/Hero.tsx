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

export default function Hero() {
  return (
    <section
      id="top"
      className="pt-20 sm:pt-28 pb-16 sm:pb-20 grid md:grid-cols-[1fr_400px] gap-10 md:gap-14 items-center"
    >
      <div>
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {profile.location} · {profile.openTo}
        </div>
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05]">
          {profile.name}.
        </h1>
        <p className="mt-4 text-xl sm:text-2xl text-muted-foreground font-light">
          {profile.title}
        </p>
        <p className="mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-foreground/80">
          {profile.bio}
        </p>
        <div className="mt-6 max-w-2xl space-y-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mr-1 w-12 shrink-0">
              Stack
            </span>
            {stackSkills.map((s) => (
              <span
                key={s}
                className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-border text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mr-1 w-12 shrink-0">
              AI
            </span>
            {aiSkills.map((s) => (
              <span
                key={s}
                className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-accent/40 bg-accent/10 text-accent"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#experience"
            className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            See my work
            <span aria-hidden>→</span>
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 border border-border px-5 py-2.5 rounded-full text-sm font-medium hover:border-accent hover:text-accent transition-colors"
          >
            Get in touch
          </a>
        </div>
      </div>

      {profile.headshot && (
        <div className="md:justify-self-end order-first md:order-none">
          <div className="relative aspect-[4/5] w-64 sm:w-80 md:w-[400px] rounded-2xl overflow-hidden border border-border shadow-sm">
            <Image
              src={profile.headshot}
              alt={`${profile.name} portrait`}
              fill
              priority
              sizes="(max-width: 768px) 320px, 400px"
              className="object-cover"
              style={{ objectPosition: "45% center" }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
