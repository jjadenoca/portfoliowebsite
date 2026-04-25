import Image from "next/image";
import Section from "./Section";
import { activities, education } from "@/lib/content";

export default function Activities() {
  return (
    <Section
      id="activities"
      eyebrow="Beyond Work"
      title="Activities & education."
    >
      <div className="grid md:grid-cols-3 gap-10">
        {/* Education */}
        <div className="md:col-span-1">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Education
          </p>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              {education.logo && (
                <div className="shrink-0 h-12 w-12 rounded-lg overflow-hidden flex items-center justify-center">
                  <Image
                    src={education.logo}
                    alt={`${education.school} logo`}
                    width={96}
                    height={96}
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-semibold">{education.school}</h3>
                <p className="text-sm text-muted-foreground">
                  {education.location}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm">{education.degree}</p>
            <p className="text-sm text-muted-foreground">
              {education.minors}
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground mt-4">
              Graduated {education.graduation}
            </p>
          </div>

          {education.activities && education.activities.length > 0 && (
            <div className="mt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Activities & Societies
              </p>
              <ul className="space-y-3">
                {education.activities.map((a) => (
                  <li
                    key={a.org}
                    className="rounded-xl border border-border bg-card p-4 hover:border-accent/50 transition-colors"
                  >
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {a.org}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {a.role}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent mt-2">
                      {a.start} — {a.end}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Activities */}
        <div className="md:col-span-2">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Additional Experience
          </p>
          {activities.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              Add clubs, leadership, hackathons, TA roles, and other college
              activities in <code className="font-mono">src/lib/content.ts</code>.
            </div>
          ) : (
            <ol className="space-y-6">
              {activities.map((a) => (
                <li
                  key={a.title + a.org}
                  className="rounded-2xl border border-border bg-card p-6 overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    {a.logo && (
                      <div className="shrink-0 mt-0.5 h-15 w-15 rounded-lg overflow-hidden flex items-center justify-center" style={{ height: "3.75rem", width: "3.75rem" }}>
                        <Image
                          src={a.logo}
                          alt={`${a.org} logo`}
                          width={120}
                          height={120}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-semibold">
                          {a.title}{" "}
                          <span className="text-muted-foreground font-normal">
                            ·{" "}
                            {a.href ? (
                              <a
                                href={a.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-accent underline-offset-4 hover:underline transition-colors"
                              >
                                {a.org} ↗
                              </a>
                            ) : (
                              a.org
                            )}
                          </span>
                        </h3>
                        <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          {a.start} - {a.end}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-foreground/85 leading-relaxed">
                    {a.bullets.map((b, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-accent mt-1.5 shrink-0">▪</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  {a.image && (
                    <div className="relative mt-5 w-full overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "16 / 9" }}>
                      <Image
                        src={a.image}
                        alt={`${a.org} event photo`}
                        fill
                        sizes="(max-width: 768px) 100vw, 66vw"
                        className="object-cover"
                        style={{ objectPosition: "center bottom" }}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </Section>
  );
}
