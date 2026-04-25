import Section from "./Section";
import { profile, skills } from "@/lib/content";

export default function About() {
  return (
    <Section id="about" eyebrow="About" title="A bit about me.">
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <p className="text-base sm:text-lg leading-relaxed text-foreground/85">
            {profile.longBio}
          </p>
        </div>
        <div className="space-y-6">
          <SkillGroup label="Languages" items={skills.languages} />
          <SkillGroup label="Python Stack" items={skills.python} />
          <SkillGroup label="Data & BI" items={skills.data} />
          <SkillGroup label="Tools" items={skills.tools} />
        </div>
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
