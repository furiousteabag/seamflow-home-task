import { redirect } from "next/navigation";
import { type ReactNode, Suspense } from "react";
import { AppShell } from "@/components/app/app-shell";
import { PowerSyncProvider } from "@/components/powersync-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/lib/supabase/server";

// Everything below is per-user and client-rendered from the local replica
export const instant = false;

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<ShellSkeleton />}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}

async function Gate({ children }: { children: ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <PowerSyncProvider fallback={<ShellSkeleton />}>
      <AppShell
        user={{ name: user.name, email: user.email, avatarUrl: user.avatarUrl }}
      >
        {children}
      </AppShell>
    </PowerSyncProvider>
  );
}

function ShellSkeleton() {
  return (
    <div className="flex min-h-svh">
      <div className="hidden w-60 border-r bg-sidebar md:block" />
      <div className="flex flex-1 flex-col gap-4 p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full max-w-3xl" />
      </div>
    </div>
  );
}
