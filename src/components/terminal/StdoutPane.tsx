import Image from "next/image";
import {
  experiences,
  projects,
  activities,
  education,
  awards,
  profile,
} from "@/lib/content";

const AI_TAGS = new Set([
  "Claude",
  "Gemini",
  "GPT-2",
  "BERT",
  "NLP",
  "LLM",
  "LLM Fine-tuning",
  "RAG",
  "Prompt Engineering",
]);

function CommandPrompt({ cmd }: { cmd: string }) {
  return (
    <p className="cmd-prompt mb-5">
      <span className="user">jaden</span>
      <span className="at">@portfolio</span>
      <span className="at">:</span>
      <span className="path">~</span>
      <span className="sigil">$ </span>
      <span className="text">{cmd}</span>
    </p>
  );
}

function SectionHeader({
  id,
  cmd,
  title,
}: {
  id: string;
  cmd: string;
  title: string;
}) {
  return (
    <header id={id} className="mb-6">
      <CommandPrompt cmd={cmd} />
      <h2 className="font-display text-2xl sm:text-4xl font-semibold tracking-[-0.02em] leading-tight">
        {title}
      </h2>
    </header>
  );
}

function ExperienceList() {
  return (
    <div className="space-y-4">
      {experiences.map((e, i) => (
        <article
          key={e.company + i}
          className="card-lift pane p-5 sm:p-6"
        >
          <div className="flex items-start gap-4">
            {e.logo && (
              <div className="shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded overflow-hidden flex items-center justify-center bg-background-elevated">
                <Image
                  src={e.logo}
                  alt={`${e.company} logo`}
                  width={96}
                  height={96}
                  className="h-full w-full object-contain p-1"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <h3 className="text-base sm:text-lg font-semibold leading-snug">
                  <span className="text-foreground">{e.role}</span>
                  <span className="text-muted-foreground font-normal"> · </span>
                  <span className="text-link">{e.company}</span>
                </h3>
                {e.end === "Present" ? (
                  <span className="badge badge-live">LIVE</span>
                ) : (
                  <span className="badge badge-done">✓ done</span>
                )}
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground mt-1">
                {e.location} · {e.start} → {e.end}
              </p>
            </div>
          </div>

          <p className="mt-3 text-[15px] text-muted-foreground">{e.blurb}</p>

          <ul className="bullet-list mt-4 text-[15.5px] text-foreground-soft">
            {e.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>

          {e.tech && e.tech.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-border-strong/40">
              {e.tech.map((t) => (
                <span
                  key={t}
                  className={"chip-mono" + (AI_TAGS.has(t) ? " is-ai" : "")}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function ProjectsGrid() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {projects.map((p) => (
        <article key={p.name} className="card-lift pane overflow-hidden">
          {p.image && (
            <div className="relative w-full aspect-[16/9] bg-background-elevated border-b border-border-strong/40">
              <Image
                src={p.image}
                alt={`${p.name} preview`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-3"
              />
            </div>
          )}
          <div className="p-5">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <h3 className="text-lg font-semibold leading-snug">
                {p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link hover:phosphor underline-offset-4 hover:underline"
                  >
                    {p.name} <span aria-hidden>↗</span>
                  </a>
                ) : (
                  <span className="text-foreground">{p.name}</span>
                )}
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-signal-dim">
                {p.start.split(" ")[1] ?? p.start}
              </span>
            </div>
            <p className="mt-1 text-[15px] text-muted-foreground">
              {p.tagline}
            </p>
            <ul className="bullet-list mt-4 text-[15px] text-foreground-soft">
              {p.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-border-strong/40">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className={"chip-mono" + (AI_TAGS.has(t) ? " is-ai" : "")}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ActivitiesList() {
  return (
    <div className="space-y-3">
      {activities.map((a) => (
        <article key={a.title + a.org} className="card-lift pane p-5">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h3 className="text-base font-semibold leading-snug">
              <span className="text-foreground">{a.title}</span>
              <span className="text-muted-foreground font-normal"> · </span>
              {a.href ? (
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:phosphor"
                >
                  {a.org} <span aria-hidden>↗</span>
                </a>
              ) : (
                <span className="text-link">{a.org}</span>
              )}
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-signal-dim">
              {a.start} → {a.end}
            </span>
          </div>
          <ul className="bullet-list mt-3 text-[15px] text-foreground-soft">
            {a.bullets.slice(0, 3).map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function EducationBlock() {
  return (
    <div className="space-y-5">
      <article className="card-lift pane p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {education.logo && (
            <div className="shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded overflow-hidden flex items-center justify-center bg-background-elevated">
              <Image
                src={education.logo}
                alt={`${education.school} logo`}
                width={96}
                height={96}
                className="h-full w-full object-contain p-1"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <h3 className="text-base sm:text-lg font-semibold">
                {education.school}
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-signal-dim">
                graduated {education.graduation}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {education.location}
            </p>
            <p className="mt-3 text-foreground-soft">{education.degree}</p>
            <p className="text-sm text-muted-foreground">{education.minors}</p>
          </div>
        </div>
      </article>
      <div>
        <p className="cmd-prompt mb-3">
          <span className="user">›</span>{" "}
          <span className="text">awards</span>
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {awards.map((a) => (
            <li
              key={a}
              className="card-lift pane px-3 py-2 flex items-center gap-2 whitespace-nowrap text-xs"
            >
              <span aria-hidden className="text-signal">★</span>
              <span className="truncate text-foreground-soft">{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ContactBlock() {
  const links = [
    { label: "email", href: `mailto:${profile.email}`, value: profile.email },
    { label: "linkedin", href: profile.linkedin, value: "linkedin.com/in/jadenoca" },
    { label: "github", href: profile.github, value: "github.com/jjadenoca" },
    { label: "medium", href: profile.medium, value: "medium.com/@jadenesoca" },
    { label: "substack", href: profile.substack, value: "substack.com/@jadenoca" },
  ];
  return (
    <div className="pane divide-y divide-border-strong/40">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target={l.href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-signal/[0.04] transition-colors group"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal-dim group-hover:text-signal transition-colors min-w-[80px]">
            {l.label}
          </span>
          <span className="text-foreground-soft group-hover:text-link truncate flex-1 text-right">
            {l.value}
          </span>
          <span className="text-muted-foreground group-hover:text-link" aria-hidden>↗</span>
        </a>
      ))}
    </div>
  );
}

export default function StdoutPane() {
  return (
    <div className="px-4 sm:px-8 pb-20 space-y-16 sm:space-y-20">
      <section>
        <SectionHeader
          id="experience"
          cmd="cat experience.log"
          title="Where I've worked."
        />
        <ExperienceList />
      </section>

      <section>
        <SectionHeader
          id="projects"
          cmd="ls -la ./projects/"
          title="Things I've built."
        />
        <ProjectsGrid />
      </section>

      <section>
        <SectionHeader
          id="activities"
          cmd="cat ./activities.log"
          title="Beyond work."
        />
        <ActivitiesList />
      </section>

      <section>
        <SectionHeader
          id="education"
          cmd="cat ./education.md"
          title="School & societies."
        />
        <EducationBlock />
      </section>

      <section>
        <SectionHeader
          id="contact"
          cmd="cat ./contact.txt"
          title="Let's talk."
        />
        <ContactBlock />
      </section>

      <div className="pt-8 border-t border-border-strong/30">
        <p className="cmd-prompt">
          <span className="user">jaden</span>
          <span className="at">@portfolio</span>
          <span className="at">:</span>
          <span className="path">~</span>
          <span className="sigil">$ </span>
          <span className="cursor-block" />
        </p>
      </div>
    </div>
  );
}
