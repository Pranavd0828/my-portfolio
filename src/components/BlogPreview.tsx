import Link from 'next/link';
import MagneticButton from './MagneticButton';

const posts = [
    {
        slug: 'future-of-ai-agents',
        title: 'The Future of Autonomous AI Agents in AdTech',
        date: 'February 2026',
        category: 'Analysis'
    },
    {
        slug: 'designing-for-retention',
        title: 'Designing for Retention using Machine Learning Models',
        date: 'January 2026',
        category: 'Product'
    }
];

export default function BlogPreview() {
    return (
        <section className="w-full max-w-5xl mx-auto py-16 md:py-32 px-6 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-16">
                <h2 className="font-serif text-4xl md:text-5xl text-accent">Editorial</h2>
                <MagneticButton className="mt-6 md:mt-0 text-xs border-white/20 text-muted hover:text-accent hover:border-white/50">
                    View All Writings
                </MagneticButton>
            </div>

            <div className="flex flex-col">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-white/5 hover:border-white/20 transition-colors"
                    >
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                            <span className="text-xs font-mono text-muted uppercase tracking-widest min-w-[120px]">
                                {post.date}
                            </span>
                            <h3 className="font-sans text-xl md:text-2xl text-accent group-hover:text-white transition-colors">
                                {post.title}
                            </h3>
                        </div>
                        <span className="text-xs mt-4 md:mt-0 uppercase tracking-widest text-muted group-hover:text-accent transition-colors">
                            {post.category}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
