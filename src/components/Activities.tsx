"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Section from "./Section";
import { activities } from "@/lib/content";

// Pixels per second the slot reel scrolls at when running
const SCROLL_SPEED = 65;

export default function Activities() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const offsetRef = useRef(0);
  const halfHeightRef = useRef(0);
  // Synchronous pause flag — the React state takes a render to propagate,
  // but the rAF tick reads this ref every frame so we can stop the auto
  // scroll instantly when the user clicks an arrow.
  const pausedRef = useRef(false);
  // While a transition is in flight, the auto-scroll must not touch the
  // transform (it would overwrite the eased step animation mid-frame).
  const animatingRef = useRef(false);

  // Duplicate the list so the reel can loop seamlessly
  const loop = [...activities, ...activities];

  // Measure the height of one set of cards
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      halfHeightRef.current = track.scrollHeight / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  // Mirror the paused state into a ref so other code paths (like stepBy)
  // can flip pause synchronously without waiting for a render.
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Drive the scroll vertically with rAF
  useEffect(() => {
    let raf = 0;
    let lastTs = performance.now();

    const tick = (ts: number) => {
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      const track = trackRef.current;
      if (
        track &&
        !paused &&
        !pausedRef.current &&
        !animatingRef.current &&
        halfHeightRef.current > 0
      ) {
        offsetRef.current += SCROLL_SPEED * dt;
        if (offsetRef.current >= halfHeightRef.current) {
          offsetRef.current -= halfHeightRef.current;
        }
        track.style.transform = `translate3d(0, ${-offsetRef.current}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  // Determine which card is currently most centered (vertically)
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
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i % activities.length;
        }
      }
      setActiveIndex(bestIdx);
      raf = requestAnimationFrame(updateActive);
    };
    raf = requestAnimationFrame(updateActive);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Snap to a specific card (centered) and pause the reel
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
    window.setTimeout(() => {
      if (track) track.style.transition = "";
    }, 620);
  };

  // Step the reel up/down by one card height with seamless wrap.
  // Lands on the same center-aligned position the pagination dots use,
  // so the active card is always perfectly framed in the highlight band.
  const stepBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container || halfHeightRef.current <= 0) return;
    if (animatingRef.current) return; // ignore clicks while easing
    const cards = Array.from(track.children) as HTMLElement[];
    if (cards.length === 0) return;
    // Stop auto-scroll synchronously so the next rAF tick can't overwrite us.
    pausedRef.current = true;
    animatingRef.current = true;
    setPaused(true);
    const containerHeight = container.clientHeight;

    // Build the centered offset for every card by measuring actual layout.
    // Cards have variable heights (different bullet counts), so we cannot
    // assume a single uniform stepSize.
    const centeredOffsets = cards.map(
      (c) => c.offsetTop + c.offsetHeight / 2 - containerHeight / 2
    );

    // Find the card whose centered position is closest to the current
    // offset, and how far past it we are (signed pixel distance).
    const cur = offsetRef.current;
    let nearestIdx = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < centeredOffsets.length; i++) {
      const d = Math.abs(cur - centeredOffsets[i]);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    }
    const signedDelta = cur - centeredOffsets[nearestIdx];

    // If going backward (up) from a position near the top, jump invisibly
    // to the equivalent spot in the second copy so the transition has room.
    const minSafeOffset =
      nearestIdx > 0
        ? centeredOffsets[nearestIdx] - centeredOffsets[nearestIdx - 1]
        : 200;
    if (direction === -1 && cur < minSafeOffset) {
      const rebased = cur + halfHeightRef.current;
      offsetRef.current = rebased;
      track.style.transition = "none";
      track.style.transform = `translate3d(0, ${-rebased}px, 0)`;
      void track.offsetWidth;
      // Re-measure offsets after the jump (positions of cards in the
      // second copy are nearestIdx + activities.length).
    }

    // Decide which centered card to land on.
    //
    // When going DOWN (direction = 1):
    //   - If we haven't yet reached the nearest card's center
    //     (signedDelta < 0), that card is still arriving → land on it.
    //   - Otherwise we're past it → skip to the next one.
    // When going UP, mirror.
    let targetIdx: number;
    const liveCur = direction === -1 && cur < minSafeOffset ? offsetRef.current : cur;
    let liveNearest = nearestIdx;
    if (direction === -1 && cur < minSafeOffset) {
      // After the rebase, recompute the nearest centered offset.
      let bestD = Infinity;
      for (let i = 0; i < centeredOffsets.length; i++) {
        const d = Math.abs(liveCur - centeredOffsets[i]);
        if (d < bestD) {
          bestD = d;
          liveNearest = i;
        }
      }
    }
    const liveSignedDelta = liveCur - centeredOffsets[liveNearest];
    if (direction === 1) {
      targetIdx = liveSignedDelta < 0 ? liveNearest : liveNearest + 1;
    } else {
      targetIdx = liveSignedDelta > 0 ? liveNearest : liveNearest - 1;
    }
    targetIdx = Math.max(0, Math.min(centeredOffsets.length - 1, targetIdx));
    // Avoid no-op (snapping back to where we already are).
    if (Math.abs(centeredOffsets[targetIdx] - liveCur) < 1) {
      targetIdx = direction === 1 ? targetIdx + 1 : targetIdx - 1;
      targetIdx = Math.max(0, Math.min(centeredOffsets.length - 1, targetIdx));
    }
    const next = centeredOffsets[targetIdx];
    offsetRef.current = next;
    track.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";
    track.style.transform = `translate3d(0, ${-next}px, 0)`;
    void signedDelta;

    window.setTimeout(() => {
      if (!track) return;
      let rebased = offsetRef.current;
      if (rebased >= halfHeightRef.current) rebased -= halfHeightRef.current;
      if (rebased < 0) rebased += halfHeightRef.current;
      offsetRef.current = rebased;
      track.style.transition = "none";
      track.style.transform = `translate3d(0, ${-rebased}px, 0)`;
      window.requestAnimationFrame(() => {
        if (track) track.style.transition = "";
        animatingRef.current = false;
      });
    }, 620);
  };

  const goPrev = () => stepBy(-1);
  const goNext = () => stepBy(1);

  return (
    <Section
      id="activities"
      eyebrow="Beyond Work"
      title="Additional experience."
    >
      <div className="relative">
        {/* Up/Down arrows on the right edge */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous activity"
          className="hidden sm:flex absolute right-3 top-3 z-20 h-11 w-11 items-center justify-center rounded-full border border-border bg-background/90 backdrop-blur hover:border-accent hover:text-accent hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span aria-hidden className="text-lg">↑</span>
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next activity"
          className="hidden sm:flex absolute right-3 bottom-3 z-20 h-11 w-11 items-center justify-center rounded-full border border-border bg-background/90 backdrop-blur hover:border-accent hover:text-accent hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span aria-hidden className="text-lg">↓</span>
        </button>

        <div className="flex gap-4">
          {/* Vertical pagination dots on the left */}
          <div className="hidden sm:flex flex-col items-center justify-center gap-2 shrink-0 pt-2">
            {activities.map((a, idx) => (
              <button
                key={a.title + a.org}
                type="button"
                onClick={() => snapTo(idx)}
                aria-label={`Go to ${a.title} at ${a.org}`}
                className={
                  "w-2 rounded-full transition-all duration-300 " +
                  (idx === activeIndex
                    ? "h-8 bg-accent"
                    : "h-2 bg-border hover:bg-accent/50")
                }
              />
            ))}
          </div>

          {/* Slot machine viewport */}
          <div
            ref={containerRef}
            className="relative flex-1 overflow-hidden rounded-2xl border border-border bg-card/30"
            style={{ height: "560px" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Top/bottom fade masks so cards fade in/out like a slot reel */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 z-10 bg-gradient-to-b from-background to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 z-10 bg-gradient-to-t from-background to-transparent" />

            {/* Center highlight band */}
            <div className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 z-0 rounded-2xl border border-accent/20 bg-accent/5" style={{ height: "calc(100% - 80px)" }} />

            <div ref={trackRef} className="flex flex-col gap-6 w-full will-change-transform px-4 py-10">
              {loop.map((a, idx) => (
                <article
                  key={a.title + a.org + idx}
                  className={
                    "shrink-0 w-full rounded-2xl border border-border bg-card p-6 sm:p-7 transition-all duration-500 " +
                    (idx % activities.length === activeIndex
                      ? "border-accent/60 shadow-lg shadow-accent/10 scale-[1.01]"
                      : "opacity-70")
                  }
                  style={{ minHeight: "480px" }}
                >
                  <div className="flex items-start gap-4">
                    {a.logo && (
                      <div
                        className="shrink-0 mt-0.5 rounded-lg overflow-hidden flex items-center justify-center"
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
                      <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                        {a.title}
                      </h3>
                      <p className="text-sm sm:text-base text-foreground/80 mt-0.5">
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
                      </p>
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent shrink-0 mt-1">
                      {a.start} {a.end ? `— ${a.end}` : ""}
                    </p>
                  </div>

                  <div className="mt-4 pb-4 border-b border-border/60" />

                  <div className="grid md:grid-cols-2 gap-6">
                    <ul className="space-y-2 text-foreground/85 leading-relaxed text-sm">
                      {a.bullets.map((b, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-accent mt-1.5 shrink-0">▪</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {a.image && (
                      <div className="relative w-full overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "4 / 3" }}>
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

        {/* Resume hint */}
        {paused && (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => setPaused(false)}
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-accent transition-colors"
            >
              ▶ Resume
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
