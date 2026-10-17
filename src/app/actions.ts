"use server";

import { generateText } from "ai";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { items } from "@/db/schema";
import { fastModel } from "@/lib/ai";
import { type ItemInput, itemInput } from "@/lib/validation";

type Result = { ok: true } | { ok: false; error: string };

export async function addItem(input: ItemInput): Promise<Result> {
  const parsed = itemInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  await db.insert(items).values({ title: parsed.data.title });
  revalidatePath("/");
  return { ok: true };
}

export async function deleteItem(id: string): Promise<Result> {
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) return { ok: false, error: "Invalid id" };
  await db.delete(items).where(eq(items.id, parsed.data));
  revalidatePath("/");
  return { ok: true };
}

export async function generateItem(topic: string): Promise<Result> {
  const recent = await db
    .select({ title: items.title })
    .from(items)
    .orderBy(desc(items.createdAt))
    .limit(10);

  try {
    const { text } = await generateText({
      model: fastModel,
      maxOutputTokens: 100,
      system:
        "You suggest one concise, concrete idea for a list. Reply with the idea only: no quotes, no preamble, under 15 words.",
      prompt: [
        topic.trim()
          ? `Topic: ${topic.trim().slice(0, 200)}`
          : "Topic: anything useful.",
        recent.length
          ? `Avoid repeating these existing items:\n${recent.map((r) => `- ${r.title}`).join("\n")}`
          : "",
      ].join("\n\n"),
    });

    const title = text.trim().replace(/^["'-]+|["']+$/g, "");
    if (!title) return { ok: false, error: "AI returned an empty answer" };

    await db.insert(items).values({ title: title.slice(0, 200), source: "ai" });
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("generateItem failed", error);
    return { ok: false, error: "AI request failed" };
  }
}
