import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Activities from "@/components/Activities";
import Writing from "@/components/Writing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-6 flex-1 w-full">
        <Hero />
        <Experience />
        <Projects />
        <Activities />
        <Writing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
