"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteItem } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function DeleteItemButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await deleteItem(id);
          if (!result.ok) toast.error(result.error);
        })
      }
    >
      {isPending ? "…" : "Delete"}
    </Button>
  );
}
