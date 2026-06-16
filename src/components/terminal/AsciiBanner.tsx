import { profile } from "@/lib/content";

export default function AsciiBanner() {
  return (
    <div
      className="px-4 sm:px-8 pt-6 pb-10 boot-line"
      style={{ animationDelay: "520ms" }}
    >
      <div className="max-w-3xl space-y-5">
        <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
          {profile.name}.
        </h1>
        <p className="text-lg sm:text-xl text-foreground-soft font-light tracking-tight">
          {profile.title}{" "}
          <span className="text-muted-foreground">·</span>{" "}
          {profile.location}
        </p>
        <p className="text-[17px] sm:text-lg text-foreground-soft leading-[1.7] max-w-2xl">
          {profile.bio}
        </p>
        <p className="cmd-prompt mt-4">
          <span className="text-signal">›</span>{" "}
          <span className="text">open to relocation</span>{" "}
          <span className="sigil">·</span>{" "}
          <span className="text-muted-foreground">response &lt; 24h</span>
        </p>
      </div>
    </div>
  );
}
