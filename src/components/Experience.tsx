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

// Pixels per second the marquee scrolls at when running
const SCROLL_SPEED = 75;

export default function Experience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  // Track translateX in a ref so the rAF loop doesn't re-render every frame
  const offsetRef = useRef(0);
  // Width of one full set of cards (so we can wrap when offset > halfWidth)
  const halfWidthRef = useRef(0);

  // Duplicate the list so the marquee can loop seamlessly
  const loop = [...experiences, ...experiences];

  // Measure the width of one set of cards (track is two sets long)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      halfWidthRef.current = track.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  // Drive the scroll with requestAnimationFrame so we can pause/resume
  // at arbitrary positions (unlike a CSS keyframe).
  useEffect(() => {
    let raf = 0;
    let lastTs = performance.now();

    const tick = (ts: number) => {
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      const track = trackRef.current;
      if (track && !paused && halfWidthRef.current > 0) {
        offsetRef.current += SCROLL_SPEED * dt;
        if (offsetRef.current >= halfWidthRef.current) {
          offsetRef.current -= halfWidthRef.current;
        }
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  // Determine which card is currently most centered and update activeIndex
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    let raf = 0;
    const updateActive = () => {
      const containerRect = container.getBoundingClientRect();
      const center = containerRect.left + containerRect.width / 2;
      const cards = track.children;
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < cards.length; i++) {
        const r = (cards[i] as HTMLElement).getBoundingClientRect();
        const cardCenter = r.left + r.width / 2;
        const d = Math.abs(cardCenter - center);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i % experiences.length;
        }
      }
      setActiveIndex(bestIdx);
      raf = requestAnimationFrame(updateActive);
    };
    raf = requestAnimationFrame(updateActive);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Snap to a specific card (centered) and pause the marquee
  const snapTo = (idx: number) => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;
    const card = track.children[idx] as HTMLElement | undefined;
    if (!card) return;
    setPaused(true);
    // Compute offset that places this card's center at the container's center
    const containerWidth = container.clientWidth;
    const cardLeft = card.offsetLeft;
    const cardWidth = card.offsetWidth;
    let target = cardLeft + cardWidth / 2 - containerWidth / 2;
    // Keep within first half so the duplicate copy is offscreen
    if (halfWidthRef.current > 0) {
      target = ((target % halfWidthRef.current) + halfWidthRef.current) % halfWidthRef.current;
    }
    offsetRef.current = target;
    track.style.transition = "transform 500ms ease-out";
    track.style.transform = `translate3d(${-target}px, 0, 0)`;
    // Clear the transition after it completes so rAF updates aren't laggy
    window.setTimeout(() => {
      if (track) track.style.transition = "";
    }, 520);
  };

  // Step the marquee forward/backward by one card width.
  // Allow the transition to overshoot past halfWidth (so the next card slides
  // smoothly into view), then silently rebase the offset back into [0, halfWidth)
  // *after* the transition completes — the duplicated second copy looks identical
  // to the first, so the rebase is invisible.
  const stepBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track || halfWidthRef.current <= 0) return;
    const firstCard = track.children[0] as HTMLElement | undefined;
    if (!firstCard) return;
    setPaused(true);
    const gap = 24; // gap-6 between cards
    const stepSize = firstCard.offsetWidth + gap;

    // If going backward from a position near 0, jump invisibly to the
    // equivalent spot in the second copy first so the transition has room.
    if (direction === -1 && offsetRef.current < stepSize) {
      const rebased = offsetRef.current + halfWidthRef.current;
      offsetRef.current = rebased;
      track.style.transition = "none";
      track.style.transform = `translate3d(${-rebased}px, 0, 0)`;
      void track.offsetWidth;
    }

    const next = offsetRef.current + direction * stepSize;
    offsetRef.current = next;
    track.style.transition = "transform 500ms ease-out";
    track.style.transform = `translate3d(${-next}px, 0, 0)`;

    window.setTimeout(() => {
      if (!track) return;
      let rebased = offsetRef.current;
      if (rebased >= halfWidthRef.current) rebased -= halfWidthRef.current;
      if (rebased < 0) rebased += halfWidthRef.current;
      offsetRef.current = rebased;
      track.style.transition = "none";
      track.style.transform = `translate3d(${-rebased}px, 0, 0)`;
      window.requestAnimationFrame(() => {
        if (track) track.style.transition = "";
      });
    }, 520);
  };

  const goPrev = () => stepBy(-1);
  const goNext = () => stepBy(1);

  return (
    <Section
      id="experience"
      eyebrow="Professional Experience"
      title="Where I've worked."
    >
      <div
        ref={containerRef}
        className="relative -mx-6 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-background to-transparent" />

        {/* Arrow buttons */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous experience"
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border border-border bg-background/90 backdrop-blur hover:border-accent hover:text-accent hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span aria-hidden className="text-lg">←</span>
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next experience"
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border border-border bg-background/90 backdrop-blur hover:border-accent hover:text-accent hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span aria-hidden className="text-lg">→</span>
        </button>

        <div ref={trackRef} className="flex gap-6 w-max py-2 will-change-transform">
          {loop.map((e, idx) => (
            <article
              key={e.company + e.start + idx}
              className="shrink-0 w-[88vw] sm:w-[460px] md:w-[480px] min-h-[480px] sm:min-h-[520px] rounded-2xl border border-border bg-card p-6 sm:p-7 flex flex-col hover:border-accent/50 hover:shadow-lg transition-all duration-300"
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

      {/* Pagination dots + status indicator */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <div className="flex gap-2">
          {experiences.map((e, idx) => (
            <button
              key={e.company + e.start}
              type="button"
              onClick={() => snapTo(idx)}
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
        {paused && (
          <button
            type="button"
            onClick={() => setPaused(false)}
            className="ml-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-accent transition-colors"
          >
            ▶ Resume
          </button>
        )}
      </div>
    </Section>
  );
}
