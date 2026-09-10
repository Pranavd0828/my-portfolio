import ReadingList from "@/components/ReadingList";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Reading",
  description: "A reading shelf of science fiction, psychology, and mysteries.",
  alternates: { canonical: "/reading" },
};
export default function ReadingPage() {
  return (
    <main>
      <ReadingList />
    </main>
  );
}
