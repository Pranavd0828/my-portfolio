import TiltCard from './TiltCard';

export default function Education() {
    return (
        <section className="w-full max-w-5xl mx-auto py-16 md:py-24 px-6 border-t border-white/5 flex flex-col items-center text-center">
            <h2 className="font-serif text-3xl leading-tight md:text-4xl lg:text-5xl md:leading-tight text-accent mb-12 md:mb-16">Academic Foundation</h2>

            <div className="flex flex-col md:flex-row gap-12 md:gap-32 w-full justify-center">

                <TiltCard className="flex flex-col items-center p-8 md:p-12 border border-white/5 bg-white/[0.01] rounded-2xl w-full">
                    <span className="text-sm font-mono text-muted uppercase tracking-widest mb-4">2019 - 2020</span>
                    <h3 className="font-serif text-2xl text-accent mb-2">Master of Science, Statistics</h3>
                    <p className="font-sans text-muted">University of Maryland, College Park</p>
                    <div className="mt-4 px-4 py-1 border border-white/10 rounded-full text-xs text-muted">
                        Honors • GPA: 3.83
                    </div>
                </TiltCard>

                <div className="hidden md:block w-[1px] bg-white/10 my-12" />

                <TiltCard className="flex flex-col items-center p-8 md:p-12 border border-white/5 bg-white/[0.01] rounded-2xl w-full">
                    <span className="text-sm font-mono text-muted uppercase tracking-widest mb-4">2013 - 2017</span>
                    <h3 className="font-serif text-2xl text-accent mb-2">Bachelor of Engineering, Computer Science</h3>
                    <p className="font-sans text-muted">University of Mumbai, India</p>
                    <div className="mt-4 px-4 py-1 border border-white/10 rounded-full text-xs text-muted">
                        GPA: 3.93
                    </div>
                </TiltCard>

            </div>
        </section>
    );
}
