import { ArrowRight, Briefcase, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CtaBand,
  MarketingShell,
  PageHero,
  SectionHeading,
} from "@/components/marketing/blocks";
import { leadership, openings } from "@/components/marketing/content";

export const metadata: Metadata = {
  title: "Company",
  description: "About SeeFood Systems: mission, leadership and careers.",
};

const values = [
  {
    title: "Be decisive",
    body: "There are two answers. Pick one. Ship it.",
  },
  {
    title: "Show the receipt",
    body: "Every decision should be explainable and on the record.",
  },
  {
    title: "Respect the bun",
    body: "A hot dog is a sausage in a sliced bun. We don't relitigate the basics.",
  },
  {
    title: "Earn trust daily",
    body: "Security and privacy are features, not footnotes.",
  },
];

const timeline = [
  { year: "2017", text: "Jian Yang demos SeeFood: Hot Dog or Not Hot Dog." },
  {
    year: "2018",
    text: "Periscope acquires the technology to detect inappropriate images.",
  },
  { year: "2026", text: "SeeFood Systems relaunches for the enterprise." },
  {
    year: "Today",
    text: "Organizations around the (fictional) world rely on SeeFood every day.",
  },
];

export default function CompanyPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="About SeeFood Systems"
        title="We exist to end ambiguity about hot dogs"
        body="SeeFood started as an app that answered a single question. We kept the question and built the enterprise around it."
      />
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Mission"
              title="One question, answered well"
            />
            <p className="-mt-4 text-lg text-muted-foreground">
              Most AI products try to answer everything. We answer one thing,
              definitively, with the evidence attached. That focus is why the
              most decisive organizations trust SeeFood with their hot dogs.
            </p>
          </div>
          <ol className="relative flex flex-col gap-6 border-l pl-6">
            {timeline.map((t) => (
              <li key={t.year}>
                <span className="absolute -left-1.5 mt-1.5 size-3 rounded-full bg-primary" />
                <p className="text-sm font-semibold text-primary">{t.year}</p>
                <p className="text-muted-foreground">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionHeading eyebrow="Values" title="How we work" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="leadership" className="scroll-mt-20 border-b">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionHeading
            eyebrow="Leadership"
            title="The team behind the verdict"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((p) => (
              <div key={p.name} className="rounded-xl border bg-card p-6">
                <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-xl font-semibold text-white">
                  {p.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>
                <h3 className="mt-4 font-semibold">{p.name}</h3>
                <p className="text-sm font-medium text-primary">{p.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">{p.bio}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Characters from HBO's Silicon Valley. Any resemblance to an actual
            leadership team is coincidental.
          </p>
        </div>
      </section>
      <section id="careers" className="scroll-mt-20 border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionHeading
            eyebrow="Careers"
            title="Join the hot dog team"
            body="We're hiring people who can make a decision and explain it."
          />
          <div className="divide-y rounded-xl border bg-card">
            {openings.map((o) => (
              <Link
                key={o.title}
                href={`/contact-sales?interest=careers&role=${encodeURIComponent(o.title)}`}
                className="group flex flex-col gap-2 p-5 hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">{o.title}</p>
                  <p className="mt-0.5 flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="size-3.5" /> {o.team}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" /> {o.location}
                    </span>
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Apply{" "}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </MarketingShell>
  );
}
