// Instagram glyph — inline SVG, no dependency
function IconInstagram() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="w-5 h-5 shrink-0"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export type UgcAccountCardProps = {
  name: string;
  handle: string;
  url: string;
  blurb: string;
};

export default function UgcAccountCard({ name, handle, url, blurb }: UgcAccountCardProps) {
  return (
    <article className="card card-lift flex flex-col gap-5 p-7 sm:p-8 reveal">
      {/* Platform badge */}
      <div
        className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs font-semibold"
        style={{
          background: "color-mix(in oklch, var(--color-accent) 10%, var(--color-bg-alt))",
          color: "var(--color-accent)",
          border: "1px solid color-mix(in oklch, var(--color-accent) 25%, transparent)",
        }}
      >
        <IconInstagram />
        Instagram Reels
      </div>

      {/* Handle */}
      <div>
        <h3
          className="font-display text-text-strong leading-tight mb-1"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            letterSpacing: "-0.01em",
          }}
        >
          {handle}
        </h3>
        <p className="eyebrow text-xs">{name}</p>
      </div>

      {/* Blurb */}
      <p className="text-muted leading-relaxed flex-1">{blurb}</p>

      {/* CTA */}
      <div className="pt-1">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2"
          aria-label={`View ${handle} reels on Instagram`}
        >
          View Reels
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="w-4 h-4"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </article>
  );
}
