import { projects } from "@/lib/content";

export default function ProjectsList() {
  return (
    <div className="space-y-6">
      {projects.map((proj) => (
        <article
          key={proj.name}
          className="card card-lift reveal p-6 md:p-8"
        >
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
            <div>
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

            <p className="text-muted text-sm whitespace-nowrap shrink-0">
              {proj.start} – {proj.end}
            </p>
          </div>

          {/* Bullets */}
          <ul className="space-y-2 mb-5 mt-4">
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
                  className="rounded-full border border-border text-muted text-xs px-3 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
