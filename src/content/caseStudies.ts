export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  role: string;
  timeframe: string;
  stack: string[];
  demo?: string;
  github?: string;
  sections: {
    heading: string;
    body: string[];
  }[];
  outcomes: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'whatsapp-regional-voice',
    title: 'WhatsApp Regional Voice Over AI',
    tagline:
      'A Smart Audio Playback layer for WhatsApp that renders text messages in the sender\u2019s regional dialect with an authentic accent, rather than a generic synthetic voice.',
    category: 'GenAI Voice / Consumer Messaging',
    role: 'Product Manager and builder: framing, model selection, full-stack prototype.',
    timeframe: 'December 2025 to January 2026',
    stack: [
      'Next.js 14 frontend styled to match WhatsApp Web',
      'FastAPI backend for AI orchestration',
      'Google Gemini for dialect detection and script transliteration',
      'ElevenLabs text-to-speech with pinned Voice IDs for high-fidelity regional accents (Hindi and Punjabi in the current build)',
      'Experimental CarPlay surface at /carplay for hands-free playback',
    ],
    demo: 'https://pranavd0828.github.io/Whatsapp-Regional-Voice-Over-AI/',
    github: 'https://github.com/Pranavd0828/Whatsapp-Regional-Voice-Over-AI',
    sections: [
      {
        heading: 'Why Now',
        body: [
          'Global text-to-speech has spent a decade optimizing the average voice and flattening everything underneath it. For any user whose primary communication carries a dialect or regional accent, the existing accessibility pipeline strips out the very thing that makes a message feel personal.',
          'The timing bet is that hosted voice models finally cleared the fidelity bar in 2025. A pipeline that combines dialect detection with a voice model tuned to a specific accent now produces audio that a listener will accept as authentic, which was not true a year earlier.',
        ],
      },
      {
        heading: 'The Problem',
        body: [
          'Two separate user pains meet on one surface. The first is accessibility: users who need or prefer audio playback receive a generic, affectless voice that erases the identity of the sender. The second is context: when messages are read in a voice that does not match the sender, the emotional register of the original message is lost.',
          'From a product lens, this is a daily-engagement and retention surface. Audio playback raises session length, extends messaging into contexts where the screen cannot be used, and opens a wedge into in-car and wearable listening where messaging apps currently have no meaningful presence.',
        ],
      },
      {
        heading: 'Product Bet',
        body: [
          'The core bet is that fidelity, not feature count, decides adoption. Users will open a synthesized audio clip once out of curiosity. They will only open it again if the voice feels like it could belong to the person who sent the message.',
          'The practical evaluation target for this prototype was a short preview clip. A user should be able to listen to a few seconds of synthesized audio and accept it as a plausible voice note from the sender, rather than as a machine reading a message out loud.',
        ],
      },
      {
        heading: 'What I Built',
        body: [
          'A WhatsApp Web clone with a play icon on every text message. Clicking the icon sends the message text through Gemini, which detects the dialect and produces the correct transliteration. The transliterated text is then sent to ElevenLabs against a pinned Voice ID chosen to match that dialect, which returns an audio clip that plays inline.',
          'The prototype also ships a CarPlay surface. A notification banner triggers hands-free audio playback, which represents the real adoption vector for the feature. Users who cannot look at a screen are the ones who need synthesized voice most, and designing for that context first keeps the product honest.',
          'The backend and frontend are cleanly separated, so the voice pipeline can be swapped without touching the messaging interface. This matters for a prototype because the model layer is the part most likely to change as better options ship.',
        ],
      },
      {
        heading: 'Tradeoffs',
        body: [
          'I did not build on-device synthesis. On-device would have solved the long-term cost story but would have added significant scope without changing what the prototype was designed to answer. The point of this build was to validate fidelity, not to prove unit economics.',
          'I chose pinned Voice IDs over voice cloning of the sender. Cloning is the obvious future state, but it carries a consent surface that is too heavy for a first prototype.',
        ],
      },
      {
        heading: 'Business Read',
        body: [
          'At messaging-app scale, a pure API pipeline is not viable on unit economics. The productionization path would use a distilled on-device model for the highest-volume dialects, and reserve hosted inference for the long tail.',
          'The feature is best understood as a platform wedge rather than a standalone product. Once audio playback is native to a messaging app, the same pipeline extends into in-car listening, wearables, and any context where the screen is unavailable. Those are the surfaces where messaging apps currently lose time to voice assistants and podcasts.',
        ],
      },
    ],
    outcomes: [
      'End-to-end prototype shipping: WhatsApp Web UI, dialect detection, regional voice synthesis, and inline playback working across a full chat.',
      'A hands-free CarPlay surface built into the prototype, which keeps the design anchored to the use case that actually needs synthesized voice.',
      'A clear productization path identified: distilled on-device models for the high-volume dialects, with hosted inference kept for the long tail.',
    ],
  },
  {
    slug: 'maps-meet-mode',
    title: 'Google Maps: Meet Halfway Mode',
    tagline:
      'A Group Fairness Engine for Google Maps that picks a real, land-locked venue for any number of friends, weighted by commute pain and inequality rather than by the geometric midpoint.',
    category: 'Product Strategy / Marketplace Fairness',
    role: 'Product Manager and builder: problem framing, fairness formula design, full-stack prototype.',
    timeframe: 'January 2026 to February 2026',
    stack: [
      'React 18 with Vite',
      'Tailwind CSS using Google design tokens',
      '@react-google-maps/api for native map rendering',
      'Google Places API for real venue candidates',
      'A custom fairnessEngine.js that scores venues using a weighted formula',
    ],
    demo: 'https://google-maps-meet-mode.vercel.app/',
    github: 'https://github.com/Pranavd0828/Google-Maps-Meet-Mode',
    sections: [
      {
        heading: 'Why Now',
        body: [
          'Maps has spent its product life optimizing one-to-one directions, but a rising share of Maps sessions start from a group plan being negotiated over a separate chat app. The coordination moment, which is the hardest part of getting three friends to meet, lives outside the product that should own it.',
          'Places data is now cheap and fast enough that a real-time, multi-user venue ranker can run inside the map surface without a dedicated backend. The feature is cheap to prototype and cheap to ship, which was not true a few product cycles earlier.',
        ],
      },
      {
        heading: 'The Problem',
        body: [
          'Classical "meet in the middle" tools fail on two dimensions at once. They support only two users, and they return a geometric centroid that routinely lands in an ocean, on a freeway, or on a residential block with no venues. The user is still the one doing the real work.',
          'For a maps product, this is a coordination tax that keeps users inside chat apps when they should be inside the map. Moving that decision into the map surface increases the value of each session and raises the probability of a downstream navigation.',
        ],
      },
      {
        heading: 'Product Bet',
        body: [
          'The bet is that fairness, not the midpoint, is what users actually want. A meetup feels successful when nobody believes they traveled too far. It does not feel successful just because everyone traveled the same amount.',
          'The scoring formula makes this explicit. The score for each venue equals (MaxCommute times 0.7) plus (Variance times 0.3). Seventy percent of the score protects the person with the longest trip. Thirty percent keeps travel times close to each other. A lower score is better.',
        ],
      },
      {
        heading: 'What I Built',
        body: [
          'Party Mode supports any number of users, not only two. Each user drops a pin on the map. The engine computes the centroid of those pins, then uses the Google Places API to fetch real venues within a four-kilometer radius of that centroid. This step solves the "meet in the ocean" failure mode because the candidate list is always a real business on land.',
          'Travel times are estimated using the Haversine formula combined with a small random multiplier between 0.9 and 1.3 on a thirty kilometers per hour urban base speed. This keeps API cost at zero while still producing travel time vectors that rank venues sensibly.',
          'The prototype ships real cost assurance: a cap of one hundred searches per day, a graceful fallback to simulation mode if the API takes longer than five seconds, and a hard-coded kill switch to prevent accidental spend after the trial window.',
        ],
      },
      {
        heading: 'Tradeoffs',
        body: [
          'I used a simulated travel time model rather than the Distance Matrix API. The decision was about cost, not accuracy. A production version would use Distance Matrix for the top three candidates only, and keep the simulation for the long tail.',
          'I did not build account state. All preferences are passed in as ephemeral pins. For a prototype this is the right choice, because forcing a login would have killed the core insight the prototype is trying to validate.',
          'The scoring formula is not shown to users in this version. The code makes it visible to a PM reviewer, but the surfaced output is just the ranked list. A future version should show why each venue was picked, because that is the difference between a list and a conversation.',
        ],
      },
      {
        heading: 'Business Read',
        body: [
          'The value of this feature is measured in downstream navigations per group session, not in clicks. A group plan that concludes inside Maps produces several routes, one per person, rather than the single route a solo session produces.',
          'The fairness engine is a defensible product surface. The weighting can be adjusted for local norms, such as weighting variance higher in regions where equal treatment matters more culturally, and that localization work is difficult for a competitor to match without significant PM investment.',
        ],
      },
    ],
    outcomes: [
      'Party Mode shipping end-to-end: any number of users, real venue candidates, and a transparent fairness formula.',
      'Zero "meet in the ocean" results after the land-snapping step, because every candidate is a real business fetched from Places.',
      'API cost per query held at zero during testing through simulated travel times, with a clear path to paid Distance Matrix calls for the top candidates in production.',
    ],
  },
  {
    slug: 'rescue-offers',
    title: 'Rescue Radar: Food Delivery Post-Cancellation Offers',
    tagline:
      'A map-first food delivery surface that turns last-minute canceled orders into a live, time-pressured rescue at fifty to seventy percent off, reframing waste prevention as delight.',
    category: 'Marketplace / Sustainability',
    role: 'Product Manager and builder: framing, marketplace design, prototype build.',
    timeframe: 'January 2026',
    stack: [
      'React with Vite',
      'Tailwind CSS',
      'React Leaflet for the Rescue Radar map',
      'Framer Motion for the feed and timer animations',
      'React Context for ephemeral cart, offer, and timer state',
    ],
    demo: 'https://pranavd0828.github.io/Food-Delivery---Post-Cancellation-Rescue-Offers/',
    github: 'https://github.com/Pranavd0828/Food-Delivery---Post-Cancellation-Rescue-Offers',
    sections: [
      {
        heading: 'Why Now',
        body: [
          'Food delivery platforms have spent a decade optimizing the forward path from order to doorstep, and almost no time on the failure path. A canceled order is already cooked, already paid for by the restaurant, and already sitting in a rider bag. The operational conditions for a salvage product have never been more favorable.',
          'A sustainability-minded user cohort is now commercially meaningful. Some users will choose a discounted rescue over a full-price fresh order, not despite the waste story but because of it. That shift makes rescue a viable product rather than a marketing line.',
        ],
      },
      {
        heading: 'The Problem',
        body: [
          'Every canceled order today is a triple loss. The restaurant eats the food cost, the platform eats the refund, and the rider is idle. No surface exists to turn that loss into a second sale.',
          'The user-side problem is discovery under a sharp constraint. A rescued dish has a window of roughly three to five minutes and a radius of about five hundred meters. Any interface that relies on search or browse will miss it. Discovery has to come to the user in real time.',
        ],
      },
      {
        heading: 'Product Bet',
        body: [
          'The first bet is that a rescue surface should not live inside the normal delivery flow. A separate, map-first, time-pressured surface makes the short window and close radius feel like the fun of the product rather than its friction.',
          'The second bet is that framing matters as much as pricing. A discounted dish must read as "a neighbor just freed up this order" and not as "someone rejected this food." The leaderboard framing around Waste Warriors and CO2 saved turns a salvage economy into a status game, which is what actually produces returning users.',
        ],
      },
      {
        heading: 'What I Built',
        body: [
          'A feed-first discovery surface, closer in feel to a short-form video feed than to a restaurant grid. A live Rescue Radar map shows nearby rescue offers appearing in real time. A ninety-second hold timer runs once a user secures a deal, which creates the urgency the product depends on without pushing the window so short that the user cannot act.',
          'The Pulse ticker makes the marketplace legible as a live system, showing rescues happening right now against food waste prevented over the last hour. A gamified checkout ranks users on cumulative CO2 saved, which turns retention into a leaderboard rather than a discount coupon.',
          'Global state lives in a RescueContext, so offers, cart, and hold timers stay in sync across the feed, the map, and the checkout without routing complexity.',
        ],
      },
      {
        heading: 'Tradeoffs',
        body: [
          'I did not integrate a real delivery backend. The point of the prototype was to validate the surface and the framing, not the operations. A real integration would require a rider re-route planner, which is a separate product.',
          'I chose the gamified Waste Warriors frame over a pure discount frame. A pure discount would likely convert faster in the short term, but it would train users to treat rescue as a price event rather than a habit, which undercuts the reason the feature exists.',
          'The prototype uses a cached library of offer copy rather than an LLM-in-the-loop. A live LLM would be slower and more expensive on the notification path, and for a salvage product the notification has to land inside a narrow window.',
        ],
      },
      {
        heading: 'Business Read',
        body: [
          'Rescue Radar converts a refund line item into a revenue line item. Even a modest rescue rate recovers margin that would otherwise be zero, and it protects the restaurant relationship that cancellations damage the most.',
          'The sustainability framing is not a marketing layer. The CO2 leaderboard is a retention mechanic that is difficult for a competitor to copy, because copying it requires rebuilding the upstream waste-prevention story rather than just adding a badge.',
          'The right launch region for this feature is a dense metro with a high cancellation rate and a sustainability-aware user base. A prototype like this is what lets a growth team see the surface clearly before committing to a launch geography.',
        ],
      },
    ],
    outcomes: [
      'A full end-to-end prototype shipping in a single session: feed, map, hold timer, gamified checkout, and a global state layer that keeps them in sync.',
      'The ninety-second hold timer validated as a usable window: long enough for a user to read the offer card and decide, short enough to preserve the urgency the product depends on.',
      'A framing decision documented in the product: Waste Warriors and CO2 saved, rather than a pure discount framing, because the goal is a returning habit rather than a one-time price event.',
    ],
  },
  {
    slug: 'linkedin-messaging-formatting',
    title: 'LinkedIn Messaging: Formatting Option',
    tagline:
      'A pixel-accurate LinkedIn Messaging recreation that adds rich-text formatting directly inside the native compose surface, closing a gap that no professional messaging product should still have.',
    category: 'Professional Network / UI Extension',
    role: 'Product Manager and builder: problem identification, interface recreation, formatting logic.',
    timeframe: 'November 2025 to January 2026',
    stack: ['HTML, CSS, JavaScript', 'Vite for dev tooling', 'Native contenteditable APIs for rich-text formatting'],
    demo: 'https://pranavd0828.github.io/LinkedIn-Messaging-with-Formatting-Option/',
    github: 'https://github.com/Pranavd0828/LinkedIn-Messaging-with-Formatting-Option',
    sections: [
      {
        heading: 'Why Now',
        body: [
          'LinkedIn is the only serious professional messaging surface at scale, and it still ships messages as plain text. Every adjacent surface, including Slack, Teams, and even LinkedIn Posts, supports rich text. The gap has become visible enough that users routinely compose their messages in a separate document and paste the result into LinkedIn, which is a reliable signal that the product is ready to be fixed.',
          'The contenteditable web APIs are mature enough now to ship rich text without a third-party editor framework, which keeps the performance budget of a chat list intact.',
        ],
      },
      {
        heading: 'The Problem',
        body: [
          'Professional messages often need structure. A founder intro benefits from a bolded name. A recruiter pitch benefits from a list of asks. An investor update benefits from emphasis on the number that matters. Plain text forces users to write messages that are worse than the ones they are capable of writing.',
          'For LinkedIn as a business, this is a quality-of-conversation problem. The platform monetizes the strength of its network, and lower-quality messages produce lower response rates, which compresses the value of InMail and Premium over time.',
        ],
      },
      {
        heading: 'Product Bet',
        body: [
          'The first bet is that the formatting surface must be invisible until a user invokes it, and must not add a single pixel of vertical space to the default compose state. Professional users will abandon any feature that makes the default view heavier.',
          'The second bet is that formatting is a quality-of-conversation lever, not a styling lever. The reason to ship it is to let users write better messages, not to give them more toys.',
        ],
      },
      {
        heading: 'What I Built',
        body: [
          'A visual recreation of LinkedIn Messaging that is close enough to the live product to let formatting behavior be tested in real context, rather than in an isolated editor. The compose area uses the browser\u2019s native contenteditable APIs, which keeps the implementation light and the rendering predictable.',
        ],
      },
      {
        heading: 'Tradeoffs',
        body: [
          'I did not build a persistence backend. Every message resets on reload. The prototype is about the compose moment, not the history surface.',
          'I chose contenteditable over a rich-text editor framework such as Lexical or ProseMirror. Those frameworks would be the right choices at LinkedIn scale, but adopting one here would have tripled the prototype surface area without teaching anything new about the product question.',
        ],
      },
      {
        heading: 'Business Read',
        body: [
          'The commercial core of LinkedIn Premium is InMail response rate. A feature that helps users write clearer, more structured messages is a direct lever on that metric, not a cosmetic one.',
          'The engineering cost of shipping formatting is small. The product cost is larger, because formatting introduces tone decisions that ripple outward. How should bold render in the notification preview? How should a list survive in the email fallback? What happens when someone pastes formatted text from a Google Doc? The prototype is what makes those questions concrete, which is the real value of building one before scoping the real thing.',
        ],
      },
    ],
    outcomes: [
      'A pixel-accurate recreation of LinkedIn Messaging that allows formatting behavior to be tested inside the real visual context of the product, rather than in an abstract editor.',
      'A working rich-text compose surface using native contenteditable, with no heavy editor framework in the way.',
      'A concrete list of downstream product questions that a production version would need to answer: notification rendering, email fallback, and paste behavior from other rich-text surfaces.',
    ],
  },
  {
    slug: 'kindle-crew',
    title: 'Read with your Crew in Kindle',
    tagline:
      'A social reading prototype that turns solitary reading into a shared habit through a daily progress ring, momentum streaks, time-validated pages, and crew nudges.',
    category: 'Consumer Habits / Social Reading',
    role: 'Product Manager and builder: habit loop design, state modeling, prototype build.',
    timeframe: 'December 2025 to January 2026',
    stack: [
      'React 18 with Vite',
      'React Context for state management',
      'localStorage for persistence without account creation',
    ],
    demo: 'https://pranavd0828.github.io/Read-with-your-Crew-in-Kindle/',
    github: 'https://github.com/Pranavd0828/Read-with-your-Crew-in-Kindle',
    sections: [
      {
        heading: 'Why Now',
        body: [
          'Reading is losing share of leisure time to short-form video, and the reason is not that books are worse. The reason is that books are alone. Every other habit product that has scaled in the last decade, from fitness to language to cycling, has used social accountability as its unlock. Reading has not.',
          'The audience is ready. Book clubs and reading groups migrated to chat apps years ago and have not come back to a native product. The wedge for a social reading feature is already open.',
        ],
      },
      {
        heading: 'The Problem',
        body: [
          'Kindle tracks pages read, but the feedback loop ends at the book cover. There is no daily ritual, no group, no visible momentum. A user who wants to finish a book this month has to build that scaffolding themselves outside the app.',
          'For the business, the consequence is a lower time-spent-per-user number, which compresses the value of Kindle Unlimited and of the device hardware it supports.',
        ],
      },
      {
        heading: 'Product Bet',
        body: [
          'The first bet is that the right habit primitive for reading is a daily progress ring that turns gold on completion, not a streak counter. Streaks punish a missed day too hard for a slow medium. Rings reset cleanly each day and forgive a miss without ending a run.',
          'The second bet is that time-validated pages are what make the metric trustworthy. Without a minimum engagement time per page, users will game the page count. With it, the metric becomes something a user is willing to share with a crew, which is the unlock for the social layer.',
        ],
      },
      {
        heading: 'What I Built',
        body: [
          'A daily progress ring on the reader home screen. A momentum bar that turns gold and pulses when the daily target is hit. Time validation that requires a minimum engagement per page before the page counts toward the ring.',
          'A crew dashboard that shows a shared group streak and a nudge function with a sixty-second cooldown. The cooldown exists to prevent nudge spam, which is the specific failure mode that kills most social reading products.',
          'All state persists in localStorage, which means the whole loop can be tested without account creation. That is a deliberate decision, because the prototype is about validating the habit mechanic rather than the sign-up flow.',
        ],
      },
      {
        heading: 'Tradeoffs',
        body: [
          'I did not integrate a real reader engine. The habit loop is testable on top of a placeholder book, which is the right scope for proving that the mechanic works.',
          'I did not build a social graph. Crews are built manually in the prototype. A production version would import from an existing contact graph, but the prototype is focused on the daily loop, not the acquisition step.',
          'The ring versus streak decision was the most important design call. I kept both measurable, but made the ring the primary surface and the streak the crew-level secondary. A streak-first product would have been easier to build and worse to use.',
        ],
      },
      {
        heading: 'Business Read',
        body: [
          'This feature raises daily active use of the reader, which is the upstream metric that makes a subscription reading service and its device refresh cycle work. The return is in the habit formation, not in the social surface itself.',
          'The crew layer also produces a low-cost acquisition loop. A reader nudging a friend is a highly targeted pull into the product, and it does not depend on a paid channel.',
        ],
      },
    ],
    outcomes: [
      'A full end-to-end prototype shipping the core habit loop: ring, momentum, time-validated pages, crew dashboard, and nudge cooldown.',
      'Zero-account persistence through localStorage, which keeps the first-use friction effectively at zero and lets the loop be tested with a friend within a minute.',
      'A deliberate design choice documented in the prototype: the ring as the forgiving primary surface, and the streak as the crew-level secondary, rather than a streak-first design that would punish a missed reading day too hard.',
    ],
  },
  {
    slug: 'flappy-eagle',
    title: 'Just One Flap',
    tagline:
      'A canvas-based hyper-casual game prototype packaged for native iOS and Android distribution, exploring how far a vanilla JavaScript build can go without a game engine.',
    category: 'Game Prototype / Mobile Distribution',
    role: 'Product Manager and builder: game mechanic, build tooling, mobile packaging.',
    timeframe: 'February 2026',
    stack: [
      'HTML5 Canvas for rendering',
      'Vanilla JavaScript ES modules',
      'Vite for dev tooling and production bundling',
      'Capacitor for iOS and Android app packaging',
    ],
    demo: 'https://pranavd0828.github.io/flappy-eagle/',
    github: 'https://github.com/Pranavd0828/flappy-eagle',
    sections: [
      {
        heading: 'Why Now',
        body: [
          'Hyper-casual games have converged on the same set of engines and the same light, forgiving physics model, because those choices maximize early retention. That convergence has flattened the category. The current generation of mobile browsers and packaging tools makes it realistic again to ship a canvas-only game from a small codebase to native app stores, which reopens a design space that game engines had effectively closed.',
        ],
      },
      {
        heading: 'The Problem',
        body: [
          'For a product manager, the question underneath a hyper-casual prototype is how much of the "feel" of a game depends on the engine and how much depends on the physics tuning on top of it. If the answer is mostly the tuning, then the category is still open to small teams. If the answer is mostly the engine, then the category is closed.',
        ],
      },
      {
        heading: 'Product Bet',
        body: [
          'The bet is that a sixty-second prototype can convey a specific game feel within the first few interactions, using only a canvas, vanilla JavaScript, and a tuned physics loop. If the first few interactions do not communicate the intent, no downstream polish will recover it.',
        ],
      },
      {
        heading: 'What I Built',
        body: [
          'A canvas game running on vanilla JavaScript ES modules, with Vite handling dev and production builds. Capacitor wraps the web build for iOS and Android, which keeps the web codebase as the single source of truth while still producing real native app builds.',
          'The packaging choice is the product decision. It says the prototype is not a browser toy. It is a mobile-first game that happens to be written on the web stack, and the intended distribution is the app store.',
        ],
      },
      {
        heading: 'Tradeoffs',
        body: [
          'I did not ship sound design in this version. Sound is half the feel of a physics game, but it is also the fastest path to feature creep. Holding it back keeps the physics tuning as the variable under test.',
          'I did not build a persistent leaderboard. The prototype is focused on the core micro-interaction, not on the retention mechanic that would sit on top of it.',
        ],
      },
      {
        heading: 'Business Read',
        body: [
          'The useful takeaway for non-game products is that feel is a designable product lever, not a property of the engine. Ride-hailing pickup animations, delivery ETA updates, and chat send feedback all leave feel on the table because no one on the product side owns it explicitly. A game prototype is a clean place to practice owning it.',
        ],
      },
    ],
    outcomes: [
      'A playable canvas-only game built on vanilla JavaScript and bundled with Vite, with no heavy engine dependency.',
      'Capacitor packaging in place for iOS and Android, which keeps one web codebase as the source of truth while producing real app-store builds.',
      'A small, legible codebase that is cheap to iterate on, which matters more for a feel-first prototype than any specific performance headline would.',
    ],
  },
];
