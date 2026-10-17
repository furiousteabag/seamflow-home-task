import {
  ArrowRight,
  BadgeCheck,
  Database,
  EyeOff,
  KeyRound,
  Lock,
  ScanText,
  Server,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CtaBand,
  heroPrimary,
  heroSecondary,
  MarketingShell,
  PageHero,
  SectionHeading,
} from "@/components/marketing/blocks";
import { frameworks, subprocessors } from "@/components/marketing/content";

export const metadata: Metadata = {
  title: "Trust Center",
  description:
    "Security, privacy and compliance at SeeFood Systems: data isolation, encryption, subprocessors and frameworks.",
};

const controls = [
  {
    icon: UserCheck,
    title: "Per-user isolation",
    body: "Every scan, image and API key belongs to one account. Sync streams only ever deliver a user's own rows.",
  },
  {
    icon: EyeOff,
    title: "Private image storage",
    body: "Uploaded images live in a private bucket and are served through short-lived signed URLs.",
  },
  {
    icon: Database,
    title: "Locked-down database",
    body: "Row-level security with no public policies blocks direct API access; all writes go through validated server routes.",
  },
  {
    icon: KeyRound,
    title: "Hashed API keys",
    body: "Keys are shown once, stored as SHA-256 hashes, scoped per integration and revocable at any time.",
  },
  {
    icon: ScanText,
    title: "Prompt-injection hardening",
    body: "Text inside an image is treated as part of the picture, never as an instruction to the model.",
  },
  {
    icon: ShieldAlert,
    title: "Abuse protection",
    body: "Per-user rate limits on classification and image generation, file type and size validation on every upload.",
  },
  {
    icon: Lock,
    title: "Encryption",
    body: "TLS for all traffic; data encrypted at rest by our infrastructure providers.",
  },
  {
    icon: Server,
    title: "Transparent operations",
    body: "Live health checks for every dependency are published on our status page.",
  },
];

export default function SecurityPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Trust Center"
        title="Security that takes hot dogs seriously"
        body="How SeeFood Systems protects your images, your verdicts and your organization's reputation for knowing what a hot dog is."
        actions={
          <>
            <Link
              href="/contact-sales?interest=security"
              className={heroPrimary}
            >
              Request a security review <ArrowRight className="size-4" />
            </Link>
            <Link href="/privacy" className={heroSecondary}>
              Read the Privacy Policy
            </Link>
          </>
        }
      />
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionHeading
            eyebrow="Controls"
            title="Defense in depth, from upload to audit log"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {controls.map((c) => (
              <div key={c.title} className="rounded-xl border bg-card p-6">
                <c.icon className="size-6 text-primary" />
                <h3 className="mt-4 font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="frameworks" className="scroll-mt-20 border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionHeading
            eyebrow="Compliance"
            title="Aligned to the frameworks that matter (to hot dogs)"
            body="We hold ourselves to the industry's most demanding food-classification standards, which we also wrote."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {frameworks.map((f) => (
              <div key={f.name} className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-14 items-center justify-center rounded-full border-2 border-primary text-sm font-bold text-primary">
                    {f.name}
                  </span>
                  <BadgeCheck className="size-5 text-emerald-600" />
                </div>
                <h3 className="mt-4 font-semibold">{f.full}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            These frameworks are parody. SeeFood Systems holds no third-party
            certifications.
          </p>
        </div>
      </section>
      <section id="subprocessors" className="scroll-mt-20 border-b">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionHeading
            eyebrow="Subprocessors"
            title="Who helps us process your data"
          />
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full min-w-[36rem] text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-4 font-medium">Subprocessor</th>
                  <th className="p-4 font-medium">Purpose</th>
                  <th className="p-4 font-medium">Location</th>
                </tr>
              </thead>
              <tbody>
                {subprocessors.map((s) => (
                  <tr key={s.name} className="border-b last:border-0">
                    <td className="p-4 font-medium">{s.name}</td>
                    <td className="p-4 text-muted-foreground">{s.purpose}</td>
                    <td className="p-4 text-muted-foreground">{s.region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy →
            </Link>
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service →
            </Link>
            <Link href="/status" className="text-primary hover:underline">
              Live system status →
            </Link>
            <Link
              href="/contact-sales?interest=security"
              className="text-primary hover:underline"
            >
              Request our security questionnaire →
            </Link>
          </div>
        </div>
      </section>
      <CtaBand />
    </MarketingShell>
  );
}
