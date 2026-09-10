# Pranav Deo — Product portfolio

A Next.js portfolio connecting professional platform ownership with independent product explorations.

## Develop

Requires Node.js 24 and npm. Run `npm ci`, then `npm run dev`.

## Validate

- `npm run lint`
- `npm test` — isolated contact request tests; never sends a message.
- `npm run build`
- `npm run typecheck`
- Start the production server with `npm start`, then run `npm run test:smoke`.
- `npm audit --omit=dev`

The smoke test targets localhost only. It covers every case study, the résumé file, internal links, metadata, security headers, sitemap, robots, and missing-page behavior.

## Content

- `src/content/caseStudies.ts`: two professional stories and eight independent prototypes, including status, boundaries, evaluation plans, and simplified product flows.
- `src/components/Journey.tsx`: résumé-backed career history.
- `public/Pranav-Deo-Resume.pdf`: the supplied AI Platforms résumé, unchanged.
- `docs/content-provenance.md`: factual source mapping and publication review notes.

The portfolio uses native document navigation and server-rendered content. There is no preloader, global canvas, scroll interception, or dependency on browser storage for essential content. Reading controls and games remain separate from the primary recruiter journey.

Contact submits to the existing Formspree endpoint with validation, a timeout, and accessible success/error feedback. Direct email is always available. Next.js configuration owns the response security headers.

## Deployment

The existing GitHub/Vercel setup is preserved. Review the local site and changes before committing or pushing. The canonical domain remains https://www.deopranav.com. No Site registration or deployment is needed for local review.
