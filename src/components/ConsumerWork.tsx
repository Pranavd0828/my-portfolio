import Link from 'next/link'
import { caseStudies } from '@/content/caseStudies'

const questions: Record<
  string,
  { question: string; decision: string; lens: string }
> = {
  'whatsapp-catch-up': {
    question: 'Eighteen minutes of voice notes. What needs your attention?',
    decision:
      'A catch-up layer that lets you inspect the source before choosing a reply.',
    lens: 'Attention & AI trust',
  },
  'gmail-commitment-radar': {
    question: 'Which promises are hiding in your inbox?',
    decision:
      'Surface commitments in context, with the original language still visible.',
    lens: 'Intent & follow-through',
  },
  'whatsapp-regional-voice': {
    question: 'Can message playback keep its regional character?',
    decision:
      'Explore dialect detection, transliteration, and regional voice delivery through an AI pipeline.',
    lens: 'Language & access',
  },
  'maps-meet-mode': {
    question: 'Where should we meet when everyone starts somewhere different?',
    decision:
      'Compare meeting places with an explicit tradeoff between travel time and fairness.',
    lens: 'Ranking & group decisions',
  },
  'rescue-offers': {
    question: 'Can a canceled order become someone else’s opportunity?',
    decision:
      'Explore nearby offers, a short reservation window, and a simulated checkout.',
    lens: 'Marketplace recovery',
  },
  'linkedin-messaging-formatting': {
    question: 'Why should a thoughtful message become a wall of text?',
    decision:
      'Bring lightweight formatting into the moment a professional message is written.',
    lens: 'Expression & usability',
  },
  'kindle-crew': {
    question: 'Could a small reading circle help you keep showing up?',
    decision:
      'Make reading progress and a shared daily ritual visible in a local prototype.',
    lens: 'Habits & social motivation',
  },
  'flappy-eagle': {
    question: 'How much experience can fit into one interaction?',
    decision:
      'A playable exploration of timing, feedback, and the urge to try again.',
    lens: 'Play & interaction craft',
  },
}

export default function ConsumerWork() {
  const stories = caseStudies.filter((s) => s.status !== 'Professional work')
  return (
    <section id="prototypes" className="consumer-section">
      <div className="shell section-space">
        <div className="section-top">
          <div>
            <p className="eyebrow">02 / Getting closer to the user</p>
            <h2 className="section-heading">
              Big systems start
              <br />
              with everyday friction.
            </h2>
          </div>
          <p className="body-copy">
            The same product questions show up in a crowded inbox, a canceled
            order, or a group trying to meet. I build independent prototypes to
            explore the experience directly—and make the tradeoffs tangible.
          </p>
        </div>
        <div className="consumer-intro">
          <span>08 independent explorations</span>
          <p>
            Open a prototype to try the interaction. Read its story for the
            product bet, technical approach, and what is simulated.
          </p>
        </div>
        <div className="consumer-grid">
          {stories.map((story, index) => {
            const item = questions[story.slug]
            return (
              <article className="consumer-card" key={story.slug}>
                <div className="consumer-card-top">
                  <span className="eyebrow">
                    {String(index + 1).padStart(2, '0')} / {item.lens}
                  </span>
                  <span aria-hidden="true">↗</span>
                </div>
                <h3>
                  <Link href={`/work/${story.slug}`}>{story.title}</Link>
                </h3>
                <p className="consumer-question">{item.question}</p>
                <p className="consumer-decision">{item.decision}</p>
                <div className="consumer-card-bottom">
                  <span className="status">{story.status}</span>
                  <div>
                    {story.demo && (
                      <a
                        className="text-link"
                        href={story.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Try prototype ↗
                        <span className="sr-only">
                          : {story.title} (opens in a new tab)
                        </span>
                      </a>
                    )}
                    <Link className="text-link" href={`/work/${story.slug}`}>
                      Product story →
                      <span className="sr-only">: {story.title}</span>
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        <p className="prototype-scope">
          Personal projects, independent of the products and companies
          referenced. Prototype interactions demonstrate concepts; they are not
          shipped features or measured business outcomes.
        </p>
      </div>
    </section>
  )
}
