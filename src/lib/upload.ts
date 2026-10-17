import { z } from "zod";

// Wire format between the PowerSync upload queue and /api/powersync/upload
export const crudOp = z.object({
  op: z.enum(["PUT", "PATCH", "DELETE"]),
  table: z.literal("items"),
  id: z.uuid(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const uploadBody = z.object({ ops: z.array(crudOp).max(1000) });

export type CrudOp = z.infer<typeof crudOp>;
