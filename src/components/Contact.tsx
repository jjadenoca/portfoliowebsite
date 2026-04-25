import Section from "./Section";
import { profile } from "@/lib/content";

const links = [
  { label: "Email", href: `mailto:${profile.email}`, value: profile.email },
  { label: "LinkedIn", href: profile.linkedin, value: "linkedin.com/in/jadenoca" },
  { label: "GitHub", href: profile.github, value: "github.com/jjadenoca" },
  { label: "Medium", href: profile.medium, value: `medium.com/@${profile.mediumUsername}` },
  { label: "Substack", href: profile.substack, value: "substack.com/@jadenoca" },
];

export default function Contact() {
  return (
    <Section id="contact" eyebrow="Contact" title="Let’s talk.">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <p className="text-base sm:text-lg leading-relaxed text-foreground/85 max-w-md">
          I’m always up for chatting about data science, analytics, SaaS, or
          interesting problems. Reach out anywhere below — I usually respond
          within a day.
        </p>
        <ul className="divide-y divide-border border-y border-border">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-6 py-4 hover:text-accent transition-colors"
              >
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground group-hover:text-accent transition-colors">
                  {l.label}
                </span>
                <span className="text-sm font-medium truncate">
                  {l.value} ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
