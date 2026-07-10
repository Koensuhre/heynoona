-- HeyNoona — initial schema
-- Draai dit één keer uit tegen je Neon / Vercel Postgres database
-- (Neon SQL editor, Vercel Postgres "Query" tab, of `psql "$DATABASE_URL" -f migrations/001_init.sql`)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  package TEXT NOT NULL,
  event_type TEXT NOT NULL,

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  message TEXT,
  terms_accepted BOOLEAN NOT NULL DEFAULT false,

  status TEXT NOT NULL DEFAULT 'nieuw'
    CHECK (status IN ('nieuw', 'goedgekeurd', 'in_behandeling', 'afgerond', 'geannuleerd')),
  admin_notes TEXT,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (date, start_time)
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);

-- Volledige dagen die de beheerder blokkeert (vakantie, onderhoud, etc.)
CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Losse tijdsloten die de beheerder blokkeert (bv. al mondeling verhuurd)
CREATE TABLE IF NOT EXISTS blocked_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (date, start_time)
);

CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON blocked_slots (date);

-- Trigger die updated_at automatisch bijwerkt
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_bookings_updated_at ON bookings;
CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
