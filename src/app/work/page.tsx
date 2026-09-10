import Link from "next/link";
import type { Metadata } from "next";
import { caseStudies } from "@/content/caseStudies";
export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Ads, marketplace, and AI product leadership at Rakuten, alongside eight independent explorations in consumer experience.",
  alternates: { canonical: "/work" },
};
export default function WorkIndex() {
  return (
    <main className="shell section-space">
      <header className="work-intro">
        <p className="eyebrow">Work / Production & exploration</p>
        <h1 className="section-heading mt-5">
          Products at scale.
          <br />
          Ideas you can try.
        </h1>
        <p className="body-copy mt-6">
          Professional work shows the scope and outcomes of my product
          ownership. Independent prototypes show how I turn a product question
          into something you can explore.
        </p>
      </header>
      {[
        {
          title: "In production",
          description: "Professional work at Rakuten.",
          items: caseStudies.filter((s) => s.status === "Professional work"),
        },
        {
          title: "Independent prototypes",
          description:
            "Personal explorations. Status labels distinguish live integrations, simulated AI, and interaction concepts.",
          items: caseStudies.filter((s) => s.status !== "Professional work"),
        },
      ].map((group) => (
        <section className="work-group" key={group.title}>
          <div className="section-top">
            <h2 className="text-2xl tracking-tight">{group.title}</h2>
            <p className="body-copy">{group.description}</p>
          </div>
          <div className="work-index-grid">
            {group.items.map((s) => (
              <article className={`index-card tone-${s.accent}`} key={s.slug}>
                <span className="status">{s.status}</span>
                <p className="eyebrow mt-6">{s.category}</p>
                <h3>
                  <Link href={`/work/${s.slug}`}>{s.title}</Link>
                </h3>
                <p className="body-copy">{s.tagline}</p>
                <div className="index-card-bottom">
                  <span>{s.timeframe}</span>
                  <Link href={`/work/${s.slug}`} className="text-link">
                    Read story ↗<span className="sr-only">: {s.title}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
      <div className="collection-link">
        <p>Interested in how this experience could translate to your team?</p>
        <Link href="/#connect" className="button">
          Get in touch ↗
        </Link>
      </div>
    </main>
  );
}
