import { creator } from "@/lib/content";

// Repeat the brand set enough times that a single "half" of the track
// (before the seamless -50% loop point) always spans wider than any
// realistic viewport — otherwise a short list leaves visible gaps on
// large screens instead of tiling edge-to-edge.
const REPEATS = 8;

export default function BrandWall() {
  const set = Array.from({ length: REPEATS }, () => creator.brands).flat();
  // Duplicate the full set once more for a seamless -50% marquee loop.
  const doubled = [...set, ...set];

  return (
    <section className="bg-bg py-6 md:py-7 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-4">
        <p className="eyebrow text-center">Worked with</p>
      </div>

      <div className="marquee" aria-label="Brand partners">
        <div className="marquee-track items-center">
          {doubled.map((brand, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${brand.name}-${i}`}
              src={brand.logo}
              alt={brand.name}
              width={56}
              height={56}
              className="shrink-0 object-contain rounded-[14px]"
              style={{ border: "1px solid var(--color-border)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
