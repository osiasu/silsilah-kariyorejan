-- ============================================================
-- Silsilah Trah Kariyorejan — Supabase Migration
-- Jalankan seluruh file ini di Supabase SQL Editor:
--   https://supabase.com/dashboard → project → SQL Editor → New Query
-- ============================================================


-- ── 1. TABEL UTAMA: members ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.members (
  id                      BIGSERIAL PRIMARY KEY,
  no_induk                TEXT,                        -- e.g. "1.2.3"
  nama                    TEXT NOT NULL,
  gender                  CHAR(1) CHECK (gender IN ('L','P')),
  tempat_lahir            TEXT,
  tanggal_lahir           DATE,
  status                  TEXT CHECK (status IN ('Hidup','Wafat') OR status IS NULL),
  alamat                  TEXT,
  kontak                  TEXT,
  parent_id               BIGINT REFERENCES public.members(id) ON DELETE SET NULL,
  generasi                SMALLINT CHECK (generasi BETWEEN 1 AND 9),

  -- Spouse fields stored inline on the member row
  pasangan                TEXT,
  pasangan_gender         CHAR(1) CHECK (pasangan_gender IN ('L','P') OR pasangan_gender IS NULL),
  pasangan_tempat_lahir   TEXT,
  pasangan_tanggal_lahir  DATE,
  pasangan_status         TEXT CHECK (pasangan_status IN ('Hidup','Wafat') OR pasangan_status IS NULL),
  pasangan_alamat         TEXT,
  pasangan_kontak         TEXT,

  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_members_updated_at ON public.members;
CREATE TRIGGER trg_members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ── 2. ROW LEVEL SECURITY ────────────────────────────────────
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Everyone (anonymous + authenticated) can read
CREATE POLICY "Public read"
  ON public.members FOR SELECT
  USING (true);

-- Allow anon key to write — the app's PIN is the access control layer.
-- When you add real Supabase Auth later, restrict these to `authenticated`.
CREATE POLICY "Anon insert"
  ON public.members FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon update"
  ON public.members FOR UPDATE
  TO anon
  USING (true) WITH CHECK (true);

CREATE POLICY "Anon delete"
  ON public.members FOR DELETE
  TO anon
  USING (true);

-- Keep authenticated policies for future proper auth
CREATE POLICY "Auth insert"
  ON public.members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth update"
  ON public.members FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete"
  ON public.members FOR DELETE
  TO authenticated
  USING (true);


-- ── 3. INDEXES ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_members_parent_id  ON public.members(parent_id);
CREATE INDEX IF NOT EXISTS idx_members_generasi   ON public.members(generasi);
CREATE INDEX IF NOT EXISTS idx_members_no_induk   ON public.members(no_induk);


-- ── 4. SAMPLE DATA (Generasi 1 – akar) ──────────────────────
-- Replace / extend with your real data.
-- Tip: you can also import data.csv directly via
--   Supabase Dashboard → Table Editor → members → Import CSV
--   (column names must match the snake_case names above)

INSERT INTO public.members
  (no_induk, nama, gender, status, generasi, pasangan, pasangan_gender, pasangan_status)
VALUES
  (NULL, 'KYAI KARIYO REJO', 'L', 'Wafat', NULL, 'NYAI KARIYO REJO', 'P', 'Wafat'),
  ('1', 'Rubiyem', 'P', 'Wafat', 1, 'Suwahyo', 'L', 'Wafat'),
  ('2', 'Kasiyem', 'P', 'Wafat', 1, 'Pawirorejo', 'L', 'Wafat'),
  ('3', 'Daliyem', 'P', 'Wafat', 1, 'Suwahyo', 'L', 'Wafat'),
  ('4', 'Mujiono', 'L', 'Wafat', 1, NULL, NULL, NULL),
  ('5', 'Ratiyem', 'P', 'Wafat',1, 'Nyonoharjo', 'L', 'Wafat'),
  ('6', 'Jangkep/Kisdiwiharjo', 'L', 'Wafat', 1, 'Ny. Jangkep', 'P', 'Wafat'),
  ('7', 'Walji Hanafi', 'L', 'Wafat', 1, 'Masiroh', 'P', 'Wafat'),
  ('7', 'Walji Hanafi', 'L', 'Wafat', 1, 'Sulistriyani', 'P', 'Wafat')
ON CONFLICT DO NOTHING;

-- ── 5. REALTIME (optional — enables live updates) ────────────
-- Uncomment if you want the page to refresh automatically when
-- another admin saves a change from a different browser.
ALTER PUBLICATION supabase_realtime ADD TABLE public.members;


-- ── DONE ─────────────────────────────────────────────────────
-- After running this, update index.html:
--   const SUPABASE_URL = 'https://<your-project>.supabase.co';
--   const SUPABASE_KEY = '<your anon public key>';
-- Both values are in: Supabase Dashboard → Settings → API
