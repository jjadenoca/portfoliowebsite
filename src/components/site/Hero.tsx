import Image from "next/image";
import Link from "next/link";
import { creator } from "@/lib/content";
import SocialLinks from "@/components/site/SocialLinks";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg min-h-[52vh] flex items-center">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 md:py-10">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16 lg:gap-20">
          {/* Text column */}
          <div className="flex-1 text-center md:text-left">
            {/* Location pin */}
            <div className="flex items-center justify-center md:justify-start gap-1.5 mb-4 reveal">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted shrink-0"
                aria-hidden="true"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-muted lowercase" style={{ fontSize: "0.875rem" }}>
                new york city
              </span>
            </div>

            {/* Name */}
            <h1
              className="font-display font-semibold text-text-strong mb-3 reveal"
              style={{
                fontSize: "clamp(2.75rem, 6.5vw, 4.75rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              {creator.name}
            </h1>

            {/* Handle */}
            <p
              className="font-display text-accent mb-2 reveal"
              style={{ fontSize: "clamp(1.2rem, 2.6vw, 1.5rem)", fontStyle: "italic" }}
            >
              {creator.handle}
            </p>

            {/* Role line */}
            <p className="text-muted mb-4 reveal" style={{ fontSize: "0.9375rem" }}>
              {creator.roleLine.text.split(creator.roleLine.link.text)[0]}
              <a
                href={creator.roleLine.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline font-semibold text-text-strong"
              >
                {creator.roleLine.link.text}
              </a>
              {creator.roleLine.text.split(creator.roleLine.link.text)[1]}
            </p>

            {/* Value prop */}
            <p className="text-text text-lg md:text-xl max-w-lg mb-2 reveal" style={{ lineHeight: 1.6 }}>
              i&apos;m in love with the intersection of people, numbers, and technology.
            </p>
            <p className="text-muted mb-8 reveal">
              <span
                className="font-display font-semibold text-accent"
                style={{ fontSize: "1.1rem" }}
              >
                {creator.followers}
              </span>{" "}
              followers across platforms.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8 reveal">
              <Link href="/work-with-me" className="btn-primary px-7 py-3 text-base">
                Work with me
              </Link>
            </div>

            {/* Social links */}
            <div className="flex justify-center md:justify-start reveal">
              <SocialLinks variant="light" />
            </div>
          </div>

          {/* Portrait column */}
          <div className="flex-shrink-0 reveal">
            <div
              className="relative"
              style={{
                width: "clamp(220px, 32vw, 340px)",
                aspectRatio: "1 / 1",
              }}
            >
              <Image
                src="/headshot-circle.jpeg"
                alt="Jaden Oca"
                fill
                sizes="(max-width: 768px) 220px, 340px"
                priority
                className="object-cover rounded-full"
                style={{
                  border: "1px solid var(--color-border)",
                  objectPosition: "center",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
