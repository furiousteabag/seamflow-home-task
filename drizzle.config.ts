import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Same file Next.js uses locally; on Vercel/CI vars come from process.env
config({ path: ".env.local", quiet: true });

export default defineConfig({
  schema: "./src/db/schema.ts",
  schemaFilter: ["public"],
  out: "./drizzle",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
