import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { AnnouncementBar } from "@/components/marketing/annoyances";
import { AuthButton } from "@/components/marketing/auth-button";
import {
  companyMenu,
  productMenu,
  resourcesMenu,
  solutions,
} from "@/components/marketing/content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MenuItem = { href: string; title: string; body: string };

const solutionsMenu: MenuItem[] = solutions.map((s) => ({
  href: `/solutions/${s.slug}`,
  title: s.name,
  body: s.tagline,
}));

const menus: { label: string; items: MenuItem[]; footer: MenuItem }[] = [
  {
    label: "Products",
    items: productMenu,
    footer: { href: "/platform", title: "Platform overview", body: "" },
  },
  {
    label: "Solutions",
    items: solutionsMenu,
    footer: { href: "/solutions", title: "All solutions", body: "" },
  },
  {
    label: "Resources",
    items: resourcesMenu,
    footer: { href: "/customers", title: "Customer stories", body: "" },
  },
  {
    label: "Company",
    items: companyMenu,
    footer: { href: "/company#careers", title: "We're hiring", body: "" },
  },
];

const utilityLinks = [
  { href: "/contact-sales", label: "Contact sales" },
  { href: "/docs", label: "Developers" },
  { href: "/status", label: "System status" },
  { href: "/security", label: "Trust Center" },
  { href: "/company#careers", label: "Careers" },
];

export function SiteHeader() {
  return (
    <>
      <AnnouncementBar />
      <div className="hidden border-b bg-slate-950 text-xs text-slate-300 md:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-end gap-5 px-4">
          {utilityLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden items-center gap-0.5 text-sm lg:flex">
              {menus.map((m, i) => (
                <div key={m.label} className="group relative">
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-md px-3 py-2 font-medium text-foreground/80 group-focus-within:bg-muted group-hover:bg-muted group-hover:text-foreground"
                  >
                    {m.label}
                    <ChevronDown className="size-3.5 transition-transform group-focus-within:rotate-180 group-hover:rotate-180" />
                  </button>
                  <div
                    className={`invisible absolute top-full ${i < 2 ? "left-0" : "right-0"} pt-2 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100`}
                  >
                    <div className="w-[36rem] overflow-hidden rounded-lg border bg-popover shadow-xl">
                      <div className="grid grid-cols-2 gap-1 p-3">
                        {m.items.map((item) => (
                          <Link
                            key={item.href + item.title}
                            href={item.href}
                            className="rounded-md p-3 hover:bg-muted"
                          >
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {item.body}
                            </p>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href={m.footer.href}
                        className="flex items-center justify-between border-t bg-muted/50 px-6 py-3 text-sm font-medium text-primary hover:bg-muted"
                      >
                        {m.footer.title} →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              <Link
                href="/customers"
                className="hidden rounded-md px-3 py-2 font-medium text-foreground/80 hover:bg-muted hover:text-foreground xl:block"
              >
                Customers
              </Link>
              <Link
                href="/pricing"
                className="rounded-md px-3 py-2 font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
              >
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/contact-sales?interest=demo"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden xl:inline-flex",
              )}
            >
              Request a demo
            </Link>
            <AuthButton />
            <MobileNav />
          </div>
        </div>
      </header>
    </>
  );
}

function MobileNav() {
  return (
    <details className="lg:hidden">
      <summary
        className="flex size-9 cursor-pointer list-none items-center justify-center rounded-md border marker:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </summary>
      <div className="absolute inset-x-0 top-16 max-h-[calc(100svh-4rem)] overflow-y-auto border-b bg-background px-4 pb-6 shadow-xl">
        {menus.map((m) => (
          <div key={m.label} className="border-b py-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {m.label}
            </p>
            {[...m.items, m.footer].map((item) => (
              <Link
                key={item.href + item.title}
                href={item.href}
                className="block py-1.5 text-sm"
              >
                {item.title}
              </Link>
            ))}
          </div>
        ))}
        <div className="flex flex-col gap-1 py-3 text-sm">
          <Link href="/customers" className="py-1.5">
            Customers
          </Link>
          <Link href="/pricing" className="py-1.5">
            Pricing
          </Link>
          {utilityLinks.map((l) => (
            <Link key={l.href} href={l.href} className="py-1.5">
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact-sales?interest=demo"
            className={buttonVariants({ className: "mt-2" })}
          >
            Request a demo
          </Link>
        </div>
      </div>
    </details>
  );
}
