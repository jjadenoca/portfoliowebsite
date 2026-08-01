import { creator } from "@/lib/content";

export default function BrandWall() {
  // Duplicate once for a seamless -50% marquee loop.
  const doubled = [...creator.brands, ...creator.brands];

  return (
    <section className="bg-bg py-6 md:py-7 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-4">
        <p className="eyebrow text-center">Worked with</p>
      </div>

      <div className="marquee" aria-label="Brand partners">
        <div className="marquee-track items-center">
          {doubled.map((brand, i) => (
            <span
              key={`${brand.name}-${i}`}
              className="font-display text-muted whitespace-nowrap"
              style={{ fontSize: "1.5rem", fontWeight: 500 }}
            >
              {brand.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
