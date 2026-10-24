import Link from 'next/link'
import styles from './PortfolioHome.module.css'

export default function ProductApproach() {
  return (
    <section
      id="approach"
      className={`${styles.section} ${styles.approach} shell`}
      aria-labelledby="approach-title"
    >
      <div className={styles.sectionIntro}>
        <p className={styles.kicker}>How I think</p>
        <h2 id="approach-title" className={styles.heading}>
          The faster system is not
          <br />
          always the better product.
        </h2>
        <p className={styles.copy}>
          In Programmatic Loyalty, I initially wanted more responsive campaign
          decisions. Engineering helped expose the cost: less predictable spend
          behavior and a harder system to diagnose. I narrowed the scope to
          protect the advertiser promise.
        </p>
        <Link
          prefetch={false}
          className={styles.quietLink}
          href="/work/rakuten-programmatic-loyalty#leadership"
        >
          How I led the work
        </Link>
      </div>
      <article className={styles.decision}>
        <div className={styles.decisionHeading}>
          <span className={styles.kicker}>One decision, in practice</span>
          <span className={styles.smallLabel}>Programmatic Loyalty</span>
        </div>
        <h3>How much should a live campaign react to new signals?</h3>
        <dl>
          <div>
            <dt>The promise</dt>
            <dd>
              Let an advertiser set a spend goal and target return, then make
              campaign decisions they could trust.
            </dd>
          </div>
          <div>
            <dt>The tradeoff</dt>
            <dd>
              Reacting to fresh intent could recover delivery faster. It also
              made spend changes harder to explain and debug.
            </dd>
          </div>
          <div>
            <dt>What I changed</dt>
            <dd>
              Keep heavier optimization offline and the live path predictable.
              Improve the guidance before adding more live complexity.
            </dd>
          </div>
        </dl>
        <Link
          prefetch={false}
          className={styles.quietLink}
          href="/work/rakuten-programmatic-loyalty#decision"
        >
          Read the full decision
        </Link>
      </article>
    </section>
  )
}
