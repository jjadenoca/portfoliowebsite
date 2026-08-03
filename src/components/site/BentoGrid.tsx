import Image from "next/image";
import Link from "next/link";
import { creator } from "@/lib/content";
import SocialLinks from "@/components/site/SocialLinks";
import GaltonBoard from "@/components/site/GaltonBoard";
import Timeline from "@/components/site/Timeline";

function IdentityTile() {
  return (
    <div className="tile reveal md:col-span-7 p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 md:gap-8">
      {/* Portrait */}
      <div
        className="relative shrink-0"
        style={{ width: "clamp(130px, 16vw, 170px)", aspectRatio: "1 / 1" }}
      >
        <Image
          src="/headshot-circle.jpeg"
          alt="Jaden Oca"
          fill
          sizes="170px"
          priority
          className="object-cover rounded-full"
          style={{ border: "1px solid var(--color-border)" }}
        />
      </div>

      {/* Text */}
      <div className="text-center sm:text-left min-w-0">
        <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted shrink-0"
            aria-hidden="true"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-muted lowercase" style={{ fontSize: "0.8125rem" }}>
            new york city
          </span>
        </div>

        <h1
          className="font-display font-semibold text-text-strong mb-1"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
        >
          {creator.name}
        </h1>

        <p
          className="font-display text-accent mb-2"
          style={{ fontSize: "clamp(1.05rem, 2vw, 1.25rem)", fontStyle: "italic" }}
        >
          {creator.handle}
        </p>

        <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
          {creator.roleLine.text.split(creator.roleLine.link.text)[0]}
          <a
            href={creator.roleLine.link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-semibold text-text-strong"
          >
            {creator.roleLine.link.text}
          </a>
          {creator.roleLine.text.split(creator.roleLine.link.text)[1]}
        </p>

        <div className="flex items-center justify-center sm:justify-start gap-4">
          <Link href="/work-with-me" className="btn-primary text-sm py-2.5 px-5 whitespace-nowrap">
            work with me
          </Link>
          <SocialLinks variant="navy" />
        </div>
      </div>
    </div>
  );
}

function GaltonTile() {
  return (
    <div className="tile reveal md:col-span-5 md:row-span-2 p-5 md:p-6 flex flex-col min-h-[340px] md:min-h-0">
      <p className="eyebrow mb-1">the galton board</p>
      <div className="flex-1 min-h-0" style={{ minHeight: "220px" }}>
        <GaltonBoard />
      </div>
      <p className="text-muted mt-2" style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
        single events are chaos. enough of them make a curve. that&apos;s why i love stats.
      </p>
    </div>
  );
}

function QuoteTile() {
  return (
    <div className="tile reveal md:col-span-4 p-6 flex items-center">
      <p
        className="font-display text-text-strong lowercase"
        style={{ fontSize: "clamp(1.1rem, 1.9vw, 1.35rem)", lineHeight: 1.35, letterSpacing: "-0.01em" }}
      >
        i&apos;m in love with the intersection of people, numbers, and technology.
      </p>
    </div>
  );
}

function StatsTile() {
  const stats = [
    { value: creator.followers, label: "followers" },
    { value: String(creator.platformCount), label: "platforms" },
    { value: `${creator.brandCount}+`, label: "brand partners" },
  ];
  return (
    <div className="tile reveal md:col-span-3 p-6 flex flex-col justify-center gap-3">
      {stats.map((s) => (
        <div key={s.label} className="flex items-baseline gap-2.5">
          <span
            className="font-display font-semibold text-text-strong"
            style={{ fontSize: "1.5rem", lineHeight: 1 }}
          >
            {s.value}
          </span>
          <span className="eyebrow">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function BrandsTile() {
  return (
    <div className="tile reveal md:col-span-5 p-6 flex flex-col gap-4">
      <p className="eyebrow">worked with</p>
      <ul className="flex flex-col gap-3">
        {creator.brands.map((b) => (
          <li key={b.name} className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.logo}
              alt=""
              width={34}
              height={34}
              className="shrink-0 object-contain rounded-[9px]"
              style={{ border: "1px solid var(--color-border)" }}
            />
            <span
              className="font-display text-text lowercase"
              style={{ fontSize: "0.9375rem", fontWeight: 500 }}
            >
              {b.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CtaTile() {
  return (
    <div
      className="tile reveal md:col-span-12 p-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{
        background:
          "linear-gradient(120deg, rgba(91,140,255,0.14), rgba(255,255,255,0.05) 60%)",
      }}
    >
      <p
        className="font-display font-semibold text-text-strong lowercase"
        style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.5rem)", letterSpacing: "-0.02em" }}
      >
        work with me
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
        <a
          href={creator.mediaKitUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary whitespace-nowrap"
        >
          brand deals
        </a>
        <a
          href={creator.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost whitespace-nowrap"
        >
          1:1 consulting
        </a>
      </div>
    </div>
  );
}

export default function BentoGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <IdentityTile />
        <GaltonTile />
        <QuoteTile />
        <StatsTile />
        <CtaTile />
        <Timeline />
        <BrandsTile />
      </div>
    </section>
  );
}
