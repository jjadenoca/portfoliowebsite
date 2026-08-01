import Hero from "@/components/site/Hero";
import StatBand from "@/components/site/StatBand";
import BrandWall from "@/components/site/BrandWall";
import Timeline from "@/components/site/Timeline";
import CtaFooter from "@/components/site/CtaFooter";

export default function Home() {
  return (
    <main>
      <Hero />
      <StatBand />
      <BrandWall />
      <Timeline />
      <CtaFooter />
    </main>
  );
}
