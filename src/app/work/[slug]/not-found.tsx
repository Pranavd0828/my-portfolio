import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="relative w-full min-h-screen px-6 py-24 md:py-32 flex items-center justify-center">
      <div className="max-w-xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">
          404 · Case study not found
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-6">
          This prototype does not exist yet.
        </h1>
        <p className="font-serif text-base md:text-lg text-white/60 leading-relaxed mb-12">
          The case study you followed may have been renamed or retired. Head back to the index to see what is live.
        </p>
        <Link
          href="/work"
          className="text-[10px] font-mono uppercase tracking-widest text-white/60 hover:text-white transition-colors"
        >
          ← All case studies
        </Link>
      </div>
    </main>
  );
}
