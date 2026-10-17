import { ScanEye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 font-semibold", className)}
    >
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <ScanEye className="size-4" />
      </span>
      <span className="tracking-tight">SeeFood</span>
      <span className="rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Enterprise
      </span>
    </Link>
  );
}
