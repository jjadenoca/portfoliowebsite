"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Delay in ms before fade-in starts after intersection */
  delay?: number;
  /** Pixels to translate from (default 16) */
  offset?: number;
  /** Threshold of intersection observer (default 0.12) */
  threshold?: number;
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  offset = 16,
  threshold = 0.12,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (shown) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, shown]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : `translateY(${offset}px)`,
        transition: `opacity 700ms cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms, transform 700ms cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`,
        willChange: shown ? undefined : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
