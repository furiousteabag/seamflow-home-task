// Single source of truth for marketing navigation and page content.
// Every href here must resolve to a real route or anchor.

export type Solution = {
  slug: string;
  name: string;
  icon: "ticket" | "utensils" | "shield" | "landmark" | "store" | "plane";
  tagline: string;
  hero: string;
  problem: string;
  outcomes: { metric: string; label: string }[];
  capabilities: { title: string; body: string }[];
  customer: string;
};

export const solutions: Solution[] = [
  {
    slug: "stadiums-and-venues",
    name: "Stadiums & Venues",
    icon: "ticket",
    tagline: "Concession intelligence at 60,000-seat scale",
    hero: "Verify every hot dog that leaves the stand, from first pitch to final whistle.",
    problem:
      "Concession operators sell tens of thousands of hot dogs per event, yet most venues still rely on visual inspection by seasonal staff. Misfiled bratwursts distort inventory, and nobody can prove what was actually served.",
    outcomes: [
      { metric: "< 2 s", label: "verdict per tray photo" },
      { metric: "100%", label: "binary decisions, no 'maybe'" },
      { metric: "1 log", label: "per scan, kept for audit" },
    ],
    capabilities: [
      {
        title: "Point-of-sale verification",
        body: "Staff snap the tray before hand-off. SeeFood returns Hot Dog or Not Hot Dog before the customer has found their napkins.",
      },
      {
        title: "Event-level analytics",
        body: "Hot dog ratio, latency and reviewer agreement per event, ready for the post-game ops review.",
      },
      {
        title: "Works when the Wi-Fi doesn't",
        body: "History and analytics stay available on-device when 60,000 fans saturate the network, and sync afterwards.",
      },
    ],
    customer: "hooli-arena",
  },
  {
    slug: "quick-service-restaurants",
    name: "Quick-Service Restaurants",
    icon: "utensils",
    tagline: "Menu integrity across every location",
    hero: "Make sure the item on the screen is the item in the bag.",
    problem:
      "Franchise networks struggle to keep photography, menus and actual output consistent. A sausage on a plate is not a hot dog, and customers notice.",
    outcomes: [
      { metric: "1 API", label: "call per menu photo" },
      { metric: "2", label: "possible answers, both actionable" },
      { metric: "0", label: "sandwiches misfiled as hot dogs" },
    ],
    capabilities: [
      {
        title: "Menu photo QA",
        body: "Run every new menu image through the REST API before it ships to digital boards.",
      },
      {
        title: "Franchise audit trail",
        body: "Every verdict is logged with image, model and latency, so regional managers can review disputes.",
      },
      {
        title: "Human-in-the-loop review",
        body: "Store managers confirm or flag verdicts, producing a measured accuracy figure per location.",
      },
    ],
    customer: "endframe-foods",
  },
  {
    slug: "food-safety-and-compliance",
    name: "Food Safety & Compliance",
    icon: "shield",
    tagline: "Defensible classification for regulated kitchens",
    hero: "When an auditor asks 'was that a hot dog?', have the answer on file.",
    problem:
      "Compliance teams need evidence, not opinions. Spreadsheets of hand-labelled photos don't survive an audit.",
    outcomes: [
      { metric: "Full", label: "image, verdict and model lineage" },
      { metric: "CSV", label: "export for auditors on demand" },
      { metric: "Per-user", label: "data isolation by default" },
    ],
    capabilities: [
      {
        title: "Immutable scan records",
        body: "Each classification stores the original image privately alongside verdict, confidence, reasoning and model version.",
      },
      {
        title: "Reviewer feedback",
        body: "Disagreements are captured as structured feedback, so accuracy is measured rather than assumed.",
      },
      {
        title: "Prompt-injection hardening",
        body: "Text inside an image is treated as part of the picture, never as an instruction. A sign saying 'hot dog' changes nothing.",
      },
    ],
    customer: "raviga-hospitality",
  },
  {
    slug: "public-sector",
    name: "Public Sector",
    icon: "landmark",
    tagline: "Mission-ready hot dog determination",
    hero: "Binary food intelligence for agencies that cannot afford ambiguity.",
    problem:
      "Public institutions procure food at enormous scale and are accountable for every line item. Ambiguous categorisation creates audit findings.",
    outcomes: [
      { metric: "Sovereign", label: "tier with dedicated instance" },
      { metric: "Annual", label: "procurement-friendly contracts" },
      { metric: "HDPA", label: "aligned controls" },
    ],
    capabilities: [
      {
        title: "Dedicated deployment",
        body: "The Sovereign tier runs on an isolated instance with its own database, storage and sync service.",
      },
      {
        title: "Procurement support",
        body: "Security questionnaires, DPAs and annual invoicing handled by a named account team.",
      },
      {
        title: "Accessibility",
        body: "Keyboard-navigable workspace with semantic markup and high-contrast verdicts.",
      },
    ],
    customer: "hooli-arena",
  },
  {
    slug: "retail-and-cpg",
    name: "Retail & CPG",
    icon: "store",
    tagline: "Shelf and packaging verification",
    hero: "Confirm the product photo matches the product category, at catalog scale.",
    problem:
      "Packaged-goods catalogs contain thousands of images. One mislabelled frankfurter pack becomes a marketplace listing problem.",
    outcomes: [
      { metric: "Batch", label: "via REST API and API keys" },
      { metric: "< 2 s", label: "median verdict latency" },
      { metric: "1", label: "workspace for every channel" },
    ],
    capabilities: [
      {
        title: "Catalog ingestion",
        body: "Classify listing images through the API; results land in the same audit log as web scans.",
      },
      {
        title: "Channel attribution",
        body: "Every scan records whether it came from the web workspace or the API.",
      },
      {
        title: "Scoped API keys",
        body: "Issue, rotate and revoke keys per integration. Keys are hashed at rest and shown once.",
      },
    ],
    customer: "endframe-foods",
  },
  {
    slug: "travel-and-hospitality",
    name: "Travel & Hospitality",
    icon: "plane",
    tagline: "In-flight and event catering assurance",
    hero: "From the galley to the gala, know exactly what's being served.",
    problem:
      "Caterers work in kitchens without reliable connectivity and with menus that change daily. They need answers that travel with them.",
    outcomes: [
      { metric: "Offline", label: "workspace with automatic sync" },
      { metric: "Any", label: "device with a camera" },
      { metric: "Live", label: "analytics per event" },
    ],
    capabilities: [
      {
        title: "Camera-first capture",
        body: "Shoot directly from a phone; images are compressed on-device before upload.",
      },
      {
        title: "Offline history",
        body: "Past verdicts, thumbnails and analytics live on the device and sync when connectivity returns.",
      },
      {
        title: "Per-event reporting",
        body: "Hot dog share, latency and reviewer agreement for every service.",
      },
    ],
    customer: "aviato-air",
  },
];

