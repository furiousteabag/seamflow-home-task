"use client";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Code2,
  FileSearch,
  ScanEye,
  WifiOff,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "classify",
    label: "Classify",
    icon: ScanEye,
    title: "SeeFood Classify",
    body: "Upload, paste or photograph any image. A Claude vision model returns Hot Dog or Not Hot Dog with a confidence score and a one-line explanation.",
    bullets: [
      "Drag-and-drop, paste or phone camera",
      "On-device compression before upload",
      "Hot Dog Score and what's missing",
    ],
    href: "/platform#classify",
    preview: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
          {/* biome-ignore lint/performance/noImgElement: static marketing sample */}
          <img
            src="/samples/hot-dog.jpg"
            alt=""
            className="size-14 rounded-md object-cover"
          />
          <div className="flex-1">
            <p className="font-semibold text-emerald-700">Hot Dog</p>
            <p className="text-xs text-muted-foreground">
              hot dog with mustard in a bun
            </p>
          </div>
          <span className="text-sm font-semibold">98%</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
          {/* biome-ignore lint/performance/noImgElement: static marketing sample */}
          <img
            src="/samples/burger.jpg"
            alt=""
            className="size-14 rounded-md object-cover"
          />
          <div className="flex-1">
            <p className="font-semibold text-red-700">Not Hot Dog</p>
            <p className="text-xs text-muted-foreground">
              cheeseburger with lettuce
            </p>
          </div>
          <span className="text-sm font-semibold">99%</span>
        </div>
      </div>
    ),
  },
  {
    id: "audit",
    label: "Audit",
    icon: FileSearch,
    title: "SeeFood Audit",
    body: "Every scan is stored with the original image, verdict, confidence, reasoning, model and latency. Reviewers confirm or flag results, turning opinions into evidence.",
    bullets: [
      "Private image storage per workspace",
      "Reviewer feedback on every verdict",
      "CSV export for auditors",
    ],
    href: "/platform#audit",
    preview: (
      <div className="overflow-hidden rounded-lg border bg-background text-xs">
        <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b bg-muted/60 px-3 py-2 font-medium">
          <span>Scan</span>
          <span>Verdict</span>
          <span>Review</span>
        </div>
        {[
          ["Tray 14 · Gate C", "Hot Dog", "Confirmed"],
          ["Menu photo v3", "Not Hot Dog", "Confirmed"],
          ["Chili dog special", "Hot Dog", "Flagged"],
          ["Bratwurst plate", "Not Hot Dog", "Confirmed"],
        ].map(([a, b, c]) => (
          <div
            key={a}
            className="grid grid-cols-[1fr_auto_auto] gap-3 border-b px-3 py-2 last:border-0"
          >
            <span className="truncate">{a}</span>
            <span
              className={b === "Hot Dog" ? "text-emerald-700" : "text-red-700"}
            >
              {b}
            </span>
            <span className="text-muted-foreground">{c}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "insights",
    label: "Insights",
    icon: BarChart3,
    title: "SeeFood Insights",
    body: "Hot dog share, latency, reviewer agreement and scans over time, computed on-device from your workspace history.",
    bullets: [
      "Measured accuracy from reviewer feedback",
      "Latency and volume trends",
      "Per-channel breakdown (web vs. API)",
    ],
    href: "/platform#insights",
    preview: (
      <div className="rounded-lg border bg-background p-4">
        <p className="text-xs text-muted-foreground">Scans, last 14 days</p>
        <div className="mt-3 flex h-28 items-end gap-1.5">
          {[30, 45, 38, 60, 52, 70, 64, 80, 72, 90, 76, 88, 95, 84].map(
            (h, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static chart
                key={i}
                className="flex-1 rounded-t bg-primary/80"
                style={{ height: `${h}%` }}
              />
            ),
          )}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <p className="text-lg font-semibold">41%</p>
            <p className="text-muted-foreground">hot dog share</p>
          </div>
          <div>
            <p className="text-lg font-semibold">1.8 s</p>
            <p className="text-muted-foreground">median latency</p>
          </div>
          <div>
            <p className="text-lg font-semibold">97%</p>
            <p className="text-muted-foreground">reviewer agreement</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "edge",
    label: "Edge",
    icon: WifiOff,
    title: "SeeFood Edge",
    body: "History, analytics and feedback live in a local database on the device and sync through PowerSync when you reconnect. Stadium Wi-Fi is not our problem.",
    bullets: [
      "Local SQLite in the browser",
      "Queued changes survive reloads",
      "Automatic two-way sync",
    ],
    href: "/platform#edge",
    preview: (
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-4 text-sm">
        <p className="flex items-center gap-2 font-medium">
          <span className="size-2 rounded-full bg-amber-500" /> Offline · 3
          changes pending
        </p>
        <p className="text-xs text-muted-foreground">
          Feedback and deletions are saved locally and upload automatically.
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle2 className="size-4" /> Synced 4 seconds after reconnect
        </div>
      </div>
    ),
  },
  {
    id: "api",
    label: "API",
    icon: Code2,
    title: "SeeFood API",
    body: "One authenticated endpoint. Two possible answers. Scans made through the API appear in the same audit log as web scans.",
    bullets: [
      "Bearer API keys, hashed at rest",
      "Structured JSON responses",
      "Per-key rate limiting",
    ],
    href: "/docs",
    preview: (
      <pre className="overflow-x-auto rounded-lg border bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
        <code>{`curl https://seefoodsystems.com/api/v1/classify \\
  -H "Authorization: Bearer $SEEFOOD_API_KEY" \\
  -F image=@lunch.jpg

{ "verdict": "hot_dog", "confidence": 0.98 }`}</code>
      </pre>
    ),
  },
];

export function ProductTabs() {
  const [active, setActive] = useState(tabs[0].id);
  const tab = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div
        role="tablist"
        className="flex gap-2 overflow-x-auto border-b pb-px"
        aria-label="SeeFood products"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === active}
            onClick={() => setActive(t.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              t.id === active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <t.icon className="size-4" /> {t.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        className="grid items-center gap-10 py-10 lg:grid-cols-2"
      >
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">{tab.title}</h3>
          <p className="mt-3 text-muted-foreground">{tab.body}</p>
          <ul className="mt-5 flex flex-col gap-2 text-sm">
            {tab.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" /> {b}
              </li>
            ))}
          </ul>
          <Link
            href={tab.href}
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Explore {tab.title} <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-primary/10 via-sky-100/50 to-indigo-100/60 p-6">
          {tab.preview}
        </div>
      </div>
    </div>
  );
}
