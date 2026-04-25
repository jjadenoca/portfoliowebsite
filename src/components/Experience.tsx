"use client";

import Image from "next/image";
import { useState } from "react";
import Section from "./Section";
import { experiences } from "@/lib/content";

const AI_TAGS = new Set([
  "Claude",
  "Gemini",
  "GPT-2",
  "BERT",
  "NLP",
  "LLM",
  "LLM Fine-tuning",
  "RAG",
  "Prompt Engineering",
]);

export default function Experience() {
  const [paused, setPaused] = useState(false);

  // Duplicate the list so the marquee can loop seamlessly
  const loop = [...experiences, ...experiences];

  return (
    <Section
      id="experience"
      eyebrow="Professional Experience"
      title="Where I've worked."
    >
      <div
        className="relative -mx-6 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-background to-transparent" />

        <div
          className="flex gap-6 w-max py-2 marquee"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {loop.map((e, idx) => (
            <article
              key={e.company + e.start + idx}
              className="shrink-0 w-[88vw] sm:w-[460px] md:w-[480px] min-h-[480px] sm:min-h-[520px] rounded-2xl border border-border bg-card p-6 sm:p-7 flex flex-col hover:border-accent/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {e.logo && (
                  <div
                    className="shrink-0 mt-0.5 rounded-lg overflow-hidden flex items-center justify-center"
                    style={{ height: "3.5rem", width: "3.5rem" }}
                  >
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
                  <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                    {e.company}
                  </h3>
                  <p className="text-sm sm:text-base text-foreground/80 mt-0.5">
                    {e.role}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pb-4 border-b border-border/60">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  {e.location}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
                  {e.start} {e.end ? `— ${e.end}` : ""}
                </p>
              </div>

              <p className="mt-3 text-sm italic text-muted-foreground">
                {e.blurb}
              </p>

              <ul className="mt-3 space-y-2 text-foreground/85 leading-relaxed flex-1 text-sm">
                {e.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-accent mt-1.5 shrink-0">▪</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {e.tech && e.tech.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap gap-1.5">
                  {e.tech.map((t) => {
                    const isAi = AI_TAGS.has(t);
                    return (
                      <span
                        key={t}
                        className={
                          "font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border " +
                          (isAi
                            ? "border-accent/40 bg-accent/10 text-accent"
                            : "border-border text-muted-foreground")
                        }
                      >
                        {t}
                      </span>
                    );
                  })}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee {
          animation: scroll-left 40s linear infinite;
        }
        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            /* shift by exactly half (the duplicated set) for seamless loop */
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee {
            animation: none;
          }
        }
      `}</style>
    </Section>
  );
}
