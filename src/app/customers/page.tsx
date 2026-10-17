import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CtaBand,
  MarketingShell,
  PageHero,
} from "@/components/marketing/blocks";
import { customers } from "@/components/marketing/content";

export const metadata: Metadata = {
  title: "Customer stories",
  description: "How decisive organizations use SeeFood Enterprise.",
};

export default function CustomersPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Customers"
        title="The most decisive teams run on SeeFood"
        body="From stadium concessions to regulated kitchens, see how organizations replaced ambiguity with a binary answer. All customers are fictional; the product is real."
      />
      <section>
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-20 md:grid-cols-2">
          {customers.map((c) => (
            <Link
              key={c.slug}
              href={`/customers/${c.slug}`}
              className="group flex flex-col rounded-xl border bg-card p-8 transition-shadow hover:shadow-lg"
            >
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                {c.industry}
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                {c.company}
              </p>
              <h2 className="mt-3 text-lg font-medium text-balance">
                {c.headline}
              </h2>
              <div className="mt-6 grid flex-1 grid-cols-3 gap-4 border-t pt-6">
                {c.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-xl font-semibold text-primary">
                      {m.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Read the story{" "}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand
        title="Become our next customer story"
        body="Our team will help you scope, pilot and roll out SeeFood across your organization."
      />
    </MarketingShell>
  );
}
