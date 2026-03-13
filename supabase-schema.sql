-- Run this once in Supabase Dashboard → SQL Editor → New query → Run.
-- Then in Storage create a public bucket named "uploads" (Dashboard → Storage → New bucket).
-- Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel (Settings → Environment Variables) and redeploy.

-- Admins table (for login & admin users)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ
);

-- Reservations table (for booking form & admin reservations)
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date TEXT,
  guests INT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed'))
);

-- Create first admin: username Shyaka, password shyaka1234
INSERT INTO admins (username, password_hash) VALUES ('Shyaka', '$2b$10$1aYTWzGIGvlAgZxZHpbNAeiHI8lbuZho.cVvjbxrDolQHlX0u.0s.')
ON CONFLICT (username) DO NOTHING;

-- Events (admin events + public events page)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  "order" INT NOT NULL DEFAULT 0
);

-- Gallery images
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  image_url TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  "order" INT NOT NULL DEFAULT 0
);

-- Site content (hero, about, menu pdf, etc.) – single row
CREATE TABLE IF NOT EXISTS content (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO content (id, data) VALUES ('default', '{}')
ON CONFLICT (id) DO NOTHING;

-- Storage bucket for media uploads (images, videos, PDFs)
-- In Supabase Dashboard go to Storage → New bucket → name: "uploads" → Public bucket → Create.
