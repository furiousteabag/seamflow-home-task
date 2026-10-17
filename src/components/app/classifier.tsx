"use client";

import { useStatus } from "@powersync/react";
import {
  CheckCircle2,
  ImageUp,
  Loader2,
  RotateCcw,
  WifiOff,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/app-shell";
import { HotDogScore } from "@/components/app/hot-dog-score";
import { Hotdogify } from "@/components/app/hotdogify";
import { HungryFinder } from "@/components/app/hungry-finder";
import { ScanFeedback } from "@/components/app/scan-feedback";
import { formatPercent } from "@/components/app/verdict-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prepareImage } from "@/lib/image";
import { cn } from "@/lib/utils";

type Result = {
  id: string;
  verdict: "hot_dog" | "not_hot_dog";
  is_hot_dog: boolean;
  confidence: number;
  label: string;
  reasoning: string;
  model: string;
  latency_ms: number;
  hot_dog_score: number | null;
  improvements: string[];
  enhanced_score: number | null;
  created_at: string;
};

const SAMPLES = [
  { src: "/samples/hot-dog.jpg", label: "Hot dog" },
  { src: "/samples/burger.jpg", label: "Burger" },
  { src: "/samples/dog.jpg", label: "Dog" },
];

export function Classifier() {
  const status = useStatus();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const offline =
    !status.connected && typeof navigator !== "undefined" && !navigator.onLine;

  const classify = useCallback(async (file: Blob) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const { blob, thumbnail, previewUrl } = await prepareImage(file);
      setPreview(previewUrl);
      const form = new FormData();
      form.append("image", blob, "upload.jpg");
      form.append("thumbnail", thumbnail);
      const response = await fetch("/api/classify", {
        method: "POST",
        body: form,
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error?.message ?? "Request failed");
      setResult(body);
    } catch (error) {
      toast.error(
        error instanceof Error && error.message !== "Failed to fetch"
          ? error.message
          : "Classification needs a network connection",
      );
    } finally {
      setBusy(false);
    }
  }, []);

  // Paste an image from the clipboard anywhere on the page
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.files ?? []).find((f) =>
        f.type.startsWith("image/"),
      );
      if (file) classify(file);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [classify]);

  const trySample = async (src: string) => {
    const blob = await fetch(src).then((r) => r.blob());
    classify(blob);
  };

  const reset = () => {
    setResult(null);
    setPreview(null);
  };

  return (
    <>
      <PageHeader
        title="Classify"
        description="Upload an image. SeeFood returns a definitive verdict."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden py-0">
          <CardContent className="p-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) classify(file);
              }}
              disabled={busy}
              className={cn(
                "relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 bg-muted/40 text-center transition-colors hover:bg-muted/70",
                dragging && "bg-primary/5 ring-2 ring-primary ring-inset",
              )}
            >
              {preview ? (
                // biome-ignore lint/performance/noImgElement: local blob preview
                <img
                  src={preview}
                  alt="Uploaded"
                  className="absolute inset-0 size-full object-contain"
                />
              ) : (
                <>
                  <span className="flex size-12 items-center justify-center rounded-full bg-background shadow-sm">
                    <ImageUp className="size-5 text-primary" />
                  </span>
                  <span className="text-sm font-medium">
                    Drop an image, paste, or click to upload
                  </span>
                  <span className="text-xs text-muted-foreground">
                    JPEG, PNG or WebP · up to 5 MB · camera on mobile
                  </span>
                </>
              )}
              {busy && (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 text-sm font-medium backdrop-blur-sm">
                  <Loader2 className="size-6 animate-spin text-primary" />
                  Analyzing…
                </span>
              )}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) classify(file);
                e.target.value = "";
              }}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {result ? (
            <Verdict result={result} preview={preview} onReset={reset} />
          ) : (
            <Card>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  {offline ? (
                    <span className="flex items-center gap-2">
                      <WifiOff className="size-4" /> You're offline. History and
                      feedback still work; classification resumes when you
                      reconnect.
                    </span>
                  ) : (
                    "No image yet. Try one of the samples:"
                  )}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {SAMPLES.map((s) => (
                    <button
                      type="button"
                      key={s.src}
                      onClick={() => trySample(s.src)}
                      disabled={busy}
                      className="group overflow-hidden rounded-md border text-left"
                    >
                      {/* biome-ignore lint/performance/noImgElement: tiny static samples */}
                      <img
                        src={s.src}
                        alt={s.label}
                        className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <span className="block px-2 py-1 text-xs text-muted-foreground">
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

function Verdict({
  result,
  preview,
  onReset,
}: {
  result: Result;
  preview: string | null;
  onReset: () => void;
}) {
  const hot = result.is_hot_dog;
  return (
    <Card className="overflow-hidden py-0">
      <div
        className={cn(
          "flex items-center gap-3 px-6 py-6 text-white",
          hot ? "bg-emerald-600" : "bg-red-600",
        )}
      >
        {hot ? (
          <CheckCircle2 className="size-10" />
        ) : (
          <XCircle className="size-10" />
        )}
        <div>
          <p className="text-3xl font-bold tracking-tight">
            {hot ? "Hot Dog" : "Not Hot Dog"}
          </p>
          <p className="text-sm text-white/80">Detected: {result.label}</p>
        </div>
      </div>
      <CardContent className="flex flex-col gap-4 pb-6">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-medium tabular-nums">
              {formatPercent(result.confidence)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full", hot ? "bg-emerald-600" : "bg-red-600")}
              style={{ width: formatPercent(result.confidence) }}
            />
          </div>
        </div>
        <p className="text-sm">{result.reasoning}</p>
        {hot && result.hot_dog_score != null && (
          <HotDogScore
            scanId={result.id}
            score={result.hot_dog_score}
            improvements={result.improvements}
            beforeUrl={preview}
          />
        )}
        {!hot && (
          <>
            <Hotdogify scanId={result.id} beforeUrl={preview} />
            <HungryFinder />
          </>
        )}
        <dl className="grid grid-cols-3 gap-2 rounded-md bg-muted/50 p-3 text-xs">
          <div>
            <dt className="text-muted-foreground">Model</dt>
            <dd className="font-mono">{result.model}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Latency</dt>
            <dd className="font-mono">{result.latency_ms} ms</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Scan ID</dt>
            <dd className="truncate font-mono" title={result.id}>
              {result.id.slice(0, 8)}
            </dd>
          </div>
        </dl>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ScanFeedback scanId={result.id} />
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="size-3.5" /> New scan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
