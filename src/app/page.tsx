import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Code2,
  Gauge,
  History,
  ShieldCheck,
  ThumbsUp,
  WifiOff,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: BadgeCheck,
    title: "Binary certainty",
    body: "Every image gets exactly one of two answers. No “maybe”, no “sandwich-adjacent”.",
  },
  {
    icon: Gauge,
    title: "Fast inference",
    body: "Vision-model verdicts in about two seconds, with confidence scores and an explanation.",
  },
  {
    icon: History,
    title: "Complete audit trail",
    body: "Every scan is logged with image, verdict, model, latency and channel. Export to CSV anytime.",
  },
  {
    icon: ThumbsUp,
    title: "Human-in-the-loop QA",
    body: "Reviewers confirm or flag verdicts, giving you a measured accuracy number, not a promise.",
  },
  {
    icon: WifiOff,
    title: "Offline-ready workspace",
    body: "History, analytics and feedback live on-device and sync automatically when you reconnect.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    body: "Private image storage, per-user isolation, hashed API keys, rate limiting and prompt-injection hardening.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    cadence: "forever",
    blurb: "For individuals evaluating hot dogs.",
    features: [
      "Web app",
      "Scan history & analytics",
      "Offline workspace",
      "Community support",
    ],
    cta: "Start free",
    href: "/app",
  },
  {
    name: "Business",
    price: "$49",
    cadence: "per month",
    blurb: "For teams with a production hot dog workload.",
    features: [
      "Everything in Starter",
      "REST API & API keys",
      "CSV export",
      "Email support",
    ],
    cta: "Start free trial",
    href: "/app",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "annual contract",
    blurb: "For organizations where hot dogs are mission-critical.",
    features: [
      "Everything in Business",
      "SSO & audit exports",
      "Dedicated instance",
      "99.9% uptime SLA",
    ],
    cta: "Contact sales",
    href: "mailto:sales@seefoodsystems.com",
  },
];

