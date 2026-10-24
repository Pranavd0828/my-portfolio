# Portfolio design system

Updated October 20, 2026.

## Direction

An editorial casebook with a small interactive product explanation. Three comparative phone and desktop compositions are preserved privately in the design review. The selected direction keeps the accepted black palette, personal identity, and simple navigation. It gives production work precedence over philosophy and keeps technical depth inside the decisions that require it.

## Typography

Inter is bundled locally from the licensed Fontsource package. One normal variable font supports the full weight range. The shared font variable is used in global and module styles, including form controls. System fonts remain a readable fallback.

- Name: responsive 2.75 to 4.25rem, line height 1.05.
- Section and page titles: shared `--text-title`, line height 1.2.
- Card titles: 1.5rem, line height 1.35.
- Body: 1rem, line height 1.7; normal reading measure approximately 58 characters.
- Supporting copy and controls: 0.875rem, line height 1.5 or 1.7.
- Eyebrow labels: 0.75 to 0.875rem; essential facts never rely on these alone.

The Escape game retains its deliberate monospace title and game interface. Portfolio navigation and explanatory text retain Inter. Native dropdowns retain their platform rendering, with 16px text and a minimum 48px control height. These are explicit exceptions, not additional editorial type systems.

## Layout and surfaces

Use the shared shell, flexible grid columns, intrinsic content height, and explicit gaps. The main widths are 700px for stacked compositions and 1024px for desktop navigation. Global layout also includes 600, 900, and 1180px adaptations. Tests exercise breakpoint neighbors.

Page background is #080808. Panels use #111 or #181818. Borders use #353535 with stronger boundaries for controls. Text is #f3f3f3, supported by #bbb or equivalent readable neutral text. Product media and book covers retain their own color. No neutral filter is applied to imagery.

Use 8, 12, 16, 20, 24, 32, and 40px spacing increments. Section spacing scales from 56 to 100px. Reading content and wide media have different containers for a reason: a video can be wider than a paragraph without making the prose harder to read.

## Interaction contracts

- Header remains available while scrolling. Its actual height updates anchor clearance.
- Mobile navigation is a disclosure, not a trapped modal. Escape returns focus, outside activation closes it, and short menus scroll internally.
- The PD seal and Home are one 44px-or-larger target with deliberate separation.
- Header and footer navigation links have a minimum 44px width as well as height. Footer gaps use 20px so short labels remain easy to tap without unnecessary wrapping on narrow phones.
- Media controls have permanent 44px targets and visible contrast over light or dark frames.
- Media keyboard focus pairs a light outline with a dark surround so bright footage cannot hide the focus ring. Case-story links use an inset ring on mobile to avoid clipping inside their scrollable navigation.
- Case-study recordings add a keyboard-operable timeline below the video. Homepage previews retain only playback and optional sound controls. Seeking and sound changes preserve a deliberate pause.
- Contact-field borders use #777 against #121212, exceeding 3:1 contrast for the enabled field boundary. Disabled controls remain visibly muted.
- Muting does not resume a paused video. Reduced motion and data-saving preferences prevent automatic playback.
- Explicit Play starts the recording even with reduced motion. A visibility callback must not cancel that deliberate action while the video remains visible. Leaving view or changing the motion preference ends the explicit playback session; returning under reduced motion requires another Play action.
- Selects and buttons drive the fictional models. No drag gesture, animation, or arithmetic is required to understand them.
- Keyboard focus is visible. Forced-colors support preserves control boundaries.
- Shared buttons use 14px text, 21px line height, and a minimum 48px height. Secondary boundaries use #777. Normal, hover, pressed, keyboard-focus, and disabled states are explicit. A selected model option keeps its light background and dark text across hover and press. Pending form controls are disabled and retain their sending label.
- Mobile Menu and game-choice borders also use #777. Menu and game choices use #252525 hover and #303030 pressed surfaces. Selected reading years use #ddd on hover and #ccc on press. Escape retry and return actions use the shared button system.
- Reading disclosures change their visible label from View cover to Hide cover when expanded. The native details element retains keyboard behavior and exposes expanded state without JavaScript.
- Optional details use native disclosures. The core story remains server-rendered.

## Content contracts

Professional work, illustrations, retrospective proposals, and independent prototypes are distinct. Product scale is not personal incremental attribution. Promotion dates are not project start dates. No contractions, em dashes, decorative link arrows, fictional performance claims, or unlabeled simulated artifacts.

The old phone philosophy block remains absent. The short product-question sidebar is desktop-only; all substantive professional evidence remains available on phones.

## Verification

`npm run test:design` checks rendered typography across all 16 routes at 390px and 1440px, opens content disclosures, captures component specimens, and exercises primary and secondary button states. Specimen captures temporarily hide sticky page chrome so it does not obscure the isolated component. Navigation and complete-page checks remain separate. The private audit contains the specimen catalogue and state-review evidence.

`npm run test:control-states` checks normal, hover, pressed, and keyboard-focus states for 31 control and link specimens in Chromium and WebKit at 390px and 1440px. These include media on both dark and bright previews. The phone-only menu is omitted at desktop widths. Computed colors are converted to sRGB before applying the local 4.5:1 text and 3:1 essential-boundary/focus gates. Actual screenshots supplement the calculations, particularly for media and canvas backgrounds. This is a bounded state review, not an accessibility certification. `PORTFOLIO_CONTROL_FILTER` accepts a comma-separated subset for focused rechecks; partial results must retain that narrower scope.

`npm run test:control-recovery` checks book disclosure labels, game disabled/retry behavior, short landscape controls, and simulated form loading and recovery at four viewport sizes in both engines. Form submissions are intercepted. Disabled states are reviewed for legibility and clear inactivity rather than graded as enabled controls. The form uses persistent labels and does not rely on placeholder text.
