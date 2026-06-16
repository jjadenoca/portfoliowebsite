import { ReactNode } from "react";
import Reveal from "./Reveal";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export default function Section({ id, eyebrow, title, children }: Props) {
  return (
    <section id={id} className="relative py-24 sm:py-32">
      <div aria-hidden className="section-rule mb-16 sm:mb-20" />
      <Reveal className="mb-12 sm:mb-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal mb-4 font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-signal mr-2 align-middle" />
          {eyebrow}
        </p>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]">
          {title}
        </h2>
      </Reveal>
      <Reveal delay={120}>{children}</Reveal>
    </section>
  );
}
