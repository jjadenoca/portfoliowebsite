import { activities } from "@/lib/content";

export default function ActivitiesList() {
  return (
    <div className="space-y-6">
      {activities.map((act) => (
        <article key={`${act.title}-${act.org}-${act.start}`} className="card reveal p-6 md:p-8">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div>
              <h3
                className="font-display text-text-strong text-xl leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {act.title}
              </h3>
              <p className="text-text font-medium mt-0.5">
                {act.href ? (
                  <a
                    href={act.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline hover:text-accent transition-colors"
                  >
                    {act.org}
                  </a>
                ) : (
                  act.org
                )}
              </p>
            </div>

            <p className="text-muted text-sm whitespace-nowrap shrink-0">
              {act.start} – {act.end}
            </p>
          </div>

          {/* Bullets */}
          <ul className="space-y-2">
            {act.bullets.map((b, i) => (
              <li key={i} className="flex gap-3 text-text text-[15px] leading-relaxed">
                <span
                  aria-hidden="true"
                  className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
                {b}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
