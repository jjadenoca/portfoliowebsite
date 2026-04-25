import { ReactNode } from "react";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export default function Section({ id, eyebrow, title, children }: Props) {
  return (
    <section id={id} className="py-20 sm:py-24 border-t border-border">
      <div className="mb-10 sm:mb-14">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
          {eyebrow}
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
