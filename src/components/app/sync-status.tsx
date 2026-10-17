"use client";

import { usePowerSync, useStatus } from "@powersync/react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const explanations = {
  Synced:
    "Your scan history is stored on this device and matches the cloud. History, analytics and feedback keep working if you lose your connection.",
  Syncing: "Uploading changes made on this device. You can keep working.",
  Connecting: "Connecting to the sync service…",
  Offline:
    "No connection. History, analytics and feedback still work and will sync when you're back online. Classifying new images needs a connection.",
};

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

  const label: keyof typeof explanations = !status.connected
    ? status.connecting
      ? "Connecting"
      : "Offline"
    : status.dataFlowStatus.uploading || pending > 0
      ? "Syncing"
      : "Synced";

  return (
    <Tooltip>
      <TooltipTrigger className="flex w-fit cursor-help items-center gap-2 text-xs text-muted-foreground">
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
      </TooltipTrigger>
      <TooltipContent side="top" align="start" className="max-w-64">
        {explanations[label]}
      </TooltipContent>
    </Tooltip>
  );
}
