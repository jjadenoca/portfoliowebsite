import { experiences } from "@/lib/content";

export default function ExperienceList() {
  return (
    <div className="space-y-6">
      {experiences.map((exp) => {
        const isCurrent = exp.end === "Present";
        return (
          <article key={`${exp.company}-${exp.start}`} className="card reveal p-6 md:p-8">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h3
                  className="font-display text-text-strong text-xl leading-snug"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {exp.company}
                </h3>
                <p className="text-text font-medium mt-0.5">{exp.role}</p>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                {isCurrent && (
                  <span
                    className="inline-flex self-start sm:self-auto items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: "color-mix(in oklch, var(--color-accent) 15%, transparent)",
                      color: "var(--color-accent)",
                    }}
                  >
                    Current
                  </span>
                )}
                <p className="text-muted text-sm whitespace-nowrap">
                  {exp.start} – {exp.end}
                </p>
                <p className="text-muted text-sm">{exp.location}</p>
              </div>
            </div>

            {/* Blurb */}
            <p className="text-muted text-sm mb-4 italic">{exp.blurb}</p>

            {/* Bullets */}
            <ul className="space-y-2 mb-5">
              {exp.bullets.map((b, i) => (
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
            {exp.tech && exp.tech.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {exp.tech.map((t) => (
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
        );
      })}
    </div>
  );
}
