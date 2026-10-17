import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CtaBand,
  MarketingShell,
  PageHero,
} from "@/components/marketing/blocks";
import { PrintButton } from "@/components/marketing/print-button";

export const metadata: Metadata = {
  title: "The State of Hot Dogs 2026",
  description:
    "SeeFood Systems' annual report on hot dog ambiguity, binary classification and the decisive enterprise.",
};

const findings = [
  {
    stat: "73%",
    text: "of food leaders say ambiguity is their #1 food-classification risk.",
  },
  {
    stat: "2",
    text: "categories are all a well-run organization needs: Hot Dog and Not Hot Dog.",
  },
  {
    stat: "4 in 5",
    text: "disputes about hot dogs could be settled by a stored image and a reason.",
  },
  {
    stat: "0",
    text: "auditors have ever asked for a 'maybe'.",
  },
];

const mix = [
  { label: "Hot dog", value: 41, color: "bg-emerald-500" },
  { label: "Burger", value: 18, color: "bg-amber-500" },
  { label: "Sausage, no bun", value: 14, color: "bg-orange-500" },
  { label: "Dogs (the animal)", value: 9, color: "bg-sky-500" },
  { label: "Everything else", value: 18, color: "bg-slate-400" },
];

export default function ReportPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Report · October 2026"
        title="The State of Hot Dogs 2026"
        body="Our annual look at how decisive organizations classify food, and why the industry is converging on two answers."
      />
      <article className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-xs text-muted-foreground">
          Methodology note: figures are illustrative and compiled for this
          parody product. No hot dogs were surveyed.
        </p>
        <h2 className="mt-8 text-2xl font-semibold tracking-tight">
          Key findings
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {findings.map((f) => (
            <div key={f.text} className="rounded-xl border bg-card p-6">
              <p className="text-4xl font-semibold tracking-tight text-primary">
                {f.stat}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-semibold tracking-tight">
          What people photograph when they ask "is this a hot dog?"
        </h2>
        <div className="mt-6 flex h-8 overflow-hidden rounded-full">
          {mix.map((m) => (
            <div
              key={m.label}
              className={m.color}
              style={{ width: `${m.value}%` }}
              title={`${m.label}: ${m.value}%`}
            />
          ))}
        </div>
        <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
          {mix.map((m) => (
            <li key={m.label} className="flex items-center gap-2">
              <span className={`size-3 rounded-sm ${m.color}`} />
              {m.label}{" "}
              <span className="text-muted-foreground">{m.value}%</span>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col gap-6 text-lg leading-relaxed text-muted-foreground">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            1. Ambiguity is expensive
          </h2>
          <p>
            When a team can't agree whether a chili dog counts, every report,
            audit and menu update inherits the disagreement. The cost isn't the
            hot dog; it's the meeting about the hot dog.
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            2. Binary beats nuanced
          </h2>
          <p>
            Multi-class food taxonomies grow without bound. Organizations that
            reduce the decision to a single, well-defined question ship faster
            and argue less.
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            3. Evidence is the product
          </h2>
          <p>
            A verdict without the image, the reason and the model version is an
            opinion. The leaders in this report keep all four, and let reviewers
            confirm or flag every result.
          </p>
        </div>

        <div className="mt-14 flex flex-col items-start gap-4 rounded-xl border bg-muted/40 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Put the findings to work</p>
            <p className="text-sm text-muted-foreground">
              Get a Hot Dog Readiness Assessment for your organization.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact-sales?interest=assessment"
              className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Get the assessment <ArrowRight className="size-4" />
            </Link>
            <PrintButton />
          </div>
        </div>
      </article>
      <CtaBand />
    </MarketingShell>
  );
}
