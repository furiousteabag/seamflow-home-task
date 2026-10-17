import { and, count, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { levelUps, scans } from "@/db/schema";
import { classifyImage } from "@/lib/classify";
import { ENHANCER_MODEL_ID, enhanceHotDog } from "@/lib/enhance";
import { parseImprovements, ScanError } from "@/lib/scans";
import { SCANS_BUCKET, supabaseAdmin } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/server";

export const maxDuration = 120;

const LEVEL_UP_LIMIT = 50;
const LEVEL_UP_WINDOW_MS = 10 * 60_000;

const error = (status: number, code: string, message: string) =>
  Response.json({ error: { code, message } }, { status });

// "Level it up": AI-enhance a hot dog photo using its improvement list, then re-score it
export async function POST(
  _request: Request,
  { params }: RouteContext<"/api/scans/[id]/enhance">,
) {
  const user = await getUser();
  if (!user) return error(401, "unauthorized", "Sign in first");

  const { id } = await params;
  const [scan] = await db
    .select()
    .from(scans)
    .where(and(eq(scans.id, id), eq(scans.userId, user.id)));
  if (!scan) return error(404, "not_found", "Scan not found");
  if (scan.verdict !== "hot_dog")
    return error(400, "not_a_hot_dog", "Only hot dogs can be leveled up");
  // Image generation is the expensive call: cap it per user rather than per scan
  const [{ recent }] = await db
    .select({ recent: count() })
    .from(levelUps)
    .where(
      and(
        eq(levelUps.userId, user.id),
        gt(levelUps.createdAt, new Date(Date.now() - LEVEL_UP_WINDOW_MS)),
      ),
    );
  if (recent >= LEVEL_UP_LIMIT) {
    return error(
      429,
      "rate_limited",
      `Level-up limit reached (${LEVEL_UP_LIMIT} per 10 minutes). Try again shortly.`,
    );
  }

  try {
    const original = await supabaseAdmin.storage
      .from(SCANS_BUCKET)
      .download(scan.imagePath);
    if (original.error || !original.data)
      throw new ScanError("Original image not found", 404, "image_missing");

    const enhanced = await enhanceHotDog(
      new Uint8Array(await original.data.arrayBuffer()),
      original.data.type || "image/jpeg",
      parseImprovements(scan.improvements),
    );
    const rescored = await classifyImage(enhanced.bytes, enhanced.mediaType);
    await db.insert(levelUps).values({
      userId: user.id,
      scanId: scan.id,
      model: ENHANCER_MODEL_ID,
      score: rescored.hot_dog_score,
    });

    const enhancedPath = `${user.id}/${scan.id}-enhanced.${enhanced.mediaType.split("/")[1]}`;
    const upload = await supabaseAdmin.storage
      .from(SCANS_BUCKET)
      .upload(enhancedPath, enhanced.bytes, {
        contentType: enhanced.mediaType,
        upsert: true,
      });
    if (upload.error)
      throw new ScanError(
        "Could not store the enhanced image",
        500,
        "storage_failed",
      );

    // Reported as scored, even if the edit made it worse
    const enhancedScore = rescored.hot_dog_score;
    await db
      .update(scans)
      .set({
        enhancedImagePath: enhancedPath,
        enhancedScore,
        enhancedAt: new Date(),
      })
      .where(eq(scans.id, scan.id));

    const signed = await supabaseAdmin.storage
      .from(SCANS_BUCKET)
      .createSignedUrl(enhancedPath, 600);
    return Response.json({
      enhanced_url: signed.data?.signedUrl ?? null,
      hot_dog_score: scan.hotDogScore,
      enhanced_score: enhancedScore,
    });
  } catch (e) {
    if (e instanceof ScanError) return error(e.status, e.code, e.message);
    console.error(e);
    return error(500, "internal", "Something went wrong");
  }
}
