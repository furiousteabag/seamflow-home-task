import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerdictBadge({
  verdict,
  className,
}: {
  verdict: string | null;
  className?: string;
}) {
  const hot = verdict === "hot_dog";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium",
        hot ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
        className,
      )}
    >
      {hot ? (
        <CheckCircle2 className="size-3.5" />
      ) : (
        <XCircle className="size-3.5" />
      )}
      {hot ? "Hot Dog" : "Not Hot Dog"}
    </span>
  );
}

export const formatPercent = (value: number | null) =>
  `${Math.round((value ?? 0) * 100)}%`;
