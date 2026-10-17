import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CtaBand,
  MarketingShell,
  PageHero,
  SolutionIcon,
} from "@/components/marketing/blocks";
import { solutions } from "@/components/marketing/content";

export const metadata: Metadata = {
  title: "Solutions",
  description: "SeeFood Enterprise solutions by industry.",
};

export default function SolutionsPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Solutions"
        title="Hot dog certainty for every industry"
        body="Whether you sell 40,000 hot dogs a night or regulate the people who do, SeeFood fits the way your organization works."
      />
      <section>
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-20 md:grid-cols-2">
          {solutions.map((s) => (
            <Link
              key={s.slug}
              href={`/solutions/${s.slug}`}
              className="group flex gap-5 rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <SolutionIcon icon={s.icon} className="size-6" />
              </span>
              <div>
                <h2 className="text-xl font-semibold">{s.name}</h2>
                <p className="mt-1 text-sm font-medium text-primary">
                  {s.tagline}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{s.hero}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Explore the solution{" "}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </MarketingShell>
  );
}
