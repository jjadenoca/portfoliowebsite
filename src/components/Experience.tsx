"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const cardWidth = card ? (card as HTMLElement).offsetWidth : el.clientWidth;
    const gap = 24; // matches gap-6
    el.scrollBy({ left: dir * (cardWidth + gap), behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    if (!card) return;
    const cardWidth = (card as HTMLElement).offsetWidth;
    const gap = 24;
    el.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
  };

  // Track which card is currently most centered using IntersectionObserver
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const items = el.querySelectorAll("li");
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let mostVisible: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            (!mostVisible || entry.intersectionRatio > mostVisible.intersectionRatio)
          ) {
            mostVisible = entry;
          }
        }
        if (mostVisible) {
          const idx = Array.from(items).indexOf(mostVisible.target as HTMLLIElement);
          if (idx !== -1) setActiveIndex(idx);
        }
      },
      {
        root: el,
        threshold: [0.5, 0.75, 1],
      }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

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
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 h-11 w-11 items-center justify-center rounded-full border border-border bg-background/90 backdrop-blur hover:border-accent hover:text-accent hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span aria-hidden className="text-lg">←</span>
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Next experience"
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 h-11 w-11 items-center justify-center rounded-full border border-border bg-background/90 backdrop-blur hover:border-accent hover:text-accent hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span aria-hidden className="text-lg">→</span>
        </button>

        <ol
          ref={scrollerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 -mx-6 px-6 sm:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {experiences.map((e, idx) => {
            const isActive = idx === activeIndex;
            return (
              <li
                key={e.company + e.start}
                className={
                  "snap-center shrink-0 w-[88%] sm:w-[62%] md:w-[55%] lg:w-[50%] min-h-[520px] sm:min-h-[560px] rounded-2xl border bg-card p-6 sm:p-8 flex flex-col transition-all duration-500 ease-out " +
                  (isActive
                    ? "border-accent/50 shadow-xl shadow-accent/5 opacity-100 scale-100"
                    : "border-border opacity-50 scale-[0.94] hover:opacity-75")
                }
              >
                <div className="flex items-start gap-4">
                  {e.logo && (
                    <div
                      className={
                        "shrink-0 mt-0.5 rounded-lg overflow-hidden flex items-center justify-center transition-transform duration-500 " +
                        (isActive ? "scale-100" : "scale-95")
                      }
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
                  <div className="flex-1 min-w-0 flex flex-col gap-y-1">
                    <div className="min-w-0">
                      <h3 className="text-xl sm:text-2xl font-semibold leading-tight">
                        {e.company}
                      </h3>
                      <p className="text-base sm:text-lg text-foreground/80 mt-0.5">
                        {e.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pb-4 border-b border-border/60">
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {e.location}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
                    {e.start} {e.end ? `— ${e.end}` : ""}
                  </p>
                </div>

                <p className="mt-4 text-sm italic text-muted-foreground">
                  {e.blurb}
                </p>

                <ul className="mt-4 space-y-2.5 text-foreground/85 leading-relaxed flex-1">
                  {e.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm sm:text-[0.95rem]"
                      style={{
                        animation: isActive
                          ? `fadeSlideIn 0.5s ease-out ${i * 0.08}s both`
                          : "none",
                      }}
                    >
                      <span className="text-accent mt-1.5 shrink-0">▪</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {e.tech && e.tech.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-border/60 flex flex-wrap gap-1.5">
                    {e.tech.map((t) => {
                      const isAi = AI_TAGS.has(t);
                      return (
                        <span
                          key={t}
                          className={
                            "font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all duration-200 hover:scale-105 " +
                            (isAi
                              ? "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
                              : "border-border text-muted-foreground hover:border-accent/40 hover:text-accent")
                          }
                        >
                          {t}
                        </span>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {/* Pagination dots */}
        <div className="mt-6 flex justify-center gap-2">
          {experiences.map((e, idx) => (
            <button
              key={e.company + e.start}
              type="button"
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to ${e.company}`}
              className={
                "h-2 rounded-full transition-all duration-300 " +
                (idx === activeIndex
                  ? "w-8 bg-accent"
                  : "w-2 bg-border hover:bg-accent/50")
              }
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Section>
  );
}
