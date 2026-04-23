# Pranav Deo · PM, hands-on with GenAI

A portfolio for a product manager who prototypes. Every project here was framed, built, and pressure-tested against current GenAI models to find the seam where a feature stops being a demo and starts being a product.

## Read the case studies first

The `/work` route contains deep dives structured from a product lens: **Why Now · The Problem · Product Bet · What I Built · Tradeoffs · Business Read · Outcomes**.

| Case study | One-line pitch |
| --- | --- |
| [WhatsApp Regional Voice Over AI](/work/whatsapp-regional-voice) | Smart audio playback that renders chat messages in the sender's native regional dialect, using Gemini for dialect detection and ElevenLabs for voice. |
| [Google Maps: Meet Halfway Mode](/work/maps-meet-mode) | A Group Fairness Engine that picks a real, land-locked venue for any number of friends, weighted by commute pain and inequality. |
| [Rescue Radar: Food Delivery Post-Cancellation](/work/rescue-offers) | Map-first, time-pressured rescue of canceled orders, gamified through a CO2-saved leaderboard. |
| [LinkedIn Messaging Formatting](/work/linkedin-messaging-formatting) | Rich-text formatting injected inside native LinkedIn Messaging, closing a glaring gap in a professional product. |
| [Read with your Crew in Kindle](/work/kindle-crew) | A daily progress ring, time-validated pages, and crew nudges that turn solitary reading into a shared habit. |
| [Flappy Eagle](/work/flappy-eagle) | A feel study in heavier physics, useful as a PM vocabulary for non-game products. |

Source of truth for case study content lives in `src/content/caseStudies.ts`, so copy can be edited without touching layout.

## Contact

Senior PM open to roles at the intersection of AI, platform, and data. Based in Sunnyvale, CA. Open to remote, hybrid, and relocation.

## Aesthetic: Cinematic Calm

Serif headers, monospace system tags, particle backdrop, snappy transitions. The surface should feel like a product decision, not a resume.

## Interactive modules

* [Signal Portals](src/components/SignalPortal.tsx) · 3D wireframe navigation entities anchored to the viewport
* [Escape Protocol](/escape) · endless-runner physics toy
* [The Crucible](/rpsls) · Rock Paper Scissors Lizard Spock with cinematic resolution

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript · Framer Motion · @react-three/fiber · Lenis · Tailwind v4

## Navigation and information architecture

The persistent top bar is the single source of navigation across every route. It swaps its contents based on `usePathname`.

* **Home (`/`)**: logo · Journey · Prototypes · **Case Studies** (outlined button) · Connect. On mobile the two middle anchors collapse and the bar shows logo · Case Studies · Connect.
* **Work index (`/work`)**: logo · Home · Connect.
* **Case study (`/work/[slug]`)**: logo · All Work · Home · Connect.
* **Interactive routes (`/escape`, `/rpsls`, `/reading`, `/playground`)**: logo · Home · Connect.

Design choices baked into the bar:

* Order on home is deliberate. Journey and Prototypes are reading flow. Case Studies is the primary CTA (bordered), so it sits next to Connect at the end of the bar where the eye terminates. Connect is always last so "how do I reach him" is the last thing on screen.
* The outlined button treatment is reserved for Case Studies on home. Every other link uses the low-contrast mono style so the hierarchy stays obvious.
* Click handlers are smart about same-route interactions. Clicking the logo while already on `/` (including `/#connect`, `/#journey`, `/#prototypes`) scrolls to the top via Lenis and clears the URL hash via `history.replaceState`. Clicking "All Work" while already on `/work` does the same. This removes the Next.js same-URL `<Link>` no-op trap.
* The bar is transparent over the hero and switches to a frosted glass treatment (`bg-[#0B0C10]/80 backdrop-blur-md` plus a 1px bottom border) once `window.scrollY > 60`.
* An SSR mount gate (`if (!mounted) return null`) avoids a hydration mismatch between server-rendered and client-rendered hash state.

## Engineering notes

### Rendering and routing

* All 6 case studies prerender as SSG via `generateStaticParams` on `/work/[slug]`.
* `sitemap.ts` and per-route metadata expose every case study and interactive module to search and social previews.
* `robots.ts` ships explicit crawler directives alongside the sitemap.
* Branded 404 at `/work/[slug]/not-found.tsx` catches invalid slugs without breaking the aesthetic.
* Route transitions are a single 250ms opacity fade with `initial={false}`, so no black curtain between pages.

### Scroll system (Lenis)

Scroll is the single hardest subsystem in this app. It owns four responsibilities, and each one has a concrete implementation:

