"use client";

import { PowerSyncContext } from "@powersync/react";
import type { PowerSyncDatabase } from "@powersync/web";
import { type ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const RESET_FLAG = "seefood:local-db-reset";
const READY_TIMEOUT_MS = 20_000;

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Local database timed out")), ms),
    ),
  ]);
}

export function PowerSyncProvider({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [db, setDb] = useState<PowerSyncDatabase | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Imported lazily so the WASM SDK never loads during SSR
    import("@/lib/powersync/db").then(async ({ getDB, resetLocalDatabase }) => {
      const instance = getDB();
      try {
        await withTimeout(instance.waitForReady(), READY_TIMEOUT_MS);
        sessionStorage.removeItem(RESET_FLAG);
        if (!cancelled) setDb(instance);
      } catch (error) {
        console.error("Local database failed to open", error);
        // Self-heal once: the replica is only a cache of server data
        if (!sessionStorage.getItem(RESET_FLAG)) {
          sessionStorage.setItem(RESET_FLAG, "1");
          await resetLocalDatabase();
          window.location.reload();
          return;
        }
        if (!cancelled) setFailed(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="font-medium">Your local workspace couldn't be opened.</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Close other SeeFood tabs and reload. Your scans are safe on the server
          and will sync back.
        </p>
        <Button
          onClick={() => {
            sessionStorage.removeItem(RESET_FLAG);
            window.location.reload();
          }}
        >
          Reload
        </Button>
      </div>
    );
  }
  if (!db) return fallback;
  return (
    <PowerSyncContext.Provider value={db}>{children}</PowerSyncContext.Provider>
  );
}
