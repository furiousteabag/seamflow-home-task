"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePowerSync, useQuery, useStatus } from "@powersync/react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { generateItem } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { LocalItem } from "@/lib/powersync/schema";
import { type ItemInput, itemInput } from "@/lib/validation";

type Row = LocalItem & { id: string };

export function ItemsApp({ userId }: { userId: string }) {
  const db = usePowerSync();
  const status = useStatus();
  const { data: rows, isLoading } = useQuery<Row>(
    "SELECT * FROM items ORDER BY created_at DESC",
  );
  const [isGenerating, startGenerating] = useTransition();
  const form = useForm<ItemInput>({
    resolver: zodResolver(itemInput),
    defaultValues: { title: "" },
  });

  // Local writes land in SQLite instantly and queue for upload
  const onSubmit = form.handleSubmit(async ({ title }) => {
    await db.execute(
      "INSERT INTO items (id, title, source, user_id, created_at) VALUES (uuid(), ?, 'manual', ?, ?)",
      [title, userId, new Date().toISOString()],
    );
    form.reset();
  });

  const onDelete = (id: string) =>
    db.execute("DELETE FROM items WHERE id = ?", [id]);

  const onGenerate = () =>
    startGenerating(async () => {
      const result = await generateItem(form.getValues("title"));
      if (result.ok) {
        form.reset();
        toast.success("AI added an item");
      } else toast.error(result.error);
    });

  const error = form.formState.errors.title;
  const online = status.connected;

  return (
    <div className="flex flex-col gap-4">
      <SyncBadge />
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Field data-invalid={!!error} className="flex-1">
          <Input
            {...form.register("title")}
            placeholder="Add an item, or a topic for AI…"
            aria-invalid={!!error}
            autoComplete="off"
          />
          <FieldError errors={[error]} />
        </Field>
        <div className="flex gap-2 self-start">
          <Button type="submit">Add</Button>
          <Button
            type="button"
            variant="outline"
            onClick={onGenerate}
            disabled={isGenerating || !online}
            title={online ? undefined : "AI needs a connection"}
          >
            {isGenerating ? "Thinking…" : "Generate with AI"}
          </Button>
        </div>
      </form>

      {isLoading && !status.hasSynced ? (
        <div className="flex flex-col gap-3 py-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
        </div>
      ) : rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No items yet. Add one or let AI suggest something.
        </p>
      ) : (
        <ul className="divide-y">
          {rows.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <span className="min-w-0 flex-1 break-words">{item.title}</span>
              <Badge variant={item.source === "ai" ? "default" : "secondary"}>
                {item.source === "ai" ? "AI" : "Manual"}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item.id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SyncBadge() {
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

  const label = !status.connected
    ? "Offline"
    : status.dataFlowStatus.uploading || pending > 0
      ? "Syncing"
      : "Synced";

  // Simulates losing the network: local reads/writes keep working, uploads queue
  const toggleOffline = async () => {
    if (status.connected || status.connecting) {
      await db.disconnect();
    } else {
      const { connector } = await import("@/lib/powersync/db");
      await db.connect(connector);
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span
        className={`size-2 rounded-full ${
          label === "Synced"
            ? "bg-emerald-500"
            : label === "Syncing"
              ? "bg-amber-500"
              : "bg-zinc-400"
        }`}
      />
      <span>{label}</span>
      {pending > 0 && (
        <span>
          · {pending} change{pending === 1 ? "" : "s"} pending
        </span>
      )}
      <Button
        variant="link"
        size="sm"
        className="ml-auto h-auto p-0"
        onClick={toggleOffline}
      >
        {status.connected || status.connecting ? "Go offline" : "Go online"}
      </Button>
    </div>
  );
}
