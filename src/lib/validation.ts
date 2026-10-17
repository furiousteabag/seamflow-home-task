import { z } from "zod";

export const itemInput = z.object({
  title: z.string().trim().min(1, "Write something first").max(200),
});

export type ItemInput = z.infer<typeof itemInput>;
