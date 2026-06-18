"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { activities } from "@/lib/content";

const SCROLL_SPEED = 65;

export default function ActivitiesList() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const offsetRef = useRef(0);
  const halfHeightRef = useRef(0);
  const loopPeriodRef = useRef(0);
  const pausedRef = useRef(false);
  const animatingRef = useRef(false);

  const loop = [...activities, ...activities];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      halfHeightRef.current = track.scrollHeight / 2;
      const kids = track.children;
      const N = activities.length;
      if (kids.length >= 2 * N && N > 0) {
        const a = kids[0] as HTMLElement;
        const b = kids[N] as HTMLElement;
        const period = b.offsetTop + b.offsetHeight / 2 - (a.offsetTop + a.offsetHeight / 2);
        if (period > 0) loopPeriodRef.current = period;
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    let raf = 0;
    let lastTs = performance.now();
    const tick = (ts: number) => {
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      const track = trackRef.current;
      if (track && !paused && !pausedRef.current && !animatingRef.current && halfHeightRef.current > 0) {
        offsetRef.current += SCROLL_SPEED * dt;
        const period = loopPeriodRef.current || halfHeightRef.current;
        if (offsetRef.current >= period) offsetRef.current -= period;
        track.style.transform = `translate3d(0, ${-offsetRef.current}px, 0)`;
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
      const center = containerRect.top + containerRect.height / 2;
      const cards = track.children;
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < cards.length; i++) {
        const r = (cards[i] as HTMLElement).getBoundingClientRect();
        const cardCenter = r.top + r.height / 2;
        const d = Math.abs(cardCenter - center);
        if (d < bestDist) { bestDist = d; bestIdx = i % activities.length; }
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
    const containerHeight = container.clientHeight;
    const cardTop = card.offsetTop;
    const cardHeight = card.offsetHeight;
    let target = cardTop + cardHeight / 2 - containerHeight / 2;
    if (halfHeightRef.current > 0) {
      target = ((target % halfHeightRef.current) + halfHeightRef.current) % halfHeightRef.current;
    }
    offsetRef.current = target;
    track.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";
    track.style.transform = `translate3d(0, ${-target}px, 0)`;
    window.setTimeout(() => { if (track) track.style.transition = ""; }, 620);
  };

  const stepBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container || halfHeightRef.current <= 0) return;
    if (animatingRef.current) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (cards.length === 0) return;
    pausedRef.current = true;
    animatingRef.current = true;
    setPaused(true);
    const containerHeight = container.clientHeight;
    const centeredOffsets = cards.map(
      (c) => c.offsetTop + c.offsetHeight / 2 - containerHeight / 2
    );
    const ACTIVITIES_LEN = centeredOffsets.length / 2;
    const loopPeriod =
      ACTIVITIES_LEN > 0
        ? centeredOffsets[ACTIVITIES_LEN] - centeredOffsets[0]
        : halfHeightRef.current;
    const cur = offsetRef.current;
    let liveCur = cur;
    if (direction === -1) {
      let preNearest = 0;
      let preBest = Infinity;
      for (let i = 0; i < centeredOffsets.length; i++) {
        const d = Math.abs(cur - centeredOffsets[i]);
        if (d < preBest) { preBest = d; preNearest = i; }
      }
      const ph = cards[preNearest].offsetHeight;
      const pSigned = cur - centeredOffsets[preNearest];
      const wouldSkip2 = -pSigned > ph * 0.5;
      const tentativeTarget = preNearest - (wouldSkip2 ? 2 : 1);
      if (tentativeTarget < 0) {
        const rebased = cur + loopPeriod;
        offsetRef.current = rebased;
        liveCur = rebased;
        track.style.transition = "none";
        track.style.transform = `translate3d(0, ${-rebased}px, 0)`;
        void track.offsetWidth;
      }
    }
    let nearest = 0;
    let bestD = Infinity;
    for (let i = 0; i < centeredOffsets.length; i++) {
      const d = Math.abs(liveCur - centeredOffsets[i]);
      if (d < bestD) { bestD = d; nearest = i; }
    }
    let targetIdx: number;
    const currentCardHeight = cards[nearest].offsetHeight;
    const skipThreshold = currentCardHeight * 0.5;
    const signedDelta = liveCur - centeredOffsets[nearest];
    if (direction === 1) {
      targetIdx = nearest + (signedDelta > skipThreshold ? 2 : 1);
    } else {
      targetIdx = nearest - (-signedDelta > skipThreshold ? 2 : 1);
    }
    targetIdx = Math.max(0, Math.min(centeredOffsets.length - 1, targetIdx));
    let next = centeredOffsets[targetIdx];
    if (targetIdx >= ACTIVITIES_LEN) {
      next -= loopPeriod;
      const rebasedCur = liveCur - loopPeriod;
      offsetRef.current = rebasedCur;
      track.style.transition = "none";
      track.style.transform = `translate3d(0, ${-rebasedCur}px, 0)`;
      void track.offsetWidth;
    }
    offsetRef.current = next;
    track.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";
    track.style.transform = `translate3d(0, ${-next}px, 0)`;
    window.setTimeout(() => {
      if (!track) return;
      track.style.transition = "";
      animatingRef.current = false;
    }, 620);
  };

  return (
    <div className="relative">
      {/* Up/Down arrows */}
      <button
        type="button"
        onClick={() => stepBy(-1)}
        aria-label="Previous activity"
        className="hidden sm:flex absolute right-3 top-3 z-20 h-11 w-11 items-center justify-center rounded-full border border-border backdrop-blur hover:border-accent hover:text-accent hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm"
        style={{ background: "color-mix(in oklch, var(--color-bg) 90%, transparent)" }}
      >
        <span aria-hidden className="text-lg">↑</span>
      </button>
      <button
        type="button"
        onClick={() => stepBy(1)}
        aria-label="Next activity"
        className="hidden sm:flex absolute right-3 bottom-3 z-20 h-11 w-11 items-center justify-center rounded-full border border-border backdrop-blur hover:border-accent hover:text-accent hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm"
        style={{ background: "color-mix(in oklch, var(--color-bg) 90%, transparent)" }}
      >
        <span aria-hidden className="text-lg">↓</span>
      </button>

      <div className="flex gap-4">
        {/* Vertical pagination dots */}
        <div className="hidden sm:flex flex-col items-center justify-center gap-2 shrink-0 pt-2">
          {activities.map((a, idx) => (
            <button
              key={a.title + a.org}
              type="button"
              onClick={() => snapTo(idx)}
              aria-label={`Go to ${a.title} at ${a.org}`}
              className="w-2 rounded-full transition-all duration-300"
              style={
                idx === activeIndex
                  ? { height: "2rem", background: "var(--color-accent)" }
                  : { height: "0.5rem", background: "var(--color-border)" }
              }
            />
          ))}
        </div>

        {/* Slot machine viewport */}
        <div
          ref={containerRef}
          className="relative flex-1 overflow-hidden rounded-2xl border border-border"
          style={{ height: "560px", background: "color-mix(in oklch, var(--color-surface-2) 60%, transparent)" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Top/bottom fade masks */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-20 z-10"
            style={{ background: "linear-gradient(to bottom, var(--color-bg), transparent)" }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 z-10"
            style={{ background: "linear-gradient(to top, var(--color-bg), transparent)" }}
          />

          {/* Center highlight band */}
          <div
            className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 z-0 rounded-2xl border"
            style={{
              height: "calc(100% - 80px)",
              borderColor: "color-mix(in oklch, var(--color-accent) 20%, transparent)",
              background: "color-mix(in oklch, var(--color-accent) 5%, transparent)",
            }}
          />

          <div ref={trackRef} className="flex flex-col gap-6 w-full will-change-transform px-4 py-10">
            {loop.map((a, idx) => (
              <article
                key={a.title + a.org + idx}
                className="card shrink-0 w-full p-6 sm:p-7 transition-all duration-500"
                style={{
                  minHeight: "480px",
                  ...(idx % activities.length === activeIndex
                    ? {
                        borderColor: "color-mix(in oklch, var(--color-accent) 60%, transparent)",
                        boxShadow: "0 8px 32px -8px color-mix(in oklch, var(--color-accent) 15%, transparent)",
                        transform: "scale(1.01)",
                      }
                    : { opacity: 0.65 }),
                }}
              >
                <div className="flex items-start gap-4">
                  {a.logo && (
                    <div
                      className="shrink-0 mt-0.5 rounded-lg overflow-hidden border border-border flex items-center justify-center"
                      style={{ height: "3.5rem", width: "3.5rem" }}
                    >
                      <Image
                        src={a.logo}
                        alt={`${a.org} logo`}
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
                      {a.title}
                    </h3>
                    <p className="text-sm sm:text-base text-text mt-0.5">
                      {a.href ? (
                        <a
                          href={a.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-underline hover:text-accent transition-colors"
                        >
                          {a.org} ↗
                        </a>
                      ) : (
                        a.org
                      )}
                    </p>
                  </div>
                  <p
                    className="text-xs uppercase tracking-widest shrink-0 mt-1"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {a.start}{a.end ? ` - ${a.end}` : ""}
                  </p>
                </div>

                <div className="mt-4 pb-4 border-b border-border" />

                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <ul className="space-y-2 text-sm">
                    {a.bullets.map((b, i) => (
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

                  {a.image && (
                    <div
                      className="relative w-full overflow-hidden rounded-xl border border-border"
                      style={{ aspectRatio: "4/3" }}
                    >
                      <Image
                        src={a.image}
                        alt={`${a.org} event photo`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        style={{ objectPosition: "center bottom" }}
                      />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {paused && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setPaused(false)}
            className="text-[10px] uppercase tracking-widest text-muted hover:text-accent transition-colors"
          >
            ▶ Resume
          </button>
        </div>
      )}
    </div>
  );
}
