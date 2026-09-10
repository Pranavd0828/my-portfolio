# Content provenance and review notes

Updated September 8, 2026. All changes remain local until reviewed.

## Positioning revision

The homepage now connects advertising, marketplace economics, technical platform ownership, and consumer product judgment. The Staff PM role is prominent. All eight independent projects appear on the homepage. Infrastructure latency stays in its own case study and is not presented as ad-serving latency or a consumer response metric. The regional voice project is described as dialect detection, transliteration, and synthesis, not translation or voice cloning.

The visual palette uses neutral black and gray throughout. Section navigation, every case-study anchor, all 16 routes, linked local assets, résumé integrity, metadata, and missing-page behavior have been checked. Browser layout checks covered desktop and phone sizes; external demo, source, artifact, and profile links all returned HTTP 200. External availability checks do not establish that a remote AI backend is configured.

## Professional facts

Both user-supplied résumé versions (PranavDeoResume_08262026.pdf and PranavDeoResume_08262029_wc.pdf) support the career dates and professional outcomes. The AI Platforms version is copied unchanged to public/Pranav-Deo-Resume.pdf. The website does not publish the phone number in its HTML; it is present in the supplied PDF.

- Staff PM: June 2025–present; Senior PM: February 2022–June 2025; PM: May 2021–February 2022.
- Programmatic Loyalty: platform annual revenue scaled to $500M+; not described as incremental revenue or individual revenue generation.
- Personalization: contributed to a 20% conversion lift.
- Infrastructure: p95 4s to 300ms; cost down 30%. Separate from recommendation response time, down 20%.
- GenAI: creative revision cycles down 30%. This replaces earlier website wording about rejection rates and launch delays, which the supplied résumés do not support.
- Personalized Rewards: 32% new-buyer acquisition lift, not the older website's engagement-lift wording.
- Propensity modeling: $16M incremental GMV.
- LeanData: configuration-related escalations down 40%; predictive scoring conversion up 21%.
- Media.net: contributed to 20% ad revenue increase.

The professional stories expand the explanation of the responsibilities and architecture named in the résumés. They do not add interviews, experiment samples, measurement windows, team sizes, internal screenshots, or undocumented decisions. Those details were not supplied. Figures from separate initiatives are kept separate.

The September 9 case-study expansion also uses the user-supplied interview preparation folder as a factual source. Interview frameworks, hypothetical answers, and company-specific product exercises are excluded from professional claims. The Programmatic Loyalty decision, architecture, MVP scope, and cross-functional operating model are supported by `Walmart - Interview Questions Prep` and `Panel Round Prep - Technical Partnership`. The Staff platform material remains bounded to the two supplied résumés because the interview folder does not document a separate end-to-end Staff-level project narrative.

The decision cards, system views, leadership maps, and product-artifact cards are sanitized reconstructions. They organize supplied facts into a reviewable portfolio format; they are not screenshots of Rakuten tools or copies of confidential documents. The Programmatic Loyalty case states the documented choice to keep settled-sales-based optimization offline and the live serving path deterministic at launch. The Staff platform case states the owner's September 9 clarification that the Redis alternative was to precompute more decisions offline and store fewer values in Redis; the chosen sharded architecture and its measured results remain supported by the supplied résumés.

## Prototype facts

Preserved project identities, routes, source repositories, demo URLs, and implementation boundaries from the existing src/content/caseStudies.ts. Revised sweeping claims to make product hypotheses and proposed evaluations explicit. No new user research, model scores, conversion results, or app-store releases are claimed.

The maps scoring discussion identifies the dimensional mismatch of combining maximum commute and variance without normalization. It does not change the external prototype implementation. Flow diagrams are simplified product flows, not screenshots or proprietary architecture artifacts.

## Review before publication

- The supplied PDF points to pranavdeo.info; the existing website uses www.deopranav.com. Keep the existing canonical host until the owner chooses a domain strategy. The PDF is deliberately unmodified.
- Production metrics have no supplied measurement windows, experiment sample sizes, or release dates. Do not invent these.
- Contact delivery tests use a mocked fetch implementation; no real message has been sent.
- External demos are separate applications. Portfolio tests do not establish that their model providers, keys, or backend services are currently available.
- The existing social image is retained; a new social image was not requested separately.
