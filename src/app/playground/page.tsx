import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Playground",
  description: "Small experiments in game physics and interaction design.",
  alternates: { canonical: "/playground" },
};
export default function Playground() {
  return (
    <main className="shell section-space">
      <p className="eyebrow">Off the roadmap / Playground</p>
      <h1 className="section-heading mt-5">A little room to play.</h1>
      <p className="body-copy mt-6 max-w-xl">
        Small experiments in input, timing, physics, and feedback. Built for the
        pleasure of figuring out how an interaction feels.
      </p>
      <div className="play-grid">
        <Link prefetch={false} href="/escape" className="play-card">
          <span className="eyebrow">01 / Physics</span>
          <h2>Escape Protocol</h2>
          <p>A runner built around gravity, timing, and a quick retry.</p>
        </Link>
        <Link prefetch={false} href="/rpsls" className="play-card">
          <span className="eyebrow">02 / Decisions</span>
          <h2>Rock, Paper, Scissors…</h2>
          <p>
            Five moves. One choice. An experiment in anticipation and reveal.
          </p>
        </Link>
      </div>
      <Link prefetch={false} href="/work/flappy-eagle" className="text-link mt-8">
        Also in the collection: Just One Flap
      </Link>
    </main>
  );
}
