"use client";

import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function grade(score: number) {
  if (score >= 90) return "Legendary";
  if (score >= 75) return "Excellent";
  if (score >= 60) return "Solid";
  if (score >= 40) return "Mediocre";
  return "Tragic";
}

function ScoreBar({ score, className }: { score: number; className?: string }) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-muted", className)}>
      <div
        className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

/** Hot Dog Score, what's missing, and the "Level it up" enhancement. */
export function HotDogScore({
  scanId,
  score,
  improvements,
  beforeUrl,
  enhancedScore,
  enhancedUrl,
}: {
  scanId: string;
  score: number;
  improvements: string[];
  beforeUrl: string | null;
  enhancedScore?: number | null;
  enhancedUrl?: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{
    url: string | null;
    score: number | null;
  } | null>(
    enhancedUrl ? { url: enhancedUrl, score: enhancedScore ?? null } : null,
  );

  const levelUp = async () => {
    setBusy(true);
    try {
      const response = await fetch(`/api/scans/${scanId}/enhance`, {
        method: "POST",
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error?.message ?? "Level up failed");
      setResult({ url: body.enhanced_url, score: body.enhanced_score });
    } catch (error) {
      toast.error(
        error instanceof Error && error.message !== "Failed to fetch"
          ? error.message
          : "Level up needs a network connection",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-gradient-to-b from-amber-50/60 to-background p-4">
      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-sm font-medium">Hot Dog Score</span>
          <span className="tabular-nums">
            <span className="text-2xl font-bold">{score}</span>
            <span className="text-sm text-muted-foreground">
              /100 · {grade(score)}
            </span>
          </span>
        </div>
        <ScoreBar score={score} />
      </div>

      {improvements.length > 0 && (
        <div>
          <p className="mb-1.5 text-sm font-medium">What's missing</p>
          <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
            {improvements.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-amber-500">+</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <Figure label="Before" score={score} url={beforeUrl} />
            <Figure
              label="After"
              score={result.score}
              url={result.url}
              highlight
            />
          </div>
          {result.score != null && (
            <p className="flex items-center justify-center gap-2 text-sm font-medium">
              {score} <ArrowRight className="size-3.5" /> {result.score}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  result.score >= score
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700",
                )}
              >
                {result.score >= score ? "+" : ""}
                {result.score - score} points
              </span>
            </p>
          )}
          <Button variant="outline" size="sm" onClick={levelUp} disabled={busy}>
            {busy ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            {busy ? "Plating a new version…" : "Try another upgrade"}
          </Button>
        </div>
      ) : (
        <Button
          onClick={levelUp}
          disabled={busy}
          className="bg-amber-500 text-white hover:bg-amber-600"
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {busy ? "Leveling up… about 15 seconds" : "Level it up"}
        </Button>
      )}
    </div>
  );
}

export function Figure({
  label,
  score,
  url,
  highlight,
}: {
  label: string;
  score: number | null;
  url: string | null;
  highlight?: boolean;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-md border bg-muted",
        highlight && "ring-2 ring-amber-400",
      )}
    >
      {url ? (
        // biome-ignore lint/performance/noImgElement: blob or signed storage URL
        <img
          src={url}
          alt={`${label} hot dog`}
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div className="aspect-square" />
      )}
      <figcaption className="flex justify-between bg-background px-2 py-1 text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{score ?? "—"}</span>
      </figcaption>
    </figure>
  );
}