const faqs = [
  {
    q: "Is a corn dog a hot dog?",
    a: "No. A hot dog is a sausage served in a sliced bun. Corn dogs, sausages without buns and the animal all come back Not Hot Dog.",
  },
  {
    q: "Can SeeFood recognize other foods?",
    a: "It can tell you, with total confidence, that they are not hot dogs.",
  },
  {
    q: "What happens to the images I upload?",
    a: "They are stored privately, visible only to your workspace, and deleted when you delete the scan.",
  },
  {
    q: "Can someone trick it with a sign that says “hot dog”?",
    a: "Text inside images is treated as part of the picture, never as an instruction, so a label alone won't change the verdict.",
  },
  {
    q: "Which model powers SeeFood?",
    a: "Anthropic's Claude vision models, constrained to a strict structured output so every response is machine-readable.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
            <div className="flex flex-col gap-6">
              <Link
                href="/docs"
                className="inline-flex w-fit items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                  New
                </span>
                REST API v1 is generally available{" "}
                <ArrowRight className="size-3" />
              </Link>
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Hot dog detection for the enterprise.
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground text-pretty">
                SeeFood classifies any image as{" "}
                <strong className="text-foreground">Hot Dog</strong> or{" "}
                <strong className="text-foreground">Not Hot Dog</strong>.
                Instantly, definitively, and with a full audit trail.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/app" className={buttonVariants({ size: "lg" })}>
                  Start classifying free <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/docs"
                  className={buttonVariants({ size: "lg", variant: "outline" })}
                >
                  <Code2 className="size-4" /> API docs
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">
                No credit card. No sign-up form. One click to a guest workspace.
              </p>
            </div>
            <ProductPreview />
          </div>
        </section>

        <section className="border-b">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Trusted by fictional companies everywhere
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-lg font-semibold text-muted-foreground/70">
              {[
                "Hooli",
                "Pied Piper",
                "Raviga",
                "Aviato",
                "Endframe",
                "Bachmanity",
              ].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-16 border-b">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="mb-12 max-w-2xl">
              <p className="text-sm font-medium text-primary">Platform</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Everything a hot dog program needs
              </h2>
              <p className="mt-3 text-muted-foreground">
                One question, answered with the rigor your compliance team
                expects.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-lg border bg-card p-6">
                  <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <h3 className="mt-4 font-medium">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b bg-muted/30">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-primary">Developers</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                One endpoint. Two possible answers.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Integrate hot dog detection into any backend with a single
                authenticated request. Scans made through the API appear in your
                workspace audit log alongside web scans.
              </p>
              <Link
                href="/docs"
                className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
              >
                Read the API reference <ArrowRight className="size-4" />
              </Link>
            </div>
            <pre className="overflow-x-auto rounded-lg border bg-zinc-950 p-5 text-xs leading-relaxed text-zinc-100">
              <code>{`$ curl https://seefoodsystems.com/api/v1/classify \\
    -H "Authorization: Bearer $SEEFOOD_API_KEY" \\
    -F image=@lunch.jpg

{
  "verdict": "hot_dog",
  "is_hot_dog": true,
  "confidence": 0.98,
  "label": "hot dog with mustard in a bun",
  "model": "claude-haiku-5-5",
  "latency_ms": 1840
}`}</code>
            </pre>
          </div>
        </section>

        <section className="border-b">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center">
            <p className="text-2xl font-medium tracking-tight text-balance">
              “We replaced a twelve-person hot dog review committee with
              SeeFood. Our false positive rate is now an OKR.”
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Erlich Bachman · Founder, Aviato (fictional)
            </p>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-16 border-b">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-semibold tracking-tight">
                Simple, predictable pricing
              </h2>
              <p className="mt-3 text-muted-foreground">
                During launch, every workspace gets every feature for free.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {plans.map((p) => (
                <div
                  key={p.name}
                  className={cn(
                    "flex flex-col rounded-lg border bg-card p-6",
                    p.featured &&
                      "border-primary shadow-lg ring-1 ring-primary",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{p.name}</h3>
                    {p.featured && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-4">
                    <span className="text-3xl font-semibold">{p.price}</span>{" "}
                    <span className="text-sm text-muted-foreground">
                      {p.cadence}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {p.blurb}
                  </p>
                  <ul className="mt-6 flex flex-1 flex-col gap-2 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={p.href}
                    className={cn(
                      buttonVariants({
                        variant: p.featured ? "default" : "outline",
                      }),
                      "mt-6",
                    )}
                  >
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-16 border-b">
          <div className="mx-auto max-w-3xl px-4 py-20">
            <h2 className="mb-8 text-3xl font-semibold tracking-tight">
              Frequently asked questions
            </h2>
            <div className="divide-y rounded-lg border bg-card">
              {faqs.map((f) => (
                <details key={f.q} className="group p-5">
                  <summary className="cursor-pointer list-none font-medium marker:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {f.q}
                      <span className="text-muted-foreground transition-transform group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Know what's on the plate.
            </h2>
            <Link
              href="/app"
              className={buttonVariants({ size: "lg", variant: "secondary" })}
            >
              Launch SeeFood <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl border bg-card shadow-2xl">
        <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs text-muted-foreground">
            seefoodsystems.com/app
          </span>
        </div>
        {/* biome-ignore lint/performance/noImgElement: static marketing sample */}
        <img
          src="/samples/hot-dog.jpg"
          alt="A hot dog with mustard"
          className="aspect-[16/9] w-full object-cover"
        />
        <div className="flex items-center gap-3 bg-emerald-600 px-5 py-4 text-white">
          <CheckCircle2 className="size-8" />
          <div>
            <p className="text-2xl font-bold tracking-tight">Hot Dog</p>
            <p className="text-xs text-white/80">
              98% confidence · 1.8 s · claude-haiku-5-5
            </p>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -left-4 hidden items-center gap-2 rounded-lg border bg-card px-4 py-3 shadow-lg sm:flex">
        <XCircle className="size-5 text-red-600" />
        <div>
          <p className="text-sm font-semibold">Not Hot Dog</p>
          <p className="text-xs text-muted-foreground">
            golden retriever · 99%
          </p>
        </div>
      </div>
    </div>
  );
}
