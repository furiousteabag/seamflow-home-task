CREATE TABLE "sales_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text NOT NULL,
	"job_title" text,
	"company_size" text,
	"interest" text NOT NULL,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sales_leads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "sales_leads_created_at_index" ON "sales_leads" USING btree ("created_at");