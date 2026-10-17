import { z } from "zod";

// Wire format between the PowerSync upload queue and /api/powersync/upload.
// Clients may only rate a scan or delete it; scans are created server-side.
export const crudOp = z.object({
  op: z.enum(["PUT", "PATCH", "DELETE"]),
  table: z.literal("scans"),
  id: z.uuid(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const uploadBody = z.object({ ops: z.array(crudOp).max(1000) });

export type CrudOp = z.infer<typeof crudOp>;
