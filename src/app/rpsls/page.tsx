import RpslsGame from "@/components/RpslsGame";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Rock, Paper, Scissors, Lizard, Spock",
  description: "Five moves, one choice. A playable interaction experiment.",
  alternates: { canonical: "/rpsls" },
};
export default function RpslsPage() {
  return <RpslsGame />;
}
