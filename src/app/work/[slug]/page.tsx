import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { caseStudies } from '@/content/caseStudies';

type Params = { slug: string };

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return {};
  return {
    title: `${cs.title} · Pranav Deo`,
    description: cs.tagline,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const idx = caseStudies.findIndex((c) => c.slug === slug);
  if (idx === -1) notFound();

  const cs = caseStudies[idx];
  const prev = idx > 0 ? caseStudies[idx - 1] : null;
  const next = idx < caseStudies.length - 1 ? caseStudies[idx + 1] : null;

  return (
    <main className="relative w-full min-h-screen px-6 py-24 md:py-32">
      <article className="max-w-3xl mx-auto">
        <Link
          href="/work"
          className="text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          ← All case studies
        </Link>

        <header className="mt-12 mb-10 border-b border-white/10 pb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">
            {cs.category}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-6">
            {cs.title}
          </h1>
          <p className="font-serif text-base md:text-lg text-white/60 leading-relaxed">
            {cs.tagline}
          </p>

          <dl className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-sm">
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">
                Role
              </dt>
              <dd className="font-serif text-white/70 leading-relaxed">{cs.role}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">
                Timeframe
              </dt>
              <dd className="font-serif text-white/70 leading-relaxed">{cs.timeframe}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">
                Stack
              </dt>
              <dd className="font-serif text-white/70 leading-relaxed">
                <ul className="space-y-1">
                  {cs.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </header>

        {/* Prominent prototype links: visible before the reader starts the case study */}
        {(cs.demo || cs.github) && (
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            {cs.demo && (
              <a
                href={cs.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-between px-6 py-5 border border-white/20 hover:border-white/50 bg-white/[0.03] hover:bg-white/[0.06] transition-all group"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Live prototype</p>
                  <p className="font-serif text-white/80 group-hover:text-white transition-colors text-sm truncate max-w-xs">
                    {cs.demo.replace('https://', '')}
                  </p>
                </div>
                <svg className="w-4 h-4 text-white/30 group-hover:text-white transition-colors flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            {cs.github && (
              <a
                href={cs.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-6 py-5 border border-white/10 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.04] transition-all group sm:w-48"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1">Source</p>
                  <p className="font-serif text-white/50 group-hover:text-white/80 transition-colors text-sm">GitHub</p>
                </div>
                <svg className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        )}

        <div className="space-y-16">
          {cs.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">
                {section.heading}
              </h2>
              <div className="space-y-5">
                {section.body.map((p, i) => (
                  <p
                    key={i}
                    className="font-serif text-base md:text-lg text-white/75 leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <section className="border-t border-white/10 pt-12">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">
              Outcomes
            </h2>
            <ul className="space-y-3">
              {cs.outcomes.map((o) => (
                <li
                  key={o}
                  className="font-serif text-base md:text-lg text-white/75 leading-relaxed pl-6 relative"
                >
                  <span className="absolute left-0 top-[0.6em] w-2 h-px bg-white/40" />
                  {o}
                </li>
              ))}
            </ul>
          </section>

          {/* Next / Prev navigation */}
          <section className="border-t border-white/10 pt-12">
            <div className="flex justify-between gap-6">
              {prev ? (
                <Link
                  href={`/work/${prev.slug}`}
                  className="group flex flex-col gap-1 max-w-[45%]"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">
                    ← Previous
                  </span>
                  <span className="font-serif text-white/60 group-hover:text-white transition-colors leading-snug">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/work/${next.slug}`}
                  className="group flex flex-col gap-1 text-right max-w-[45%] ml-auto"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">
                    Next →
                  </span>
                  <span className="font-serif text-white/60 group-hover:text-white transition-colors leading-snug">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </section>

          {/* Final CTA */}
          <section className="border-t border-white/5 pt-12 text-center">
            <Link
              href="/#connect"
              className="font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              Get in touch →
            </Link>
          </section>
        </div>
      </article>
    </main>
  );
}
