import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CtaBand,
  heroPrimary,
  heroSecondary,
  MarketingShell,
  PageHero,
  SectionHeading,
  SolutionIcon,
} from "@/components/marketing/blocks";
import { customers, solutions } from "@/components/marketing/content";

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = solutions.find((x) => x.slug === slug);
  return s ? { title: s.name, description: s.hero } : {};
}

export default async function SolutionPage({
  params,
}: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const solution = solutions.find((s) => s.slug === slug);
  if (!solution) notFound();
  const story = customers.find((c) => c.slug === solution.customer);
  const others = solutions.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <MarketingShell>
      <PageHero
        eyebrow={`Solutions · ${solution.name}`}
        title={solution.hero}
        body={solution.tagline}
        actions={
          <>
            <Link
              href={`/contact-sales?interest=demo&industry=${solution.slug}`}
              className={heroPrimary}
            >
              Talk to an industry specialist <ArrowRight className="size-4" />
            </Link>
            <Link href="/app" className={heroSecondary}>
              Try it now
            </Link>
          </>
        }
      />
      <section className="border-b bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-px px-4 sm:grid-cols-3">
          {solution.outcomes.map((o) => (
            <div key={o.label} className="px-4 py-10 text-center">
              <p className="text-4xl font-semibold tracking-tight text-primary">
                {o.metric}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{o.label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <span className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <SolutionIcon icon={solution.icon} className="size-6" />
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight">
              The challenge
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              {solution.problem}
            </p>
          </div>
          <div className="grid gap-4">
            {solution.capabilities.map((c) => (
              <div key={c.title} className="rounded-xl border bg-card p-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="size-5 text-primary" /> {c.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {story && (
        <section className="border-b bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <p className="text-sm font-semibold tracking-wide text-sky-300 uppercase">
              Customer story · {story.company}
            </p>
            <p className="mt-3 max-w-3xl text-2xl font-medium tracking-tight text-balance">
              “{story.quote.text}”
            </p>
            <p className="mt-3 text-sm text-slate-400">
              {story.quote.author} · {story.quote.role}
            </p>
            <Link
              href={`/customers/${story.slug}`}
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-300 hover:underline"
            >
              Read the full story <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionHeading title="Explore other solutions" />
          <div className="grid gap-4 md:grid-cols-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/solutions/${s.slug}`}
                className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <SolutionIcon icon={s.icon} className="size-6 text-primary" />
                <h3 className="mt-3 font-semibold">{s.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {s.tagline}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </MarketingShell>
  );
}
