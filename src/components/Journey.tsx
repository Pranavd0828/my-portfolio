import styles from './PortfolioHome.module.css'
import { profile } from '@/content/profile'
const experience = [
  {
    company: 'Rakuten',
    location: 'San Mateo, CA',
    period: profile.employerPeriod,
    roles: [
      {
        title: profile.currentTitle,
        focus: 'AI platforms & ads infrastructure',
        period: profile.currentRolePeriod,
        description:
          'Product architecture for multi-agent GenAI workflows, shared recommendation and ranking systems, and cloud infrastructure. Partnering with engineering and data science on the contracts and metrics that make platforms reusable.',
        result:
          'Current scope; initiative timelines span my work at Rakuten',
      },
      {
        title: 'Senior Product Manager',
        focus: 'Recommendations & optimization',
        period: profile.seniorRolePeriod,
        description:
          'Launched Programmatic Loyalty and defined personalization, cohort targeting, and online/offline decisioning across Kafka, Redis, and Snowflake.',
        result:
          'Programmatic Loyalty reached $500M+ in annual product revenue',
      },
      {
        title: 'Product Manager',
        focus: 'Ads performance & experimentation',
        period: profile.initialRolePeriod,
        description:
          'Launched Personalized Rewards, designed randomized experiments with CUPED, and partnered with data science on propensity modeling for merchants with sparse historical data.',
        result: 'Personalized Rewards and sparse-data merchant modeling were separate initiatives',
      },
    ],
  },
  {
    company: 'LeanData',
    location: 'Santa Clara, CA',
    period: 'August 2020 to May 2021',
    roles: [
      {
        title: 'Product Manager',
        focus: 'Workflow automation & decisioning',
        period: 'August 2020 to May 2021',
        description:
          'Shipped no-code rules and workflow orchestration. Built real-time lead routing and led the integration of predictive scoring into production CRM workflows.',
        result:
          '40% fewer configuration escalations · 21% higher conversion through predictive scoring',
      },
    ],
  },
  {
    company: 'Media.net',
    location: 'Mumbai, India',
    period: 'August 2017 to July 2019',
    roles: [
      {
        title: 'Product Analyst',
        focus: 'ML optimization & platform analytics',
        period: 'August 2017 to July 2019',
        description:
          'Built Python regression models to connect campaign performance with traffic economics and translate analysis into bidding and traffic decisions.',
        result: 'Contributed to a 20% increase in ad revenue',
      },
    ],
  },
]
export default function Journey() {
  const focus: Record<string, string> = {
    Rakuten: 'Advertising, recommendations, AI, and infrastructure',
    LeanData: 'Workflow automation and revenue operations',
    'Media.net': 'Advertising economics and performance analysis',
  }
  return (
    <section
      id="journey"
      className={`${styles.section} shell`}
      aria-labelledby="experience-title"
    >
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.kicker}>Experience</p>
          <h2 id="experience-title" className={styles.heading}>
            A career built
            <br />
            across the whole problem.
          </h2>
        </div>
        <p className={styles.copy}>
          From analyzing advertising performance to owning products and leading
          shared platforms. Open a chapter for the roles, responsibilities, and
          outcomes.
        </p>
      </div>
      <div className={styles.careerList}>
        {experience.map((company) => (
          <details className={styles.career} key={company.company}>
            <summary>
              <div>
                <h3>{company.company}</h3>
                <p>
                  {company.period} · {company.location}
                </p>
              </div>
              <p>{focus[company.company]}</p>
              <span className={styles.disclosureIcon} aria-hidden="true" />
            </summary>
            <div className={styles.careerBody}>
              {company.roles.map((role) => (
                <article className={styles.careerRole} key={role.title}>
                  <div>
                    <h4>{role.title}</h4>
                    <span>{role.period}</span>
                  </div>
                  <p>{role.description}</p>
                  <p>{role.result}</p>
                </article>
              ))}
            </div>
          </details>
        ))}
      </div>
      <section className={styles.education} aria-labelledby="education-title">
        <h3 id="education-title" className={styles.kicker}>Education</h3>
        <dl>
          <div>
            <dt>Master of Science in Statistics</dt>
            <dd>University of Maryland, College Park</dd>
            <dd>2019 to 2020</dd>
          </div>
          <div>
            <dt>Bachelor of Engineering in Computer Science</dt>
            <dd>University of Mumbai</dd>
            <dd>2013 to 2017</dd>
          </div>
        </dl>
      </section>
    </section>
  )
}
