export default function Education() {
    return (
        <section className="w-full max-w-6xl mx-auto py-16 md:py-32 px-6">
            <div className="flex flex-col items-center text-center mb-16 max-w-4xl mx-auto">
                <h2 className="font-serif text-3xl leading-tight md:text-5xl lg:text-7xl md:leading-none text-accent mb-6">Academic Foundation</h2>
                <p className="font-serif text-sm md:text-base text-white/50 leading-relaxed">
                    A timeline of formal academic training, research contributions, and foundational excellence in computer science and quantitative analytics.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">

                <div className="flex flex-col p-8 md:p-12 border-[0.5px] border-white/10 opacity-80 hover:opacity-100 transition-opacity duration-1000">
                    <span className="text-xs font-mono text-muted uppercase tracking-widest mb-6">2019 - 2020</span>
                    <h3 className="font-serif text-2xl text-white mb-2">Master of Science, Statistics</h3>
                    <p className="font-serif text-sm text-white/50 leading-relaxed mb-4">University of Maryland, College Park</p>
                    <p className="font-serif text-sm text-white/70 mb-8">Contributed research to <span className="text-white font-medium">The Feeling Economy</span> (Ming-Hui Huang, Roland Rust), focused on AI&apos;s impact on customer experience, service strategy, and the rising value of emotional intelligence.</p>
                    <div className="mt-auto pt-8 border-t-[0.5px] border-white/10 text-xs font-mono uppercase tracking-widest text-muted">
                        Honors • GPA: 3.83
                    </div>
                </div>

                <div className="flex flex-col p-8 md:p-12 border-[0.5px] border-white/10 opacity-80 hover:opacity-100 transition-opacity duration-1000">
                    <span className="text-xs font-mono text-muted uppercase tracking-widest mb-6">2013 - 2017</span>
                    <h3 className="font-serif text-2xl text-white mb-2">Bachelor of Engineering, Computer Science</h3>
                    <p className="font-serif text-sm text-white/50 leading-relaxed mb-4">University of Mumbai, India</p>
                    <p className="font-serif text-sm text-white/70 mb-8">Consecutively ranked first in Applied Mathematics for five semesters.</p>
                    <div className="mt-auto pt-8 border-t-[0.5px] border-white/10 text-xs font-mono uppercase tracking-widest text-muted">
                        First Class Honors • GPA: 3.93
                    </div>
                </div>

            </div>
        </section>
    );
}
