import { CalendarCheck, Clock, Headphones, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MarketingShell } from "@/components/marketing/blocks";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact sales",
  description:
    "Talk to the SeeFood Enterprise team about pricing, demos and rollouts.",
};

const expectations = [
  {
    icon: Clock,
    title: "Response within one business day",
    body: "An account executive who knows your industry will follow up.",
  },
  {
    icon: CalendarCheck,
    title: "A demo on your own images",
    body: "Bring a few photos; we'll classify them live.",
  },
  {
    icon: ShieldCheck,
    title: "Security review support",
    body: "Questionnaires, DPA and subprocessor details on request.",
  },
  {
    icon: Headphones,
    title: "Already a customer?",
    body: "Visit the documentation or check system status.",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/status", label: "System status" },
    ],
  },
];

export default function ContactSalesPage() {
  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-muted/60 to-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-[1fr_1.2fr] lg:py-20">
          <div>
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              Contact sales
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Let's talk about your hot dogs
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Tell us about your organization and we'll put together a demo, a
              quote or a readiness assessment.
            </p>
            <ul className="mt-10 flex flex-col gap-6">
              {expectations.map((e) => (
                <li key={e.title} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <e.icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{e.title}</p>
                    <p className="text-sm text-muted-foreground">{e.body}</p>
                    {e.links && (
                      <p className="mt-1 flex gap-4 text-sm">
                        {e.links.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            className="font-medium text-primary hover:underline"
                          >
                            {l.label} →
                          </Link>
                        ))}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Suspense
            fallback={<div className="h-[36rem] rounded-xl border bg-card" />}
          >
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </MarketingShell>
  );
}
