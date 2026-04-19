import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import AboutMe from "@/components/AboutMe";
import ReadingList from "@/components/ReadingList";
import ConnectSection from "@/components/ConnectSection";
import RevealFocus from "@/components/RevealFocus";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between overflow-hidden">
      <Hero />
      <RevealFocus>
        <Journey />
      </RevealFocus>
      <RevealFocus>
        <Projects />
      </RevealFocus>
      <RevealFocus>
        <Education />
      </RevealFocus>
      {/* Blog section hidden per feature flag requested */}
      <RevealFocus>
        <AboutMe />
      </RevealFocus>
      <RevealFocus>
        <ReadingList />
      </RevealFocus>
      <RevealFocus>
        <ConnectSection />
      </RevealFocus>
      
      <BackToTop />
    </main>
  );
}