export type CustomerStory = {
  slug: string;
  company: string;
  industry: string;
  headline: string;
  summary: string;
  metrics: { value: string; label: string }[];
  challenge: string;
  solution: string;
  results: string[];
  quote: { text: string; author: string; role: string };
};

export const customers: CustomerStory[] = [
  {
    slug: "hooli-arena",
    company: "Hooli Arena",
    industry: "Stadiums & Venues",
    headline:
      "Hooli Arena replaced a 12-person review committee with one API call",
    summary:
      "The home of the Hooli XYZ esports league standardised concession verification across 48 stands.",
    metrics: [
      { value: "48", label: "concession stands onboarded" },
      { value: "12 → 0", label: "manual reviewers" },
      { value: "< 2 s", label: "verdict at the counter" },
    ],
    challenge:
      "Hooli Arena's concessions team reviewed tray photos by hand after every event. Reports took a week, and nobody agreed on whether a chili dog counted.",
    solution:
      "Staff now photograph each tray at hand-off. SeeFood returns a verdict at the counter, and every scan lands in an audit log that operations reviews the next morning.",
    results: [
      "Same-day concession reports instead of week-long reviews",
      "A single, defensible definition of 'hot dog' across all stands",
      "Analytics that survive network congestion during sold-out events",
    ],
    quote: {
      text: "Hooli isn't about hot dogs. It's about making the world a better place through binary food classification.",
      author: "Gavin Belson",
      role: "Founder & CEO, Hooli (fictional)",
    },
  },
  {
    slug: "aviato-air",
    company: "Aviato",
    industry: "Travel & Hospitality",
    headline: "Aviato keeps catering verified at 35,000 feet",
    summary:
      "Aviato's in-flight catering team classifies meals offline in the galley and syncs on landing.",
    metrics: [
      { value: "Offline", label: "galley workflow" },
      { value: "100%", label: "of meals logged" },
      { value: "1", label: "workspace across all routes" },
    ],
    challenge:
      "Galley crews have no connectivity in flight, and the catering vendor kept substituting bratwursts.",
    solution:
      "Crews review scan history and analytics offline on a tablet; new scans are captured on the ground and every verdict syncs automatically when the aircraft reconnects.",
    results: [
      "Vendor substitutions caught before departure",
      "A full audit trail available to the catering contract manager",
      "No dependency on in-flight Wi-Fi",
    ],
    quote: {
      text: "Aviato. Aviato. My company, Aviato, now knows what it serves.",
      author: "Erlich Bachman",
      role: "Founder, Aviato (fictional)",
    },
  },
  {
    slug: "endframe-foods",
    company: "Endframe Foods",
    industry: "Quick-Service Restaurants",
    headline: "Endframe Foods audits 3,000 menu photos before launch",
    summary:
      "A fast-growing QSR chain uses the SeeFood API to keep digital menu boards honest.",
    metrics: [
      { value: "3,000", label: "menu photos classified" },
      { value: "API", label: "integrated into CMS publishing" },
      { value: "0", label: "sausages shipped as hot dogs" },
    ],
    challenge:
      "Endframe's marketing team reused stock imagery across regions, and a sausage-on-a-plate photo ended up advertising the hot dog combo.",
    solution:
      "Their CMS now calls the SeeFood REST API on every upload and blocks publication when the verdict doesn't match the menu category.",
    results: [
      "Menu-photo QA moved from spreadsheet to pipeline",
      "Disputed verdicts resolved with stored reasoning and confidence",
      "API keys scoped per environment and rotated quarterly",
    ],
    quote: {
      text: "We did middle-out compression for images. Then we realised we just needed to know if it was a hot dog.",
      author: "Endframe engineering lead",
      role: "Endframe Foods (fictional)",
    },
  },
  {
    slug: "raviga-hospitality",
    company: "Raviga Hospitality Group",
    industry: "Food Safety & Compliance",
    headline: "Raviga makes hot dog classification audit-ready",
    summary:
      "A portfolio of 30 restaurants standardised evidence for food-category audits.",
    metrics: [
      { value: "30", label: "restaurants in one workspace" },
      { value: "Full", label: "image and model lineage" },
      { value: "Hours", label: "not weeks, to answer an auditor" },
    ],
    challenge:
      "Raviga's auditors asked for proof of categorisation decisions. The evidence lived in group chats.",
    solution:
      "Every classification is stored with the original image, verdict, confidence, reasoning and model version. Reviewers confirm or flag results, producing a measured accuracy number.",
    results: [
      "Audit evidence assembled from the workspace in hours",
      "Reviewer feedback turned into a tracked accuracy KPI",
      "Per-user isolation for franchisee data",
    ],
    quote: {
      text: "I don't need to understand the model. I need to know it says 'hot dog' or 'not hot dog', and I need the receipt.",
      author: "Laurie Bream",
      role: "Managing Partner, Raviga (fictional)",
    },
  },
];

