"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { experiences } from "@/lib/content";

const AI_TAGS = new Set([
  "Claude Code", "Gemini", "ChatGPT", "Grok API",
  "GPT-2", "BERT", "NLP", "LLM", "LLM Fine-tuning",
  "RAG", "Prompt Engineering",
]);

const SCROLL_SPEED = 75;

export default function ExperienceList() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);

  const loop = [...experiences, ...experiences];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => { halfWidthRef.current = track.scrollWidth / 2; };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    let lastTs = performance.now();
    const tick = (ts: number) => {
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      const track = trackRef.current;
      if (track && !paused && halfWidthRef.current > 0) {
        offsetRef.current += SCROLL_SPEED * dt;
        if (offsetRef.current >= halfWidthRef.current) offsetRef.current -= halfWidthRef.current;
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

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
        if (d < bestDist) { bestDist = d; bestIdx = i % experiences.length; }
      }
      setActiveIndex(bestIdx);
      raf = requestAnimationFrame(updateActive);
    };
    raf = requestAnimationFrame(updateActive);
    return () => cancelAnimationFrame(raf);
  }, []);

  const snapTo = (idx: number) => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;
    const card = track.children[idx] as HTMLElement | undefined;
    if (!card) return;
    setPaused(true);
    const containerWidth = container.clientWidth;
    const cardLeft = card.offsetLeft;
    const cardWidth = card.offsetWidth;
    let target = cardLeft + cardWidth / 2 - containerWidth / 2;
    if (halfWidthRef.current > 0) {
      target = ((target % halfWidthRef.current) + halfWidthRef.current) % halfWidthRef.current;
    }
    offsetRef.current = target;
    track.style.transition = "transform 500ms ease-out";
    track.style.transform = `translate3d(${-target}px, 0, 0)`;
    window.setTimeout(() => { if (track) track.style.transition = ""; }, 520);
  };

  const stepBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track || halfWidthRef.current <= 0) return;
    const firstCard = track.children[0] as HTMLElement | undefined;
    if (!firstCard) return;
    setPaused(true);
    const gap = 24;
    const stepSize = firstCard.offsetWidth + gap;
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
      window.requestAnimationFrame(() => { if (track) track.style.transition = ""; });
    }, 520);
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="relative -mx-4 sm:-mx-6 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Edge fade masks */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10"
          style={{ background: "linear-gradient(to right, var(--color-bg), transparent)" }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10"
          style={{ background: "linear-gradient(to left, var(--color-bg), transparent)" }}
        />

        {/* Arrow buttons */}
        <button
          type="button"
          onClick={() => stepBy(-1)}
          aria-label="Previous experience"
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border border-border backdrop-blur hover:border-accent hover:text-accent hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
          style={{ background: "color-mix(in oklch, var(--color-bg) 90%, transparent)" }}
        >
          <span aria-hidden className="text-lg">←</span>
        </button>
        <button
          type="button"
          onClick={() => stepBy(1)}
          aria-label="Next experience"
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border border-border backdrop-blur hover:border-accent hover:text-accent hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
          style={{ background: "color-mix(in oklch, var(--color-bg) 90%, transparent)" }}
        >
          <span aria-hidden className="text-lg">→</span>
        </button>

        <div ref={trackRef} className="flex gap-6 w-max py-2 will-change-transform px-4 sm:px-6">
          {loop.map((e, idx) => (
            <article
              key={e.company + e.start + idx}
              className="card card-lift shrink-0 w-[88vw] sm:w-[460px] md:w-[480px] p-6 sm:p-7 flex flex-col"
              style={{ minHeight: "480px" }}
            >
              <div className="flex items-start gap-4">
                {e.logo && (
                  <div
                    className="shrink-0 mt-0.5 rounded-lg overflow-hidden border border-border flex items-center justify-center"
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
                  <h3
                    className="text-lg sm:text-xl font-semibold leading-tight text-text-strong"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {e.company}
                  </h3>
                  <p className="text-sm sm:text-base text-text mt-0.5">{e.role}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pb-4 border-b border-border">
                <p className="text-xs uppercase tracking-widest text-muted">{e.location}</p>
                <p className="text-xs uppercase tracking-widest text-accent">
                  {e.start}{e.end ? ` - ${e.end}` : ""}
                </p>
              </div>

              <p className="mt-3 text-sm italic text-muted">{e.blurb}</p>

              <ul className="mt-3 space-y-2 flex-1 text-sm">
                {e.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-text leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {e.tech && e.tech.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-1.5">
                  {e.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border"
                      style={
                        AI_TAGS.has(t)
                          ? {
                              borderColor: "color-mix(in oklch, var(--color-accent) 40%, transparent)",
                              background: "color-mix(in oklch, var(--color-accent) 10%, transparent)",
                              color: "var(--color-accent)",
                            }
                          : { borderColor: "var(--color-border)", color: "var(--color-muted)" }
                      }
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <div className="flex gap-2">
          {experiences.map((e, idx) => (
            <button
              key={e.company + e.start}
              type="button"
              onClick={() => snapTo(idx)}
              aria-label={`Go to ${e.company}`}
              className="h-2 rounded-full transition-all duration-300"
              style={
                idx === activeIndex
                  ? { width: "2rem", background: "var(--color-accent)" }
                  : { width: "0.5rem", background: "var(--color-border)" }
              }
            />
          ))}
        </div>
        {paused && (
          <button
            type="button"
            onClick={() => setPaused(false)}
            className="ml-2 text-[10px] uppercase tracking-widest text-muted hover:text-accent transition-colors"
          >
            ▶ Resume
          </button>
        )}
      </div>
    </div>
  );
}
