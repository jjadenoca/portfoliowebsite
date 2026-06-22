import type { Metadata } from "next";
import { creator } from "@/lib/content";
import UgcHero from "@/components/site/UgcHero";
import UgcAccountCard from "@/components/site/UgcAccountCard";
import BrandCollabGrid from "@/components/site/BrandCollabGrid";
import SocialLinks from "@/components/site/SocialLinks";

export const metadata: Metadata = {
  title: "UGC Portfolio | Jaden Oca (@jadeneoca)",
  description:
    "Jaden Oca (@jadeneoca) creates short-form content on stats, psychology, mindset & AI for brands on Instagram Reels. Worked with Monarch Money, Blossom Social, Higgsfield AI, Polymarket, and Finvest.",
};

export default function UgcPage() {
  return (
    <main className="flex flex-col flex-1">
      {/* ── Hero ── */}
      <UgcHero />

      {/* ── Divider ── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
        <hr style={{ borderColor: "var(--color-border)" }} />
      </div>

      {/* ── UGC Accounts ── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 md:mb-14">
            <p className="eyebrow mb-3">Channels</p>
            <h2
              className="font-display text-text-strong"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Two channels, one voice.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {creator.ugcAccounts.map((account) => (
              <UgcAccountCard
                key={account.handle}
                name={account.name}
                handle={account.handle}
                url={account.url}
                blurb={account.blurb}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Collabs ── */}
      <BrandCollabGrid />

      {/* ── CTA Band ── */}
      <section className="dark-section py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-xl">
            <p className="eyebrow mb-4" style={{ color: "var(--color-on-navy-muted)" }}>
              Let&apos;s work together
            </p>
            <h2
              className="font-display text-on-navy mb-5"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Ready to brief your next campaign?
            </h2>
            <p className="mb-8" style={{ color: "var(--color-on-navy-muted)", lineHeight: 1.7 }}>
              I&apos;m open to paid partnerships, gifted collabs, and long-term brand deals.
              Reach out and let&apos;s make something your audience actually watches.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
              <a
                href={`mailto:${creator.contactEmail}`}
                className="btn-primary"
              >
                Get in touch
              </a>
              <SocialLinks variant="navy" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
