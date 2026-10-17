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

export const NEW_SCAN_EVENT = "seefood:new-scan";

const nav = [
  { href: "/app", label: "Classify", icon: ScanSearch },
  { href: "/app/history", label: "Scan history", icon: History },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/app/api-keys", label: "API keys", icon: KeyRound },
];

type Profile = {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
};

export function AppShell({
  children,
  user,
}: {
  children: ReactNode;
  user: Profile;
}) {
  const pathname = usePathname();
  // Already on Classify: links to /app don't remount the page, so ask it to clear
  const resetIfOnClassify = () => {
    if (pathname === "/app") window.dispatchEvent(new Event(NEW_SCAN_EVENT));
  };

  return (
    <div className="flex min-h-svh w-full flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col border-b bg-sidebar md:sticky md:top-0 md:h-svh md:w-60 md:border-r md:border-b-0">
        <div className="flex h-14 items-center justify-between px-4">
          <span onClickCapture={resetIfOnClassify}>
            <Logo href="/app" />
          </span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-1 md:flex-col md:pb-0">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={href === "/app" ? resetIfOnClassify : undefined}
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
          <div className="flex items-center gap-3">
            <Avatar user={user} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user.name ?? user.email ?? "Signed in"}
              </p>
              {user.name && user.email && (
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              )}
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
        <div className="flex items-center justify-between gap-3 border-b px-4 py-2 md:hidden">
          <Avatar user={user} />
          <div className="min-w-0 flex-1">
            <SyncStatus />
          </div>
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

function Avatar({ user }: { user: Profile }) {
  const initials = (user.name ?? user.email ?? "?")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return user.avatarUrl ? (
    // biome-ignore lint/performance/noImgElement: external Google avatar, tiny
    <img
      src={user.avatarUrl}
      alt=""
      referrerPolicy="no-referrer"
      className="size-8 shrink-0 rounded-full border object-cover"
    />
  ) : (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
      {initials}
    </span>
  );
}
