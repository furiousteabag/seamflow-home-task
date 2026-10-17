"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { scans } from "@/db/schema";
import { SCANS_BUCKET, supabaseAdmin } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/server";

/** Short-lived link to the original image of one of the user's scans. */
export async function getScanImageUrl(
  scanId: string,
  variant: "original" | "enhanced" = "original",
) {
  const user = await getUser();
  if (!user) return null;
  const [scan] = await db
    .select({
      imagePath: scans.imagePath,
      enhancedImagePath: scans.enhancedImagePath,
    })
    .from(scans)
    .where(and(eq(scans.id, scanId), eq(scans.userId, user.id)));
  const path =
    variant === "enhanced" ? scan?.enhancedImagePath : scan?.imagePath;
  if (!path) return null;
  const { data } = await supabaseAdmin.storage
    .from(SCANS_BUCKET)
    .createSignedUrl(path, 300);
  return data?.signedUrl ?? null;
}
