import Link from "next/link";
import { creator } from "@/lib/content";
import SocialLinks from "@/components/site/SocialLinks";

export default function CtaFooter() {
  return (
    <footer className="dark-section py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col items-center text-center gap-8">
        {/* Eyebrow */}
        <p className="eyebrow" style={{ color: "var(--color-on-navy-muted)" }}>
          GET IN TOUCH
        </p>

        {/* Headline */}
        <h2
          className="font-display font-semibold text-on-navy"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            letterSpacing: "-0.025em",
            lineHeight: 1.08,
          }}
        >
          Let&apos;s build something.
        </h2>

        {/* Sub-line */}
        <p
          className="text-on-navy-muted max-w-sm"
          style={{ fontSize: "1.0625rem", lineHeight: 1.7 }}
        >
          Brand partnership or collaboration. I&apos;d love to hear from you.
        </p>

        {/* CTA button */}
        <Link href="/work-with-me" className="btn-primary px-9 py-3.5 text-base">
          Work with me
        </Link>

        {/* Social links */}
        <SocialLinks variant="navy" />

        {/* Divider */}
        <div
          className="w-full max-w-xs h-px"
          style={{ backgroundColor: "var(--color-navy-border)" }}
          aria-hidden="true"
        />

        {/* Copyright */}
        <p
          className="text-on-navy-muted font-sans"
          style={{ fontSize: "0.8125rem" }}
        >
          &copy; 2026 {creator.name} &middot; {creator.handle}
        </p>
      </div>
    </footer>
  );
}
