"use client";

import { ArrowRight, Loader2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { VerdictBadge } from "@/components/app/verdict-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function grade(score: number) {
  if (score >= 90) return "Legendary";
  if (score >= 75) return "Excellent";
  if (score >= 60) return "Solid";
  if (score >= 40) return "Mediocre";
  return "Tragic";
}

export type Enhancement = {
  url: string | null;
  verdict: string | null;
  score: number | null;
};

/** Runs "Level it up" (hot dogs) or "Hot-dogify" (anything else) for a scan. */
export function useEnhance(scanId: string, initial: Enhancement | null = null) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Enhancement | null>(initial);

  const run = async () => {
    setBusy(true);
    try {
      const response = await fetch(`/api/scans/${scanId}/enhance`, {
        method: "POST",
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error?.message ?? "Image edit failed");
      setResult({
        url: body.enhanced_url,
        verdict: body.enhanced_verdict,
        score: body.enhanced_score,
      });
    } catch (error) {
      toast.error(
        error instanceof Error && error.message !== "Failed to fetch"
          ? error.message
          : "This needs a network connection",
      );
    } finally {
      setBusy(false);
    }
  };

  return { busy, result, run };
}

/** Hot Dog Score with grade and "What's missing". */
export function ScoreSummary({
  score,
  improvements,
}: {
  score: number;
  improvements: string[];
}) {
  return (
    <div className="flex flex-col gap-3">
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
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"
            style={{ width: `${score}%` }}
          />
        </div>
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
    </div>
  );
}

/** The image-edit call to action plus a one-line summary of the last result. */
export function EnhanceAction({
  isHotDog,
  score,
  busy,
  result,
  onRun,
}: {
  isHotDog: boolean;
  score: number | null;
  busy: boolean;
  result: Enhancement | null;
  onRun: () => void;
}) {
  const Icon = isHotDog ? Sparkles : Wand2;
  const label = isHotDog
    ? result
      ? "Level up again"
      : "Level it up"
    : result
      ? "Try another"
      : "Hot-dogify it";

  return (
    <div className="flex flex-col gap-3">
      {!isHotDog && !result && (
        <div>
          <p className="text-sm font-medium">Not a hot dog. Yet.</p>
          <p className="text-sm text-muted-foreground">
            SeeFood can add one to your photo, then classify it again.
          </p>
        </div>
      )}
      {result && (
        <div className="flex flex-wrap items-center gap-2 rounded-md bg-muted/60 px-3 py-2 text-sm">
          {isHotDog ? (
            <>
              <span className="tabular-nums">{score ?? "—"}</span>
              <ArrowRight className="size-3.5" />
              <span className="font-semibold tabular-nums">
                {result.score ?? "—"}
              </span>
              {score != null && result.score != null && (
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
              )}
            </>
          ) : (
            <>
              <VerdictBadge verdict="not_hot_dog" />
              <ArrowRight className="size-3.5" />
              <VerdictBadge verdict={result.verdict ?? "not_hot_dog"} />
              {result.score != null && (
                <span className="text-muted-foreground">
                  Score {result.score}
                </span>
              )}
            </>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            Drag the slider to compare
          </span>
        </div>
      )}
      <Button
        onClick={onRun}
        disabled={busy}
        variant={result ? "outline" : "default"}
        className={cn(
          !result &&
            (isHotDog
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-red-600 text-white hover:bg-red-700"),
        )}
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Icon className="size-4" />
        )}
        {busy
          ? isHotDog
            ? "Leveling up… about 15 seconds"
            : "Adding a hot dog… about 15 seconds"
          : label}
      </Button>
    </div>
  );
}
