"use client";

import { MoveHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Before/after viewer: drag the handle to reveal the original under the edited image. */
export function CompareSlider({
  before,
  after,
  className,
}: {
  before: string;
  after: string;
  className?: string;
}) {
  const [position, setPosition] = useState(50);

  return (
    <div
      className={cn(
        "relative w-full select-none overflow-hidden bg-muted",
        className,
      )}
    >
      {/* biome-ignore lint/performance/noImgElement: blob or signed storage URL */}
      <img
        src={after}
        alt="After"
        draggable={false}
        className="mx-auto block max-h-[70svh] w-full object-contain"
      />
      {/* biome-ignore lint/performance/noImgElement: blob or signed storage URL */}
      <img
        src={before}
        alt="Before"
        draggable={false}
        className="absolute inset-0 size-full object-contain"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
        style={{ left: `${position}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-foreground shadow-md">
          <MoveHorizontal className="size-4" />
        </span>
      </div>
      <span className="pointer-events-none absolute top-3 left-3 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
        Before
      </span>
      <span className="pointer-events-none absolute top-3 right-3 rounded bg-amber-500 px-2 py-0.5 text-xs font-medium text-white">
        After
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label="Compare before and after"
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

/** Single image at its natural aspect ratio, never cropped. */
export function ImageView({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn("w-full overflow-hidden bg-muted", className)}>
      {/* biome-ignore lint/performance/noImgElement: blob or signed storage URL */}
      <img
        src={src}
        alt={alt}
        className="mx-auto block max-h-[70svh] w-full object-contain"
      />
    </div>
  );
}
