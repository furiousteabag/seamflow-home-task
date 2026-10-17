"use client";

import { useQuery } from "@powersync/react";
import { PageHeader } from "@/components/app/app-shell";
import { formatPercent } from "@/components/app/verdict-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Totals = {
  total: number;
  hot: number;
  avg_confidence: number | null;
  avg_latency: number | null;
  correct: number;
  incorrect: number;
  api: number;
};
type Day = { day: string; hot: number; not_hot: number };

const DAYS = 14;

// Computed from the local SQLite replica, so the dashboard works offline
export function Analytics() {
  const { data: totalsRows } = useQuery<Totals>(`
    SELECT count(*) AS total,
      sum(verdict = 'hot_dog') AS hot,
      avg(confidence) AS avg_confidence,
      avg(latency_ms) AS avg_latency,
      sum(feedback = 'correct') AS correct,
      sum(feedback = 'incorrect') AS incorrect,
      sum(channel = 'api') AS api
    FROM scans`);
  const { data: days } = useQuery<Day>(
    `SELECT date(created_at) AS day,
      sum(verdict = 'hot_dog') AS hot,
      sum(verdict = 'not_hot_dog') AS not_hot
    FROM scans WHERE created_at >= ? GROUP BY day ORDER BY day`,
    [new Date(Date.now() - DAYS * 86_400_000).toISOString().slice(0, 10)],
  );

  const t = totalsRows[0];
  const total = t?.total ?? 0;
  const rated = (t?.correct ?? 0) + (t?.incorrect ?? 0);

  const series = Array.from({ length: DAYS }, (_, i) => {
    const day = new Date(Date.now() - (DAYS - 1 - i) * 86_400_000)
      .toISOString()
      .slice(0, 10);
    const row = days.find((d) => d.day === day);
    return { day, hot: row?.hot ?? 0, notHot: row?.not_hot ?? 0 };
  });
  const peak = Math.max(1, ...series.map((d) => d.hot + d.notHot));

  const stats = [
    {
      label: "Total scans",
      value: total.toLocaleString(),
      hint: `${t?.api ?? 0} via API`,
    },
    {
      label: "Hot dog rate",
      value: total ? formatPercent((t?.hot ?? 0) / total) : "—",
      hint: `${t?.hot ?? 0} hot dogs`,
    },
    {
      label: "Avg. confidence",
      value: t?.avg_confidence != null ? formatPercent(t.avg_confidence) : "—",
      hint: "Model certainty",
    },
    {
      label: "Avg. latency",
      value: t?.avg_latency != null ? `${Math.round(t.avg_latency)} ms` : "—",
      hint: "Inference time",
    },
    {
      label: "Reported accuracy",
      value: rated ? formatPercent((t?.correct ?? 0) / rated) : "—",
      hint: `${rated} rated · ${t?.incorrect ?? 0} flagged`,
    },
  ];

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Classification volume and quality for this workspace."
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label} className="gap-1 py-4">
            <CardContent className="px-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-semibold tabular-nums">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Daily volume</CardTitle>
          <CardDescription>Last {DAYS} days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-end gap-1.5">
            {series.map((d) => (
              <div
                key={d.day}
                className="group relative flex h-full flex-1 flex-col justify-end"
              >
                <div
                  className="w-full rounded-t-sm bg-chart-2/80"
                  style={{ height: `${(d.notHot / peak) * 100}%` }}
                />
                <div
                  className="w-full bg-chart-1"
                  style={{ height: `${(d.hot / peak) * 100}%` }}
                />
                <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background group-hover:block">
                  {d.day.slice(5)}: {d.hot} hot · {d.notHot} not
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>{series[0].day.slice(5)}</span>
            <span>Today</span>
          </div>
          <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-chart-1" /> Hot Dog
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-chart-2/80" /> Not Hot Dog
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
