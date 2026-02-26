import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import AboutMe from "@/components/AboutMe";
import ReadingList from "@/components/ReadingList";
import ConnectSection from "@/components/ConnectSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between overflow-hidden">
      <Hero />
      <Journey />
      <Projects />
      <Education />
      {/* Blog section hidden per feature flag requested */}
      <AboutMe />
      <ReadingList />
      <ConnectSection />
    </main>
  );
}
