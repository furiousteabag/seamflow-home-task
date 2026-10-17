import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { items } from "@/db/schema";
import { getUser } from "@/lib/supabase/server";
import { uploadBody } from "@/lib/upload";

const itemFields = (data: Record<string, unknown> | undefined) => {
  const fields: Partial<typeof items.$inferInsert> = {};
  if (typeof data?.title === "string") fields.title = data.title.slice(0, 200);
  if (data?.source === "manual" || data?.source === "ai")
    fields.source = data.source;
  if (typeof data?.created_at === "string")
    fields.createdAt = new Date(data.created_at);
  return fields;
};

// Applies one PowerSync upload transaction; user_id always comes from the session
export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const parsed = uploadBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 400 });
  }

  await db.transaction(async (tx) => {
    for (const op of parsed.data.ops) {
      const owned = and(eq(items.id, op.id), eq(items.userId, user.id));
      if (op.op === "PUT") {
        const fields = itemFields(op.data);
        await tx
          .insert(items)
          .values({ title: "", ...fields, id: op.id, userId: user.id })
          .onConflictDoUpdate({
            target: items.id,
            set: fields,
            setWhere: sql`${items.userId} = ${user.id}`,
          });
      } else if (op.op === "PATCH") {
        const fields = itemFields(op.data);
        if (Object.keys(fields).length > 0) {
          await tx.update(items).set(fields).where(owned);
        }
      } else {
        await tx.delete(items).where(owned);
      }
    }
  });

  return Response.json({ ok: true });
}
