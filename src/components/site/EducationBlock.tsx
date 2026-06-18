import { education, awards, skills } from "@/lib/content";

const SKILL_GROUPS: { label: string; items: string[] }[] = [
  { label: "AI tools",        items: skills.ai },
  { label: "Languages",       items: skills.languages },
  { label: "Python packages", items: skills.python },
  { label: "Data & BI tools", items: skills.data },
  { label: "Tools",           items: skills.tools },
];

export default function EducationBlock() {
  return (
    <div className="space-y-6">
      {/* Education card */}
      <article className="card reveal p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
          <div>
            <h3
              className="font-display text-text-strong text-xl leading-snug"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {education.school}
            </h3>
            <p className="text-text font-medium mt-0.5">{education.degree}</p>
            <p className="text-muted text-sm mt-0.5">{education.minors}</p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-muted text-sm">{education.graduation}</p>
            <p className="text-muted text-sm">{education.location}</p>
          </div>
        </div>

        {/* Campus activities */}
        {education.activities.length > 0 && (
          <div className="border-t border-border pt-4 mt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
              Campus activities
            </p>
            <ul className="space-y-1.5">
              {education.activities.map((a) => (
                <li
                  key={`${a.org}-${a.role}`}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 text-[15px]"
                >
                  <span>
                    <span className="text-text">{a.org}</span>
                    <span className="text-muted">, {a.role}</span>
                  </span>
                  <span className="text-muted text-sm whitespace-nowrap">
                    {a.start} – {a.end}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      {/* Awards card */}
      <article className="card reveal p-6 md:p-8">
        <p className="eyebrow mb-4">Awards &amp; Honors</p>
        <ul className="flex flex-wrap gap-2">
          {awards.map((award) => (
            <li
              key={award}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
              style={{
                backgroundColor: "color-mix(in oklch, var(--color-accent) 12%, transparent)",
                color: "var(--color-accent)",
                border: "1px solid color-mix(in oklch, var(--color-accent) 25%, transparent)",
              }}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
              {award}
            </li>
          ))}
        </ul>
      </article>

      {/* Skills card */}
      <article className="card reveal p-6 md:p-8">
        <p className="eyebrow mb-5">Skills</p>
        <div className="space-y-5">
          {SKILL_GROUPS.map(({ label, items }) => (
            <div key={label}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
                {label}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border text-muted text-xs px-3 py-1"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
