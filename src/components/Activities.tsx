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
  // The "loop period" — the offset distance between identical cards in
  // copy 1 vs copy 2. This is the correct modulo for seamless looping;
  // halfHeight (track.scrollHeight/2) is off by the track's outer
  // py-10 padding, which only exists once but gets averaged into half.
  const loopPeriodRef = useRef(0);
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
      // Compute true loop period from card centers if possible.
      const kids = track.children;
      const N = activities.length;
      if (kids.length >= 2 * N && N > 0) {
        const a = kids[0] as HTMLElement;
        const b = kids[N] as HTMLElement;
        const period =
          b.offsetTop + b.offsetHeight / 2 - (a.offsetTop + a.offsetHeight / 2);
        if (period > 0) loopPeriodRef.current = period;
      }
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
        const period = loopPeriodRef.current || halfHeightRef.current;
        if (offsetRef.current >= period) {
          offsetRef.current -= period;
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

    // The true "loop period" — the offset distance between the same card
    // in copy 1 vs copy 2. This is the amount we must shift by when
    // rebasing positions, NOT track.scrollHeight/2 (which is off by the
    // top/bottom padding because the track has py-10 only at its outer
    // edges, not between copies).
    const ACTIVITIES_LEN = centeredOffsets.length / 2;
    const loopPeriod =
      ACTIVITIES_LEN > 0
        ? centeredOffsets[ACTIVITIES_LEN] - centeredOffsets[0]
        : halfHeightRef.current;

    const cur = offsetRef.current;
    let liveCur = cur;

    // Find what would be the nearest card BEFORE any rebase, just to
    // decide whether we need one. If going up and that nearest card is
    // in the first copy of the list (idx < activities.length), shift
    // the visual position into the second copy so the eased animation
    // has room to travel backwards into a real (existing) card index.
    if (direction === -1) {
      let preNearest = 0;
      let preBest = Infinity;
      for (let i = 0; i < centeredOffsets.length; i++) {
        const d = Math.abs(cur - centeredOffsets[i]);
        if (d < preBest) {
          preBest = d;
          preNearest = i;
        }
      }
      // If the previous slot would be < 0 OR pointing to the same card
      // (no movement), we need to jump into copy 2 first.
      // We "skip 2" if past halfway through current card.
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

    // Decide target by "which card center are we approaching, in the
    // direction of travel?" with a tolerance equal to half the typical
    // gap between cards. This prevents the case where the auto-scroll
    // has just barely crossed a card's center and the user clicks down,
    // making us skip that card unfairly (variable-height cards make a
    // strict signedDelta-sign rule too aggressive).
    //
    // direction = 1 (DOWN): pick the smallest centered-offset that is
    //   strictly greater than (liveCur - tolerance). i.e. if a card's
    //   center is barely behind us, still treat it as the next target.
    // direction = -1 (UP): pick the largest centered-offset that is
    //   strictly less than (liveCur + tolerance).
    //
    // Tolerance = 25% of nearest card height — small enough that we still
    // skip cards we're solidly past, but large enough that "just crossed"
    // doesn't get unfairly skipped.
    // Find the card we are currently centered on (nearest center).
    let nearest = 0;
    let bestD = Infinity;
    for (let i = 0; i < centeredOffsets.length; i++) {
      const d = Math.abs(liveCur - centeredOffsets[i]);
      if (d < bestD) {
        bestD = d;
        nearest = i;
      }
    }

    // Always advance at least one card past the one we're currently on.
    // For the "incoming card already past halfway → skip" rule: if we
    // are already significantly past the nearest card's center in the
    // direction of travel, advance two instead of one.
    let targetIdx: number;
    const currentCardHeight = cards[nearest].offsetHeight;
    const skipThreshold = currentCardHeight * 0.5;
    const signedDelta = liveCur - centeredOffsets[nearest];
    if (direction === 1) {
      const skip = signedDelta > skipThreshold;
      targetIdx = nearest + (skip ? 2 : 1);
    } else {
      const skip = -signedDelta > skipThreshold;
      targetIdx = nearest - (skip ? 2 : 1);
    }
    targetIdx = Math.max(0, Math.min(centeredOffsets.length - 1, targetIdx));

    let next = centeredOffsets[targetIdx];

    // If the eased transition would land us inside the second copy of
    // the list (>= halfHeight), rebase BEFORE the animation: shift the
    // current visual position back by halfHeight and reduce the target
    // by the same amount. The user sees the same starting frame because
    // the loop is identical, then the eased animation lands directly on
    // a first-copy position — no post-animation readjust needed.
    // Pre-animation rebase using loopPeriod (NOT halfHeight — see comment
    // above). If the snap target is in copy 2, shift current and target
    // back by exactly one loop period so the animation lands in copy 1.
    if (targetIdx >= ACTIVITIES_LEN) {
      next -= loopPeriod;
      const rebasedCur = liveCur - loopPeriod;
      offsetRef.current = rebasedCur;
      track.style.transition = "none";
      track.style.transform = `translate3d(0, ${-rebasedCur}px, 0)`;
      // Force a layout flush so the browser commits the rebased frame
      // before we install the new transition.
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
