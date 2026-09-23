-- Up Migration

-- The running app connects as this role. Migrating and seeding keep using the owner.
-- Roles are cluster-wide, so the test database's migration finds it already there.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'wicken_app') THEN
    CREATE ROLE wicken_app NOLOGIN;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO wicken_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO wicken_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO wicken_app;

-- Tables a later migration adds get the same grants without that migration having to repeat them.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO wicken_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO wicken_app;

-- Down Migration

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM wicken_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM wicken_app;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM wicken_app;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM wicken_app;
REVOKE USAGE ON SCHEMA public FROM wicken_app;
-- The role itself stays: another database in the cluster may still be granting to it.
