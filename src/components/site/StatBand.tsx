"use client";

import { useEffect, useRef, useState } from "react";
import { creator } from "@/lib/content";

type Stat = {
  /** The numeric portion to animate. */
  numericValue: number;
  /** String to display after the number, e.g. "k+" or "+". */
  suffix: string;
  label: string;
};

const STATS: Stat[] = [
  {
    numericValue: 7,
    suffix: "k+",
    label: "Followers",
  },
  {
    numericValue: creator.platformCount,
    suffix: "",
    label: "Platforms",
  },
  {
    numericValue: creator.brandCount,
    suffix: "+",
    label: "Brand partners",
  },
];

function useCountUp(target: number, duration = 1200, started: boolean) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started) return;

    // Respect prefers-reduced-motion — jump to the final value (deferred so we
    // don't call setState synchronously inside the effect body).
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      rafRef.current = requestAnimationFrame(() => setCount(target));
      return () => {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      };
    }

    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [started, target, duration]);

  return count;
}

function StatItem({ stat, started }: { stat: Stat; started: boolean }) {
  const count = useCountUp(stat.numericValue, 1200, started);

  return (
    <div className="flex flex-col items-center gap-2 px-8 py-6">
      <span className="stat-num">
        {count}
        {stat.suffix}
      </span>
      <span
        className="text-on-navy-muted font-sans font-semibold text-xs tracking-widest uppercase"
      >
        {stat.label}
      </span>
    </div>
  );
}

export default function StatBand() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="dark-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
        <div className="flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-navy-border">
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
}