1. **Smooth wheel and touch**. One Lenis instance, initialized in `SmoothScroll.tsx` and guarded against React Strict Mode double-invokes via a `useRef` init check. RAF is explicitly cancelled and Lenis is destroyed in cleanup.
2. **Shared instance**. The Lenis instance is exposed through `LenisContext` and consumed in `Navigation.tsx` and `BackToTop.tsx` via `useLenis()`. Nothing calls `window.scrollTo` directly on top-level scroll concerns, so nothing fights the Lenis RAF.
3. **Universal anchor handling**. A single global `document.click` listener in `SmoothScroll` intercepts any `a[href^="#"]`, resolves the target, and routes through `lenis.scrollTo(target, ...)`. Plain `<a href="#section">` anchors anywhere in the tree stay smooth without per-component wiring.
4. **Per-path scroll memory**. On every scroll tick, the current position is written to `sessionStorage` keyed by pathname. On route change the effect chooses deterministically between three outcomes:
   * If `popstate` fired (back/forward), restore the saved position. A `parseInt` `NaN` guard protects against corrupted storage.
   * Else if the URL has a hash, resolve the target and scroll to it.
   * Else scroll to top.
   This ordering is synchronous and has no competing `setTimeout`s, so the three outcomes never race.

### Architecture

* `layout.tsx` order: `LoadingProvider` → `Preloader` → `CanvasBackground` → `SmoothScroll` → (`Navigation` + `SignalPortal` + `PageTransitionProvider` + children). Navigation and SignalPortal live inside `SmoothScroll` because both consume `LenisContext`.
* `CanvasBackground` sits outside `SmoothScroll` intentionally. It is a fixed, full-viewport layer and has no scroll dependency.
* `PageTransitionProvider` wraps `children` only, so nav and portals persist across route transitions without re-animating.

### Performance and accessibility

* Every animated component respects `prefers-reduced-motion`: Hero, Journey, Projects, VolumetricGlow, CanvasBackground, SignalPortal.
* `@react-three/fiber` canvas is tuned for low-power devices: clamped `dpr`, disabled antialias, reduced particle count on mobile.
* Mobile tap targets on the back-to-top button meet the 44px minimum (`min-h-[44px]` plus `py-3.5`).
* Hero CTA stacks vertically below the `sm` breakpoint to avoid overflow on 360px viewports.
* Hero on mobile renders the tagline across three stacked lines (name · role · specialty); desktop keeps the single inline treatment with bullet separators.
* One primary CTA on the hero (`View Prototypes`). Case Studies is accessible via the nav button, so the hero does not duplicate it.

### Copy and code hygiene

* Copy is kept free of em dashes and contractions as a hard style rule. This is enforced in both JSX and long-form case study copy.
* No unused imports, unused variables, or unused parameters in the tree. Verified against `next build` which runs TypeScript and the Next lint pass.
* Zero npm audit vulnerabilities on Next 16.2.4.

## Run it

```bash
npm install
npm run dev
```

For performance that matches the live Vercel deployment, run a production build locally instead:

```bash
npm run build
npm start
```

Visit `http://localhost:3000`.

## Repository layout

```
src/
  app/                     Next.js App Router routes
    page.tsx               Home (hero, journey, projects, prototypes, connect)
    work/page.tsx          Case study index
    work/[slug]/page.tsx   Individual case study (SSG)
    work/[slug]/not-found.tsx  Branded 404 for invalid slugs
    escape/                Endless-runner physics toy
    rpsls/                 Rock Paper Scissors Lizard Spock
    reading/               Reading list
    playground/            Experiments
    sitemap.ts             Dynamic sitemap covering home, /work, and every slug
    robots.ts              Crawler directives
    layout.tsx             Root layout, provider ordering
  components/              UI components
    Navigation.tsx         Persistent top bar, route-aware contents
    SmoothScroll.tsx       Lenis init, global anchor interceptor, per-path scroll memory
    LenisContext.tsx       Context wrapper exposing the Lenis instance via useLenis()
    BackToTop.tsx          Fixed bottom-left scroll-to-top button (Lenis-driven)
    SignalPortal.tsx       3D wireframe portal entities (duel, escape)
    Hero.tsx               Hero section with responsive tagline and single CTA
    Journey.tsx            Career timeline
    Projects.tsx           Case study grid
    Prototypes.tsx         Interactive prototype showcase
    ConnectSection.tsx     Contact section with mailto form
    CanvasBackground.tsx   Three.js particle background
    Preloader.tsx          First-load progress animation
    LoadingContext.tsx     isLoaded flag consumed by Hero and SmoothScroll
    PageTransitionProvider.tsx  250ms opacity route fade
    RpslsGame.tsx          RPSLS game (mobile-adaptive pentagon layout)
    EscapeGame.tsx         Endless runner
    ReadingList.tsx        Reading list rendering
    RevealFocus.tsx        Scroll-linked reveal wrapper
    MagneticButton.tsx     Hover-magnetic CTA
  content/
    caseStudies.ts         Case study data: single source of truth for the /work section
docs/                      Reference material (resume text, session restoration notes)
```
