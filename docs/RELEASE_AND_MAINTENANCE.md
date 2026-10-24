# Release and maintenance

Updated October 23, 2026. The owner approved committing and pushing the reviewed candidate on this date. Deployment verification remains a separate check.

## Source of truth

- `src/content/profile.ts`: approved role chronology, identity, domain, and description.
- `src/content/caseStudies.ts`: professional stories, independent concept status, external destinations, and media descriptions.
- `src/content/decisionExamples.ts`: fictional explanatory states, never production campaign logic.
- `src/components/DecisionLab.tsx`: accessible model controls and static fallbacks.
- `src/components/PortfolioHome.module.css`, `Introduction.module.css`, and `src/app/globals.css`: typography, layout, and responsive contracts.
- `public/Pranav-Deo-Resume.pdf`: local chronology-corrected download. Original historical metrics remain owner-reported and require review before release.

Private evidence and source extracts are stored outside this checkout. Do not import them into components, assets, source maps, or deployment configuration. Removing old tracked text dumps in this candidate does not erase prior Git history.

## Safe local preview

Use Node.js 24, `npm ci`, `npm run check`, and `npm run preview`. The launcher defaults to port 3040, creates an isolated build directory, validates assets, and records the running build in `.local-preview/current.json`. Never build over the output directory of an active server. Keep the process running while reviewing. The full procedure is in `local-preview.md`.

Before a new release run smoke, browser, mobile, visitor, accessibility, release, states, resize, keyboard, and loading checks against the actual preview URL. Use `PORTFOLIO_BROWSERS=chromium,webkit,firefox` where available. The CI workflow installs its own browser engines and uses the same isolated launcher. A configured CI workflow is not a successful hosted CI run.

The mobile suite checks emulated layouts. Actual iOS keyboards, Safari chrome, safe areas, and tablet split view require separate physical-device testing.

## Updating content and media

Keep project dates separate from promotion dates. Record the source, unit, period, and attribution for new metrics before publication. Qualitative wording is preferable to an invented definition. Mark synthetic examples and prototype limits beside the relevant content.

For a new case, add a stable slug, status, problem, personal role, decision, outcome boundary, and next step. Preserve old destinations or add tested redirects. Check the work index, related case link, page metadata, and sitemap.

Use color artwork and actual video posters. Recordings should use efficient H.264 video, compatible color conversion where needed, fast-start metadata, and only necessary audio. Keep visible pause controls, 44px touch targets, initial mute, reduced-motion behavior, offscreen pause, and failure recovery. Do not expand media downloads on the initial page visit.

## Measurement plan

Existing Vercel Analytics and Speed Insights load only in the Vercel production environment. Local previews do not request their hosted endpoints. Keep page-level visitation and Web Vitals as diagnostics, not evidence of recruiting success. No email or message content is sent as analytics properties.

A future measurement iteration can add aggregate case-study and resume engagement if there is a specific decision to inform. Do not instrument every action or add personal identifiers. Combine broad navigation patterns with consented reviewer comprehension and actual conversations. Low traffic makes percentage comparisons unstable. No event collection or external reviewer outreach is added solely to complete a checklist.

## Release gate

The owner confirmed `https://www.pranavdeo.info` as the primary address on October 19, 2026. Both public domains currently serve the older portfolio, whose canonical still names `www.deopranav.com`. The local candidate consistently uses the approved `.info` host. At release, configure permanent redirects from `deopranav.com`, `www.deopranav.com`, and the `.info` apex to `www.pranavdeo.info`, preserving paths and query strings. Confirm the domain assignments in the hosting project first. No DNS or hosting changes were made during local work.

Verify the root, one case-study path, a query-string URL, the PDF, canonical tags, and sitemap after redirect configuration. Do not count a canonical tag as an HTTP redirect or create a redirect loop between the two domains.

Review the concrete local diff and download. Confirm the canonical host and hosting redirects. Resolve or explicitly accept the reported limitations, including historical resume metrics, physical devices, and the external Maps and Rescue Radar provider errors. Then obtain approval for this candidate before committing and pushing. Verify the resulting deployment rather than assuming GitHub integration succeeded.

Smoke-check public pages, assets, social metadata, canonical URLs, videos, PDF bytes, and error recovery after deployment. Contact tests intercept delivery. A real test message requires separate authorization.

## Rollback

The original baseline is `c40b8e0e1dd574d4109e31aa976fe66dafa63cdb`. Original Desktop and accepted preview directories have been preserved. Before release, record the accepted new commit and the prior Vercel deployment identifier. If deployment fails, restore the prior deployment through the hosting workflow, then verify public assets and routes. Do not use a destructive working-tree reset to roll back a deployed site.

## Known dependency limits

Fresh production-only and full dependency audits on October 23, 2026 report zero advisories. The earlier audit reported five high-severity findings in the lint dependency tree; that historical report is preserved in the private audit record. No dependency change was made in this latest pass, so the new result reflects the current advisory response, not an additional patch. Recheck before release and keep lint jobs on trusted repository content. Provider account spam settings still require separate review.

## October 23 runtime and foldable verification

Fresh full and production npm audits report zero known dependency advisories. This does not audit the Node executable or certify the hosting environment. The local default Node 24.11.1 predates current security fixes. The candidate was built and checked using Node 24.22.1 from an official archive verified against the published SHA-256 checksum. `.nvmrc` and CI select 24.22.1; package engines select the Node 24 major for hosting. Verify the actual Vercel build and function runtime patch version before declaring the deployed runtime cleared. Source: https://nodejs.org/en/blog/vulnerability/october-2026-security-releases

`tests/foldable.mjs` checks representative folded, unfolded, rotated and split-view browser sizes across all 16 routes, plus menu and takeover resizing, in Chromium and WebKit. These are not certified iPhone Duo viewport dimensions or physical hinge tests. A physical iPhone Duo and other foldable devices remain unverified.
