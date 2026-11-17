-- PostgreSQL foundation: all financial amounts are stored as integer kobo.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE users (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 full_name TEXT NOT NULL,
 email TEXT NOT NULL UNIQUE,
 password_hash TEXT,
 google_sub TEXT UNIQUE,
 role TEXT NOT NULL DEFAULT 'TRADER' CHECK (role IN ('TRADER','SPECTATOR','ADMIN','ORGANISER')),
 admin_user_id TEXT UNIQUE,
 phone TEXT,
 campus TEXT,
 department TEXT,
 level TEXT,
 email_verified_at TIMESTAMPTZ,
 age_verified_at TIMESTAMPTZ,
 identity_verified_at TIMESTAMPTZ,
 status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','SUSPENDED')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 last_login_at TIMESTAMPTZ,
 last_visit_at TIMESTAMPTZ,
 deactivated_at TIMESTAMPTZ,
 deactivation_reason TEXT
);
CREATE TABLE admin_access_assignments (
 email TEXT PRIMARY KEY,
 admin_user_id TEXT NOT NULL UNIQUE,
 assigned_by TEXT NOT NULL DEFAULT 'PLATFORM_OWNER',
 assigned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE admin_id_allowlist (
 admin_user_id TEXT PRIMARY KEY,
 claimed_by_email TEXT UNIQUE,
 claimed_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO admin_id_allowlist (admin_user_id) VALUES
 ('Jossy08'),('Farid10'),('Digimide00'),('Yusuph24'),('Awwa_1'),('Honey13')
ON CONFLICT (admin_user_id) DO NOTHING;
CREATE TABLE user_activity (
 id BIGSERIAL PRIMARY KEY,
 user_id UUID NOT NULL REFERENCES users(id),
 activity_type TEXT NOT NULL,
 details JSONB NOT NULL DEFAULT '{}',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX user_activity_user_idx ON user_activity(user_id,created_at DESC);
CREATE TABLE markets (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 question TEXT NOT NULL,
 category TEXT NOT NULL,
 description TEXT NOT NULL DEFAULT '',
 yes_price NUMERIC(6,5) NOT NULL CHECK (yes_price > 0 AND yes_price < 1),
 status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','OPEN','CLOSED','RESOLVED','VOID')),
 closes_at TIMESTAMPTZ NOT NULL,
 resolution_criteria TEXT NOT NULL,
 result_source TEXT NOT NULL,
 outcome TEXT CHECK (outcome IN ('YES','NO')),
 resolved_by UUID REFERENCES users(id),
 resolved_at TIMESTAMPTZ,
 created_by UUID NOT NULL REFERENCES users(id),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE wallets (
 user_id UUID PRIMARY KEY REFERENCES users(id),
 available_kobo BIGINT NOT NULL DEFAULT 0 CHECK (available_kobo >= 0),
 pending_kobo BIGINT NOT NULL DEFAULT 0 CHECK (pending_kobo >= 0),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE ledger_transactions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 reference TEXT NOT NULL UNIQUE,
 kind TEXT NOT NULL CHECK (kind IN ('DEPOSIT','WITHDRAWAL','TRADE','PAYOUT','REFUND','ADJUSTMENT')),
 status TEXT NOT NULL CHECK (status IN ('PENDING','POSTED','FAILED','REVERSED')),
 description TEXT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE ledger_entries (
 id BIGSERIAL PRIMARY KEY,
 transaction_id UUID NOT NULL REFERENCES ledger_transactions(id),
 account_code TEXT NOT NULL,
 user_id UUID REFERENCES users(id),
 amount_kobo BIGINT NOT NULL CHECK (amount_kobo <> 0),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ledger_entries_user_idx ON ledger_entries(user_id,created_at DESC);
CREATE TABLE positions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id),
 market_id UUID NOT NULL REFERENCES markets(id),
 outcome TEXT NOT NULL CHECK (outcome IN ('YES','NO')),
 stake_kobo BIGINT NOT NULL CHECK (stake_kobo > 0),
 execution_price NUMERIC(6,5) NOT NULL,
 shares NUMERIC(20,8) NOT NULL,
 status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','WON','LOST','REFUNDED')),
 payout_kobo BIGINT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE payment_events (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 provider TEXT NOT NULL,
 provider_reference TEXT NOT NULL UNIQUE,
 user_id UUID NOT NULL REFERENCES users(id),
 amount_kobo BIGINT NOT NULL CHECK (amount_kobo > 0),
 status TEXT NOT NULL CHECK (status IN ('PENDING','VERIFIED','FAILED')),
 raw_event JSONB NOT NULL,
 received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE admin_audit_logs (
 id BIGSERIAL PRIMARY KEY,
 actor_id UUID NOT NULL REFERENCES users(id),
 action TEXT NOT NULL,
 entity_type TEXT NOT NULL,
 entity_id UUID,
 metadata JSONB NOT NULL DEFAULT '{}',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE IF NOT EXISTS market_suggestions (
 id BIGSERIAL PRIMARY KEY,
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 title VARCHAR(160) NOT NULL,
 category VARCHAR(60) NOT NULL,
 details VARCHAR(1200) NOT NULL,
 contact_email VARCHAR(200) NOT NULL,
 status VARCHAR(20) NOT NULL DEFAULT 'NEW',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS market_suggestions_created_idx ON market_suggestions(created_at DESC);
