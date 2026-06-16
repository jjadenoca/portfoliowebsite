import { profile } from "@/lib/content";

export default function ResumeHero() {
  return (
    <section className="bg-bg pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Eyebrow */}
        <p className="eyebrow mb-4">Corporate Resume</p>

        {/* H1 */}
        <h1
          className="font-display text-text-strong mb-5"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          Data &amp; analytics background
        </h1>

        {/* Framing line */}
        <p className="text-muted text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
          Texas A&amp;M statistics graduate with ~2 years in data science and analytics
          across financial services — from Fortune 100 banks to mortgage intelligence leaders.
        </p>

        {/* Actions row */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={profile.resumeUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 shrink-0"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 0 1 .75.75v7.69l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0L5.72 10.03a.75.75 0 1 1 1.06-1.06L9.25 11.44V3.75A.75.75 0 0 1 10 3Zm-6.25 13a.75.75 0 0 1 .75-.75h11a.75.75 0 0 1 0 1.5h-11a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            Download résumé (PDF)
          </a>

          {/* Contact row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
            <a
              href={`mailto:${profile.email}`}
              className="link-underline text-muted hover:text-accent transition-colors"
            >
              {profile.email}
            </a>
            <span aria-hidden="true" className="text-border hidden sm:inline">·</span>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-muted hover:text-accent transition-colors"
            >
              LinkedIn
            </a>
            <span aria-hidden="true" className="text-border hidden sm:inline">·</span>
            <span>{profile.location}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
