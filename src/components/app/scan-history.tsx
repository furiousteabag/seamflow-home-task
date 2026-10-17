"use client";

import { usePowerSync, useQuery } from "@powersync/react";
import { Download, ImageOff, Loader2, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getScanImageUrl } from "@/app/app/actions";
import { PageHeader } from "@/components/app/app-shell";
import { HotDogScore } from "@/components/app/hot-dog-score";
import { Hotdogify } from "@/components/app/hotdogify";
import { ScanFeedback } from "@/components/app/scan-feedback";
import { formatPercent, VerdictBadge } from "@/components/app/verdict-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LocalScan } from "@/lib/powersync/schema";

type Filter = "all" | "hot_dog" | "not_hot_dog" | "flagged";

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

export function ScanHistory() {
  const db = usePowerSync();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<LocalScan | null>(null);

  const where =
    filter === "flagged"
      ? "feedback = 'incorrect'"
      : filter === "all"
        ? "1 = 1"
        : `verdict = '${filter}'`;
  const { data: rows, isLoading } = useQuery<LocalScan>(
    `SELECT * FROM scans WHERE ${where} AND label LIKE ? ORDER BY created_at DESC`,
    [`%${search}%`],
  );

  const exportCsv = () => {
    const header = [
      "id",
      "created_at",
      "verdict",
      "confidence",
      "label",
      "channel",
      "feedback",
      "model",
      "latency_ms",
    ];
    const lines = rows.map((r) =>
      [
        r.id,
        r.created_at,
        r.verdict,
        r.confidence,
        r.label,
        r.channel,
        r.feedback ?? "",
        r.model,
        r.latency_ms,
      ]
        .map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "text/csv",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `seefood-scans-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const remove = async (scan: LocalScan) => {
    await db.execute("DELETE FROM scans WHERE id = ?", [scan.id]);
    setSelected(null);
    toast.success("Scan deleted");
  };

  return (
    <>
      <PageHeader
        title="Scan history"
        description="Audit log of every classification in this workspace. Available offline."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            disabled={rows.length === 0}
          >
            <Download className="size-3.5" /> Export CSV
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="hot_dog">Hot Dog</TabsTrigger>
            <TabsTrigger value="not_hot_dog">Not Hot Dog</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative sm:w-64">
          <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search detections"
            className="pl-8"
          />
        </div>
      </div>

      <Card className="overflow-hidden py-0">
        {isLoading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            No scans match. Classify an image to start your audit trail.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Image</th>
                  <th className="px-4 py-2 font-medium">Verdict</th>
                  <th className="px-4 py-2 font-medium">Detection</th>
                  <th className="px-4 py-2 font-medium">Confidence</th>
                  <th className="hidden px-4 py-2 font-medium sm:table-cell">
                    Score
                  </th>
                  <th className="hidden px-4 py-2 font-medium sm:table-cell">
                    Score
                  </th>
                  <th className="hidden px-4 py-2 font-medium md:table-cell">
                    Channel
                  </th>
                  <th className="hidden px-4 py-2 font-medium md:table-cell">
                    Feedback
                  </th>
                  <th className="px-4 py-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((scan) => (
                  <tr
                    key={scan.id}
                    onClick={() => setSelected(scan)}
                    className="cursor-pointer hover:bg-muted/40"
                  >
                    <td className="px-4 py-2">
                      <Thumb src={scan.thumbnail} />
                    </td>
                    <td className="px-4 py-2">
                      <VerdictBadge verdict={scan.verdict} />
                    </td>
                    <td className="max-w-48 truncate px-4 py-2">
                      {scan.label}
                    </td>
                    <td className="px-4 py-2 tabular-nums">
                      {formatPercent(scan.confidence)}
                    </td>
                    <td className="hidden px-4 py-2 tabular-nums sm:table-cell">
                      {scan.hot_dog_score ?? (
                        <span className="text-muted-foreground">—</span>
                      )}
                      {scan.enhanced_score != null && (
                        <span className="text-amber-600">
                          {" "}
                          → {scan.enhanced_score}
                        </span>
                      )}
                    </td>
                    <td className="hidden px-4 py-2 uppercase text-muted-foreground text-xs md:table-cell">
                      {scan.channel}
                    </td>
                    <td className="hidden px-4 py-2 text-xs md:table-cell">
                      {scan.feedback === "incorrect" ? (
                        <span className="text-red-600">Flagged</span>
                      ) : scan.feedback === "correct" ? (
                        <span className="text-emerald-600">Confirmed</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
                      {formatDate(scan.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ScanDialog
        scan={selected}
        onClose={() => setSelected(null)}
        onDelete={remove}
      />
    </>
  );
}

function Thumb({ src }: { src: string | null }) {
  return src ? (
    // biome-ignore lint/performance/noImgElement: inline data URL thumbnail
    <img src={src} alt="" className="size-10 rounded object-cover" />
  ) : (
    <span className="flex size-10 items-center justify-center rounded bg-muted">
      <ImageOff className="size-4 text-muted-foreground" />
    </span>
  );
}

function ScanDialog({
  scan,
  onClose,
  onDelete,
}: {
  scan: LocalScan | null;
  onClose: () => void;
  onDelete: (scan: LocalScan) => void;
}) {
  const [fullUrl, setFullUrl] = useState<{
    id: string;
    url: string | null;
    enhancedUrl: string | null;
  } | null>(null);
  const open = !!scan;

  if (scan && fullUrl?.id !== scan.id) {
    setFullUrl({ id: scan.id, url: null, enhancedUrl: null });
    Promise.all([
      getScanImageUrl(scan.id),
      scan.enhanced_image_path ? getScanImageUrl(scan.id, "enhanced") : null,
    ])
      .then(([url, enhancedUrl]) =>
        setFullUrl({ id: scan.id, url, enhancedUrl }),
      )
      .catch(() => setFullUrl({ id: scan.id, url: null, enhancedUrl: null }));
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        {scan && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <VerdictBadge verdict={scan.verdict} className="text-sm" />
                <span className="truncate">{scan.label}</span>
              </DialogTitle>
              <DialogDescription>{scan.reasoning}</DialogDescription>
            </DialogHeader>
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md bg-muted">
              {fullUrl?.url ? (
                // biome-ignore lint/performance/noImgElement: signed storage URL
                <img
                  src={fullUrl.url}
                  alt={scan.label ?? ""}
                  className="size-full object-contain"
                />
              ) : scan.thumbnail ? (
                // biome-ignore lint/performance/noImgElement: offline thumbnail fallback
                <img
                  src={scan.thumbnail}
                  alt=""
                  className="size-full object-contain blur-[1px]"
                />
              ) : (
                <ImageOff className="size-6 text-muted-foreground" />
              )}
            </div>
            {scan.verdict === "hot_dog" && scan.hot_dog_score != null && (
              <HotDogScore
                key={`${scan.id}-${fullUrl?.enhancedUrl ? "e" : "o"}`}
                scanId={scan.id}
                score={scan.hot_dog_score}
                improvements={parseImprovements(scan.improvements)}
                beforeUrl={fullUrl?.url ?? scan.thumbnail}
                enhancedScore={scan.enhanced_score}
                enhancedUrl={fullUrl?.enhancedUrl}
              />
            )}
            {scan.verdict === "not_hot_dog" && (
              <Hotdogify
                key={`${scan.id}-${fullUrl?.enhancedUrl ? "e" : "o"}`}
                scanId={scan.id}
                beforeUrl={fullUrl?.url ?? scan.thumbnail}
                enhancedUrl={fullUrl?.enhancedUrl}
                enhancedScore={scan.enhanced_score}
              />
            )}
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <dt className="text-muted-foreground">Confidence</dt>
              <dd className="tabular-nums">{formatPercent(scan.confidence)}</dd>
              <dt className="text-muted-foreground">Model</dt>
              <dd className="font-mono">{scan.model}</dd>
              <dt className="text-muted-foreground">Latency</dt>
              <dd className="font-mono">{scan.latency_ms} ms</dd>
              <dt className="text-muted-foreground">Channel</dt>
              <dd className="uppercase">{scan.channel}</dd>
              <dt className="text-muted-foreground">Scan ID</dt>
              <dd className="truncate font-mono">{scan.id}</dd>
              <dt className="text-muted-foreground">Created</dt>
              <dd>{formatDate(scan.created_at)}</dd>
            </dl>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
              <ScanFeedback scanId={scan.id} />
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600"
                onClick={() => onDelete(scan)}
              >
                <Trash2 className="size-3.5" /> Delete
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function parseImprovements(raw: string | null) {
  try {
    const value = JSON.parse(raw ?? "[]");
    return Array.isArray(value)
      ? value.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}
