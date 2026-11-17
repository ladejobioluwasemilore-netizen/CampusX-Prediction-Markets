-- Apply once to an existing CampusX PostgreSQL database.
ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_user_id TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS campus TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS level TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_visit_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deactivation_reason TEXT;
CREATE TABLE IF NOT EXISTS admin_access_assignments (
 email TEXT PRIMARY KEY,
 admin_user_id TEXT NOT NULL UNIQUE,
 assigned_by TEXT NOT NULL DEFAULT 'PLATFORM_OWNER',
 assigned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS user_activity (
 id BIGSERIAL PRIMARY KEY,
 user_id UUID NOT NULL REFERENCES users(id),
 activity_type TEXT NOT NULL,
 details JSONB NOT NULL DEFAULT '{}',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS user_activity_user_idx ON user_activity(user_id,created_at DESC);

-- One-time administrator ID claims. Each approved ID can create exactly one admin account.
CREATE TABLE IF NOT EXISTS admin_id_allowlist (
 admin_user_id TEXT PRIMARY KEY,
 claimed_by_email TEXT UNIQUE,
 claimed_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO admin_id_allowlist (admin_user_id) VALUES
 ('Jossy08'),('Farid10'),('Digimide00'),('Yusuph24'),('Awwa_1'),('Honey13')
ON CONFLICT (admin_user_id) DO NOTHING;
