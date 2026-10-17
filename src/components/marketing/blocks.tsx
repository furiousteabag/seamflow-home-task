import {
  ArrowRight,
  Landmark,
  Plane,
  ShieldCheck,
  Store,
  Ticket,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Solution } from "@/components/marketing/content";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

/** Dark gradient hero used by every inner marketing page. */
export function PageHero({
  eyebrow,
  title,
  body,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <HeroBackdrop />
      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <p className="text-sm font-semibold tracking-wide text-sky-300 uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {body && (
          <p className="mt-4 max-w-2xl text-lg text-slate-300 text-pretty">
            {body}
          </p>
        )}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        {children}
      </div>
    </section>
  );
}

export function HeroBackdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.25),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.35),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  center,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("mb-10 max-w-3xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {body && (
        <p className="mt-3 text-lg text-muted-foreground text-pretty">{body}</p>
      )}
    </div>
  );
}

export function CtaBand({
  title = "See SeeFood on your own hot dogs",
  body = "Talk to our team about a rollout, or start classifying in the evaluation workspace today.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <HeroBackdrop />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-16 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 max-w-xl text-slate-300">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact-sales?interest=demo"
            className={buttonVariants({
              size: "lg",
              className: "bg-white text-slate-950 hover:bg-slate-200",
            })}
          >
            Request a demo <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/app"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className:
                "border-slate-600 bg-transparent text-white hover:bg-slate-800 hover:text-white",
            })}
          >
            Open the workspace
          </Link>
        </div>
      </div>
    </section>
  );
}

const solutionIcons = {
  ticket: Ticket,
  utensils: UtensilsCrossed,
  shield: ShieldCheck,
  landmark: Landmark,
  store: Store,
  plane: Plane,
} as const;

export function SolutionIcon({
  icon,
  className,
}: {
  icon: Solution["icon"];
  className?: string;
}) {
  const Icon = solutionIcons[icon];
  return <Icon className={className} />;
}

/** White-on-dark button pair helpers for dark heroes. */
export const heroPrimary = buttonVariants({
  size: "lg",
  className: "bg-white text-slate-950 hover:bg-slate-200",
});
export const heroSecondary = buttonVariants({
  size: "lg",
  variant: "outline",
  className:
    "border-slate-600 bg-transparent text-white hover:bg-slate-800 hover:text-white",
});
