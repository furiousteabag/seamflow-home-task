import Link from "next/link";
import { Logo } from "@/components/logo";
import { COMPANY } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="flex flex-col gap-3 md:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Binary food intelligence for organizations that cannot afford
            ambiguity about hot dogs.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-medium">Product</p>
          <Link
            href="/app"
            className="text-muted-foreground hover:text-foreground"
          >
            Web app
          </Link>
          <Link
            href="/docs"
            className="text-muted-foreground hover:text-foreground"
          >
            API reference
          </Link>
          <Link
            href="/#pricing"
            className="text-muted-foreground hover:text-foreground"
          >
            Pricing
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-medium">Company</p>
          <a
            href="mailto:sales@seefoodsystems.com"
            className="text-muted-foreground hover:text-foreground"
          >
            Contact sales
          </a>
          <Link
            href="/#faq"
            className="text-muted-foreground hover:text-foreground"
          >
            FAQ
          </Link>
          <Link
            href="/api/health"
            className="text-muted-foreground hover:text-foreground"
          >
            System status
          </Link>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>
            © 2026 {COMPANY}. A parody of SeeFood from HBO's Silicon Valley.
          </span>
          <span>
            Sample photos: “Hot Dogs on a Bun” by TheBusyBrain (CC BY 2.0);
            burger and dog photos CC0, via Wikimedia Commons.
          </span>
        </div>
      </div>
    </footer>
  );
}
