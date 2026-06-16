// Placeholder UGC reel cards — intentional, not broken.
// Real video content will be added in the /ugc route.

const PLACEHOLDER_CARDS = [
  {
    id: 1,
    tag: "@financefleap",
    platform: "Instagram Reels",
    gradient: "from-[#1A1A2E] via-[#16213E] to-[#0F3460]",
    accent: "#C8852A",
  },
  {
    id: 2,
    tag: "@investfleap",
    platform: "TikTok",
    gradient: "from-[#1f1c2c] via-[#2d2b55] to-[#1c1c3b]",
    accent: "#C8852A",
  },
  {
    id: 3,
    tag: "@createwithfleap",
    platform: "YouTube Shorts",
    gradient: "from-[#0d1117] via-[#161b22] to-[#21262d]",
    accent: "#C8852A",
  },
] as const;

export default function WorkTeaser() {
  return (
    <section className="bg-bg-alt py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <p className="eyebrow mb-4">SELECTED WORK</p>
          <h2
            className="font-display font-semibold text-text-strong"
            style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
          >
            Content that converts.
          </h2>
          <p className="text-muted mt-4 max-w-md mx-auto">
            Short-form videos built for real engagement — finance breakdowns, lifestyle storytelling,
            and brand integrations that feel native.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 mb-10">
          {PLACEHOLDER_CARDS.map((card) => (
            <div key={card.id} className="card card-lift reveal group cursor-pointer">
              {/* 9:16 aspect container */}
              <div
                className="relative w-full overflow-hidden rounded-2xl"
                style={{ aspectRatio: "9 / 16" }}
              >
                {/* Gradient bg */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${card.gradient}`}
                  aria-hidden="true"
                />

                {/* Subtle noise texture overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  aria-hidden="true"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                  }}
                />

                {/* Play triangle */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-90 transition-opacity duration-200"
                  aria-hidden="true"
                >
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: "52px",
                      height: "52px",
                      backgroundColor: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(4px)",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    {/* Triangle shape */}
                    <svg
                      width="18"
                      height="20"
                      viewBox="0 0 18 20"
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ marginLeft: "2px" }}
                    >
                      <path d="M0 0L18 10L0 20V0Z" />
                    </svg>
                  </div>
                </div>

                {/* Platform badge — top */}
                <div className="absolute top-3 left-3">
                  <span
                    className="font-sans text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: "rgba(200,133,42,0.85)",
                      color: "#1A1206",
                    }}
                  >
                    {card.platform}
                  </span>
                </div>

                {/* Handle — bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pt-12"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)"
                  }}
                >
                  <p className="font-sans font-semibold text-sm" style={{ color: "#F3EFE7" }}>
                    {card.tag}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center reveal">
          <a href="/ugc" className="btn-ghost px-8 py-3">
            View full UGC portfolio
          </a>
        </div>
      </div>
    </section>
  );
}
