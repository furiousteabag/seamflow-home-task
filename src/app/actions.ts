"use server";

import { generateText } from "ai";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { items } from "@/db/schema";
import { fastModel } from "@/lib/ai";
import { getUser } from "@/lib/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

export async function generateItem(topic: string): Promise<Result> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in first" };

  const recent = await db
    .select({ title: items.title })
    .from(items)
    .where(eq(items.userId, user.id))
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

    // Syncs back to the client through PowerSync
    await db
      .insert(items)
      .values({ title: title.slice(0, 200), source: "ai", userId: user.id });
    return { ok: true };
  } catch (error) {
    console.error("generateItem failed", error);
    return { ok: false, error: "AI request failed" };
  }
}
