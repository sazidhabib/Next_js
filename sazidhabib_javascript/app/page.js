import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Tech from "@/components/Tech";
import Skills from "@/components/Skills";
import Works from "@/components/Works";
import Contact from "@/components/Contact";
import { StarsCanvas } from "@/components/canvas";

export default function Home() {
  return (
    <main className="relative z-0 bg-[#03030a] overflow-hidden">
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Navbar />
        <Hero />
      </div>
      <About />
      <Experience />
      <Tech />
      <Skills />
      <Works />
      <div className="relative z-0">
        <Contact />
        <StarsCanvas />
      </div>
    </main>
  );
}
