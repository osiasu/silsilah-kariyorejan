-- ============================================================
-- PATCH: Fix RLS write permissions for existing members table
-- Run this in Supabase SQL Editor if you already ran the migration.
-- ============================================================

-- Drop the old authenticated-only write policies
DROP POLICY IF EXISTS "Admin insert" ON public.members;
DROP POLICY IF EXISTS "Admin update" ON public.members;
DROP POLICY IF EXISTS "Admin delete" ON public.members;

-- Allow anon key to write (app PIN is the security gate)
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

-- Verify policies are active:
-- SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'members';


-- ============================================================
-- PATCH: Normalise existing status values to "Wafat"
-- Run after the RLS fix above.
-- ============================================================

UPDATE public.members
SET status = 'Wafat'
WHERE status IS NOT NULL AND status ~* '^alm';

UPDATE public.members
SET pasangan_status = 'Wafat'
WHERE pasangan_status IS NOT NULL AND pasangan_status ~* '^alm';

-- Update the CHECK constraints to only allow 'Hidup' or 'Wafat'
ALTER TABLE public.members
  DROP CONSTRAINT IF EXISTS members_status_check,
  DROP CONSTRAINT IF EXISTS members_pasangan_status_check;

ALTER TABLE public.members
  ADD CONSTRAINT members_status_check
    CHECK (status IN ('Hidup','Wafat') OR status IS NULL),
  ADD CONSTRAINT members_pasangan_status_check
    CHECK (pasangan_status IN ('Hidup','Wafat') OR pasangan_status IS NULL);
