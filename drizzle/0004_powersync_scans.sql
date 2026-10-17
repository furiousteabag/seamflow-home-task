-- Replicate scans to PowerSync when the replication setup (powersync/setup.sql) exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'powersync') THEN
    ALTER PUBLICATION powersync ADD TABLE public.scans;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'powersync_role') THEN
    GRANT SELECT ON public.scans TO powersync_role;
  END IF;
END $$;
