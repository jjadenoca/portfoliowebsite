import Image from "next/image";
import Link from "next/link";
import { creator } from "@/lib/content";
import SocialLinks from "@/components/site/SocialLinks";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg min-h-[88vh] flex items-center">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 py-20 md:py-28">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16 lg:gap-20">
          {/* Text column */}
          <div className="flex-1 text-center md:text-left">
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
              className="font-display text-accent mb-6 reveal"
              style={{ fontSize: "clamp(1.2rem, 2.6vw, 1.5rem)", fontStyle: "italic" }}
            >
              {creator.handle}
            </p>

            {/* Value prop */}
            <p className="text-text text-lg md:text-xl max-w-lg mb-2 reveal" style={{ lineHeight: 1.6 }}>
              {creator.tagline}
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
                width: "clamp(240px, 38vw, 400px)",
                aspectRatio: "3 / 4",
              }}
            >
              <Image
                src="/headshot.jpeg"
                alt="Jaden Oca"
                fill
                sizes="(max-width: 768px) 240px, 400px"
                priority
                className="object-cover rounded-[24px]"
                style={{
                  border: "3px solid color-mix(in oklch, var(--color-accent) 45%, transparent)",
                  boxShadow: "0 24px 55px -20px color-mix(in oklch, var(--color-ink-navy) 30%, transparent)",
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
