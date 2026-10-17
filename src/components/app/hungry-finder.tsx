"use client";

import { Loader2, MapPin, Navigation, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import type { HotDogPlace } from "@/app/api/hot-dog-places/route";
import { Button } from "@/components/ui/button";

type State =
  | { kind: "idle" }
  | { kind: "locating" | "searching" }
  | { kind: "done"; places: HotDogPlace[] }
  | { kind: "error"; message: string };

const formatDistance = (m: number) =>
  m < 1000
    ? `${Math.round(m / 10) * 10} m`
    : `${(m / 1000).toFixed(m < 10_000 ? 1 : 0)} km`;

/** "Hungry?": asks for the browser location and lists the nearest hot dog places. */
export function HungryFinder() {
  const [state, setState] = useState<State>({ kind: "idle" });

  const find = () => {
    if (!("geolocation" in navigator)) {
      setState({
        kind: "error",
        message: "Location isn't available in this browser.",
      });
      return;
    }
    setState({ kind: "locating" });
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        setState({ kind: "searching" });
        try {
          const response = await fetch(
            `/api/hot-dog-places?lat=${coords.latitude}&lon=${coords.longitude}`,
          );
          const body = await response.json();
          if (!response.ok)
            throw new Error(body.error?.message ?? "Search failed");
          setState({ kind: "done", places: body.places });
        } catch (error) {
          setState({
            kind: "error",
            message: error instanceof Error ? error.message : "Search failed",
          });
        }
      },
      (error) =>
        setState({
          kind: "error",
          message:
            error.code === error.PERMISSION_DENIED
              ? "Location permission was denied. Allow it in your browser to find hot dogs nearby."
              : "Couldn't get your location. Try again.",
        }),
      { enableHighAccuracy: false, timeout: 15_000, maximumAge: 300_000 },
    );
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <UtensilsCrossed className="size-4" />
        </span>
        <div>
          <p className="text-sm font-medium">Hungry?</p>
          <p className="text-sm text-muted-foreground">
            Find real hot dogs near you. Your location is only used for this
            search.
          </p>
        </div>
      </div>

      {state.kind === "done" ? (
        state.places.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hot dog places found nearby on OpenStreetMap. Time to make your
            own.
          </p>
        ) : (
          <ul className="divide-y rounded-md border">
            {state.places.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-3 py-2">
                <MapPin className="size-4 shrink-0 text-red-600" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatDistance(p.distanceM)}
                    {p.address && ` · ${p.address}`}
                  </p>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Navigation className="size-3" /> Directions
                </a>
              </li>
            ))}
          </ul>
        )
      ) : state.kind === "error" ? (
        <p className="text-sm text-destructive">{state.message}</p>
      ) : null}

      {state.kind !== "done" && (
        <Button
          variant="outline"
          onClick={find}
          disabled={state.kind === "locating" || state.kind === "searching"}
        >
          {state.kind === "locating" || state.kind === "searching" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <MapPin className="size-4" />
          )}
          {state.kind === "locating"
            ? "Getting your location…"
            : state.kind === "searching"
              ? "Searching nearby…"
              : "Find hot dogs near me"}
        </Button>
      )}
      <p className="text-[10px] text-muted-foreground">
        Place data © OpenStreetMap contributors
      </p>
    </div>
  );
}
