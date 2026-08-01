import { creator } from "@/lib/content";

const STATS = [
  { value: creator.followers, label: "Followers" },
  { value: String(creator.platformCount), label: "Platforms" },
  { value: `${creator.brandCount}+`, label: "Brand partners" },
];

export default function StatBand() {
  return (
    <section className="bg-bg border-y border-border">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 md:py-7">
        <div className="grid grid-cols-3">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={[
                "reveal flex flex-col items-center text-center gap-2 px-2",
                i > 0 ? "border-l border-border" : "",
              ].join(" ")}
            >
              <span className="stat-num">{s.value}</span>
              <span className="eyebrow">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
