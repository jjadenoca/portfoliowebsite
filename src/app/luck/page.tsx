import type { Metadata } from "next";
import LuckLab from "@/components/site/LuckLab";

export const metadata: Metadata = {
  title: "Luck Simulation | Jaden Oca (@jadeneoca)",
  description:
    "An interactive 3D simulation of increasing your surface area for luck — drag the field, pull the levers, and watch how density, diversification, skill, and volume reshape your odds.",
};

const ALSO_CHIPS = [
  "start earlier",
  "the unique 3-way intersection",
  "copy the best's inputs",
];

export default function LuckPage() {
  return (
    <main className="min-h-screen bg-bg">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6 md:py-8">
        {/* header */}
        <div className="reveal mb-6 md:mb-8 max-w-2xl flex flex-col gap-3">
          <h1
            className="font-display font-semibold"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)", letterSpacing: "-0.02em" }}
          >
            the luck field
          </h1>
          <p className="text-text" style={{ fontSize: "1.0625rem", lineHeight: 1.65 }}>
            luck isn&apos;t a black box, it&apos;s a formula that you can rig in your
            favor.
          </p>
        </div>

        <LuckLab />

        {/* the levers that don't fit on a slider */}
        <div className="tile reveal mt-4 flex flex-wrap items-center gap-4 px-6 py-5">
          <span className="eyebrow whitespace-nowrap">also folded into the model</span>
          <div className="flex flex-wrap gap-2">
            {ALSO_CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border bg-surface px-3 py-1.5 font-mono lowercase text-text"
                style={{ fontSize: "0.75rem" }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
