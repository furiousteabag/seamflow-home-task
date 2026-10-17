import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.url(),
  ANTHROPIC_API_KEY: z.string().min(1),
});

export const env = schema.parse(process.env);
