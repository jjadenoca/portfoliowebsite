import { creator } from "@/lib/content";

const FOCUS_AREAS = [
  { icon: "▶", label: "UGC Video", sub: "Short-form vertical content built to convert" },
  { icon: "◆", label: "Stats & Psychology", sub: "Data-driven breakdowns that actually make people think" },
  { icon: "◉", label: "Mindset & AI", sub: "Personal growth, AI tools, and what's actually working" },
];

export default function AboutBlock() {
  return (
    <section className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left — bio */}
          <div className="reveal">
            <p
              className="font-serif-accent text-text-strong mb-6"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                lineHeight: 1.25,
                fontStyle: "italic",
              }}
            >
              Stats grad. One year corporate. Now betting on myself.
            </p>
            <p className="text-text mb-5" style={{ fontSize: "1.0625rem", lineHeight: 1.75 }}>
              {creator.bio}
            </p>
            <p className="text-muted" style={{ fontSize: "0.9375rem", lineHeight: 1.7 }}>
              Stats don&apos;t have to be scary. I combine a data-driven mindset with creator
              instincts to make content on psychology, mindset, and AI that actually reaches
              people and actually moves them.
            </p>
          </div>

          {/* Right — focus areas */}
          <div className="reveal">
            <p className="eyebrow mb-6">WHAT I FOCUS ON</p>
            <ul className="space-y-5">
              {FOCUS_AREAS.map(({ icon, label, sub }) => (
                <li
                  key={label}
                  className="flex items-start gap-4 pb-5 border-b border-border last:border-b-0 last:pb-0"
                >
                  <span
                    className="mt-1 shrink-0 font-display font-semibold text-accent"
                    style={{ fontSize: "1rem" }}
                    aria-hidden="true"
                  >
                    {icon}
                  </span>
                  <div>
                    <p
                      className="font-display font-semibold text-text-strong"
                      style={{ fontSize: "1.0625rem" }}
                    >
                      {label}
                    </p>
                    <p className="text-muted text-sm mt-0.5">{sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
