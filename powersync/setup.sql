-- One-time Supabase setup for PowerSync replication. Run in the Supabase SQL editor.
-- Use the same password as POWERSYNC_DATABASE_PASSWORD in .env.local.
CREATE ROLE powersync_role WITH REPLICATION BYPASSRLS LOGIN PASSWORD 'change-me';
GRANT USAGE ON SCHEMA public TO powersync_role;
GRANT SELECT ON public.items TO powersync_role;
CREATE PUBLICATION powersync FOR TABLE public.items;
