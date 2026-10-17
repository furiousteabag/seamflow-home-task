import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { scans } from "@/db/schema";
import { SCANS_BUCKET, supabaseAdmin } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/server";
import { uploadBody } from "@/lib/upload";

// Applies one PowerSync upload transaction, scoped to the signed-in user
export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const parsed = uploadBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 400 });
  }

  const removedImages: string[] = [];
  await db.transaction(async (tx) => {
    for (const op of parsed.data.ops) {
      const owned = and(eq(scans.id, op.id), eq(scans.userId, user.id));
      if (op.op === "PATCH") {
        const feedback = op.data?.feedback;
        if (
          feedback === "correct" ||
          feedback === "incorrect" ||
          feedback === null
        ) {
          await tx.update(scans).set({ feedback }).where(owned);
        }
      } else if (op.op === "DELETE") {
        const deleted = await tx
          .delete(scans)
          .where(owned)
          .returning({ imagePath: scans.imagePath });
        removedImages.push(...deleted.map((d) => d.imagePath));
      }
      // PUT is ignored: scans are only created by the classifier
    }
  });

  if (removedImages.length > 0) {
    await supabaseAdmin.storage.from(SCANS_BUCKET).remove(removedImages);
  }
  return Response.json({ ok: true });
}
