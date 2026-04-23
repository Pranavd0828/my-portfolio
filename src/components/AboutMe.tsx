export default function AboutMe() {
    return (
        <section id="about" className="w-full max-w-4xl mx-auto py-16 md:py-32 px-6">
            <h2 className="font-serif text-3xl leading-tight md:text-5xl md:leading-tight text-white mb-12 text-center">About</h2>

            <div className="flex flex-col gap-8 font-serif text-white/60 md:text-lg leading-relaxed text-left">
                <p>
                    Seven years of product work across three domains: programmatic advertising, B2B workflow automation, and AI-powered platform systems. The through-line across all three is a preference for platform thinking over feature thinking, and a habit of building the thing rather than just writing the spec.
                </p>
                <p>
                    The career started on the data side at Media.net in Mumbai, analyzing yield and monetization gaps across programmatic, video, and display inventory. That foundation led to a graduate degree in Statistics at the University of Maryland, which shifted the work from reporting on systems to designing them.
                </p>
                <p>
                    At LeanData in Santa Clara, that meant shipping a routing and entity intelligence engine for B2B revenue operations: a problem at the intersection of fragmented real-world data and business-critical workflow. At Rakuten in San Mateo, it has meant leading platform strategy for a unified campaign system and, more recently, defining the roadmap for a LangChain-based agentic AI tool that automates review and pre-launch workflows at scale, cutting rejection rates by 30% and launch delays by 30%.
                </p>
                <p>
                    The prototypes on this site are built alongside the day job. Each one starts from a real product gap, gets framed from a PM lens, and gets built far enough to pressure-test the core assumption against a current GenAI model. That practice is what keeps the product intuition honest.
                </p>
            </div>
        </section>
    );
}
