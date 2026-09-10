import Link from 'next/link'
import { caseStudies, type CaseStudy } from '@/content/caseStudies'
import StoryFlow from './StoryFlow'
export function WorkCard({
  story,
  index,
}: {
  story: CaseStudy
  index: number
}) {
  return (
    <article className={`work-card tone-${story.accent}`}>
      <div className="work-card-visual">
        <div className="card-topline">
          <span className="eyebrow">0{index + 1} / Selected work</span>
          <span className="status">{story.status}</span>
        </div>
        <StoryFlow steps={story.flow} accent={story.accent} />
      </div>
      <div className="work-card-copy">
        <p className="eyebrow">{story.category}</p>
        <h3>
          <Link href={`/work/${story.slug}`}>{story.title}</Link>
        </h3>
        <p className="body-copy">{story.tagline}</p>
        <p className="card-takeaway">{story.takeaway}</p>
        <Link href={`/work/${story.slug}`} className="text-link">
          Read the story <span aria-hidden="true">↗</span>
          <span className="sr-only">: {story.title}</span>
        </Link>
      </div>
    </article>
  )
}
export default function Projects() {
  return (
    <section id="production" className="section-space shell selected-work">
      <div className="section-top">
        <div>
          <p className="eyebrow">01 / Building at scale</p>
          <h2 className="section-heading">
            Advertiser goals.
            <br />
            Customer value. Shared systems.
          </h2>
        </div>
        <p className="body-copy">
          At Rakuten, I connect campaign economics and customer incentives with
          recommendations, experimentation, and AI. These two stories show the
          product ownership and technical decisions behind the outcomes.
        </p>
      </div>
      <div className="featured-list">
        {caseStudies
          .filter((s) => s.status === 'Professional work')
          .map((story, index) => (
            <WorkCard key={story.slug} story={story} index={index} />
          ))}
      </div>
      <div className="expertise-grid">
        <article>
          <p className="eyebrow">Ads & marketplace economics</p>
          <h3>Align the incentives.</h3>
          <p>
            From revenue-per-click and cost-per-click modeling at Media.net to
            ROAS-driven recommendations at Rakuten: connect advertiser returns,
            budget pacing, and customer rewards.
          </p>
        </article>
        <article>
          <p className="eyebrow">Measurement & growth</p>
          <h3>Separate signal from noise.</h3>
          <p>
            Randomized experiments with CUPED, cohort targeting, and propensity
            models. My acquisition work spans a 32% new-buyer lift and $16M in
            incremental GMV across separate initiatives.
          </p>
        </article>
        <article>
          <p className="eyebrow">AI & infrastructure</p>
          <h3>Make the experience dependable.</h3>
          <p>
            Define orchestration, evaluation, APIs, and data requirements with
            engineering and data science. Balance workflow quality,
            recommendation speed, and operating cost.
          </p>
        </article>
      </div>
    </section>
  )
}
