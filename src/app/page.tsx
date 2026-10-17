import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  Globe,
  KeyRound,
  Lock,
  Quote,
  RefreshCw,
  Server,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  CtaBand,
  HeroBackdrop,
  heroPrimary,
  heroSecondary,
  MarketingShell,
  SectionHeading,
  SolutionIcon,
} from "@/components/marketing/blocks";
import {
  customers,
  resources,
  solutions,
} from "@/components/marketing/content";
import { ProductTabs } from "@/components/marketing/product-tabs";

const logos: { name: string; href: string }[] = [
  { name: "Hooli", href: "/customers/hooli-arena" },
  { name: "Aviato", href: "/customers/aviato-air" },
  { name: "Endframe", href: "/customers/endframe-foods" },
  { name: "Raviga", href: "/customers/raviga-hospitality" },
  { name: "Pied Piper", href: "/customers" },
  { name: "Bachmanity", href: "/customers" },
];

const stats = [
  { value: "2", label: "possible verdicts. Ever." },
  { value: "< 2 s", label: "median time to verdict" },
  { value: "100%", label: "of scans on the audit record" },
  { value: "0", label: "answers that say “it depends”" },
];

const trust = [
  {
    icon: Lock,
    title: "Secure by design",
    body: "Private image storage, per-user isolation, hashed API keys and prompt-injection hardening.",
    href: "/security",
    cta: "Explore the Trust Center",
  },
  {
    icon: ShieldCheck,
    title: "Compliant across the globe",
    body: "Controls aligned to HDPA, BUN-2 and ISO-HD, with a published subprocessor list.",
    href: "/security#frameworks",
    cta: "See our frameworks",
  },
  {
    icon: Server,
    title: "Reliable at scale",
    body: "Live health checks for the database, storage, sync and AI services, published in real time.",
    href: "/status",
    cta: "View system status",
  },
];

const ecosystem = [
  {
    icon: Cpu,
    name: "Anthropic Claude",
    body: "Vision models",
    href: "/security#subprocessors",
  },
  {
    icon: Database,
    name: "Supabase",
    body: "Postgres, Auth, Storage",
    href: "/security#subprocessors",
  },
  {
    icon: Globe,
    name: "Vercel",
    body: "Global edge hosting",
    href: "/security#subprocessors",
  },
  {
    icon: RefreshCw,
    name: "PowerSync",
    body: "Offline sync engine",
    href: "/platform#edge",
  },
  {
    icon: KeyRound,
    name: "Google Workspace",
    body: "Single sign-on",
    href: "/login",
  },
  { icon: Server, name: "REST API", body: "Integrate anything", href: "/docs" },
];

