import Image from "next/image";
import Section from "./Section";
import { projects } from "@/lib/content";

export default function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title="Things I’ve built.">
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <article
            key={p.name}
            className="rounded-2xl border border-border bg-card overflow-hidden hover:border-accent/60 transition-colors"
          >
            {p.image && (
              <div className="relative w-full aspect-[16/9] bg-muted/30 border-b border-border">
                <Image
                  src={p.image}
                  alt={`${p.name} preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-3"
                />
              </div>
            )}
            <div className="p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                {p.logo && (
                  <div className="shrink-0 mt-0.5 rounded-lg overflow-hidden flex items-center justify-center" style={{ height: "3rem", width: "3rem" }}>
                    <Image
                      src={p.logo}
                      alt={`${p.name} logo`}
                      width={96}
                      height={96}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <h3 className="text-lg sm:text-xl font-semibold">{p.name}</h3>
              </div>
              {p.href && (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors shrink-0"
                  aria-label={`Open ${p.name}`}
                >
                  ↗
                </a>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1 italic">
              {p.tagline}
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground mt-3">
              {p.start === p.end ? p.start : `${p.start} - ${p.end}`}
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-foreground/85 leading-relaxed">
              {p.bullets.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-accent mt-1.5 shrink-0">▪</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-border text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
