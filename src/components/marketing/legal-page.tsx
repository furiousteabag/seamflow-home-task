import type { ReactNode } from "react";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export const CONTACT_EMAIL = "privacy@seefoodsystems.com";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16">
        <p className="text-sm font-medium text-primary">Legal</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated {updated}
        </p>
        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:mt-1 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
