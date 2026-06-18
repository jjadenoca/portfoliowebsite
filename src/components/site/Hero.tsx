import Image from "next/image";
import { creator } from "@/lib/content";
import SocialLinks from "@/components/site/SocialLinks";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg min-h-[88vh] flex items-center">
      {/* Glow elements */}
      <div
        className="hero-glow"
        style={{ width: "600px", height: "600px", top: "-100px", left: "5%", opacity: 0.6 }}
        aria-hidden="true"
      />
      <div
        className="hero-glow"
        style={{
          width: "400px",
          height: "400px",
          bottom: "-60px",
          right: "8%",
          opacity: 0.35,
          animationDelay: "10s",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 py-20 md:py-28">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16 lg:gap-20">
          {/* Text column */}
          <div className="flex-1 text-center md:text-left">
            {/* Eyebrow */}
            <p className="eyebrow mb-5 reveal">AI · DECISION MAKING · UGC</p>

            {/* Name */}
            <h1
              className="font-display font-semibold text-text-strong mb-3 reveal"
              style={{
                fontSize: "clamp(3rem, 8vw, 6rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              {creator.name}
            </h1>

            {/* Handle */}
            <p
              className="font-display text-accent mb-6 reveal"
              style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontStyle: "italic" }}
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
              followers across {creator.platformCount} platforms.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8 reveal">
              <a href={`mailto:${creator.contactEmail}`} className="btn-primary px-7 py-3 text-base">
                Work with me
              </a>
              <a href="/ugc" className="btn-ghost px-7 py-3 text-base">
                See my work
              </a>
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
                width: "clamp(220px, 36vw, 380px)",
                height: "clamp(220px, 36vw, 380px)",
              }}
            >
              {/* Gold ring accent */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 70% 30%, color-mix(in oklch, var(--color-accent) 25%, transparent), transparent 65%)",
                  transform: "scale(1.08)",
                }}
              />
              <Image
                src="/headshot.jpeg"
                alt="Jaden Oca"
                fill
                sizes="(max-width: 768px) 220px, 380px"
                priority
                className="object-cover rounded-full"
                style={{
                  border: "3px solid color-mix(in oklch, var(--color-accent) 50%, transparent)",
                  objectPosition: "40% center",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
