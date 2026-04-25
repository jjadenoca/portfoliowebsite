import Image from "next/image";
import Section from "./Section";
import { experiences } from "@/lib/content";

export default function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Professional Experience"
      title="Where I've worked."
    >
      <ol className="space-y-10">
        {experiences.map((e) => (
          <li
            key={e.company + e.start}
            className="border-b border-border pb-10 last:border-b-0"
          >
            <div className="flex items-start gap-4">
              {e.logo && (
                <div className="shrink-0 mt-0.5 h-18 w-18 rounded-lg overflow-hidden flex items-center justify-center" style={{ height: "4.5rem", width: "4.5rem" }}>
                  <Image
                    src={e.logo}
                    alt={`${e.company} logo`}
                    width={144}
                    height={144}
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-xl sm:text-2xl font-semibold">
                    {e.company} - {e.role}
                  </h3>
                  <span className="text-base font-semibold text-foreground/80">
                    {e.location}
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mt-1.5">
                  <p className="text-base italic text-muted-foreground">
                    {e.blurb}
                  </p>
                  <span className="text-base italic text-muted-foreground">
                    {e.start} {e.end ? `- ${e.end}` : ""}
                  </span>
                </div>
              </div>
            </div>
            <ul className="mt-4 space-y-2.5 text-foreground/85 leading-relaxed">
              {e.bullets.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-accent mt-2 shrink-0">▪</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            {e.tech && e.tech.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {e.tech.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-border text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
