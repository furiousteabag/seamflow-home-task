import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Code2,
  FileSearch,
  ScanEye,
  WifiOff,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CtaBand,
  heroPrimary,
  heroSecondary,
  MarketingShell,
  PageHero,
} from "@/components/marketing/blocks";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "SeeFood Classify, Audit, Insights, Edge and API: the complete hot dog intelligence platform.",
};

const modules = [
  {
    id: "classify",
    icon: ScanEye,
    name: "SeeFood Classify",
    title: "Hot Dog or Not Hot Dog, in under two seconds",
    body: "Upload, paste or photograph any image. Images are compressed on-device and analysed by an Anthropic Claude vision model constrained to a strict, machine-readable output.",
    points: [
      "Definitive binary verdict with confidence score",
      "One-line explanation of what the model saw",
      "Hot Dog Score and a list of what's missing",
      "Text in images is treated as pixels, never as instructions",
    ],
    cta: { href: "/app", label: "Classify an image" },
  },
  {
    id: "audit",
    icon: FileSearch,
    name: "SeeFood Audit",
    title: "Every scan, image and model, on record",
    body: "Each classification stores the original image in private storage alongside verdict, confidence, reasoning, model version, latency and channel.",
    points: [
      "Per-user data isolation",
      "Reviewer feedback: confirm or flag every verdict",
      "Delete a scan and its image together",
      "CSV export for auditors",
    ],
    cta: { href: "/app/history", label: "Open scan history" },
  },
  {
    id: "insights",
    icon: BarChart3,
    name: "SeeFood Insights",
    title: "Accuracy you can measure, not assume",
    body: "Analytics are computed from your workspace history: hot dog share, latency, volume over time and reviewer agreement.",
    points: [
      "Measured accuracy from reviewer feedback",
      "Median and tail latency",
      "Web vs. API channel mix",
      "Works offline from on-device data",
    ],
    cta: { href: "/app/analytics", label: "View analytics" },
  },
  {
    id: "edge",
    icon: WifiOff,
    name: "SeeFood Edge",
    title: "An offline-ready workspace",
    body: "History, analytics and feedback live in a local SQLite database in the browser, kept in sync with Postgres by PowerSync.",
    points: [
      "Instant reads from the local database",
      "Feedback and deletions queue while offline",
      "Queued changes survive reloads",
      "Two-way sync when connectivity returns",
    ],
    cta: { href: "/app/history", label: "Try it offline" },
  },
  {
    id: "api",
    icon: Code2,
    name: "SeeFood API",
    title: "One endpoint, two possible answers",
    body: "Classify images from any backend with a bearer API key. API scans land in the same audit log as web scans.",
    points: [
      "Keys hashed at rest, shown once",
      "Create, name and revoke keys per integration",
      "Structured JSON with verdict and confidence",
      "Per-key rate limiting",
    ],
    cta: { href: "/docs", label: "Read the API reference" },
  },
];

export default function PlatformPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Platform"
        title="The complete hot dog intelligence platform"
        body="Five products on one secure foundation: classify images, keep the evidence, measure accuracy, work offline and integrate everywhere."
        actions={
          <>
            <Link href="/contact-sales?interest=demo" className={heroPrimary}>
              Request a demo <ArrowRight className="size-4" />
            </Link>
            <Link href="/app" className={heroSecondary}>
              Open the workspace
            </Link>
          </>
        }
      >
        <div className="mt-12 flex flex-wrap gap-2">
          {modules.map((m) => (
            <a
              key={m.id}
              href={`#${m.id}`}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              <m.icon className="size-4 text-sky-300" /> {m.name}
            </a>
          ))}
        </div>
      </PageHero>
      {modules.map((m, i) => (
        <section
          key={m.id}
          id={m.id}
          className={
            i % 2
              ? "scroll-mt-20 border-b bg-muted/30"
              : "scroll-mt-20 border-b"
          }
        >
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
                <m.icon className="size-4" /> {m.name}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                {m.title}
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">{m.body}</p>
              <Link
                href={m.cta.href}
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                {m.cta.label} <ArrowRight className="size-4" />
              </Link>
            </div>
            <ul className="grid gap-3 self-center sm:grid-cols-2">
              {m.points.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 rounded-lg border bg-card p-4 text-sm"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
      <CtaBand />
    </MarketingShell>
  );
}
