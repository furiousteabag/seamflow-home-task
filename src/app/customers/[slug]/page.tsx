import { ArrowLeft, ArrowRight, CheckCircle2, Quote } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CtaBand,
  MarketingShell,
  PageHero,
} from "@/components/marketing/blocks";
import { customers, solutions } from "@/components/marketing/content";

export function generateStaticParams() {
  return customers.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/customers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = customers.find((x) => x.slug === slug);
  return c
    ? { title: `${c.company} customer story`, description: c.summary }
    : {};
}

export default async function CustomerStoryPage({
  params,
}: PageProps<"/customers/[slug]">) {
  const { slug } = await params;
  const story = customers.find((c) => c.slug === slug);
  if (!story) notFound();
  const solution = solutions.find((s) => s.name === story.industry);
  const next = customers[(customers.indexOf(story) + 1) % customers.length];

  return (
    <MarketingShell>
      <PageHero
        eyebrow={`Customer story · ${story.industry}`}
        title={story.headline}
        body={story.summary}
      >
        <div className="mt-10 grid max-w-3xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
          {story.metrics.map((m) => (
            <div key={m.label}>
              <p className="text-3xl font-semibold text-sky-300">{m.value}</p>
              <p className="mt-1 text-sm text-slate-400">{m.label}</p>
            </div>
          ))}
        </div>
      </PageHero>
      <article className="mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-10 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              The challenge
            </h2>
            <p className="mt-3 text-muted-foreground">{story.challenge}</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              The solution
            </h2>
            <p className="mt-3 text-muted-foreground">{story.solution}</p>
          </section>
          <figure className="rounded-xl border-l-4 border-primary bg-muted/50 p-8">
            <Quote className="size-7 text-primary" />
            <blockquote className="mt-3 text-xl font-medium">
              “{story.quote.text}”
            </blockquote>
            <figcaption className="mt-3 text-sm text-muted-foreground">
              {story.quote.author} · {story.quote.role}
            </figcaption>
          </figure>
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              The results
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {story.results.map((r) => (
                <li key={r} className="flex items-start gap-3 text-base">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" />
                  {r}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <aside className="flex h-fit flex-col gap-4 lg:sticky lg:top-24">
          <div className="rounded-xl border bg-card p-6 text-sm">
            <p className="text-lg font-bold">{story.company}</p>
            <dl className="mt-4 flex flex-col gap-3">
              <div>
                <dt className="text-muted-foreground">Industry</dt>
                <dd className="font-medium">
                  {solution ? (
                    <Link
                      href={`/solutions/${solution.slug}`}
                      className="text-primary hover:underline"
                    >
                      {story.industry}
                    </Link>
                  ) : (
                    story.industry
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Products</dt>
                <dd className="font-medium">
                  <Link
                    href="/platform"
                    className="text-primary hover:underline"
                  >
                    Classify, Audit, Insights
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium">Fictional, but decisive</dd>
              </div>
            </dl>
          </div>
          <Link
            href="/contact-sales?interest=demo"
            className="rounded-xl bg-primary p-6 text-primary-foreground"
          >
            <p className="font-semibold">Get results like {story.company}</p>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Book a demo with a solutions engineer →
            </p>
          </Link>
        </aside>
      </article>
      <section className="border-t">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm font-semibold">
          <Link
            href="/customers"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ArrowLeft className="size-4" /> All customer stories
          </Link>
          <Link
            href={`/customers/${next.slug}`}
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Next: {next.company} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
      <CtaBand />
    </MarketingShell>
  );
}
