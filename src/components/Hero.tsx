import Link from 'next/link'
import { profile } from '@/content/profile'
import styles from './PortfolioHome.module.css'
import hero from './Introduction.module.css'

export default function Hero() {
  return (
    <section id="about" className={`${hero.opening} shell`} aria-labelledby="intro-title">
      <div className={hero.identity}>
        <p className={styles.kicker}>Product leadership / Sunnyvale, California</p>
        <h1 id="intro-title">Pranav Deo<span>.</span></h1>
        <p className={hero.role}>{profile.currentTitle} at {profile.employer}</p>
      </div>
      <div className={hero.story}>
        <div>
          <h2>I turn advertiser goals into products that work for customers.</h2>
          <p className={styles.copy}>
            For more than five years at Rakuten, I have worked across the full
            product journey: understanding advertiser needs, launching
            Programmatic Loyalty, and shaping the recommendations and systems
            behind the experience. My work now also includes shared decisioning
            and AI-assisted creative workflows.
          </p>
          <div className={styles.actions}>
            <Link prefetch={false} className="button button-primary" href="/#production">Explore my work</Link>
            <a className={styles.quietLink} href="/Pranav-Deo-Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé (PDF)<span className="sr-only">, opens in a new tab</span></a>
          </div>
        </div>
        <div className={hero.note} role="group" aria-label="What connects my work">
          <p className={styles.kicker}>The product question</p>
          <p className={hero.question}>A business wants growth.<br />A customer wants something worth choosing.</p>
          <p className={styles.copy}>The product has to make both possible.</p>
          <ol className={hero.loop}>
            <li><span>01</span><strong>Understand the goal</strong><p>Advertiser intent and customer need</p></li>
            <li><span>02</span><strong>Design the decision</strong><p>Recommendations, incentives, and controls</p></li>
            <li><span>03</span><strong>Measure the outcome</strong><p>Business value and customer response</p></li>
          </ol>
          <Link prefetch={false} className={styles.quietLink} href="/work/rakuten-programmatic-loyalty#system">See it in a real product</Link>
        </div>
      </div>
      <div className={hero.foundation}>
        <p>Computer science trained me to understand systems.<br />Statistics trained me to question the evidence.</p>
        <Link prefetch={false} className={styles.quietLink} href="/#journey">My background</Link>
      </div>
    </section>
  )
}
