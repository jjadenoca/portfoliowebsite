import Image from "next/image";
import Section from "./Section";
import { education } from "@/lib/content";

export default function Education() {
  return (
    <Section id="education" eyebrow="Education" title="School & societies.">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Education card */}
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
          <p className="text-sm text-muted-foreground">{education.minors}</p>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground mt-4">
            Graduated {education.graduation}
          </p>
        </div>

        {/* Activities & Societies */}
        {education.activities && education.activities.length > 0 && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Other Activities
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
    </Section>
  );
}
