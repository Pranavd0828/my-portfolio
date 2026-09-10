export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  status: string;
  role: string;
  timeframe: string;
  stack: string[];
  flow: string[];
  sections: { heading: string; body: string[] }[];
  outcomes: string[];
  takeaway: string;
  accent: string;
  featured?: boolean;
  metrics?: { value: string; label: string }[];
  demo?: string;
  github?: string;
  artifacts?: { label: string; url: string }[];
  decision?: {
    question: string;
    tension: string;
    options: { label: string; detail: string; selected?: boolean }[];
    rationale: string;
    impact: string;
  };
  systemMap?: {
    title: string;
    description: string;
    steps: { label: string; detail: string }[];
    mode?: "flow" | "scope";
    foundation?: string;
    feedback?: string;
  };
  leadership?: {
    team: string;
    alignment: string;
  }[];
  productArtifacts?: {
    title: string;
    purpose: string;
    rows: { label: string; value: string }[];
  }[];
  evidenceNote?: string;
};
export const caseStudies: CaseStudy[] = [
  {
    slug: "rakuten-programmatic-loyalty",
    title: "Programmatic Loyalty: aligning advertiser goals and customer incentives.",
    tagline:
      "Launching Programmatic Loyalty: a recommendation and optimization platform that translates advertiser goals into commission rates, budget pacing, and customer incentives.",
    category: "Ads, marketplaces & recommendations",
    status: "Professional work",
    role: "Senior Product Manager · Rakuten",
    timeframe: "Feb 2022 – Jun 2025",
    stack: [
      "Recommendation systems",
      "Kafka",
      "Snowflake",
      "Redis",
      "Personalization",
    ],
    flow: [
      "Advertiser spend + target ROAS",
      "Commission, pacing + incentive decisions",
      "Campaign and customer outcomes",
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "Sales and operations teams were manually configuring campaign economics across hundreds of advertisers. Spend goals, target return on ad spend, incentive allocation, and delivery pacing moved through multiple handoffs, making launches slow and the system difficult to scale.",
        ],
      },
      {
        heading: "My ownership",
        body: [
          "I took Programmatic Loyalty from idea to launch: validating the problem, aligning leadership on an MVP, defining the advertiser workflow and system requirements, and leading phased delivery with engineering, data science, design, sales, and revenue operations.",
          "The product translated advertiser spend and target ROAS into recommended effective commission rates, pacing strategies, and customer incentive allocations. I also defined personalization for first-time buyers, new-to-merchant customers, and lapsed audiences.",
        ],
      },
    ],
    decision: {
      question:
        "Should fresh intent signals directly change live campaign decisions at launch?",
      tension:
        "More responsive optimization could help an underdelivering campaign recover faster. It could also blur the boundary between trusted pacing guidance and request-time behavior, making spend changes harder to explain and debug.",
      options: [
        {
          label: "Put fresh intent in the live path",
          detail:
            "Higher responsiveness, with more request-time complexity and less predictable pacing behavior.",
        },
        {
          label: "Keep the live path deterministic",
          detail:
            "Use precomputed pacing state online, preserve a clean system boundary, and fall back conservatively when state is stale.",
          selected: true,
        },
      ],
      rationale:
        "I treated budget discipline and ROAS predictability as the product promise that could not move. We kept heavy settled-sales-based optimization offline and made the online layer fast, explainable, and conservative.",
      impact:
        "The team launched a system that could react quickly enough for campaign delivery while remaining predictable for merchants and operable for internal teams.",
    },
    systemMap: {
      title: "From advertiser goal to measurable outcome",
      description:
        "A simplified view of the product and data loop I defined with engineering and data science.",
      steps: [
        {
          label: "Advertiser intent",
          detail: "Monthly spend, target ROAS, promotion context",
        },
        {
          label: "Offline guidance",
          detail: "Commission recommendation, pacing plan, profitability guardrails",
        },
        {
          label: "Live decisioning",
          detail: "Eligibility, ranking, incentive bucket, delivery surface",
        },
        {
          label: "Customer experience",
          detail: "Relevant offers across app, email, push, and other placements",
        },
        {
          label: "Measurement",
          detail: "Spend, ROAS, conversion, margin, pacing, and system health",
        },
      ],
      foundation:
        "Kafka ingested events · Redis served low-latency decision state · Snowflake remained the settled-sales and analytical source of truth",
      feedback:
        "Measured outcomes updated future recommendations and pacing guidance.",
    },
    leadership: [
      {
        team: "Engineering",
        alignment:
          "Defined system boundaries, failure behavior, state transitions, API requirements, and phased milestones.",
      },
      {
        team: "Data science",
        alignment:
          "Aligned the advertiser inputs, recommended outputs, forecasting logic, and evaluation measures.",
      },
      {
        team: "Design",
        alignment:
          "Turned complex campaign choices into a usable setup flow, then iterated from beta behavior and drop-offs.",
      },
      {
        team: "Sales & revenue operations",
        alignment:
          "Used discovery, sandbox demos, advertiser edge cases, and role-specific dashboards to make the product useful and sellable.",
      },
      {
        team: "Leadership",
        alignment:
          "Built the opportunity case, agreed on the MVP boundary, and used a phased pilot plus shared success metrics to earn trust.",
      },
    ],
    productArtifacts: [
      {
        title: "MVP boundary",
        purpose: "Ship the shortest complete path from goal to activation.",
        rows: [
          {
            label: "Included",
            value:
              "Campaign creation, targeting, spend and ROAS input, recommendation preview, activation",
          },
          {
            label: "Deferred",
            value: "Post-launch reporting and campaign editing",
          },
          {
            label: "Reason",
            value:
              "Validate the highest-leverage workflow before expanding the operating surface",
          },
        ],
      },
      {
        title: "Decision scorecard",
        purpose: "Make speed-versus-control tradeoffs explicit.",
        rows: [
          {
            label: "Primary outcomes",
            value: "ROAS attainment, budget utilization, conversion",
          },
          {
            label: "Marketplace guardrails",
            value: "Margin health, pacing deviation, overspend risk",
          },
          {
            label: "System guardrails",
            value: "Latency, fallback rate, stale-state behavior",
          },
        ],
      },
    ],
    evidenceNote:
      "Sanitized reconstruction from product requirements and interview materials. Proprietary interfaces, customer data, and implementation detail are omitted.",
    outcomes: [
      "Programmatic Loyalty scaled to $500M+ in annual revenue.",
      "Personalization and cohort-targeting work contributed to a 20% lift in conversion.",
      "Online optimization used low-latency state while settled financial outcomes remained the source of truth.",
    ],
    featured: true,
    accent: "mint",
    metrics: [
      {
        value: "$500M+",
        label: "Platform annual revenue",
      },
      {
        value: "+20%",
        label: "Conversion lift contributed to",
      },
    ],
    takeaway:
      "Product leadership across marketplace economics, recommendations, and real-time data.",
  },
  {
    slug: "rakuten-ai-platform",
    title: "Better creative workflows. Shared decisions. Infrastructure that keeps up.",
    tagline:
      "At Rakuten, I lead product work across shared decisioning, multi-agent creative workflows, and the infrastructure that supports them.",
    category: "AI platforms & infrastructure",
    status: "Professional work",
    role: "Staff Product Manager · Rakuten",
    timeframe: "Jun 2025 – Present",
    stack: [
      "LangChain",
      "Memory & retrieval",
      "Model evaluation",
      "Docker & Kubernetes",
      "AWS & GCP",
      "Sharded Redis",
    ],
    flow: [
      "Shared campaign + marketplace signals",
      "Recommendation, ranking + pacing",
      "Common APIs + integration contracts",
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "Recommendation, ranking, and budget-pacing logic had grown across separate systems. Creative generation and review were also fragmented. As platform scale increased, product teams needed shared decisions, clear contracts, and infrastructure that could keep up.",
        ],
      },
      {
        heading: "My ownership",
        body: [
          "As Staff Product Manager, I led product architecture across three connected initiatives: a common decisioning layer, a multi-agent creative workflow, and the cloud and data infrastructure supporting them.",
          "I defined shared signals, evaluation metrics, APIs, integration contracts, orchestration, memory and retrieval behavior, model evaluation, access and retention controls, and technical requirements for containerized services.",
        ],
      },
    ],
    decision: {
      question:
        "Should we reduce online state, or scale the live decisioning architecture?",
      tension:
        "Precomputing more decisions offline would reduce the number of values stored in Redis and simplify the online path. It would also narrow what the live decisioning layer could respond to as the platform grew.",
      options: [
        {
          label: "Move more decisions offline",
          detail:
            "Precompute more of the answer and store less live state in Redis, reducing pressure on the existing architecture.",
        },
        {
          label: "Shard the Redis architecture",
          detail:
            "Distribute decisioning state horizontally so the platform could preserve its online requirements as scale increased.",
          selected: true,
        },
      ],
      rationale:
        "I drove the sharded architecture because the product still needed low-latency online decisions. The system constraint had to change without removing the live product capability it supported.",
      impact:
        "The migration improved p95 latency from 4 seconds to 300 milliseconds and reduced infrastructure costs by 30%.",
    },
    systemMap: {
      title: "How the Staff PM scope fits together",
      description:
        "A portfolio-level view of three separate initiatives, rather than a single runtime request path.",
      mode: "scope",
      steps: [
        {
          label: "Shared decisioning",
          detail:
            "Common campaign and marketplace signals → recommendation, ranking, and pacing → shared APIs and evaluation metrics",
        },
        {
          label: "GenAI creative workflow",
          detail:
            "Agent orchestration → memory and retrieval → model evaluation and review → access and retention controls",
        },
        {
          label: "Infrastructure foundation",
          detail:
            "Containerized services across AWS and GCP → Docker and Kubernetes → sharded Redis architecture",
        },
      ],
      foundation:
        "Outcome lens · recommendation response time · product decision velocity · creative revision cycles · p95 latency · infrastructure cost",
      feedback:
        "Each initiative had its own success measures; the results are kept separate below.",
    },
    leadership: [
      {
        team: "Engineering",
        alignment:
          "Converted product needs into platform abstractions, API and integration contracts, infrastructure requirements, and migration outcomes.",
      },
      {
        team: "Data science",
        alignment:
          "Defined shared signals and evaluation measures so ranking, recommendation, and pacing could be assessed consistently.",
      },
      {
        team: "Creative workflow stakeholders",
        alignment:
          "Translated a fragmented generation-and-review journey into orchestration, memory, retrieval, evaluation, and governance requirements.",
      },
      {
        team: "Product teams",
        alignment:
          "Used common interfaces to reduce repeated decision work while preserving the needs of each consuming product.",
      },
    ],
    productArtifacts: [
      {
        title: "Shared decisioning contract",
        purpose: "Define what each consuming product could rely on.",
        rows: [
          {
            label: "Inputs",
            value: "Common campaign and marketplace signals",
          },
          {
            label: "Decisions",
            value: "Recommendation, ranking, and budget pacing",
          },
          {
            label: "Interface",
            value: "APIs, integration contracts, and evaluation metrics",
          },
        ],
      },
      {
        title: "GenAI workflow specification",
        purpose: "Treat AI output as a governed product workflow.",
        rows: [
          {
            label: "Orchestration",
            value: "Agent roles, sequence, and handoffs",
          },
          {
            label: "Context",
            value: "Memory, retrieval, and data access",
          },
          {
            label: "Quality & control",
            value: "Model evaluation, review behavior, and retention rules",
          },
        ],
      },
    ],
    evidenceNote:
      "Sanitized reconstruction from role materials. The metrics below come from separate Staff PM initiatives and are not presented as one experiment.",
    outcomes: [
      "p95 infrastructure latency improved from 4s to 300ms; infrastructure costs fell 30%.",
      "Multi-agent GenAI orchestration reduced creative revision cycles by 30%.",
      "Shared decisioning reduced recommendation response time by 20% and increased product decision velocity by 25%.",
    ],
    featured: true,
    accent: "blue",
    metrics: [
      {
        value: "−20%",
        label: "Recommendation response time",
      },
      {
        value: "−30%",
        label: "Creative revision cycles",
      },
    ],
    takeaway:
      "Connecting AI orchestration, shared platform contracts, and operational performance.",
  },
  {
    slug: "whatsapp-catch-up",
    title: "WhatsApp Catch-Up",
    tagline:
      "Turn a backlog of voice notes into a reviewable summary, source-linked decisions, and replies the user controls.",
    category: "AI interaction design",
    status: "Simulated AI prototype",
    role: "Product framing, interaction design, AI output schema & build",
    timeframe: "July 2026",
    stack: [
      "React 19 & TypeScript",
      "Vite",
      "Tailwind CSS",
      "Typed mock AI data",
      "Shared audio playback state",
    ],
    flow: [
      "Voice-note cluster",
      "Review summary + inspect sources",
      "Edit a reply, then send",
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "Voice notes are easy to send and expensive to catch up on. Decisions, deadlines, and questions can be scattered across several recordings. A receiver has to listen, remember, and decide what needs a response.",
        ],
      },
      {
        heading: "The product bet",
        body: [
          "Make catch-up a recovery layer inside the conversation. The central interaction is a short loop: skim, verify the source, edit a reply, and send deliberately.",
          "I prioritized source traceability and user control over autonomous replies. A summary should help the user understand the conversation before it asks them to act.",
        ],
      },
      {
        heading: "What works in the prototype",
        body: [
          "The main scenario contains seven voice notes totaling eighteen minutes. The build includes an inline summary, detail panel, global catch-up inbox, transcript search, playback controls, and reply helper.",
          "Sending a reply updates the answered state. Topics, questions, decisions, confidence, and source timing are represented as typed data. A companion Product Sense Flow Map explains the feature logic and tradeoffs.",
        ],
      },
      {
        heading: "What is simulated",
        body: [
          "The AI outputs and conversation data are mocked. This is an interactive workflow prototype, not a live transcription or summarization service, and it does not connect to a WhatsApp account.",
          "A production version would need a privacy architecture that preserves end-to-end encryption. On-device processing and explicit consent for any cloud inference would need evaluation.",
        ],
      },
      {
        heading: "How I would evaluate it",
        body: [
          "Compare time to identify the correct decisions and unanswered questions against listening to the original notes. Track missed asks, unsupported summary claims, source-verification behavior, and edits to suggested replies.",
          "Include ambiguous commitments, conflicting dates, multiple speakers, and imperfect transcripts. Accuracy and recoverability should be checked before increasing automation. These are proposed evaluation criteria; no model-quality or user-study results are claimed.",
        ],
      },
    ],
    outcomes: [
      "An interactive catch-up workflow from voice backlog to reviewed reply.",
      "A typed schema for inspectable summaries, questions, decisions, and source segments.",
      "An explicit evaluation plan and privacy considerations for moving beyond simulated AI.",
    ],
    featured: true,
    accent: "amber",
    metrics: [
      {
        value: "7 notes",
        label: "Built-in demonstration scenario",
      },
      {
        value: "18 minutes",
        label: "Audio in the scenario",
      },
    ],
    takeaway:
      "Designing trust into an AI-assisted workflow before automating it.",
    demo: "https://pranavd0828.github.io/WhatsApp-catch-up/",
    github: "https://github.com/Pranavd0828/WhatsApp-catch-up",
    artifacts: [
      {
        label: "Product Sense Flow Map",
        url: "https://pranavd0828.github.io/WhatsApp-catch-up/product-mind-map/",
      },
    ],
  },
  {
    slug: "gmail-commitment-radar",
    title: "Gmail Commitment Radar",
    tagline:
      "Find promises and unresolved asks in email, explain the source, and let the user decide the next action.",
    category: "AI workflow design",
    status: "Simulated AI prototype",
    role: "Workflow framing, Gmail interface, persistent state & build",
    timeframe: "June 2026",
    stack: ["React 19 & TypeScript", "Vite", "Zustand", "localStorage"],
    flow: [
      "Email thread",
      "Source-backed commitment",
      "Done, snooze, or draft",
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "An email can disappear from the visible inbox while a promise inside it remains open. Tracking commitments requires noticing an obligation and moving it into a separate workflow.",
        ],
      },
      {
        heading: "The product decision",
        body: [
          "Keep triage inside the inbox and highlight the exact phrase behind a detected commitment. The user can inspect the evidence before marking it done, snoozing it, or preparing a reply.",
        ],
      },
      {
        heading: "What works",
        body: [
          "The prototype connects inbox badges, a thread view, radar panel, dashboard, settings, and draft composer. Commitment state persists locally and stays consistent across the views.",
        ],
      },
      {
        heading: "Boundaries and next evaluation",
        body: [
          "Detection is simulated. There is no live Gmail connection or model inference. This keeps the build focused on workflow and state consistency.",
          "A next evaluation would measure precision of commitment detection, incorrect deadlines, user corrections, and unresolved tasks recovered. Negation, quoted messages, and requests addressed to someone else are important failure cases.",
        ],
      },
    ],
    outcomes: [
      "A connected Gmail-style triage workflow with persistent local state.",
      "Source-phrase highlighting makes each simulated detection inspectable.",
      "The build exposes the handoff between detection and user-controlled action.",
    ],
    accent: "blue",
    takeaway:
      "Source evidence and consistent state make assistant suggestions easier to inspect.",
    demo: "https://pranavd0828.github.io/Gmail-Commitment-Radar/",
    github: "https://github.com/Pranavd0828/Gmail-Commitment-Radar",
  },
  {
    slug: "whatsapp-regional-voice",
    title: "WhatsApp Regional Voice",
    tagline:
      "Explore regional-dialect playback through a messaging prototype and a Gemini-to-ElevenLabs voice pipeline.",
    category: "Voice & AI integration",
    status: "AI integration prototype",
    role: "Problem framing, model selection, frontend & backend prototype",
    timeframe: "Dec 2025 – Jan 2026",
    stack: ["Next.js", "FastAPI", "Gemini", "ElevenLabs"],
    flow: [
      "Message text",
      "Dialect detection + transliteration",
      "Regional voice playback",
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "Generic text-to-speech can flatten the regional character of a message. I explored how playback could preserve more of that character in Hindi and Punjabi, including contexts where the user cannot look at a screen.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "A WhatsApp-style interface sends text to Gemini for dialect detection and transliteration, then to ElevenLabs with a pinned voice ID for synthesis. The prototype also includes an experimental in-car playback surface.",
          "The frontend and backend are separate so the model pipeline can change without replacing the messaging interface.",
        ],
      },
      {
        heading: "The tradeoff",
        body: [
          "I chose pinned regional voice IDs rather than cloning a sender. The output represents a regional voice, not the actual speaker’s identity.",
          "The repository includes the integration pipeline. The hosted frontend is a prototype; live synthesis depends on a configured backend and model-service credentials. It is not a WhatsApp integration or a deployed CarPlay application.",
        ],
      },
      {
        heading: "What needs evaluation",
        body: [
          "Before calling the voices authentic, I would compare pronunciation and dialect fidelity with native speakers, including mixed-language messages. I would also measure generation latency, failure rate, and cost per audio minute.",
          "Consent, retention, fallback playback, and on-device feasibility belong in production planning. No benchmark or listening-study results are presented here.",
        ],
      },
    ],
    outcomes: [
      "An integration prototype combining dialect detection, transliteration, and synthesized audio.",
      "A separate frontend/backend boundary for model iteration.",
      "A defined evaluation surface around pronunciation, latency, consent, and cost.",
    ],
    accent: "mint",
    takeaway:
      "Working across model boundaries while keeping identity and consent explicit.",
    demo: "https://pranavd0828.github.io/Whatsapp-Regional-Voice-Over-AI/",
    github: "https://github.com/Pranavd0828/Whatsapp-Regional-Voice-Over-AI",
  },
  {
    slug: "maps-meet-mode",
    title: "Google Maps: Meet Halfway",
    tagline:
      "Rank meetup venues around the burden of the longest trip, rather than relying on a geometric midpoint.",
    category: "Ranking & product strategy",
    status: "Prototype · estimated travel",
    role: "Problem framing, fairness formula & prototype build",
    timeframe: "Jan – Feb 2026",
    stack: ["React & Vite", "Google Places API", "Custom fairness scoring"],
    flow: [
      "Group locations",
      "Venue candidates + estimated travel",
      "Ranked meetup options",
    ],
    sections: [
      {
        heading: "The product question",
        body: [
          "For a group choosing where to meet, a geometric midpoint does not answer whether the trip is reasonable for everyone. I explored ranking real venues with a penalty for long and uneven commutes.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "Users add locations; the prototype searches for nearby venue candidates and ranks them with a weighted commute score. A simulation fallback allows the interaction to remain demonstrable when the Places service is unavailable.",
        ],
      },
      {
        heading: "The important limitation",
        body: [
          "Travel times are simulated using distance, an assumed urban speed, and a random multiplier. They are not live routes, traffic estimates, or validated commute predictions.",
          "The original score combines maximum commute and variance. A production score should normalize those quantities before weighting them because time and variance use different units. The weights also need sensitivity testing and user feedback.",
        ],
      },
      {
        heading: "How I would improve the decision",
        body: [
          "Evaluate candidate coverage beyond a centroid search radius, especially around water, transit barriers, and uneven travel modes. Use real route estimates for shortlisted candidates and explain who travels farther.",
          "The next useful comparison is group acceptance and time to agreement against simpler baselines. This prototype does not establish a measured improvement in either metric.",
        ],
      },
    ],
    outcomes: [
      "A group venue-ranking interaction with an explicit fairness objective.",
      "A simulated travel model that makes ranking tradeoffs explorable.",
      "Clear next steps for route accuracy, score normalization, and candidate coverage.",
    ],
    accent: "blue",
    takeaway:
      "A ranking formula is a product hypothesis that needs normalization and validation.",
    demo: "https://google-maps-meet-mode.vercel.app/",
    github: "https://github.com/Pranavd0828/Google-Maps-Meet-Mode",
  },
  {
    slug: "rescue-offers",
    title: "Rescue Radar",
    tagline:
      "A time-sensitive marketplace concept for rediscovering canceled food orders nearby.",
    category: "Marketplace design",
    status: "Interaction prototype",
    role: "Marketplace framing, offer lifecycle & build",
    timeframe: "January 2026",
    stack: ["React & Vite", "React Leaflet", "React Context"],
    flow: [
      "Nearby rescue offer",
      "Review + temporary hold",
      "Simulated checkout",
    ],
    sections: [
      {
        heading: "The product question",
        body: [
          "Could a canceled, prepared order become a useful nearby offer? The prototype explores discovery, urgency, and framing rather than a real delivery operation.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "A discovery feed, map, ninety-second hold timer, and simulated checkout share offer state. Cached copy supports the demonstration without live language-model calls.",
        ],
      },
      {
        heading: "Tradeoffs and boundaries",
        body: [
          "There is no delivery backend, payment processing, or live inventory. Discounts, activity, and environmental figures belong to the demonstration scenario and are not measured marketplace outcomes.",
          "Before launch, food handling, order eligibility, customer trust, rider rerouting, refunds, and unit economics would need validation. A countdown alone does not establish that a resale window is operationally safe or usable.",
        ],
      },
      {
        heading: "Next evaluation",
        body: [
          "Compare clear savings-led messaging with the sustainability framing. Measure comprehension, offer acceptance, expired holds, and whether customers understand the condition of the order. Retention and waste reduction remain hypotheses.",
        ],
      },
    ],
    outcomes: [
      "A connected offer lifecycle across feed, map, timer, and simulated checkout.",
      "A concrete surface for testing urgency and trust.",
      "Operational and measurement questions separated from the interaction prototype.",
    ],
    accent: "amber",
    takeaway:
      "Marketplace interaction design only works when operational constraints are explicit.",
    demo: "https://pranavd0828.github.io/Food-Delivery---Post-Cancellation-Rescue-Offers/",
    github:
      "https://github.com/Pranavd0828/Food-Delivery---Post-Cancellation-Rescue-Offers",
  },
  {
    slug: "linkedin-messaging-formatting",
    title: "LinkedIn Messaging: Formatting",
    tagline:
      "Explore lightweight rich-text composition inside a familiar professional messaging interface.",
    category: "Interaction craft",
    status: "Interaction prototype",
    role: "Problem framing, interface recreation & formatting logic",
    timeframe: "Nov 2025 – Jan 2026",
    stack: ["HTML, CSS & JavaScript", "Vite", "Native contenteditable"],
    flow: [
      "Compose a message",
      "Add structure + emphasis",
      "Review formatted text",
    ],
    sections: [
      {
        heading: "The product question",
        body: [
          "Professional messages often include several asks, a short introduction, or a number worth emphasizing. I explored how a formatting surface could add structure without crowding the default compose experience.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "A LinkedIn-style messaging recreation with a working rich-text composer using native contenteditable APIs. The prototype is a separate application and does not modify LinkedIn or send messages through it.",
        ],
      },
      {
        heading: "The tradeoff",
        body: [
          "Native editing APIs keep the build small, but a production editor needs deliberate handling of selection, undo, pasted content, keyboard shortcuts, and accessibility. Messages do not persist after reload in this prototype.",
        ],
      },
      {
        heading: "Next evaluation",
        body: [
          "Test whether recipients understand multi-part asks more accurately, then inspect how formatted content survives notifications and plain-text fallbacks. Improved reply rates are a hypothesis, not a measured result.",
        ],
      },
    ],
    outcomes: [
      "A working formatting interaction in a familiar compose context.",
      "A lightweight implementation for exploring the core interaction.",
      "Production questions made concrete: paste, undo, accessibility, and rendering fallbacks.",
    ],
    accent: "blue",
    takeaway:
      "Small interface changes have consequences across the whole message lifecycle.",
    demo: "https://pranavd0828.github.io/LinkedIn-Messaging-with-Formatting-Option/",
    github:
      "https://github.com/Pranavd0828/LinkedIn-Messaging-with-Formatting-Option",
  },
  {
    slug: "kindle-crew",
    title: "Read with Your Crew",
    tagline:
      "Explore a daily reading ritual through progress, shared momentum, and gentle accountability.",
    category: "Consumer product design",
    status: "Interaction prototype",
    role: "Habit design, state modeling & build",
    timeframe: "Dec 2025 – Jan 2026",
    stack: ["React & Vite", "React Context", "localStorage"],
    flow: [
      "Set a daily intention",
      "Read + track progress",
      "Share momentum with a crew",
    ],
    sections: [
      {
        heading: "The product question",
        body: [
          "Could a lightweight social layer help readers return to a book? I explored daily progress and crew nudges without making a missed day feel like losing all progress.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "A daily progress ring, momentum indicator, time-based page validation, and a crew dashboard. Local storage preserves progress without account creation. This is a standalone concept, not an Amazon or Kindle integration.",
        ],
      },
      {
        heading: "The tradeoff",
        body: [
          "Time on a page is a proxy for engagement, not proof of reading or comprehension. A production experience should account for reading speed, assistive technology, and the possibility that social comparison creates pressure.",
        ],
      },
      {
        heading: "Next evaluation",
        body: [
          "Compare return-to-reading behavior and self-reported motivation with and without crew visibility. Inspect nudge fatigue and opt-out behavior. The prototype does not establish a retention lift.",
        ],
      },
    ],
    outcomes: [
      "A connected daily-progress and crew interaction.",
      "Local persistence supports repeated exploration without login.",
      "A clear distinction between activity proxies and meaningful reading outcomes.",
    ],
    accent: "amber",
    takeaway:
      "Designing a habit includes deciding what the progress metric cannot tell you.",
    demo: "https://pranavd0828.github.io/Read-with-your-Crew-in-Kindle/",
    github: "https://github.com/Pranavd0828/Read-with-your-Crew-in-Kindle",
  },
  {
    slug: "flappy-eagle",
    title: "Just One Flap",
    tagline:
      "A small canvas game exploring how physics tuning changes the feel of an interaction.",
    category: "Play & prototyping",
    status: "Playable prototype",
    role: "Physics tuning, game prototype & mobile packaging",
    timeframe: "February 2026",
    stack: ["JavaScript", "Canvas", "Vite", "Capacitor"],
    flow: ["Tap", "Physics + collision feedback", "Retry"],
    sections: [
      {
        heading: "The question",
        body: [
          "How much of an interaction’s feel comes from the underlying engine, and how much comes from the tuning? A small game provides a direct way to explore that question.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "A playable canvas game using JavaScript modules and Vite. Capacitor packaging provides a path to iOS and Android builds from the web codebase; packaging is not a claim of app-store release.",
        ],
      },
      {
        heading: "The scope",
        body: [
          "The prototype concentrates on input, gravity, collision, and retry. Persistent leaderboards and sound design are outside this version.",
          "The next evaluation would compare input responsiveness and early-session behavior across devices and physics settings. No retention or performance benchmark is claimed.",
        ],
      },
    ],
    outcomes: [
      "A playable canvas game without a dedicated game engine.",
      "Mobile packaging alongside the web build.",
      "A compact environment for practicing interaction tuning.",
    ],
    accent: "mint",
    takeaway:
      "Product craft includes the timing and feedback of the smallest interaction.",
    demo: "https://pranavd0828.github.io/flappy-eagle/",
    github: "https://github.com/Pranavd0828/flappy-eagle",
  },
];
