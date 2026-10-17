import { desc } from "drizzle-orm";
import { DeleteItemButton } from "@/components/delete-item-button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { items } from "@/db/schema";

export async function ItemList() {
  const rows = await db.select().from(items).orderBy(desc(items.createdAt));

  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No items yet. Add one or let AI suggest something.
      </p>
    );
  }

  return (
    <ul className="divide-y">
      {rows.map((item) => (
        <li key={item.id} className="flex items-center gap-3 py-3">
          <span className="min-w-0 flex-1 break-words">{item.title}</span>
          <Badge variant={item.source === "ai" ? "default" : "secondary"}>
            {item.source === "ai" ? "AI" : "Manual"}
          </Badge>
          <DeleteItemButton id={item.id} />
        </li>
      ))}
    </ul>
  );
}
