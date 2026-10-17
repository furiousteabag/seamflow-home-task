import { sql } from "drizzle-orm";
import { CheckCircle2, CircleAlert, XCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { MarketingShell, PageHero } from "@/components/marketing/blocks";
import { db } from "@/db";
import { env } from "@/env";
import { SCANS_BUCKET, supabaseAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "System status",
  description: "Live health of SeeFood Enterprise services.",
};

type Check = {
  name: string;
  description: string;
  ok: boolean;
  latencyMs: number;
  detail?: string;
};

async function timed(
  name: string,
  description: string,
  fn: () => Promise<void>,
): Promise<Check> {
  const start = performance.now();
  try {
    await fn();
    return {
      name,
      description,
      ok: true,
      latencyMs: Math.round(performance.now() - start),
    };
  } catch (error) {
    return {
      name,
      description,
      ok: false,
      latencyMs: Math.round(performance.now() - start),
      detail: (error as Error).message.slice(0, 120),
    };
  }
}

async function runChecks(): Promise<Check[]> {
  const timeout = () => AbortSignal.timeout(5000);
  return Promise.all([
    timed("Database", "Postgres: scans, API keys, audit log", async () => {
      await db.execute(sql`select 1`);
    }),
    timed("Image storage", "Private storage for uploaded images", async () => {
      const { error } = await supabaseAdmin.storage.getBucket(SCANS_BUCKET);
      if (error) throw error;
    }),
    timed("Offline sync", "PowerSync service for scan history", async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_POWERSYNC_URL}/probes/liveness`,
        { signal: timeout(), cache: "no-store" },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    }),
    timed("AI classification", "Anthropic Claude vision models", async () => {
      const res = await fetch("https://api.anthropic.com/v1/models?limit=1", {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
          "anthropic-version": "2023-06-01",
        },
        signal: timeout(),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    }),
    timed(
      "Authentication",
      "Sign-in with Google and guest access",
      async () => {
        const res = await fetch(
          `${env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/health`,
          {
            headers: { apikey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY },
            signal: timeout(),
            cache: "no-store",
          },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      },
    ),
  ]);
}

export default function StatusPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="System status"
        title="SeeFood Enterprise status"
        body="Every check below runs live against our production dependencies each time this page loads."
      />
      <section className="mx-auto max-w-4xl px-4 py-16">
        <Suspense fallback={<StatusSkeleton />}>
          <LiveStatus />
        </Suspense>
        <div className="mt-10 grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-6">
            <p className="font-semibold">Past incidents</p>
            <p className="mt-1 text-muted-foreground">
              No incidents reported. If something looks wrong, let us know.
            </p>
            <Link
              href="/contact-sales?interest=sales"
              className="mt-3 inline-block font-medium text-primary hover:underline"
            >
              Report an issue →
            </Link>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <p className="font-semibold">Machine-readable health</p>
            <p className="mt-1 text-muted-foreground">
              Monitoring tools can poll our JSON health endpoint.
            </p>
            <a
              href="/api/health"
              className="mt-3 inline-block font-medium text-primary hover:underline"
            >
              GET /api/health →
            </a>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

async function LiveStatus() {
  await connection();
  const checks = await runChecks();
  const down = checks.filter((c) => !c.ok).length;
  const checkedAt = new Date().toUTCString();

  return (
    <>
      <div
        className={
          down === 0
            ? "flex items-center gap-3 rounded-xl bg-emerald-600 p-5 text-white"
            : "flex items-center gap-3 rounded-xl bg-amber-500 p-5 text-white"
        }
      >
        {down === 0 ? (
          <CheckCircle2 className="size-7" />
        ) : (
          <CircleAlert className="size-7" />
        )}
        <div>
          <p className="text-lg font-semibold">
            {down === 0
              ? "All systems operational"
              : `${down} component${down === 1 ? "" : "s"} degraded`}
          </p>
          <p className="text-sm text-white/80">Checked {checkedAt}</p>
        </div>
      </div>
      <div className="mt-6 divide-y rounded-xl border bg-card">
        {checks.map((c) => (
          <div key={c.name} className="flex items-center gap-4 p-5">
            {c.ok ? (
              <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
            ) : (
              <XCircle className="size-5 shrink-0 text-red-600" />
            )}
            <div className="flex-1">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-muted-foreground">
                {c.ok ? c.description : (c.detail ?? "Unavailable")}
              </p>
            </div>
            <div className="text-right text-sm">
              <p className={c.ok ? "text-emerald-700" : "text-red-700"}>
                {c.ok ? "Operational" : "Degraded"}
              </p>
              <p className="text-xs text-muted-foreground">{c.latencyMs} ms</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function StatusSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-20 animate-pulse rounded-xl bg-muted" />
      <div className="h-80 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
