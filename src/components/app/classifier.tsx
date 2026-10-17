"use client";

import { useStatus } from "@powersync/react";
import {
  CheckCircle2,
  ImageUp,
  Loader2,
  RotateCcw,
  Upload,
  WifiOff,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { NEW_SCAN_EVENT, PageHeader } from "@/components/app/app-shell";
import { CompareSlider, ImageView } from "@/components/app/compare-slider";
import {
  EnhanceAction,
  ScoreSummary,
  useEnhance,
} from "@/components/app/hot-dog-score";
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
      setPreview(null);
      toast.error(
        error instanceof Error && error.message !== "Failed to fetch"
          ? error.message
          : "Classification needs a network connection",
      );
    } finally {
      setBusy(false);
    }
  }, []);

  // "Classify" in the sidebar (or the logo) while already here starts over
  useEffect(() => {
    const reset = () => {
      setResult(null);
      setPreview(null);
    };
    window.addEventListener(NEW_SCAN_EVENT, reset);
    return () => window.removeEventListener(NEW_SCAN_EVENT, reset);
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

  const pickFile = () => inputRef.current?.click();

  const fileInput = (
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
  );

  // While analyzing: show the photo being classified
  if (busy && preview) {
    return (
      <>
        <PageHeader
          title="Classify"
          description="Upload an image. SeeFood returns a definitive verdict."
        />
        <Card className="relative mx-auto max-w-3xl overflow-hidden py-0">
          <ImageView src={preview} alt="Uploaded image" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/60 text-sm font-medium backdrop-blur-[2px]">
            <Loader2 className="size-6 animate-spin text-primary" />
            Analyzing…
          </div>
        </Card>
      </>
    );
  }

  if (result && preview) {
    return (
      <ResultView
        key={result.id}
        result={result}
        preview={preview}
        onNewScan={pickFile}
        onReset={() => {
          setResult(null);
          setPreview(null);
        }}
        fileInput={fileInput}
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Classify"
        description="Upload an image. SeeFood returns a definitive verdict."
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="overflow-hidden py-0">
          <button
            type="button"
            onClick={pickFile}
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
              "flex min-h-80 w-full flex-col items-center justify-center gap-3 bg-muted/40 p-8 text-center transition-colors hover:bg-muted/70",
              dragging && "bg-primary/5 ring-2 ring-primary ring-inset",
            )}
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-background shadow-sm">
              {busy ? (
                <Loader2 className="size-5 animate-spin text-primary" />
              ) : (
                <ImageUp className="size-5 text-primary" />
              )}
            </span>
            <span className="text-sm font-medium">
              Drop an image, paste, or click to upload
            </span>
            <span className="text-xs text-muted-foreground">
              JPEG, PNG or WebP · up to 5 MB · camera on mobile
            </span>
          </button>
          {fileInput}
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-3">
            {offline ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <WifiOff className="size-4 shrink-0" /> You're offline. History
                and feedback still work; classification resumes when you
                reconnect.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No image handy? Try a sample:
              </p>
            )}
            <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
              {SAMPLES.map((s) => (
                <button
                  type="button"
                  key={s.src}
                  onClick={() => trySample(s.src)}
                  disabled={busy}
                  className="group flex flex-col overflow-hidden rounded-md border text-left lg:flex-row lg:items-center"
                >
                  {/* biome-ignore lint/performance/noImgElement: tiny static samples */}
                  <img
                    src={s.src}
                    alt={s.label}
                    className="aspect-square w-full object-cover transition-transform group-hover:scale-105 lg:size-14 lg:w-14"
                  />
                  <span className="px-3 py-1.5 text-xs text-muted-foreground lg:text-sm">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function ResultView({
  result,
  preview,
  onNewScan,
  onReset,
  fileInput,
}: {
  result: Result;
  preview: string;
  onNewScan: () => void;
  onReset: () => void;
  fileInput: React.ReactNode;
}) {
  const hot = result.is_hot_dog;
  const enhance = useEnhance(result.id);

  return (
    <>
      <PageHeader
        title="Classify"
        description="Upload an image. SeeFood returns a definitive verdict."
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw className="size-3.5" /> Clear
            </Button>
            <Button size="sm" onClick={onNewScan}>
              <Upload className="size-3.5" /> New scan
            </Button>
          </div>
        }
      />
      {fileInput}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-6">
          {/* Small screens: verdict first, the detail panel follows the image */}
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-white lg:hidden",
              hot ? "bg-emerald-600" : "bg-red-600",
            )}
          >
            {hot ? (
              <CheckCircle2 className="size-7 shrink-0" />
            ) : (
              <XCircle className="size-7 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-2xl font-bold tracking-tight">
                {hot ? "Hot Dog" : "Not Hot Dog"}
              </p>
              <p className="line-clamp-2 text-xs text-white/80">
                {formatPercent(result.confidence)} · {result.label}
              </p>
            </div>
          </div>
          <Card className="relative overflow-hidden py-0">
            {enhance.result?.url ? (
              <CompareSlider before={preview} after={enhance.result.url} />
            ) : (
              <ImageView src={preview} alt={result.label} />
            )}
            {enhance.busy && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/60 text-sm font-medium backdrop-blur-[2px]">
                <Loader2 className="size-6 animate-spin text-amber-500" />
                {hot ? "Leveling up your hot dog…" : "Adding a hot dog…"}
                <span className="text-xs font-normal text-muted-foreground">
                  About 15 seconds
                </span>
              </div>
            )}
          </Card>
          {!hot && <HungryFinder />}
        </div>

        <Card className="gap-0 overflow-hidden py-0 lg:sticky lg:top-8">
          <div
            className={cn(
              "hidden items-center gap-3 px-5 py-5 text-white lg:flex",
              hot ? "bg-emerald-600" : "bg-red-600",
            )}
          >
            {hot ? (
              <CheckCircle2 className="size-9 shrink-0" />
            ) : (
              <XCircle className="size-9 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-3xl font-bold tracking-tight">
                {hot ? "Hot Dog" : "Not Hot Dog"}
              </p>
              <p className="line-clamp-2 text-sm text-white/80">
                Detected: {result.label}
              </p>
            </div>
          </div>
          <CardContent className="flex flex-col gap-5 p-5">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-medium tabular-nums">
                  {formatPercent(result.confidence)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full",
                    hot ? "bg-emerald-600" : "bg-red-600",
                  )}
                  style={{ width: formatPercent(result.confidence) }}
                />
              </div>
              <p className="mt-3 text-sm">{result.reasoning}</p>
            </div>

            {hot && result.hot_dog_score != null && (
              <ScoreSummary
                score={result.hot_dog_score}
                improvements={result.improvements}
              />
            )}

            <EnhanceAction
              isHotDog={hot}
              score={result.hot_dog_score}
              busy={enhance.busy}
              result={enhance.result}
              onRun={enhance.run}
            />

            <div className="border-t pt-4">
              <ScanFeedback scanId={result.id} />
            </div>

            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-md bg-muted/50 p-3 text-xs">
              <div className="col-span-2">
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}
