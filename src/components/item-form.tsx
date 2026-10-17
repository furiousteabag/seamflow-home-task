"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { addItem, generateItem } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type ItemInput, itemInput } from "@/lib/validation";

export function ItemForm() {
  const [isAdding, startAdding] = useTransition();
  const [isGenerating, startGenerating] = useTransition();
  const form = useForm<ItemInput>({
    resolver: zodResolver(itemInput),
    defaultValues: { title: "" },
  });

  const onSubmit = form.handleSubmit((values) =>
    startAdding(async () => {
      const result = await addItem(values);
      if (result.ok) form.reset();
      else toast.error(result.error);
    }),
  );

  const onGenerate = () =>
    startGenerating(async () => {
      const result = await generateItem(form.getValues("title"));
      if (result.ok) {
        form.reset();
        toast.success("AI added an item");
      } else toast.error(result.error);
    });

  const error = form.formState.errors.title;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <Field data-invalid={!!error} className="flex-1">
        <Input
          {...form.register("title")}
          placeholder="Add an item, or a topic for AI…"
          aria-invalid={!!error}
          autoComplete="off"
        />
        <FieldError errors={[error]} />
      </Field>
      <div className="flex gap-2 self-start">
        <Button type="submit" disabled={isAdding}>
          {isAdding ? "Adding…" : "Add"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? "Thinking…" : "Generate with AI"}
        </Button>
      </div>
    </form>
  );
}
