import { z } from "zod";
import { getUser } from "@/lib/supabase/server";

const query = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
});

export type HotDogPlace = {
  id: string;
  name: string;
  address: string | null;
  lat: number;
  lon: number;
  distanceM: number;
};

type PhotonFeature = {
  geometry: { coordinates: [number, number] };
  properties: {
    osm_type?: string;
    osm_id?: number;
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    district?: string;
  };
};

// Photon (OpenStreetMap search by Komoot) matches fuzzily, so names are re-checked here
const TERMS = ["hot dog", "hotdog", "sausage", "wurst", "frankfurter"];
const RELEVANT = /hot ?-?dog|sausage|wurst|würst|frankfurt|wiener|bratwurst/i;
const SPANS_DEG = [0.3, 1];

function distanceM(aLat: number, aLon: number, bLat: number, bLon: number) {
  const rad = Math.PI / 180;
  const h =
    Math.sin(((bLat - aLat) * rad) / 2) ** 2 +
    Math.cos(aLat * rad) *
      Math.cos(bLat * rad) *
      Math.sin(((bLon - aLon) * rad) / 2) ** 2;
  return Math.round(12_742_000 * Math.asin(Math.sqrt(h)));
}

async function search(term: string, lat: number, lon: number, span: number) {
  const lonSpan = span / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
  const params = new URLSearchParams({
    q: term,
    lat: String(lat),
    lon: String(lon),
    bbox: [lon - lonSpan, lat - span, lon + lonSpan, lat + span].join(","),
    osm_tag: "amenity",
    limit: "20",
  });
  const response = await fetch(`https://photon.komoot.io/api/?${params}`, {
    headers: {
      "User-Agent": "SeeFoodEnterprise/1.0 (+https://seefoodsystems.com)",
    },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Photon ${response.status}`);
  return ((await response.json()) as { features: PhotonFeature[] }).features;
}

async function nearby(
  lat: number,
  lon: number,
  span: number,
): Promise<HotDogPlace[]> {
  const results = await Promise.allSettled(
    TERMS.map((t) => search(t, lat, lon, span)),
  );
  const features = results.flatMap((r) =>
    r.status === "fulfilled" ? r.value : [],
  );
  if (features.length === 0 && results.every((r) => r.status === "rejected")) {
    throw new Error("All place searches failed");
  }

  const byId = new Map<string, HotDogPlace>();
  for (const f of features) {
    const p = f.properties;
    if (!p.name || !RELEVANT.test(p.name)) continue;
    const [pLon, pLat] = f.geometry.coordinates;
    const id = `${p.osm_type ?? "x"}/${p.osm_id ?? `${pLat},${pLon}`}`;
    const street = [p.street, p.housenumber].filter(Boolean).join(" ");
    byId.set(id, {
      id,
      name: p.name,
      address:
        [street, p.district ?? p.city].filter(Boolean).join(", ") || null,
      lat: pLat,
      lon: pLon,
      distanceM: distanceM(lat, lon, pLat, pLon),
    });
  }
  return [...byId.values()]
    .sort((a, b) => a.distanceM - b.distanceM)
    .slice(0, 10);
}

// Nearest hot dog places from OpenStreetMap; the location is used for this lookup only
export async function GET(request: Request) {
  if (!(await getUser())) {
    return Response.json(
      { error: { code: "unauthorized", message: "Sign in first" } },
      { status: 401 },
    );
  }
  const parsed = query.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!parsed.success) {
    return Response.json(
      { error: { code: "invalid_location", message: "Invalid coordinates" } },
      { status: 400 },
    );
  }
  // ~100 m precision is plenty to find lunch
  const lat = Number(parsed.data.lat.toFixed(3));
  const lon = Number(parsed.data.lon.toFixed(3));

  try {
    let places: HotDogPlace[] = [];
    for (const span of SPANS_DEG) {
      places = await nearby(lat, lon, span);
      if (places.length >= 3) break;
    }
    return Response.json({ places });
  } catch (error) {
    console.error("hot dog places failed", error);
    return Response.json(
      {
        error: {
          code: "places_unavailable",
          message: "The places service is busy, try again",
        },
      },
      { status: 502 },
    );
  }
}
