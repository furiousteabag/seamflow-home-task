import "server-only";
import { and, count, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { type Scan, scans } from "@/db/schema";
import { classifyImage } from "@/lib/classify";
import { SCANS_BUCKET, supabaseAdmin } from "@/lib/supabase/admin";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const RATE_LIMIT_PER_MINUTE = 20;

export class ScanError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
  ) {
    super(message);
  }
}

// Trust the bytes, not the declared content type
function sniffImageType(bytes: Uint8Array) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return "image/jpeg";
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  )
    return "image/png";
  if (
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  )
    return "image/webp";
  return null;
}

export async function validateImage(file: unknown) {
  if (!(file instanceof File) || file.size === 0) {
    throw new ScanError(
      "Attach an image in the `image` field",
      400,
      "missing_image",
    );
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new ScanError("Image exceeds the 5 MB limit", 413, "image_too_large");
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const mediaType = sniffImageType(bytes);
  if (!mediaType) {
    throw new ScanError(
      "Only JPEG, PNG and WebP images are supported",
      415,
      "unsupported_type",
    );
  }
  return { bytes, mediaType };
}

export async function createScan(input: {
  userId: string;
  bytes: Uint8Array;
  mediaType: string;
  thumbnail: string;
  channel: Scan["channel"];
}): Promise<Scan> {
  const [{ recent }] = await db
    .select({ recent: count() })
    .from(scans)
    .where(
      and(
        eq(scans.userId, input.userId),
        gt(scans.createdAt, new Date(Date.now() - 60_000)),
      ),
    );
  if (recent >= RATE_LIMIT_PER_MINUTE) {
    throw new ScanError(
      `Rate limit exceeded: ${RATE_LIMIT_PER_MINUTE} scans per minute`,
      429,
      "rate_limited",
    );
  }

  const id = crypto.randomUUID();
  const extension = input.mediaType.split("/")[1];
  const imagePath = `${input.userId}/${id}.${extension}`;

  const [upload, result] = await Promise.all([
    supabaseAdmin.storage
      .from(SCANS_BUCKET)
      .upload(imagePath, input.bytes, { contentType: input.mediaType }),
    classifyImage(input.bytes, input.mediaType).catch((error) => {
      console.error("classification failed", error);
      return null;
    }),
  ]);

  if (!result) {
    await supabaseAdmin.storage.from(SCANS_BUCKET).remove([imagePath]);
    throw new ScanError(
      "The classifier is unavailable, try again",
      502,
      "classifier_unavailable",
    );
  }
  if (upload.error) {
    console.error("image upload failed", upload.error);
    throw new ScanError(
      "Could not store the image, try again",
      500,
      "storage_failed",
    );
  }

  const [scan] = await db
    .insert(scans)
    .values({
      id,
      userId: input.userId,
      verdict: result.verdict,
      confidence: result.confidence,
      label: result.label.slice(0, 120),
      reasoning: result.reasoning.slice(0, 500),
      imagePath,
      thumbnail: input.thumbnail,
      model: result.model,
      latencyMs: result.latencyMs,
      channel: input.channel,
      ...(result.verdict === "hot_dog" && result.hot_dog_score != null
        ? {
            hotDogScore: result.hot_dog_score,
            improvements: JSON.stringify(result.improvements.slice(0, 4)),
          }
        : {}),
    })
    .returning();
  return scan;
}

/** Public JSON shape shared by the web app and the REST API. */
export function serializeScan(scan: Scan) {
  return {
    id: scan.id,
    verdict: scan.verdict,
    is_hot_dog: scan.verdict === "hot_dog",
    confidence: Number(scan.confidence.toFixed(4)),
    label: scan.label,
    reasoning: scan.reasoning,
    model: scan.model,
    latency_ms: scan.latencyMs,
    hot_dog_score: scan.hotDogScore,
    improvements: parseImprovements(scan.improvements),
    enhanced_score: scan.enhancedScore,
    created_at: scan.createdAt.toISOString(),
  };
}

export function parseImprovements(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter((v) => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}
