const SERVICES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="3" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="1.75" />
        <path d="M9 18h2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M17 7l4 2.5L17 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "UGC Video",
    tagline: "Short-form vertical content built for brands.",
    description:
      "Authentic, platform-native Reels and TikToks that feel organic, not like ads. Scripted, filmed, and edited to convert.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.75" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Brand Partnerships",
    tagline: "Sponsored content that feels like storytelling.",
    description:
      "Integrated placements in stats, mindset, and AI content. Your product, my audience's trust, delivered naturally.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "AI & Decision Making Content",
    tagline: "Explainers that make people think differently.",
    description:
      "From cognitive biases to AI breakdowns, I translate complex ideas about how people think and decide into content that earns attention, builds trust, and keeps people coming back.",
  },
] as const;

export default function Services() {
  return (
    <section className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <p className="eyebrow mb-4">WHAT I OFFER</p>
          <h2
            className="font-display font-semibold text-text-strong"
            style={{ fontSize: "clamp(1.875rem, 4.5vw, 3rem)" }}
          >
            How we can work together.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <article key={s.title} className="card card-lift reveal p-8 flex flex-col gap-5">
              {/* Gold accent top bar */}
              <div
                className="w-8 h-0.5 rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
                aria-hidden="true"
              />

              {/* Icon */}
              <div className="text-accent">{s.icon}</div>

              {/* Text */}
              <div className="flex flex-col gap-2">
                <h3
                  className="font-display font-semibold text-text-strong"
                  style={{ fontSize: "1.1875rem" }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-accent font-sans font-medium"
                  style={{ fontSize: "0.875rem" }}
                >
                  {s.tagline}
                </p>
                <p className="text-muted text-sm mt-1" style={{ lineHeight: 1.7 }}>
                  {s.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
