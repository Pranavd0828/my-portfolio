# Local review workflow

Use Node.js 24 and the checked-in dependency lockfile.

```sh
npm ci
npm run check
npm run preview
```

The preview defaults to `http://127.0.0.1:3040`. Set `PORTFOLIO_PREVIEW_PORT` to choose another available local port. Keep the preview process running while reviewing the site.

The launcher checks that the port is available, builds into a unique directory, starts the exact completed build, and validates referenced CSS and JavaScript assets. It uses the installed Next.js webpack option. It does not overwrite a build that another preview is serving.

Do not run a separate build into the directory recorded in `.local-preview/current.json` while that preview is active. Stop the preview process before starting a new preview on the same port. Do not terminate an unrelated process to free a port.

After readiness, run browser checks against the actual URL:

```sh
PORTFOLIO_TEST_URL=http://127.0.0.1:3040 npm run test:smoke
PORTFOLIO_TEST_URL=http://127.0.0.1:3040 npm run test:intro
PORTFOLIO_TEST_URL=http://127.0.0.1:3040 npm run test:browser
PORTFOLIO_TEST_URL=http://127.0.0.1:3040 npm run test:mobile
PORTFOLIO_TEST_URL=http://127.0.0.1:3040 npm run test:visitor
PORTFOLIO_TEST_URL=http://127.0.0.1:3040 npm run test:accessibility
PORTFOLIO_TEST_URL=http://127.0.0.1:3040 npm run test:targets
```

Browser executables and engines can be selected through the existing test environment options. See the test entry points for supported values. Browser tests intercept contact delivery; do not add real sends without explicit authorization.

Source of confirmed role chronology: `src/content/profile.ts`. Project dates are separate from promotion dates. Do not restore June 2025 or February 2022 from historical notes or older resumes.

The local PDF has the confirmed July 2022 and June 2026 corrections. The original supplied PDFs remain preserved outside this checkout. The latest owner clarifications govern the website copy. The owner requested retaining the current PDF until they provide a replacement.

This is a local review workflow. No deployment is implied by a successful build or test run.

## Optional production scripts

Analytics and speed reporting render only when the build uses `VERCEL_ENV=production`. To validate their failure handling, start a separate local preview on a free port:

```sh
VERCEL_ENV=production PORTFOLIO_PREVIEW_PORT=3021 npm run preview
```

In a second terminal, run:

```sh
PORTFOLIO_TEST_URL=http://127.0.0.1:3021 npm run test:optional-scripts
```

This check requires both analytics scripts to be requested. It intercepts them as blocked requests or service failures, then exercises navigation, model controls, media, and simulated contact submission at phone and desktop widths in Chromium and WebKit. All contact responses are simulated locally. The test blocks unexpected external traffic and never sends a message. The separate preview does not overwrite the build used by the main review server. Starting it updates `.local-preview/current.json` to identify the most recently launched preview.

The optional `test:visibility` diagnostic requires a headed Chrome browser. It restores native focus and background behavior instead of mocking `document.hidden`. The current host still reports the video page as visible after the alternate tab is activated. That check therefore fails its prerequisite and remains incomplete; it is not included in the unattended CI gate. A successful run must observe a real hidden document, stationary playback while hidden, silent autoplay on return, and preserved manual pause and reduced-motion preferences.
