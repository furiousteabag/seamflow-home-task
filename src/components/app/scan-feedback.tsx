"use client";

import { usePowerSync, useQuery } from "@powersync/react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

// Writes to local SQLite; PowerSync uploads it (also works offline)
export function ScanFeedback({ scanId }: { scanId: string }) {
  const db = usePowerSync();
  const { data } = useQuery<{ feedback: string | null }>(
    "SELECT feedback FROM scans WHERE id = ?",
    [scanId],
  );
  const row = data[0];
  const set = (feedback: "correct" | "incorrect") =>
    db.execute("UPDATE scans SET feedback = ? WHERE id = ?", [
      row?.feedback === feedback ? null : feedback,
      scanId,
    ]);

  if (!row) {
    return <p className="text-xs text-muted-foreground">Syncing to history…</p>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Was this right?</span>
      <Button
        size="sm"
        variant={row.feedback === "correct" ? "default" : "outline"}
        onClick={() => set("correct")}
      >
        <ThumbsUp className="size-3.5" /> Correct
      </Button>
      <Button
        size="sm"
        variant={row.feedback === "incorrect" ? "destructive" : "outline"}
        onClick={() => set("incorrect")}
      >
        <ThumbsDown className="size-3.5" /> Incorrect
      </Button>
    </div>
  );
}
