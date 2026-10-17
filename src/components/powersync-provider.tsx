"use client";

import { PowerSyncContext } from "@powersync/react";
import type { PowerSyncDatabase } from "@powersync/web";
import { type ReactNode, useEffect, useState } from "react";

export function PowerSyncProvider({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [db, setDb] = useState<PowerSyncDatabase | null>(null);

  useEffect(() => {
    // Imported lazily so the WASM SDK never loads during SSR
    import("@/lib/powersync/db").then(({ getDB }) => setDb(getDB()));
  }, []);

  if (!db) return fallback;
  return (
    <PowerSyncContext.Provider value={db}>{children}</PowerSyncContext.Provider>
  );
}