export const tiers = [
  {
    slug: "enterprise",
    name: "Enterprise",
    blurb: "For organizations standardising hot dog classification.",
    features: [
      "Unlimited web workspace seats",
      "Scan history, audit log & CSV export",
      "Reviewer feedback & accuracy analytics",
      "REST API with scoped API keys",
      "Offline-ready workspace",
      "Business-hours support",
    ],
  },
  {
    slug: "enterprise-plus",
    name: "Enterprise Plus",
    blurb: "For multi-site operators with production hot dog workloads.",
    featured: true,
    features: [
      "Everything in Enterprise",
      "Single sign-on (Google Workspace)",
      "Priority API throughput",
      "99.9% uptime commitment",
      "Named customer success manager",
      "24/7 support with 1-hour response",
    ],
  },
  {
    slug: "sovereign",
    name: "Sovereign",
    blurb: "For the public sector and regulated industries.",
    features: [
      "Everything in Enterprise Plus",
      "Dedicated, isolated instance",
      "Custom data retention",
      "Security review & DPA support",
      "Annual invoicing & PO billing",
      "Executive business reviews",
    ],
  },
] as const;

export const comparison: {
  group: string;
  rows: { label: string; values: [string, string, string] }[];
}[] = [
  {
    group: "Classification",
    rows: [
      { label: "Hot Dog / Not Hot Dog verdicts", values: ["✓", "✓", "✓"] },
      { label: "Confidence score & reasoning", values: ["✓", "✓", "✓"] },
      { label: "Hot Dog Score", values: ["✓", "✓", "✓"] },
      {
        label: "API throughput",
        values: ["Standard", "Priority", "Dedicated"],
      },
    ],
  },
  {
    group: "Governance",
    rows: [
      { label: "Audit log with image lineage", values: ["✓", "✓", "✓"] },
      { label: "CSV export", values: ["✓", "✓", "✓"] },
      { label: "Single sign-on", values: ["—", "✓", "✓"] },
      { label: "Custom data retention", values: ["—", "—", "✓"] },
      { label: "Dedicated instance", values: ["—", "—", "✓"] },
    ],
  },
  {
    group: "Support",
    rows: [
      { label: "Support hours", values: ["Business", "24/7", "24/7"] },
      {
        label: "Response time",
        values: ["1 business day", "1 hour", "1 hour"],
      },
      { label: "Named success manager", values: ["—", "✓", "✓"] },
      { label: "Uptime commitment", values: ["—", "99.9%", "99.95%"] },
    ],
  },
];

