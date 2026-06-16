"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/lib/content";

const links = [
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#activities", label: "Activities" },
  { href: "/#contact", label: "Contact" },
  { href: "/ai-daily", label: "AI Daily" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
      <nav className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
        <ul className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          {links.map((l) => {
            const isActive =
              l.href.startsWith("/") &&
              !l.href.includes("#") &&
              pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={
                    isActive
                      ? "text-accent transition-colors"
                      : "hover:text-foreground transition-colors"
                  }
                  aria-current={isActive ? "page" : undefined}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium px-3.5 py-1.5 rounded-full border border-border hover:border-accent hover:text-accent transition-colors"
        >
          Resume ↗
        </a>
      </nav>
    </header>
  );
}
