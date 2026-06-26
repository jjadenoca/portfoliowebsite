const SERVICES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.75" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Brand Deals",
    cta: { label: "contact@jadenoca.com", href: "mailto:contact@jadenoca.com" },
    preferred: true,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "1:1 Session — $50/hr",
    description: "Email me to set up a time.",
    cta: { label: "contact@jadenoca.com", href: "mailto:contact@jadenoca.com" },
    preferred: false,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Collabs",
    description: "Shoot me an email and let's figure something out.",
    cta: { label: "contact@jadenoca.com", href: "mailto:contact@jadenoca.com" },
    preferred: false,
  },
];

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
            Want to work with me?
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <article
              key={s.title}
              className="card card-lift reveal p-8 flex flex-col gap-5 relative"
              style={s.preferred ? { boxShadow: "0 0 0 2px var(--color-accent)" } : undefined}
            >
              {/* Preferred badge */}
              {s.preferred && (
                <span
                  className="absolute top-4 right-4 font-sans text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{ background: "var(--color-accent)", color: "var(--color-accent-ink)" }}
                >
                  Preferred
                </span>
              )}

              {/* Gold accent top bar */}
              <div
                className="w-8 h-0.5 rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
                aria-hidden="true"
              />

              {/* Icon */}
              <div className="text-accent">{s.icon}</div>

              {/* Text */}
              <div className="flex flex-col gap-2 flex-1">
                <h3
                  className="font-display font-semibold text-text-strong"
                  style={{ fontSize: "1.1875rem" }}
                >
                  {s.title}
                </h3>
                {"description" in s && s.description && (
                  <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>
                    {s.description}
                  </p>
                )}
              </div>

              {/* CTA link */}
              <a
                href={s.cta.href}
                className="font-sans text-sm font-medium text-accent hover:underline mt-auto"
              >
                {s.cta.label} →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
