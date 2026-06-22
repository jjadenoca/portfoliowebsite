"use client";

import { useState } from "react";
import { creator } from "@/lib/content";
import type { Brand } from "@/lib/content";

function BrandLogoTile({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="card-navy card-lift flex items-center justify-center p-6 sm:p-8 min-h-[96px] reveal">
      {failed ? (
        <span
          className="font-display font-semibold text-on-navy-muted text-center leading-tight text-sm"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {brand.name}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brand.logo}
          alt={brand.name}
          className="w-full h-full object-contain"
          style={{ filter: "brightness(0) invert(1) opacity(0.8)", maxHeight: "48px" }}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
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
