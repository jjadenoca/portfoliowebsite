import type { Metadata } from "next";
import { creator } from "@/lib/content";
import SocialLinks from "@/components/site/SocialLinks";

export const metadata: Metadata = {
  title: "Work with me | Jaden Oca (@jadeneoca)",
  description:
    "Partner with Jaden Oca (@jadeneoca) on a brand deal, or book a 1:1 coaching call to level up your content and AI workflows.",
};

const EMAIL = creator.contactEmail;

/* ── Icons ───────────────────────────────────────────────── */
function HandshakeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CallIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function WorkWithMePage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      <section>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-20 md:pt-28 pb-10">
          <h1
            className="font-display font-semibold text-text-strong mb-5"
            style={{ fontSize: "clamp(2.25rem, 5.5vw, 3.5rem)", lineHeight: 1.06, letterSpacing: "-0.03em" }}
          >
            Work with me.
          </h1>
          <p
            className="text-muted max-w-xl"
            style={{ fontSize: "1.0625rem", lineHeight: 1.7 }}
          >
            Two ways in: a brand partnership, or a 1:1 call. Whichever fits, you&apos;ll
            hear back from me directly.
          </p>
        </div>
      </section>

      {/* Two funnels */}
      <section className="pb-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ── Brand deal ── */}
            <article className="card p-8 md:p-10 flex flex-col gap-6">
              <div className="text-accent">
                <HandshakeIcon />
              </div>

              <div className="flex flex-col gap-3">
                <h2
                  className="font-display font-semibold text-text-strong"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 1.9rem)", letterSpacing: "-0.02em" }}
                >
                  Brand deal
                </h2>
                <p className="text-muted" style={{ fontSize: "1rem", lineHeight: 1.7 }}>
                  Paid partnerships, gifted collabs, and long-term ambassador work.
                  I make short-form content on decision making that people actually stop
                  to watch. The media kit has my reach, rates, and past work.
                </p>
              </div>

              {/* Past partners */}
              <div className="flex flex-col gap-2">
                <p className="text-muted" style={{ fontSize: "0.8125rem" }}>
                  Past partners
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {creator.brands.map((b) => (
                    <span
                      key={b.name}
                      className="font-display text-text-strong"
                      style={{ fontSize: "0.9375rem", fontWeight: 500 }}
                    >
                      {b.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mt-auto pt-2">
                <a
                  href={creator.mediaKitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  View media kit
                </a>
                <a href={`mailto:${EMAIL}`} className="btn-ghost">
                  Email me
                </a>
              </div>
            </article>

            {/* ── 1:1 coaching call ── */}
            <article className="card card-lift reveal p-8 md:p-10 flex flex-col gap-6">
              <div className="text-accent">
                <CallIcon />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2
                    className="font-display font-semibold text-text-strong"
                    style={{ fontSize: "clamp(1.5rem, 3vw, 1.9rem)", letterSpacing: "-0.02em" }}
                  >
                    1:1 coaching call
                  </h2>
                  <span className="stat-num text-accent" style={{ fontSize: "1.25rem" }}>
                    {creator.coachingRate}
                  </span>
                </div>
                <p className="text-muted" style={{ fontSize: "1rem", lineHeight: 1.7 }}>
                  A focused hour, one-on-one. Bring your questions on growing short-form
                  content, building an audience, or wiring up AI workflows to ship faster.
                  I studied stats, spent a year at Capital One, and left to bet on myself,
                  so I&apos;ll give it to you straight.
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 mt-auto pt-2">
                <a
                  href={creator.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Book a call
                </a>
                <a href={`mailto:${EMAIL}`} className="btn-ghost">
                  Ask a question
                </a>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* Closing band */}
      <section className="dark-section mt-16 md:mt-24 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col items-center text-center gap-6">
          <h2
            className="font-display font-semibold text-on-navy"
            style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            Still deciding? Email me.
          </h2>
          <a
            href={`mailto:${EMAIL}`}
            className="btn-primary px-8 py-3 text-base"
          >
            {EMAIL}
          </a>
          <SocialLinks variant="navy" />
        </div>
      </section>
    </main>
  );
}
