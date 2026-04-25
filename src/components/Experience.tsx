"use client";

import Image from "next/image";
import { useRef } from "react";
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
  const scrollerRef = useRef<HTMLOListElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const cardWidth = card ? (card as HTMLElement).offsetWidth : el.clientWidth;
    const gap = 24; // matches gap-6
    el.scrollBy({ left: dir * (cardWidth + gap), behavior: "smooth" });
  };

  return (
    <Section
      id="experience"
      eyebrow="Professional Experience"
      title="Where I've worked."
    >
      <div className="relative">
        {/* Arrow buttons */}
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Previous experience"
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 backdrop-blur hover:border-accent hover:text-accent transition-colors shadow-sm"
        >
          <span aria-hidden>←</span>
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Next experience"
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 backdrop-blur hover:border-accent hover:text-accent transition-colors shadow-sm"
        >
          <span aria-hidden>→</span>
        </button>

        <ol
          ref={scrollerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-6 px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {experiences.map((e) => (
            <li
              key={e.company + e.start}
              className="snap-center shrink-0 w-[88%] sm:w-[75%] md:w-[80%] rounded-2xl border border-border bg-card p-6 sm:p-8"
            >
              <div className="flex items-start gap-4">
                {e.logo && (
                  <div
                    className="shrink-0 mt-0.5 rounded-lg overflow-hidden flex items-center justify-center"
                    style={{ height: "4.5rem", width: "4.5rem" }}
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
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-x-4 gap-y-1">
                  <div className="min-w-0">
                    <h3 className="text-xl sm:text-2xl font-semibold">
                      {e.company} - {e.role}
                    </h3>
                    <p className="text-base italic text-muted-foreground mt-1.5">
                      {e.blurb}
                    </p>
                  </div>
                  <div className="shrink-0 sm:text-right">
                    <p className="text-base font-semibold text-foreground/80">
                      {e.location}
                    </p>
                    <p className="text-base italic text-muted-foreground mt-1.5">
                      {e.start} {e.end ? `- ${e.end}` : ""}
                    </p>
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
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
