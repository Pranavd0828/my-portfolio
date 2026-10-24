import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ProductApproach from "@/components/ProductApproach";
import Projects from "@/components/Projects";
import ConsumerWork from "@/components/ConsumerWork";
import Journey from "@/components/Journey";
import AboutMe from "@/components/AboutMe";
import ConnectSection from "@/components/ConnectSection";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <ProductApproach />
      <ConsumerWork />
      <Journey />
      <AboutMe />
      <ConnectSection />
    </main>
  );
}
