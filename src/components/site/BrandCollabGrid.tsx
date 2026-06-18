"use client";

import { creator } from "@/lib/content";
import type { Brand } from "@/lib/content";

function BrandLogoTile({ brand }: { brand: Brand }) {
  return (
    <div className="card-navy card-lift relative flex items-center justify-center p-6 sm:p-8 min-h-[96px] overflow-hidden reveal">
      {/* Text fallback — always in DOM, painted over by the image when it loads */}
      <span
        className="font-display font-semibold text-on-navy-muted text-center leading-tight pointer-events-none select-none text-sm"
        style={{ fontFamily: "var(--font-display)" }}
        aria-hidden="true"
      >
        {brand.name}
      </span>

      {/* Logo overlay — hides itself on 404 via onError, revealing the text beneath */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.logo}
        alt={brand.name}
        className="absolute inset-0 w-full h-full object-contain p-6 sm:p-8"
        style={{ filter: "brightness(0) invert(1) opacity(0.8)" }}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}

export default function BrandCollabGrid() {
  return (
    <section className="dark-section py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-12 md:mb-16 max-w-xl reveal">
          <p className="eyebrow mb-4" style={{ color: "var(--color-on-navy-muted)" }}>
            Brand Collaborations
          </p>
          <h2
            className="font-display text-on-navy mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Trusted by brands that move markets.
          </h2>
          <p style={{ color: "var(--color-on-navy-muted)", lineHeight: 1.7 }}>
            From fintech to AI tools, I&apos;ve partnered with brands building
            category-defining products, creating content that earns attention and drives action.
          </p>
        </div>

        {/* Brand grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {creator.brands.map((brand) => (
            <BrandLogoTile key={brand.name} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
