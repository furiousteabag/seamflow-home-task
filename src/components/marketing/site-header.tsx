import Link from "next/link";
import { Logo } from "@/components/logo";
import { AuthButton } from "@/components/marketing/auth-button";

const links = [
  { href: "/#features", label: "Product" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/docs", label: "API" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <AuthButton />
      </div>
    </header>
  );
}
