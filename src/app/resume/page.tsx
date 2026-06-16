import type { Metadata } from "next";
import { profile } from "@/lib/content";
import ResumeHero from "@/components/site/ResumeHero";
import ExperienceList from "@/components/site/ExperienceList";
import ProjectsList from "@/components/site/ProjectsList";
import ActivitiesList from "@/components/site/ActivitiesList";
import EducationBlock from "@/components/site/EducationBlock";

export const metadata: Metadata = {
  title: "Corporate Résumé — Jaden Oca",
  description:
    "Statistics grad with ~2 years in data science & analytics across financial services.",
};

function SectionHeader({
  eyebrow,
  heading,
}: {
  eyebrow: string;
  heading: string;
}) {
  return (
    <div className="mb-8">
      <p className="eyebrow mb-2">{eyebrow}</p>
      <h2
        className="font-display text-text-strong"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
        }}
      >
        {heading}
      </h2>
    </div>
  );
}

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      <ResumeHero />

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Content column */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-24 space-y-20 md:space-y-28">

        {/* Experience */}
        <section aria-labelledby="exp-heading">
          <SectionHeader eyebrow="Work history" heading="Experience" />
          <ExperienceList />
        </section>

        {/* Projects */}
        <section aria-labelledby="projects-heading">
          <SectionHeader eyebrow="Selected work" heading="Projects" />
          <ProjectsList />
        </section>

        {/* Activities */}
        <section aria-labelledby="activities-heading">
          <SectionHeader eyebrow="Leadership & research" heading="Activities" />
          <ActivitiesList />
        </section>

        {/* Education & Skills */}
        <section aria-labelledby="edu-heading">
          <SectionHeader eyebrow="Education, honors & skills" heading="Education &amp; Skills" />
          <EducationBlock />
        </section>

        {/* Closing CTA */}
        <div className="dark-section rounded-2xl px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p
              className="font-display text-on-navy text-xl font-semibold mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Want the full picture?
            </p>
            <p className="text-on-navy-muted text-sm">
              Download the one-page PDF or reach out directly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href={profile.resumeUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Download PDF
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="btn-ghost"
              style={{ color: "var(--color-on-navy)", borderColor: "var(--color-navy-border)" }}
            >
              Get in touch
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
