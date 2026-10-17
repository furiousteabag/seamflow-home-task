"use client";

import { ArrowRight, Loader2, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Figure } from "@/components/app/hot-dog-score";
import { VerdictBadge } from "@/components/app/verdict-badge";
import { Button } from "@/components/ui/button";

/** For non hot dogs: an image model adds a hot dog to the photo, then it is re-classified. */
export function Hotdogify({
  scanId,
  beforeUrl,
  enhancedUrl,
  enhancedScore,
}: {
  scanId: string;
  beforeUrl: string | null;
  enhancedUrl?: string | null;
  enhancedScore?: number | null;
}) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{
    url: string | null;
    verdict: string | null;
    score: number | null;
  } | null>(
    enhancedUrl
      ? {
          url: enhancedUrl,
          verdict: enhancedScore != null ? "hot_dog" : null,
          score: enhancedScore ?? null,
        }
      : null,
  );

  const run = async () => {
    setBusy(true);
    try {
      const response = await fetch(`/api/scans/${scanId}/enhance`, {
        method: "POST",
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error?.message ?? "Hot-dogify failed");
      setResult({
        url: body.enhanced_url,
        verdict: body.enhanced_verdict,
        score: body.enhanced_score,
      });
    } catch (error) {
      toast.error(
        error instanceof Error && error.message !== "Failed to fetch"
          ? error.message
          : "Hot-dogify needs a network connection",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-gradient-to-b from-red-50/50 to-background p-4">
      <div>
        <p className="text-sm font-medium">Not a hot dog. Yet.</p>
        <p className="text-sm text-muted-foreground">
          Let SeeFood add one, then we'll classify it again.
        </p>
      </div>
      {result && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Figure label="Before" score={null} url={beforeUrl} />
            <Figure
              label="After"
              score={result.score}
              url={result.url}
              highlight
            />
          </div>
          <p className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <VerdictBadge verdict="not_hot_dog" />
            <ArrowRight className="size-3.5" />
            <VerdictBadge verdict={result.verdict ?? "not_hot_dog"} />
            {result.score != null && (
              <span className="text-muted-foreground">
                Score {result.score}/100
              </span>
            )}
          </p>
        </>
      )}
      <Button
        onClick={run}
        disabled={busy}
        variant={result ? "outline" : "default"}
        className={
          result ? undefined : "bg-red-600 text-white hover:bg-red-700"
        }
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Wand2 className="size-4" />
        )}
        {busy
          ? "Adding a hot dog… about 15 seconds"
          : result
            ? "Try again"
            : "Hot-dogify it"}
      </Button>
    </div>
  );
}
