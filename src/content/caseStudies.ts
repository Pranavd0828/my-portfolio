import { profile } from './profile.ts';

export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  status: string;
  role: string;
  timeframe: string;
  timeframeLabel?: string;
  roleLabel?: string;
  stack: string[];
  flow: string[];
  sections: { heading: string; body: string[] }[];
  outcomeNote?: string;
  illustration?: "campaign" | "creative";
  outcomes: string[];
  takeaway: string;
  accent: string;
  featured?: boolean;
  metrics?: { value: string; label: string }[];
  video?: { name: string; description: string; sound?: boolean };
  demo?: string;
  demoLabel?: string;
  demoNotice?: string;
  github?: string;
  artifacts?: { label: string; url: string }[];
  decision?: {
    question: string;
    framing?: string;
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
    timeframe: profile.careerContext,
    timeframeLabel: "Career context",
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
    illustration: "campaign",
    sections: [
      {
        heading: "The problem",
        body: [
          "An advertiser knows the business outcome they want. They should not have to understand every delivery lever to pursue it. At Rakuten, campaign economics had relied on manual configuration. Spend, commission rates, customer rewards, and delivery decisions needed to work together.",
          "Programmatic Loyalty made that a product problem: let an advertiser express a spend goal and target return, review a recommendation, and activate a campaign whose delivery the platform could manage. The customer still needed a relevant offer worth choosing. More exposure alone was not the goal.",
        ],
      },
      {
        heading: "My ownership",
        body: [
          "I led the product from idea to launch. Advertiser conversations informed the requirements; I defined the workflow and initial wireframes, and partnered with design to develop the experience. With engineering and data science, I translated the business goal into recommendations, delivery requirements, and a practical launch scope.",
          "An advertiser supplied monthly spend and a target return on ad spend, or ROAS. The product recommended an effective commission rate. Once the advertiser accepted and configured it through their affiliate network, the system could manage customer incentives and delivery against those goals. A target was an input to the product, not a claim of incremental return.",
          "My responsibility was the product definition and the choices connecting the advertiser experience to the underlying systems. Engineering and data science developed the implementation. That distinction matters: the workflow, economics, and operating requirements had to be agreed together.",
        ],
      },
      {
        heading: "The commercial judgment",
        body: [
          "Advertiser goals and platform margin did not always point in the same direction. My work involved looking beyond margin percentage to the total economic value of the program. A recommendation needed to be useful to the advertiser and sustainable for the platform, rather than optimize one ratio in isolation.",
          "The same discipline applied to model complexity. Starting with simpler targeting and scoring let us learn before taking on a more demanding model rollout. The product question was what would improve the decision enough to justify the additional implementation and operating cost.",
        ],
      },
      {
        heading: "Making forecasts useful to advertisers",
        body: [
          "The advertiser journey began with recommendations and forecasts. I partnered with data science on improving the estimates through better training of our NeuralProphet forecasting model. My role was to connect the forecasting work to the recommendation experience and advertiser expectations; the modeling team owned training and implementation.",
          "The product question was whether the estimates gave advertisers a more useful basis for planning. Forecast quality and the speed of a live recommendation are separate measures.",
        ],
      },
    ],
    decision: {
      question:
        "How much should a live campaign react to fresh signals?",
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
        "Engineering challenged my initial preference for more intraday responsiveness. I adjusted scope: keep the online decision simple, refresh precomputed guidance at a useful cadence, and use conservative behavior when state is stale or missing. The advertiser needed predictable delivery, not real-time complexity for its own sake.",
      impact:
        "The product kept a clear boundary between optimization based on settled outcomes and fast enforcement during delivery. We tracked return, budget utilization, latency, and fallback behavior. This decision is not presented as the isolated cause of the revenue result.",
    },
    systemMap: {
      title: "From advertiser goal to measurable outcome",
      description:
        "A product-level reconstruction. Immediate engagement signals and settled financial outcomes serve different purposes; they are not interchangeable evidence.",
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
          "Created initial advertiser-workflow wireframes and requirements; partnered with design on the developed experience.",
      },
      {
        team: "Sales & revenue operations",
        alignment:
          "Translated advertiser needs and campaign setup constraints into requirements for the product and operating workflow.",
      },
      {
        team: "Leadership",
        alignment:
          "Framed the commercial opportunity and initial product scope, then aligned delivery around the advertiser workflow.",
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
            value: "Additional workflow depth beyond the first goal-to-activation path",
          },
          {
            label: "Reason",
            value:
              "Validate the highest-leverage workflow before expanding the operating surface",
          },
        ],
      },
      {
        title: "A retrospective decision scorecard",
        purpose: "An explanatory review framework, not a reproduced launch scorecard.",
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
      "The five-month pilot recorded $182M in product revenue. Programmatic Loyalty later grew to more than $500M in annual product revenue.",
      "The product translated advertiser goals into commission recommendations, pacing, and customer incentives.",
      "Online optimization used low-latency state while settled financial outcomes remained the source of truth.",
    ],
    outcomeNote: "The pilot total and annual revenue cover different periods and should not be compared as a growth rate. Both describe product revenue, not personal incremental revenue or the result of one experiment. Reporting years are not specified here.",
    featured: true,
    accent: "mint",
    metrics: [
      {
        value: "$500M+",
        label: "Annual product revenue",
      },

    ],
    takeaway:
      "Product leadership across marketplace economics, recommendations, and real-time data.",
  },
  {
    slug: "rakuten-ai-platform",
    title: "Shared decisions. Reviewable AI. Reliable product foundations.",
    tagline:
      "At Rakuten, I lead product work across shared decisioning, multi-agent creative workflows, and the infrastructure that supports them.",
    category: "AI platforms & infrastructure",
    status: "Professional work",
    role: `${profile.currentTitle} · ${profile.employer}`,
    roleLabel: "Current role",
    timeframe: profile.currentRolePeriod,
    timeframeLabel: "Current role period",
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
    illustration: "creative",
    sections: [
      {
        heading: "The problem",
        body: ["A successful product creates repeated decisions: what to recommend, how to pace a budget, which creative to revise, and how quickly the system must respond. These are different problems. My platform work at Rakuten brings product requirements to each, rather than treating every problem as a reason to add AI."],
      },
      {
        heading: "My ownership",
        body: ["I have led product requirements for a common decisioning layer, multi-agent creative workflows, and cloud infrastructure. My contribution spans platform abstractions, APIs, integration contracts, orchestration requirements, and success measures developed with engineering and data science. These initiatives span my Rakuten tenure; my June 2026 Staff promotion is not their shared start date."],
      },
      {
        heading: "Shared decisioning",
        body: [
          "Recommendation, ranking, and budget-pacing logic had grown across separate systems. I worked on bringing that logic over shared campaign and marketplace signals into a common decisioning layer, with APIs and integration contracts that consuming products could use.",
          "The product responsibility was to define the abstraction and its success measures with engineering and data science. Sharing an interface does not mean every surface should have the same objective. A useful platform makes the shared behavior explicit while keeping the consumer product accountable for its experience.",
          "For customers, the product decision was which personalized cash-back offer to show and where in the journey to present it. My platform work connected those decisions to shared requirements and interfaces. In reviewing the platform, I would assess recommendation quality, response time, adoption, and integration effort separately.",
        ],
      },
      {
        heading: "AI creative workflows",
        body: [
          "Creative generation and review were fragmented. I led product architecture for a multi-agent GenAI orchestration platform, defining agent orchestration, memory and retrieval requirements, evaluation, and data-access and retention controls. The purpose was a more useful creative workflow, not autonomy as an end in itself.",
          "The distinction I want a reviewer to inspect is between generating a suggestion and having authority to act on it. Rules can handle explicit requirements; model-assisted interpretation introduces uncertainty. The example below illustrates how I would make that boundary reviewable. It is a synthetic product explanation, not a claim about the exact production approval policy.",
          "The reported operational outcome was a 30% reduction in manual interventions in the creative workflow. This measures human involvement in the process, not model accuracy, cost savings, or the number of revision rounds. The example below makes the product questions concrete without reproducing internal assets.",
        ],
      },
      {
        heading: "Infrastructure as a product investment",
        body: [
          "As platform scale increased, I owned technical product requirements for containerized services across AWS and GCP and drove the migration toward a sharded Redis architecture with the platform and ad infrastructure teams. The product question was which online capabilities the investment needed to preserve.",
          "The remembered alternative was to precompute more decisions offline and store fewer values in Redis. That could reduce online state, but it would also change what remained available to live decisions. Engineering owned architecture and implementation; my contribution was the requirements, prioritization, and product tradeoff.",
          "The infrastructure work combined Redis for near-real-time access with PostgreSQL and Kafka pipeline optimizations. The reported result was a 30% reduction in infrastructure costs across that work. My responsibility was to prioritize a responsive customer experience alongside reliability and operating cost; engineering owned the implementation.",
        ],
      },
      {
        heading: "Experimentation and incentives",
        body: [
          "Earlier at Rakuten, I launched Personalized Rewards for new and lapsed customer cohorts. I designed randomized experiments using CUPED, a pre-period adjustment intended to reduce estimator variance during high-variance seasonal periods. The reported result was a 32% lift in new-buyer acquisition.",
          "That is a reported acquisition result, not a percentage-point claim. The public account does not provide the randomization unit, sample size, interval, or experiment window, so it should not be read as a complete statistical report.",
          "A separate initiative used similar-store proxy signals for propensity modeling where merchants had sparse history, partnering with data science. The reported outcome was a 16% improvement in Net GMV over 12 months. Net GMV is distinct from product revenue and new-buyer acquisition; these results are not combined into one claimed experiment.",
          "A retrospective review would examine assignment quality, incentive cost, cohort differences, and persistence of the effect before expanding a program. These are the questions I would ask, not additional historical results.",
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
        "I supported scaling the state layer to preserve online product requirements. The remembered alternative was greater precomputation with fewer stored values. This summary describes the product rationale; it does not claim that I implemented the sharding design.",
      impact:
        "The broader infrastructure work reported 30% lower infrastructure costs. That result spans Redis, PostgreSQL, and Kafka optimizations and is not attributed to sharding alone. An exact latency improvement is omitted because the measured request path is not established.",
    },
    systemMap: {
      title: "Three distinct product responsibilities",
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
        "Each initiative has a separate outcome: useful shared decisions, better creative workflows, or dependable online capabilities.",
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
      "Sanitized reconstruction from role materials. These initiatives span my work at Rakuten. The current-role date describes my Staff promotion, not the start of every project. Results are reported for separate initiatives, not one experiment.",
    outcomes: [
      "Shared recommendation, ranking, and pacing logic was brought into a common decisioning layer with defined interfaces.",
      "Creative workflow work combined orchestration with memory, retrieval, evaluation, and data controls.",
      "Infrastructure work addressed the online capability behind those product requirements.",
    ],
    featured: true,
    accent: "blue",
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
    demoLabel: "Explore the interface",
    video: { name: "regional-voice", sound: true, description: "Recorded concept: Rahul asks where the recipient has reached, using the message Bhai, kaha pohcha? A playback control demonstrates regional voice delivery over a navigation-style interface." },
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
    video: { name: "meet-halfway", description: "Recorded walkthrough: two starting locations, venue categories, and a recommended meeting point. Travel values are prototype estimates." },
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
    demoNotice: "The hosted demo currently shows a Google Maps loading error. The case study and source code remain available. The map service needs repair before the full experience can be demonstrated.",
    github: "https://github.com/Pranavd0828/Google-Maps-Meet-Mode",
  },
  {
    slug: "rescue-offers",
    video: { name: "rescue-radar", description: "Recorded walkthrough of nearby rescue offers, food categories, and a short reservation flow. Prices and availability are simulated." },
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
    demoNotice: "Watch the recorded walkthrough below. The hosted prototype currently shows a map-provider error on offer pages. Its feed and sample hold timer work, but inventory, reservations, and checkout are simulated.",
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
