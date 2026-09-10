import Link from "next/link";
export default function AboutMe() {
  return (
    <section id="about" className="section-space shell about-grid">
      <div>
        <p className="eyebrow">04 / Perspective</p>
        <h2 className="section-heading mt-4">
          A quantitative foundation.
          <br />A builder’s curiosity.
        </h2>
        <div className="body-copy space-y-5 mt-6">
          <p>
            I started on the data side at Media.net in Mumbai. A master’s in
            Statistics at the University of Maryland deepened how I think about
            uncertainty, experiments, and the difference between a signal and a
            useful decision.
          </p>
          <p>
            Since then, I’ve worked on revenue workflows at LeanData and
            advertising, recommendation, AI, and infrastructure platforms at Rakuten. I like
            problems where the customer experience depends on getting the
            underlying system right.
          </p>
          <p>
            I also build independent prototypes to make product questions
            concrete. Some explore a live AI pipeline; others deliberately
            simulate the model so I can focus on the interaction. Each story
            makes that distinction clear.
          </p>
        </div>
        <Link href="/reading" className="text-link mt-5">
          Away from the roadmap: my reading shelf ↗
        </Link>
      </div>
      <aside className="education-panel">
        <p className="eyebrow">Education</p>
        <div>
          <h3>MS, Statistics</h3>
          <p>University of Maryland, College Park</p>
          <span>2019 – 2020 · Honors · 3.83 / 4.00</span>
        </div>
        <div>
          <h3>BE, Computer Science</h3>
          <p>University of Mumbai</p>
          <span>2013 – 2017 · 3.93 / 4.00</span>
        </div>
        <p className="education-note">
          Statistics informs the experiments.
          <br />
          Computer science informs the systems.
        </p>
      </aside>
    </section>
  );
}
