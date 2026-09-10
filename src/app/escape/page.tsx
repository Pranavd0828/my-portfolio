import EscapeGame from "@/components/EscapeGame";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Escape Protocol",
  description: "A small runner exploring timing and physics.",
  alternates: { canonical: "/escape" },
};
export default function EscapePage() {
  return (
    <main>
      <EscapeGame />
    </main>
  );
}