export default function Home() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <HeroBackdrop />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div className="flex flex-col gap-6">
            <Link
              href="/platform#insights"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:bg-white/10"
            >
              <span className="rounded-full bg-sky-400 px-1.5 py-0.5 text-[10px] font-semibold text-slate-950">
                NEW
              </span>
              Hot Dog Score is now generally available
              <ArrowRight className="size-3" />
            </Link>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              The decisive food intelligence platform for the enterprise.
            </h1>
            <p className="max-w-xl text-lg text-slate-300 text-pretty">
              SeeFood Enterprise classifies any image as{" "}
              <strong className="text-white">Hot Dog</strong> or{" "}
              <strong className="text-white">Not Hot Dog</strong>, with a
              confidence score, an explanation and a complete audit trail. Built
              for organizations that cannot afford ambiguity.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact-sales?interest=demo" className={heroPrimary}>
                Request a demo <ArrowRight className="size-4" />
              </Link>
              <Link href="/app" className={heroSecondary}>
                Try it on your hot dog
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              {[
                "Sign in with Google",
                "Works offline",
                "REST API included",
              ].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-sky-400" /> {t}
                </span>
              ))}
            </div>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-10">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Trusted by the most decisive (fictional) companies in the Valley
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            {logos.map((l) => (
              <Link
                key={l.name}
                href={l.href}
                className="text-xl font-bold tracking-tight text-slate-400 transition-colors hover:text-slate-900"
              >
                {l.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-10 text-center">
              <p className="text-4xl font-semibold tracking-tight text-primary">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionHeading
            eyebrow="The SeeFood platform"
            title="Five products. One unambiguous answer."
            body="From the first photo to the auditor's question, SeeFood covers the full hot dog lifecycle on a single, secure platform."
          />
          <ProductTabs />
          <Link
            href="/platform"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View the full platform overview <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionHeading
            eyebrow="Solutions"
            title="Built for every industry that serves, sells or regulates hot dogs"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <Link
                key={s.slug}
                href={`/solutions/${s.slug}`}
                className="group flex flex-col rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SolutionIcon icon={s.icon} className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.name}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">
                  {s.tagline}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Learn more{" "}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionHeading
            eyebrow="Enterprise-grade"
            title="Secure, compliant and reliable by design"
            body="The questions your CISO will ask, answered before the first meeting."
            center
          />
          <div className="grid gap-6 md:grid-cols-3">
            {trust.map((t) => (
              <div key={t.title} className="rounded-xl border bg-card p-8">
                <t.icon className="size-8 text-primary" />
                <h3 className="mt-5 text-xl font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
                <Link
                  href={t.href}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  {t.cta} <ArrowRight className="size-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold tracking-wide text-sky-300 uppercase">
                Customer outcomes
              </p>
              <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Decisive teams ship hot dog decisions faster
              </h2>
            </div>
            <Link
              href="/customers"
              className="inline-flex items-center gap-1 text-sm font-semibold text-sky-300 hover:underline"
            >
              Read all stories <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {customers.map((c) => (
              <Link
                key={c.slug}
                href={`/customers/${c.slug}`}
                className="group flex flex-col rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
              >
                <p className="text-4xl font-semibold tracking-tight text-sky-300">
                  {c.metrics[0].value}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {c.metrics[0].label}
                </p>
                <p className="mt-6 flex-1 text-sm font-semibold">{c.company}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-300">
                  Read the story <ArrowRight className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
          <figure className="mt-12 rounded-xl border border-white/10 bg-white/5 p-8">
            <Quote className="size-8 text-sky-300" />
            <blockquote className="mt-4 text-2xl font-medium tracking-tight text-balance">
              “{customers[0].quote.text}”
            </blockquote>
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
              <span>
                {customers[0].quote.author} · {customers[0].quote.role}
              </span>
              <Link
                href={`/customers/${customers[0].slug}`}
                className="font-semibold text-sky-300 hover:underline"
              >
                How Hooli Arena did it →
              </Link>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Resources"
              title="Insights for hot dog leaders"
            />
            <Link
              href="/resources"
              className="mb-10 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Browse the library <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {resources.slice(0, 3).map((r) => (
              <Link
                key={r.title}
                href={r.href}
                className="group flex flex-col rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <span className="w-fit rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold tracking-wide text-primary uppercase">
                  {r.kind}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{r.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">
                  {r.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  {r.cta} <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionHeading
            eyebrow="Ecosystem"
            title="Runs on the stack you already trust"
            center
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {ecosystem.map((e) => (
              <Link
                key={e.name}
                href={e.href}
                className="flex flex-col items-center rounded-xl border bg-card p-5 text-center transition-shadow hover:shadow-md"
              >
                <e.icon className="size-7 text-primary" />
                <p className="mt-3 text-sm font-semibold">{e.name}</p>
                <p className="text-xs text-muted-foreground">{e.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </MarketingShell>
  );
}

function ProductPreview() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white text-slate-900 shadow-2xl shadow-sky-950/50">
        <div className="flex items-center gap-1.5 border-b bg-slate-100 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 rounded bg-white px-2 py-0.5 text-xs text-slate-500">
            seefoodsystems.com/app
          </span>
        </div>
        <div className="grid grid-cols-[7rem_1fr]">
          <div className="hidden flex-col gap-1 border-r bg-slate-50 p-3 text-[11px] text-slate-500 sm:flex">
            <span className="rounded bg-primary/10 px-2 py-1 font-semibold text-primary">
              Classify
            </span>
            <span className="px-2 py-1">History</span>
            <span className="px-2 py-1">Analytics</span>
            <span className="px-2 py-1">API keys</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
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
            <div className="grid grid-cols-3 divide-x border-t text-center text-[11px]">
              <div className="p-2">
                <p className="font-semibold">1,284</p>
                <p className="text-slate-500">scans</p>
              </div>
              <div className="p-2">
                <p className="font-semibold">41%</p>
                <p className="text-slate-500">hot dogs</p>
              </div>
              <div className="p-2">
                <p className="font-semibold">97%</p>
                <p className="text-slate-500">agreement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -top-6 -right-2 hidden items-center gap-3 rounded-lg border bg-white p-2 pr-4 text-slate-900 shadow-xl sm:flex">
        {/* biome-ignore lint/performance/noImgElement: static marketing sample */}
        <img
          src="/samples/dog.jpg"
          alt="A golden retriever"
          className="size-10 rounded-md object-cover"
        />
        <div>
          <p className="flex items-center gap-1 text-sm font-semibold">
            <XCircle className="size-4 text-red-600" /> Not Hot Dog
          </p>
          <p className="text-xs text-slate-500">golden retriever · 99%</p>
        </div>
      </div>
      <div className="absolute -bottom-6 -left-4 hidden rounded-lg border bg-white px-4 py-3 text-slate-900 shadow-xl md:block">
        <p className="text-[11px] font-medium text-slate-500 uppercase">
          Audit log
        </p>
        <p className="text-sm font-semibold">Every scan on record</p>
      </div>
    </div>
  );
}
