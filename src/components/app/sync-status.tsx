"use client";

import { usePowerSync, useStatus } from "@powersync/react";
import { useEffect, useState } from "react";

export function SyncStatus() {
  const db = usePowerSync();
  const status = useStatus();
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const tick = () =>
      db.getUploadQueueStats().then((stats) => setPending(stats.count));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [db]);

  // Simulates losing the network: history, feedback and deletes keep working locally
  const toggle = async () => {
    if (status.connected || status.connecting) {
      await db.disconnect();
    } else {
      const { connector } = await import("@/lib/powersync/db");
      await db.connect(connector);
    }
  };

  const online = status.connected;
  const label = !online
    ? status.connecting
      ? "Connecting"
      : "Offline"
    : status.dataFlowStatus.uploading || pending > 0
      ? "Syncing"
      : "Synced";

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span
        className={`size-2 shrink-0 rounded-full ${
          label === "Synced"
            ? "bg-emerald-500"
            : label === "Offline"
              ? "bg-zinc-400"
              : "bg-amber-500"
        }`}
      />
      <span>
        {label}
        {pending > 0 && ` · ${pending} pending`}
      </span>
      <button
        type="button"
        onClick={toggle}
        className="ml-auto underline-offset-2 hover:text-foreground hover:underline"
      >
        {status.connected || status.connecting ? "Go offline" : "Go online"}
      </button>
    </div>
  );
}
