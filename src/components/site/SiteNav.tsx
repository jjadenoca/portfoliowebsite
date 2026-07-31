"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteNav() {
  const pathname = usePathname();
  const onWork = pathname.startsWith("/work-with-me");
  const onOverview = pathname === "/";

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-bg) 88%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 py-3.5">
        {/* Wordmark */}
        <Link
          href="/"
          className="shrink-0 font-display font-semibold text-lg text-text-strong tracking-tight hover:text-accent transition-colors duration-150"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Jaden Oca
        </Link>

        {/* Two tabs: Overview (text) + Work with me (gold pill CTA) */}
        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Main navigation">
          <Link
            href="/"
            className={[
              "relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150",
              onOverview ? "text-text-strong" : "text-muted hover:text-text-strong",
            ].join(" ")}
            aria-current={onOverview ? "page" : undefined}
          >
            Overview
            {onOverview && (
              <span
                aria-hidden="true"
                className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
            )}
          </Link>

          <Link
            href="/work-with-me"
            className="btn-primary text-sm py-2 px-4 whitespace-nowrap"
            aria-current={onWork ? "page" : undefined}
          >
            Work with me
          </Link>
        </nav>
      </div>
    </header>
  );
}
