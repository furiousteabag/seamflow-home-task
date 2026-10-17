"use client";

import { Download } from "lucide-react";

/** Opens the browser print dialog so the page can be saved as PDF. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
    >
      <Download className="size-4" /> Save as PDF
    </button>
  );
}
