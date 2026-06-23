const REELS = [
  { shortcode: "DSbMSBIjwbM" },
  { shortcode: "DSgI3Zuj1oO" },
  { shortcode: "DXnbNJLjbiE" },
];

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
            Content that makes you rethink
          </h2>
        </div>

        {/* Instagram reel embeds */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 mb-10">
          {REELS.map((reel) => (
            <div key={reel.shortcode} className="reveal">
              <div className="relative w-full overflow-hidden rounded-2xl bg-bg border border-border">
                <iframe
                  src={`https://www.instagram.com/reel/${reel.shortcode}/embed/`}
                  style={{ display: "block", width: "100%", height: "720px", border: 0 }}
                  scrolling="no"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Instagram Reel"
                />
                {/* White overlay matches the embed's background — covers "Add a comment" row at the bottom */}
                <div
                  className="absolute bottom-0 inset-x-0 pointer-events-none"
                  style={{ height: "58px", background: "#ffffff" }}
                />
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
