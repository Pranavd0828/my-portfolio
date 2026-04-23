import Link from 'next/link';
import type { Metadata } from 'next';
import { caseStudies } from '@/content/caseStudies';

export const metadata: Metadata = {
  title: 'Work · Pranav Deo',
  description:
    'Deep case studies: a PM hands-on with GenAI, from problem framing to prototype to shipped learnings.',
};

export default function WorkIndex() {
  return (
    <main className="relative w-full min-h-screen px-6 py-24 md:py-32">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/#prototypes"
          className="text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          ← Back
        </Link>

        <header className="mt-12 mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">
            /work · case studies
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-6">
            Hands-on product prototyping.
          </h1>
          <p className="font-serif text-base md:text-lg text-white/60 leading-relaxed max-w-2xl">
            A PM who builds. Each of these is a real prototype: framed, shipped, and
            pressure-tested against current GenAI models, to find the seam where a feature stops
            being a demo and starts being a product.
          </p>
        </header>

        <ul className="space-y-px">
          {caseStudies.map((cs) => (
            <li key={cs.slug} className="border-t border-white/10 last:border-b">
              <Link
                href={`/work/${cs.slug}`}
                className="group block py-10 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-baseline justify-between gap-6 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                    {cs.category}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                    {cs.timeframe}
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-white/90 group-hover:text-white transition-colors mb-3">
                  {cs.title}
                </h2>
                <p className="font-serif text-sm md:text-base text-white/50 leading-relaxed max-w-2xl">
                  {cs.tagline}
                </p>
                <div className="mt-6 flex items-center text-[10px] font-mono uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                  Read case study
                  <svg
                    className="w-3 h-3 ml-2 opacity-50 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
