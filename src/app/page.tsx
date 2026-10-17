import { redirect } from "next/navigation";
import { Suspense } from "react";
import { signOut } from "@/app/auth/actions";
import { ItemsApp } from "@/components/items-app";
import { PowerSyncProvider } from "@/components/powersync-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/lib/supabase/server";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-16">
      <Card>
        <Suspense fallback={<AppSkeleton />}>
          <App />
        </Suspense>
      </Card>
    </main>
  );
}

async function App() {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Seamflow</CardTitle>
        <CardDescription>
          {user.email} · stored on this device, synced to Postgres by PowerSync
        </CardDescription>
        <CardAction>
          <form action={signOut}>
            <Button variant="ghost" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </CardAction>
      </CardHeader>
      <CardContent>
        <PowerSyncProvider>
          <ItemsApp userId={user.id} />
        </PowerSyncProvider>
      </CardContent>
    </>
  );
}

function AppSkeleton() {
  return (
    <CardContent className="flex flex-col gap-3">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-6 w-4/5" />
    </CardContent>
  );
}
