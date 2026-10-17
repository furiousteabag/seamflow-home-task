CREATE TABLE "level_ups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"scan_id" uuid NOT NULL,
	"model" text NOT NULL,
	"score" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "level_ups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "level_ups" ADD CONSTRAINT "level_ups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "level_ups" ADD CONSTRAINT "level_ups_scan_id_scans_id_fk" FOREIGN KEY ("scan_id") REFERENCES "public"."scans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "level_ups_user_id_created_at_index" ON "level_ups" USING btree ("user_id","created_at");