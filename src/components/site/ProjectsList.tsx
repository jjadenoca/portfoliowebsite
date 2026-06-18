import Image from "next/image";
import { projects } from "@/lib/content";

const AI_TAGS = new Set([
  "Claude Code", "Gemini", "ChatGPT", "Grok API",
  "GPT-2", "BERT", "NLP", "LLM", "LLM Fine-tuning",
  "RAG", "Prompt Engineering",
]);

export default function ProjectsList() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {projects.map((proj) => (
        <article
          key={proj.name}
          className="card card-lift reveal overflow-hidden"
        >
          {/* Project preview image */}
          {proj.image && (
            <div
              className="relative w-full overflow-hidden border-b border-border"
              style={{ aspectRatio: "16/9" }}
            >
              <Image
                src={proj.image}
                alt={`${proj.name} preview`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-3"
                style={{ background: "var(--color-bg-alt)" }}
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Header row: logo + name + external link */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-start gap-3 min-w-0">
                {proj.logo && (
                  <div
                    className="shrink-0 mt-0.5 rounded-lg overflow-hidden border border-border flex items-center justify-center"
                    style={{ height: "2.75rem", width: "2.75rem" }}
                  >
                    <Image
                      src={proj.logo}
                      alt={`${proj.name} logo`}
                      width={88}
                      height={88}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <h3
                    className="font-display text-text-strong text-xl leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {proj.href ? (
                      <a
                        href={proj.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline hover:text-accent transition-colors"
                      >
                        {proj.name}
                      </a>
                    ) : (
                      proj.name
                    )}
                  </h3>
                  <p className="text-muted text-sm mt-0.5 italic">{proj.tagline}</p>
                </div>
              </div>

              {proj.href && (
                <a
                  href={proj.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${proj.name}`}
                  className="shrink-0 text-muted hover:text-accent transition-colors text-lg leading-none"
                >
                  ↗
                </a>
              )}
            </div>

            {/* Date */}
            <p className="text-muted text-sm mb-4">
              {proj.start === proj.end ? proj.start : `${proj.start} – ${proj.end}`}
            </p>

            {/* Bullets */}
            <ul className="space-y-2 mb-5">
              {proj.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-text text-[15px] leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  />
                  {b}
                </li>
              ))}
            </ul>

            {/* Tech chips */}
            {proj.tech.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {proj.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border text-xs px-3 py-1"
                    style={
                      AI_TAGS.has(t)
                        ? {
                            borderColor: "color-mix(in oklch, var(--color-accent) 40%, transparent)",
                            background: "color-mix(in oklch, var(--color-accent) 10%, transparent)",
                            color: "var(--color-accent)",
                          }
                        : { borderColor: "var(--color-border)", color: "var(--color-muted)" }
                    }
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
