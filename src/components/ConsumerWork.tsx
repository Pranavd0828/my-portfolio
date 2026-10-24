import Link from 'next/link'
import { caseStudies } from '@/content/caseStudies'
import styles from './PortfolioHome.module.css'
import ProductVideo from './ProductVideo'

const featured = [
  {
    slug: 'maps-meet-mode',
    video: 'meet-halfway',
    lens: 'Fairness & group decisions',
    question: 'What makes a meeting place fair for everyone?',
    decision: 'Make the burden of the longest trip part of the ranking.',
    alt: 'Google Maps Meet Halfway concept preview showing two locations and a fair meeting point.',
  },
  {
    slug: 'whatsapp-regional-voice',
    video: 'regional-voice',
    lens: 'Language & access',
    question: 'Can playback keep its regional character?',
    decision:
      'Explore dialect detection, transliteration, and regional voice delivery through an AI pipeline.',
    alt: 'WhatsApp Regional Voice concept preview showing a regional voice message in a CarPlay style interface.',
  },
  {
    slug: 'rescue-offers',
    video: 'rescue-radar',
    lens: 'Marketplace recovery',
    question: 'Could a canceled order become a useful nearby offer?',
    decision: 'Explore discovery, urgency, and a short reservation window.',
    alt: 'Rescue Radar prototype showing nearby food offers and simulated prices.',
  },
]

export default function ConsumerWork() {
  const stories = caseStudies.filter(
    (story) => story.status !== 'Professional work'
  )
  const selected = featured.flatMap((item) => {
    const story = stories.find((story) => story.slug === item.slug)
    return story ? [{ ...item, story }] : []
  })
  const others = stories.filter(
    (story) => !selected.some((item) => item.slug === story.slug)
  )
  return (
    <section
      id="prototypes"
      className={styles.prototypes}
      aria-labelledby="prototypes-title"
    >
      <div className={`${styles.section} shell`}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.kicker}>Built out of curiosity</p>
            <h2 id="prototypes-title" className={styles.heading}>
              Everyday friction.
              <br />
              Something worth exploring.
            </h2>
          </div>
          <div>
            <p className={styles.copy}>
              Outside work, I build around the small frustrations I notice in
              products I use. A working prototype helps me explore the
              interaction and make the tradeoffs concrete.
            </p>
            <p className={styles.prototypeCount}>
              {stories.length} independent prototypes
            </p>
          </div>
        </div>
        <div className={styles.prototypeGrid}>
          {selected.map(
            ({ story, video, lens, question, decision, alt }) => (
              <article className={styles.prototype} key={story.slug}>
                <div className={styles.preview}>
                  <div className={styles.previewTop}>
                    <span />
                    <span />
                    <span />
                    <p>{story.title}</p>
                  </div>
                  <ProductVideo
                    src={`/videos/${video}.mp4`}
                    title={alt}
                    poster={`/previews/${video}-poster.jpg`}
                    soundToggle={video === 'regional-voice'}
                  />
                </div>
                <div className={styles.prototypeCopy}>
                  <p className={styles.kicker}>{lens}</p>
                  <h3>
                    <Link prefetch={false} href={`/work/${story.slug}`}>
                      {question}
                    </Link>
                  </h3>
                  <p className={styles.copy}>{decision}</p>
                  {video === 'regional-voice' && <details className={styles.demoDescription}>
                    <summary>Read the video description</summary>
                    <p>A message from Rahul appears over a navigation-style interface: “Bhai, kaha pohcha?” The message asks where the recipient has reached. The preview demonstrates spoken playback from the notification. This is a concept recording, not a deployed driving interface.</p>
                  </details>}
                  <p className={styles.prototypeStatus}>
                    {story.status}
                    {story.demoNotice
                      ? '. Demo availability noted in the story.'
                      : ''}
                  </p>
                  <div className={styles.prototypeLinks}>
                    <Link
                      prefetch={false}
                      href={`/work/${story.slug}`}
                      className={styles.quietLink}
                    >
                      The product thinking
                      <span className="sr-only"> behind {story.title}</span>
                    </Link>
                    {story.demo && !story.demoNotice && (
                      <a
                        href={story.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.quietLink}
                      >
                        {story.demoLabel || "Try it"}
                        <span className="sr-only">
                          : {story.title} (opens in a new tab)
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            )
          )}
        </div>
        <details className={styles.morePrototypes}>
          <summary>
            <span>There is more on the workbench</span>
            <span>
              {others.length} more explorations
              <span className={styles.disclosureIcon} aria-hidden="true" />
            </span>
          </summary>
          <div className={styles.moreGrid}>
            {others.map((story) => (
              <article key={story.slug}>
                <p className={styles.kicker}>{story.category}</p>
                <h3>
                  <Link prefetch={false} href={`/work/${story.slug}`}>
                    {story.title}
                  </Link>
                </h3>
                <p className={styles.copy}>{story.tagline}</p>
                <p className={styles.prototypeStatus}>
                  {story.status}
                  {story.demoNotice
                    ? '. Demo availability noted in the story.'
                    : ''}
                </p>
                <div className={styles.prototypeLinks}>
                  <Link
                    prefetch={false}
                    className={styles.quietLink}
                    href={`/work/${story.slug}`}
                  >
                    Read the story
                    <span className="sr-only">: {story.title}</span>
                  </Link>
                  {story.demo && !story.demoNotice && (
                    <a
                      className={styles.quietLink}
                      href={story.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {story.demoLabel || "Try it"}
                      <span className="sr-only">
                        : {story.title} (opens in a new tab)
                      </span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </details>
        <p className={styles.prototypeNote}>
          Independent concepts, with sample data. Each story explains what
          works, what is simulated, and what I would evaluate next.
        </p>
      </div>
    </section>
  )
}
