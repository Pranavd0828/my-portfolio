import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { caseStudies } from "@/content/caseStudies";
import StoryFlow from "@/components/StoryFlow";
import StoryNavigation from "@/components/StoryNavigation";
type Params = { slug: string };
const sectionId = (heading: string) =>
  heading.toLowerCase().replace(/[^a-z0-9]+/g, "-");
export function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = caseStudies.find((s) => s.slug === slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.tagline,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: s.title,
      description: s.tagline,
      url: `/work/${slug}`,
      type: "article",
    },
    twitter: { title: s.title, description: s.tagline },
  };
}
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const index = caseStudies.findIndex((s) => s.slug === slug);
  if (index < 0) notFound();
  const s = caseStudies[index];
  const next = caseStudies[(index + 1) % caseStudies.length];
  const storyNavigation = [
    ...s.sections.map((sec) => ({
      id: sectionId(sec.heading),
      label: sec.heading,
    })),
    ...(s.decision ? [{ id: "decision", label: "The decision" }] : []),
    ...(s.systemMap ? [{ id: "system", label: "System view" }] : []),
    ...(s.leadership ? [{ id: "leadership", label: "How I led" }] : []),
    ...(s.productArtifacts
      ? [{ id: "artifacts", label: "Product artifacts" }]
      : []),
    {
      id: "outcomes",
      label:
        s.status === "Professional work"
          ? "Outcomes"
          : "What this prototype demonstrates",
    },
    { id: "implementation", label: "Technical context" },
  ];
  return (
    <main className={`shell story-page tone-${s.accent}`}>
      <Link href="/work" className="text-link">
        ← All work
      </Link>
      <header className="story-header">
        <div>
          <div className="story-kicker">
            <span className="status">{s.status}</span>
            <span className="eyebrow">{s.category}</span>
          </div>
          <h1>{s.title}</h1>
          <p className="body-copy story-deck">{s.tagline}</p>
          <div className="hero-actions">
            {s.demo && (
              <a
                href={s.demo}
                className="button button-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore prototype ↗
              </a>
            )}
            {s.artifacts?.map((a) => (
              <a
                href={a.url}
                key={a.url}
                className="button"
                target="_blank"
                rel="noopener noreferrer"
              >
                {a.label} ↗
              </a>
            ))}
            {s.github && (
              <a
                href={s.github}
                className="text-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source code ↗
              </a>
            )}
          </div>
          {!s.demo && (
            <a
              href="/Pranav-Deo-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              View résumé (PDF) ↗
            </a>
          )}
        </div>
        <aside className="story-context">
          <p className="eyebrow">My role</p>
          <p>{s.role}</p>
          <p className="eyebrow mt-5">Timeframe</p>
          <p>{s.timeframe}</p>
        </aside>
      </header>
      {s.status !== "Professional work" && (
        <p className="prototype-note">
          Independent concept; not affiliated with or endorsed by the product’s
          owner.{" "}
          {s.status === "Simulated AI prototype"
            ? "AI outputs use demonstration data; no live account connection or inference."
            : "Implementation boundaries are described below."}
        </p>
      )}
      <div className="story-overview">
        <StoryFlow steps={s.flow} accent={s.accent} />
        <div className="story-summary">
          <p className="eyebrow">The takeaway</p>
          <p>{s.takeaway}</p>
          {s.metrics && (
            <dl className="story-metrics">
              {s.metrics.map((m) => (
                <div key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
      <div className="story-body">
        <StoryNavigation items={storyNavigation} />
        <article>
          {s.evidenceNote && (
            <p className="case-evidence-note">{s.evidenceNote}</p>
          )}
          {s.sections.map((sec) => (
            <section
              id={sectionId(sec.heading)}
              key={sec.heading}
              className="story-section"
            >
              <h2>{sec.heading}</h2>
              {sec.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
          {s.decision && (
            <section id="decision" className="story-section decision-section">
              <p className="eyebrow">A decisive product moment</p>
              <h2>{s.decision.question}</h2>
              <p className="decision-tension">{s.decision.tension}</p>
              <div className="decision-options" aria-label="Options considered">
                {s.decision.options.map((option) => (
                  <article
                    key={option.label}
                    className={option.selected ? "is-selected" : undefined}
                  >
                    <div className="decision-option-heading">
                      <h3>{option.label}</h3>
                      {option.selected && <span>Chosen</span>}
                    </div>
                    <p>{option.detail}</p>
                  </article>
                ))}
              </div>
              <div className="decision-resolution">
                <div>
                  <p className="eyebrow">Why</p>
                  <p>{s.decision.rationale}</p>
                </div>
                <div>
                  <p className="eyebrow">What changed</p>
                  <p>{s.decision.impact}</p>
                </div>
              </div>
            </section>
          )}
          {s.systemMap && (
            <section id="system" className="story-section system-section">
              <p className="eyebrow">System view</p>
              <h2>{s.systemMap.title}</h2>
              <p>{s.systemMap.description}</p>
              <ol
                className={`system-map${s.systemMap.mode === "scope" ? " is-scope" : ""}`}
                aria-label={s.systemMap.title}
              >
                {s.systemMap.steps.map((step, stepIndex) => (
                  <li key={step.label}>
                    <span className="system-step-number">
                      {String(stepIndex + 1).padStart(2, "0")}
                    </span>
                    <strong>{step.label}</strong>
                    <span>{step.detail}</span>
                  </li>
                ))}
              </ol>
              {s.systemMap.feedback && (
                <p className="system-feedback">
                  <span aria-hidden="true">↺</span> {s.systemMap.feedback}
                </p>
              )}
              {s.systemMap.foundation && (
                <div className="system-foundation">
                  <span>Foundation</span>
                  <p>{s.systemMap.foundation}</p>
                </div>
              )}
            </section>
          )}
          {s.leadership && (
            <section id="leadership" className="story-section leadership-section">
              <p className="eyebrow">Leadership scope</p>
              <h2>How I made the work move</h2>
              <p>
                My role was to create shared decisions across the people building,
                evaluating, operating, and using the product.
              </p>
              <dl className="leadership-grid">
                {s.leadership.map((item, itemIndex) => (
                  <div key={item.team}>
                    <dt>
                      <span>{String(itemIndex + 1).padStart(2, "0")}</span>
                      {item.team}
                    </dt>
                    <dd>{item.alignment}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          {s.productArtifacts && (
            <section id="artifacts" className="story-section artifacts-section">
              <p className="eyebrow">Selected product artifacts</p>
              <h2>The structure behind the decisions</h2>
              <p>
                Sanitized reconstructions show how I framed scope, contracts, and
                measurement without exposing internal systems or customer data.
              </p>
              <div className="artifact-grid">
                {s.productArtifacts.map((artifact) => (
                  <article key={artifact.title} className="artifact-card">
                    <header>
                      <h3>{artifact.title}</h3>
                      <p>{artifact.purpose}</p>
                    </header>
                    <dl>
                      {artifact.rows.map((row) => (
                        <div key={row.label}>
                          <dt>{row.label}</dt>
                          <dd>{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                ))}
              </div>
            </section>
          )}
          <section id="outcomes" className="story-section outcomes">
            <p className="eyebrow">
              {s.status === "Professional work"
                ? "Professional outcomes"
                : "Prototype outcomes"}
            </p>
            <h2>
              {s.status === "Professional work"
                ? "What changed"
                : "What this prototype demonstrates"}
            </h2>
            <ul>
              {s.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </section>
          <section id="implementation" className="story-section">
            <details className="technical-details">
              <summary>
                Technical context <span aria-hidden="true">+</span>
              </summary>
              <ul>
                {s.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          </section>
          <div className="story-next">
            <p className="eyebrow">Up next</p>
            <Link href={`/work/${next.slug}`}>{next.title} ↗</Link>
          </div>
          <div className="collection-link">
            <p>Let’s talk about the product decisions behind the work.</p>
            <Link href="/#connect" className="button button-primary">
              Get in touch ↗
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
