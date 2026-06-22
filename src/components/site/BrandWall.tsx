"use client";

import { useState } from "react";
import { creator } from "@/lib/content";

export default function BrandWall() {
  // Duplicate the list for seamless infinite scroll
  const doubled = [...creator.brands, ...creator.brands];

  return (
    <section className="dark-section py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-10 text-center">
        <p className="eyebrow" style={{ color: "var(--color-on-navy-muted)" }}>
          TRUSTED BY BRANDS
        </p>
      </div>

      <div className="marquee" aria-label="Brand partners">
        <div className="marquee-track items-center">
          {doubled.map((brand, i) => (
            <BrandLogo key={`${brand.name}-${i}`} name={brand.name} logo={brand.logo} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandLogo({ name, logo }: { name: string; logo: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center gap-2 shrink-0"
      style={{ minWidth: "120px" }}
    >
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={name}
          width={48}
          height={48}
          className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 object-contain select-none"
          style={{ borderRadius: "10px" }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-on-navy font-display font-semibold text-lg opacity-70 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          {name}
        </span>
      )}
    </div>
  );
}
