"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { creator } from "@/lib/content";

const NAV_LINKS = [
  { label: "Home",             href: "/" },
  { label: "Corporate Resume", href: "/resume" },
] as const;

export default function SiteNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border"
      style={{
        backgroundColor: "color-mix(in oklch, var(--color-bg) 88%, transparent)",
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

        {/* Nav tabs — hidden on very small screens, shown sm+ */}
        <nav className="hidden sm:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150",
                  active
                    ? "text-text-strong"
                    : "text-muted hover:text-text-strong",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side: mobile nav row + CTA */}
        <div className="flex items-center gap-3">
          {/* Mobile nav — shown only below sm */}
          <nav className="flex sm:hidden items-center gap-1" aria-label="Main navigation mobile">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "relative px-2 py-1 text-xs font-medium rounded transition-colors duration-150",
                    active
                      ? "text-text-strong"
                      : "text-muted hover:text-text-strong",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  {label === "Corporate Resume" ? "Resume" : label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <a
            href={`mailto:${creator.contactEmail}`}
            className="btn-primary text-sm py-2 px-4"
          >
            Work with me
          </a>
        </div>
      </div>
    </header>
  );
}