export const leadership = [
  {
    name: "Jian Yang",
    role: "Founder & Chief Executive Officer",
    bio: "Created the original SeeFood app. Believes there are only two kinds of food.",
  },
  {
    name: "Erlich Bachman",
    role: "Chief Visionary Officer",
    bio: "Former incubator owner. Responsible for the vision, the keynote, and the hoodie.",
  },
  {
    name: "Monica Hall",
    role: "Chief Financial Officer",
    bio: "Previously at Raviga Capital. Keeps the hot dog unit economics honest.",
  },
  {
    name: "Bertram Gilfoyle",
    role: "Chief Information Security Officer",
    bio: "Runs infrastructure and security. Would like you to stop asking about the cloud.",
  },
];

export const openings = [
  {
    title: "Senior Hot Dog Annotation Lead",
    team: "AI Quality",
    location: "Palo Alto · Hybrid",
  },
  {
    title: "Enterprise Account Executive, Stadiums",
    team: "Sales",
    location: "Remote · US",
  },
  {
    title: "Staff Engineer, Sync & Offline",
    team: "Platform",
    location: "Remote · EMEA",
  },
  {
    title: "Solutions Engineer, Public Sector",
    team: "Sales Engineering",
    location: "Washington, D.C.",
  },
  { title: "Head of Not Hot Dog", team: "Product", location: "Palo Alto" },
];

