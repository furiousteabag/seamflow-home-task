ALTER TABLE "scans" ADD COLUMN "hot_dog_score" integer;--> statement-breakpoint
ALTER TABLE "scans" ADD COLUMN "improvements" text;--> statement-breakpoint
ALTER TABLE "scans" ADD COLUMN "enhanced_image_path" text;--> statement-breakpoint
ALTER TABLE "scans" ADD COLUMN "enhanced_score" integer;--> statement-breakpoint
ALTER TABLE "scans" ADD COLUMN "enhanced_at" timestamp with time zone;