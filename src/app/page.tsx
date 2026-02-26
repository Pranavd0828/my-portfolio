import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import BlogPreview from "@/components/BlogPreview";
import ConnectSection from "@/components/ConnectSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between overflow-hidden">
      <Hero />
      <Journey />
      <Projects />
      <Education />
      <BlogPreview />
      <ConnectSection />
    </main>
  );
}