export const frameworks = [
  {
    name: "HDPA",
    full: "Hot Dog Portability and Accountability",
    body: "Controls for the handling, storage and lineage of hot dog imagery.",
  },
  {
    name: "BUN-2",
    full: "Binary Unambiguous Notation, Type II",
    body: "Every classification produces exactly one of two outcomes, every time.",
  },
  {
    name: "ISO-HD",
    full: "Internal Standard for Obvious Hot Dogs",
    body: "Our published definition: a sausage served in a sliced bun.",
  },
];

export const subprocessors = [
  {
    name: "Anthropic",
    purpose: "Image analysis (Claude vision models)",
    region: "United States",
  },
  {
    name: "Supabase",
    purpose: "Authentication, Postgres database, private image storage",
    region: "United States (us-east-1)",
  },
  {
    name: "Vercel",
    purpose: "Application hosting and edge network",
    region: "Global",
  },
  {
    name: "PowerSync",
    purpose: "Offline sync of scan history",
    region: "European Union",
  },
  { name: "Google", purpose: "Optional sign-in with Google", region: "Global" },
];

export const resources = [
  {
    kind: "Report",
    title: "The State of Hot Dogs 2026",
    body: "Why binary classification beats 'it's complicated', with benchmarks from the SeeFood workspace.",
    href: "/resources/state-of-hot-dogs-2026",
    cta: "Read the report",
  },
  {
    kind: "Customer story",
    title: "Hooli Arena replaced a 12-person review committee",
    body: "How a 48-stand venue moved concession verification to the counter.",
    href: "/customers/hooli-arena",
    cta: "Read the story",
  },
  {
    kind: "Documentation",
    title: "REST API v1 reference",
    body: "Authenticate with an API key and classify an image in one request.",
    href: "/docs",
    cta: "Open the docs",
  },
  {
    kind: "Trust",
    title: "Security & compliance overview",
    body: "Data handling, isolation, subprocessors and our HDPA-aligned controls.",
    href: "/security",
    cta: "Visit the Trust Center",
  },
  {
    kind: "Live",
    title: "System status",
    body: "Real-time health of the database, storage, sync and AI services.",
    href: "/status",
    cta: "Check status",
  },
  {
    kind: "Demo",
    title: "Book a guided demo",
    body: "A solutions engineer walks your team through a production rollout.",
    href: "/contact-sales?interest=demo",
    cta: "Book a demo",
  },
];

export const productMenu = [
  {
    href: "/platform#classify",
    title: "SeeFood Classify",
    body: "Hot Dog or Not Hot Dog, in under two seconds",
  },
  {
    href: "/platform#audit",
    title: "SeeFood Audit",
    body: "Every scan, image and model, on record",
  },
  {
    href: "/platform#insights",
    title: "SeeFood Insights",
    body: "Accuracy, latency and hot dog share",
  },
  {
    href: "/platform#edge",
    title: "SeeFood Edge",
    body: "Offline workspace with automatic sync",
  },
  {
    href: "/docs",
    title: "SeeFood API",
    body: "One endpoint, two possible answers",
  },
];

export const resourcesMenu = [
  {
    href: "/resources",
    title: "Resource library",
    body: "Reports, stories and guides",
  },
  {
    href: "/resources/state-of-hot-dogs-2026",
    title: "State of Hot Dogs 2026",
    body: "Our annual industry report",
  },
  { href: "/docs", title: "API documentation", body: "Reference and examples" },
  { href: "/status", title: "System status", body: "Live service health" },
];

export const companyMenu = [
  { href: "/company", title: "About SeeFood", body: "Mission and leadership" },
  { href: "/company#careers", title: "Careers", body: "Join the hot dog team" },
  { href: "/security", title: "Trust Center", body: "Security and compliance" },
  { href: "/contact-sales", title: "Contact", body: "Talk to sales" },
];
