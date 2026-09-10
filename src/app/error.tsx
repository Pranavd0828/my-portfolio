"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="shell section-space">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="section-heading mt-6">Let’s try that again.</h1>
      <p className="body-copy mt-6">
        The page couldn’t load. You can retry or reach me directly.
      </p>
      <div className="hero-actions">
        <button onClick={reset} className="button button-primary">
          Try again
        </button>
        <Link href="/" className="button">
          Home
        </Link>
        <a href="mailto:deopranav2808.work@gmail.com" className="text-link">
          Email me ↗
        </a>
      </div>
    </main>
  );
}
