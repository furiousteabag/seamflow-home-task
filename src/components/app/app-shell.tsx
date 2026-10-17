"use client";

import {
  BarChart3,
  BookOpen,
  History,
  KeyRound,
  LogOut,
  ScanSearch,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { signOut } from "@/app/auth/actions";
import { SyncStatus } from "@/components/app/sync-status";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/app", label: "Classify", icon: ScanSearch },
  { href: "/app/history", label: "Scan history", icon: History },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/app/api-keys", label: "API keys", icon: KeyRound },
];

export function AppShell({
  children,
  userLabel,
}: {
  children: ReactNode;
  userLabel: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-svh w-full flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col border-b bg-sidebar md:sticky md:top-0 md:h-svh md:w-60 md:border-r md:border-b-0">
        <div className="flex h-14 items-center justify-between px-4">
          <Logo href="/app" />
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-1 md:flex-col md:pb-0">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  active && "bg-accent font-medium text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
          <Link
            href="/docs"
            className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <BookOpen className="size-4" />
            API docs
          </Link>
        </nav>
        <div className="hidden flex-col gap-3 border-t p-4 md:flex">
          <SyncStatus />
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{userLabel}</p>
              <p className="text-xs text-muted-foreground">Workspace owner</p>
            </div>
            <form action={signOut}>
              <Button
                variant="ghost"
                size="icon"
                type="submit"
                title="Sign out"
              >
                <LogOut className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b px-4 py-2 md:hidden">
          <SyncStatus />
          <form action={signOut}>
            <Button variant="ghost" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </div>
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {actions}
    </div>
  );
}
