import Link from 'next/link'
import styles from './PortfolioHome.module.css'

const selectedWork = [
  {
    slug: 'rakuten-programmatic-loyalty',
    category: 'Advertising & marketplaces',
    role: 'Senior Product Manager',
    title: 'Programmatic Loyalty: from advertiser goals to customer rewards.',
    description:
      'I took Programmatic Loyalty from idea to launch, connecting advertiser budgets and return targets with commission recommendations, campaign pacing, and customer rewards.',
    ownership:
      'Problem discovery, MVP definition, advertiser workflow, cross-functional alignment, and phased delivery.',
    metric: '$500M+',
    label: 'Annual product revenue',
    detail: 'Programmatic Loyalty, the product I launched',
    topics: [
      'Advertiser experience',
      'Recommendations',
      'Marketplace economics',
    ],
  },
  {
    slug: 'rakuten-ai-platform',
    category: 'AI & platform leadership',
    role: 'Staff Product Manager',
    title: 'Making shared decisions useful. Making AI workflows reviewable.',
    description:
      'My current scope brings together shared recommendation systems, multi-agent creative workflows, and cloud and data infrastructure. Each initiative has its own product requirements and success measures.',
    ownership:
      'Product architecture, workflow definition, evaluation, platform contracts, and infrastructure priorities.',
    metric: 'Three disciplines',
    label: 'Shared decisioning, creative workflows, infrastructure',
    detail: 'Separate initiatives with distinct product requirements',
    topics: ['AI workflows', 'Shared decisioning', 'Infrastructure'],
  },
]

export default function Projects() {
  return (
    <section
      id="production"
      className={`${styles.section} shell`}
      aria-labelledby="work-title"
    >
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.kicker}>Selected professional work</p>
          <h2 id="work-title" className={styles.heading}>
            From a commercial problem
            <br />
            to a product people can use.
          </h2>
        </div>
        <p className={styles.copy}>
          Two views into my work at Rakuten: a product I launched and the
          platform scope I lead today.
        </p>
      </div>
      <div className={styles.workList}>
        {selectedWork.map((work, index) => (
          <article className={styles.work} key={work.slug}>
            <div className={styles.workNumber} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className={styles.workCopy}>
              <p className={styles.kicker}>{work.category}</p>
              <h3>
                <Link prefetch={false} href={`/work/${work.slug}`}>
                  {work.title}
                </Link>
              </h3>
              <p className={styles.copy}>{work.description}</p>
              <p className={styles.ownership}>
                <span>My ownership</span>
                {work.ownership}
              </p>
              <div className={styles.workBottom}>
                <Link
                  prefetch={false}
                  className={styles.quietLink}
                  href={`/work/${work.slug}`}
                >
                  Read the case study
                  <span className="sr-only">: {work.title}</span>
                </Link>
                <span className={styles.smallLabel}>{work.role}</span>
              </div>
            </div>
            <div
              className={styles.workEvidence}
              role="group"
              aria-label={`Outcome for ${work.title}`}
            >
              <div>
                <strong>{work.metric}</strong>
                <p>{work.label}</p>
                <small>{work.detail}</small>
              </div>
              <ul>
                {work.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
