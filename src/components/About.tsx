import Section from "./Section";
import { skills } from "@/lib/content";

export default function About() {
  return (
    <Section id="about" eyebrow="Skills" title="Tools I work with.">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <SkillGroup label="Languages" items={skills.languages} />
        <SkillGroup label="Python Stack" items={skills.python} />
        <SkillGroup label="Data & BI" items={skills.data} />
        <SkillGroup label="Tools" items={skills.tools} />
      </div>
    </Section>
  );
}

function SkillGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => (
          <span
            key={s}
            className="text-xs font-medium px-2.5 py-1 rounded-full bg-card border border-border"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
