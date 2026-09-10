import Link from 'next/link'

export default function Hero() {
  return (
    <section id="hero" className="hero shell">
      <p className="hero-identity">
        <strong>Pranav Deo</strong> <span>Staff Product Manager at Rakuten</span>
      </p>
      <div className="hero-grid">
        <div>
          <h1>
            Ads. AI. Marketplaces.
            <span className="hero-headline-secondary">Built around people.</span>
          </h1>
          <p className="body-copy hero-intro">
            I connect advertiser goals, consumer needs, and the technical
            systems that turn product decisions into real outcomes.
          </p>
          <Link className="hero-proof" href="/work/rakuten-programmatic-loyalty">
            <strong>$500M+</strong>
            <span>Annual revenue reached by Programmatic Loyalty, the platform I launched at Rakuten.</span>
            <span aria-hidden="true">↗</span>
          </Link>
          <div className="hero-actions">
            <Link href="/#production" className="button button-primary">
              Explore my work <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/#prototypes" className="button">
              8 consumer prototypes <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="hero-meta">
            <span>Sunnyvale, California</span>
            <a
              href="/Pranav-Deo-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Résumé (PDF) ↗
            </a>
          </div>
        </div>
        <aside
          className="product-perspective"
          aria-label="How I approach product work"
        >
          <h2 className="perspective-heading">My role is to connect these decisions.</h2>
          <p className="perspective-intro">I bring three questions to the work:</p>
          <ol>
            <li>
              <span>01 / People</span>
              <p>What makes this worth using?</p>
              <small>Relevance, trust, and control.</small>
            </li>
            <li>
              <span>02 / Marketplace</span>
              <p>What makes the economics work?</p>
              <small>Advertiser return, incentives, and growth.</small>
            </li>
            <li>
              <span>03 / Systems</span>
              <p>What makes it work at scale?</p>
              <small>Decisioning, measurement, and infrastructure.</small>
            </li>
          </ol>
        </aside>
      </div>
      <div className="proof-strip" aria-label="Selected professional outcomes">
        <div className="proof-item">
          <strong>Technical depth</strong>
          <p>
            Product ownership across recommendations, AI workflows, and ads infrastructure.
          </p>
        </div>
        <div className="proof-item">
          <strong>32% lift</strong>
          <p>
            New-buyer acquisition through Personalized Rewards, validated with
            randomized experiments.
          </p>
        </div>
        <div className="proof-item">
          <strong>30% fewer</strong>
          <p>
            Creative revision cycles through multi-agent GenAI orchestration at
            Rakuten.
          </p>
        </div>
      </div>
    </section>
  )
}
