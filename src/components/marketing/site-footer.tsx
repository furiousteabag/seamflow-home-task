import Link from "next/link";
import { Logo } from "@/components/logo";
import {
  Annoyances,
  CookieSettingsLink,
} from "@/components/marketing/annoyances";
import { customers, solutions } from "@/components/marketing/content";
import { COMPANY } from "@/lib/site";

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Products",
    links: [
      { href: "/platform", label: "Platform overview" },
      { href: "/platform#classify", label: "SeeFood Classify" },
      { href: "/platform#audit", label: "SeeFood Audit" },
      { href: "/platform#insights", label: "SeeFood Insights" },
      { href: "/platform#edge", label: "SeeFood Edge" },
      { href: "/docs", label: "SeeFood API" },
      { href: "/app", label: "Sign in to workspace" },
    ],
  },
  {
    title: "Solutions",
    links: solutions.map((s) => ({
      href: `/solutions/${s.slug}`,
      label: s.name,
    })),
  },
  {
    title: "Customers",
    links: [
      { href: "/customers", label: "All customer stories" },
      ...customers.map((c) => ({
        href: `/customers/${c.slug}`,
        label: c.company,
      })),
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/resources", label: "Resource library" },
      {
        href: "/resources/state-of-hot-dogs-2026",
        label: "State of Hot Dogs 2026",
      },
      { href: "/docs", label: "API documentation" },
      { href: "/status", label: "System status" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company", label: "About us" },
      { href: "/company#leadership", label: "Leadership" },
      { href: "/company#careers", label: "Careers" },
      { href: "/security", label: "Trust Center" },
      { href: "/contact-sales", label: "Contact sales" },
    ],
  },
];

export function SiteFooter() {
  return (
    <>
      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
            <div className="flex flex-col gap-4">
              <Logo className="text-white [&_span:last-child]:border-slate-700 [&_span:last-child]:text-slate-400" />
              <p className="max-w-xs text-sm text-slate-400">
                Binary food intelligence for organizations that cannot afford
                ambiguity about hot dogs.
              </p>
              <Link
                href="/contact-sales"
                className="w-fit rounded-md border border-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
              >
                Contact sales →
              </Link>
            </div>
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-2 text-sm">
                <p className="mb-1 font-semibold text-white">{col.title}</p>
                {col.links.map((l) => (
                  <Link
                    key={l.href + l.label}
                    href={l.href}
                    className="text-slate-400 hover:text-white"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-800">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate-500 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <span>© 2026 {COMPANY}, Inc.</span>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
              <Link href="/security#subprocessors" className="hover:text-white">
                Subprocessors
              </Link>
              <CookieSettingsLink className="hover:text-white" />
              <Link href="/privacy#your-rights" className="hover:text-white">
                Do Not Sell or Share My Hot Dog Data
              </Link>
            </div>
            <p className="max-w-xl lg:text-right">
              A parody of SeeFood from HBO's Silicon Valley; all customers and
              people named are fictional. Sample photos: “Hot Dogs on a Bun” by
              TheBusyBrain (CC BY 2.0); burger and dog photos CC0, via Wikimedia
              Commons.
            </p>
          </div>
        </div>
      </footer>
      {/* Outside the footer so popups don't inherit its dark-theme text color */}
      <Annoyances />
    </>
  );
}
