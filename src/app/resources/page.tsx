import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CtaBand,
  MarketingShell,
  PageHero,
} from "@/components/marketing/blocks";
import { resources } from "@/components/marketing/content";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Reports, customer stories, documentation and tools from SeeFood Systems.",
};

export default function ResourcesPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Resource library"
        title="Insights for hot dog leaders"
        body="Research, customer stories, documentation and tools to help your organization classify with confidence."
      />
      <section>
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-20 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <Link
              key={r.title}
              href={r.href}
              className="group flex flex-col rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <span className="w-fit rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold tracking-wide text-primary uppercase">
                {r.kind}
              </span>
              <h2 className="mt-4 text-lg font-semibold">{r.title}</h2>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">
                {r.body}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                {r.cta}{" "}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </MarketingShell>
  );
}
