CREATE TYPE "public"."scan_channel" AS ENUM('web', 'api');--> statement-breakpoint
CREATE TYPE "public"."scan_feedback" AS ENUM('correct', 'incorrect');--> statement-breakpoint
CREATE TYPE "public"."verdict" AS ENUM('hot_dog', 'not_hot_dog');--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"prefix" text NOT NULL,
	"key_hash" text NOT NULL,
	"last_used_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_keyHash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
ALTER TABLE "api_keys" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "scans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"verdict" "verdict" NOT NULL,
	"confidence" real NOT NULL,
	"label" text NOT NULL,
	"reasoning" text NOT NULL,
	"image_path" text NOT NULL,
	"thumbnail" text NOT NULL,
	"model" text NOT NULL,
	"latency_ms" integer NOT NULL,
	"channel" "scan_channel" DEFAULT 'web' NOT NULL,
	"feedback" "scan_feedback",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "scans" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scans" ADD CONSTRAINT "scans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "api_keys_user_id_index" ON "api_keys" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "scans_user_id_created_at_index" ON "scans" USING btree ("user_id","created_at");