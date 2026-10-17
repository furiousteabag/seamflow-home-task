import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CtaBand,
  MarketingShell,
  PageHero,
  SectionHeading,
} from "@/components/marketing/blocks";
import { comparison, tiers } from "@/components/marketing/content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "SeeFood Enterprise pricing is tailored to your hot dog volume. Contact sales for a quote.",
};

const faqs = [
  {
    q: "Why isn't pricing listed?",
    a: "Every hot dog program is different. Your quote reflects scan volume, number of sites, support level and deployment model.",
  },
  {
    q: "Can we evaluate before talking to sales?",
    a: "Yes. Sign in to the evaluation workspace and classify as many images as you like within fair-use limits.",
  },
  {
    q: "Do you offer multi-year agreements?",
    a: "Yes, with price protection for the term. Your account executive can model one-, two- and three-year options.",
  },
  {
    q: "How is a 'scan' counted?",
    a: "One image classified through the web workspace or the API is one scan, whatever the verdict.",
  },
  {
    q: "Is a corn dog a hot dog?",
    a: "No. A hot dog is a sausage served in a sliced bun. This is not negotiable at any tier.",
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Pricing"
        title="Pricing tailored to your hot dog program"
        body="SeeFood Enterprise is sold on annual agreements sized to your scan volume, sites and support needs. Talk to our team for a quote."
      />
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-20 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.slug}
              className={cn(
                "flex flex-col rounded-xl border bg-card p-8",
                "featured" in t &&
                  t.featured &&
                  "border-primary shadow-xl ring-1 ring-primary",
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t.name}</h2>
                {"featured" in t && t.featured && (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
              <p className="mt-6 text-4xl font-semibold tracking-tight">
                Custom
              </p>
              <p className="text-sm text-muted-foreground">
                Annual agreement · billed yearly
              </p>
              <Link
                href={`/contact-sales?interest=pricing&plan=${t.slug}`}
                className={buttonVariants({
                  variant:
                    "featured" in t && t.featured ? "default" : "outline",
                  className: "mt-6",
                })}
              >
                Contact sales
              </Link>
              <ul className="mt-8 flex flex-col gap-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionHeading title="Compare plans" center />
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-4 font-medium">Feature</th>
                  {tiers.map((t) => (
                    <th key={t.slug} className="p-4 text-center font-semibold">
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              {comparison.map((g) => (
                <tbody key={g.group}>
                  <tr className="border-b bg-muted/30">
                    <td
                      colSpan={4}
                      className="px-4 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                    >
                      {g.group}
                    </td>
                  </tr>
                  {g.rows.map((r) => (
                    <tr key={r.label} className="border-b last:border-0">
                      <td className="p-4">{r.label}</td>
                      {r.values.map((v, i) => (
                        <td
                          // biome-ignore lint/suspicious/noArrayIndexKey: fixed tier columns
                          key={i}
                          className={cn(
                            "p-4 text-center",
                            v === "✓" && "font-semibold text-primary",
                            v === "—" && "text-muted-foreground",
                          )}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Want to try before you talk to us?{" "}
            <Link
              href="/app"
              className="font-medium text-primary hover:underline"
            >
              Open the evaluation workspace
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <SectionHeading title="Pricing questions" />
          <div className="divide-y rounded-xl border bg-card">
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
          <Link
            href="/contact-sales?interest=pricing"
            className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Ask our team anything else <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
      <CtaBand title="Get a quote in one business day" />
    </MarketingShell>
  );
}
