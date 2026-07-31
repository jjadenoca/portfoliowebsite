import Hero from "@/components/site/Hero";
import StatBand from "@/components/site/StatBand";
import BrandWall from "@/components/site/BrandWall";
import AboutBlock from "@/components/site/AboutBlock";
import WorkTeaser from "@/components/site/WorkTeaser";
import CtaFooter from "@/components/site/CtaFooter";

export default function Home() {
  return (
    <main>
      <Hero />
      <StatBand />
      <BrandWall />
      <AboutBlock />
      <WorkTeaser />
      <CtaFooter />
    </main>
  );
}
