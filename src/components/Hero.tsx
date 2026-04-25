import Image from "next/image";
import { profile } from "@/lib/content";

export default function Hero() {
  return (
    <section
      id="top"
      className="pt-20 sm:pt-28 pb-16 sm:pb-20 grid md:grid-cols-[1fr_500px] gap-10 md:gap-14 items-center"
    >
      <div>
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {profile.location} · {profile.openTo}
        </div>
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05]">
          {profile.name}.
        </h1>
        <p className="mt-4 text-xl sm:text-2xl text-muted-foreground font-light">
          {profile.title}
        </p>
        <p className="mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-foreground/80">
          {profile.bio}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#experience"
            className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            See my work
            <span aria-hidden>→</span>
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 border border-border px-5 py-2.5 rounded-full text-sm font-medium hover:border-accent hover:text-accent transition-colors"
          >
            Get in touch
          </a>
        </div>
      </div>

      {profile.headshot && (
        <div className="md:justify-self-end order-first md:order-none">
          <div className="relative aspect-[4/5] w-72 sm:w-96 md:w-[500px] rounded-2xl overflow-hidden border border-border shadow-sm">
            <Image
              src={profile.headshot}
              alt={`${profile.name} portrait`}
              fill
              priority
              sizes="(max-width: 768px) 384px, 500px"
              className="object-cover"
              style={{ objectPosition: "45% center" }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
