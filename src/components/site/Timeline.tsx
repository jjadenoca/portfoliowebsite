import { creator } from "@/lib/content";

type Item = (typeof creator.timeline)[number];

function Line({ text, link }: { text: string; link?: Item["link"] }) {
  if (!link || !text.includes(link.text)) return <>{text}</>;
  const [before, after] = text.split(link.text);
  return (
    <>
      {before}
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="link-underline font-semibold text-text-strong"
      >
        {link.text}
      </a>
      {after}
    </>
  );
}

export default function Timeline() {
  const items = creator.timeline;

  return (
    <div className="tile reveal md:col-span-7 md:row-span-2 p-6 md:p-7">
      <h2
        className="font-display font-semibold text-text-strong mb-5"
        style={{ fontSize: "clamp(1.35rem, 2.6vw, 1.75rem)", letterSpacing: "-0.02em" }}
      >
        How I got here
      </h2>

        <ol className="relative lowercase">
          {/* Vertical rail */}
          <span
            aria-hidden="true"
            className="absolute left-[6px] top-2 bottom-2 w-0.5"
            style={{ background: "var(--color-border)" }}
          />

          {items.map((item, i) => {
            const isNow = i === items.length - 1;
            return (
              <li key={item.year} className="relative pl-10 pb-4 last:pb-0 reveal">
                {/* Node */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[5px] rounded-full"
                  style={{
                    width: "13px",
                    height: "13px",
                    background: isNow ? "var(--color-text-strong)" : "var(--color-bg)",
                    border: "2px solid var(--color-text-strong)",
                    boxShadow: isNow
                      ? "0 0 0 4px color-mix(in srgb, var(--color-text-strong) 9%, transparent)"
                      : "none",
                  }}
                />

                {/* Year */}
                <div className="flex items-baseline gap-3 mb-1">
                  <span
                    className="text-text-strong"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {item.year}
                  </span>
                  {isNow && (
                    <span className="eyebrow" style={{ color: "var(--color-accent)" }}>
                      now
                    </span>
                  )}
                </div>

                {/* Events */}
                <ul className="space-y-0.5">
                  {item.items.map((t, j) => (
                    <li
                      key={j}
                      className="text-text flex items-baseline gap-2"
                      style={{ fontSize: "0.9375rem", lineHeight: 1.5 }}
                    >
                      <span aria-hidden="true" className="text-muted" style={{ fontSize: "0.7em" }}>
                        ●
                      </span>
                      <span>
                        <Line text={t} link={item.link} />
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
    </div>
  );
}
