const experience = [
  {
    company: "Rakuten",
    location: "San Mateo, CA",
    period: "May 2021 – Present",
    roles: [
      {
        title: "Staff Product Manager",
        focus: "AI platforms & ads infrastructure",
        period: "Jun 2025 – Present",
        description:
          "Product architecture for multi-agent GenAI workflows, shared recommendation and ranking systems, and cloud infrastructure. Partnering with engineering and data science on the contracts and metrics that make platforms reusable.",
        result:
          "20% faster recommendation response · 30% fewer creative revision cycles",
      },
      {
        title: "Senior Product Manager",
        focus: "Recommendations & optimization",
        period: "Feb 2022 – Jun 2025",
        description:
          "Launched Programmatic Loyalty and defined personalization, cohort targeting, and online/offline decisioning across Kafka, Redis, and Snowflake.",
        result:
          "Platform scaled to $500M+ annual revenue · Contributed to 20% conversion lift",
      },
      {
        title: "Product Manager",
        focus: "Ads performance & experimentation",
        period: "May 2021 – Feb 2022",
        description:
          "Launched Personalized Rewards, designed randomized experiments with CUPED, and partnered with data science on propensity modeling for merchants with sparse historical data.",
        result: "32% lift in new-buyer acquisition · $16M incremental GMV",
      },
    ],
  },
  {
    company: "LeanData",
    location: "Santa Clara, CA",
    period: "Aug 2020 – May 2021",
    roles: [
      {
        title: "Product Manager",
        focus: "Workflow automation & decisioning",
        period: "Aug 2020 – May 2021",
        description:
          "Shipped no-code rules and workflow orchestration. Built real-time lead routing and led the integration of predictive scoring into production CRM workflows.",
        result:
          "40% fewer configuration escalations · 21% higher conversion through predictive scoring",
      },
    ],
  },
  {
    company: "Media.net",
    location: "Mumbai, India",
    period: "Aug 2017 – Jul 2019",
    roles: [
      {
        title: "Product Analyst",
        focus: "ML optimization & platform analytics",
        period: "Aug 2017 – Jul 2019",
        description:
          "Built Python regression models to connect campaign performance with traffic economics and translate analysis into bidding and traffic decisions.",
        result: "Contributed to a 20% increase in ad revenue",
      },
    ],
  },
];
export default function Journey() {
  return (
    <section id="journey" className="section-space shell">
      <div className="section-top">
        <div>
          <p className="eyebrow">03 / The experience behind the decisions</p>
          <h2 className="section-heading">
            From ad economics
            <br />
            to product leadership.
          </h2>
        </div>
        <p className="body-copy">
          Media.net grounded me in advertising economics. LeanData brought
          workflow product ownership. At Rakuten, that scope grew across
          acquisition, marketplace optimization, AI, and infrastructure.
        </p>
      </div>
      <div className="journey-list">
        {experience.map((company) => (
          <div className="company-row" key={company.company}>
            <div className="company-name">
              <h3>{company.company}</h3>
              <p>{company.location}</p>
              <p>{company.period}</p>
            </div>
            <div className="company-roles">
              {company.roles.map((role) => (
                <article key={role.title} className="role">
                  <div className="role-heading">
                    <h4>{role.title}</h4>
                    <span>{role.period}</span>
                  </div>
                  <p className="role-focus">{role.focus}</p>
                  <p className="body-copy">{role.description}</p>
                  <p className="role-result">{role.result}</p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
