-- ============================================================
--  Silsilah Trah Kariyorejan — data_requests table
--  Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.data_requests (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type     TEXT          NOT NULL
                     CHECK (request_type IN (
                       'add_member', 'update_member',
                       'add_spouse',  'update_spouse'
                     )),
  target_id        TEXT          DEFAULT NULL,   -- member/spouse UUID being updated (null for add)
  target_name      TEXT          DEFAULT NULL,   -- human-readable name for the queue list
  requestor_name   TEXT          NOT NULL,
  requestor_contact TEXT         DEFAULT NULL,
  data             JSONB         NOT NULL DEFAULT '{}'::jsonb,
  notes            TEXT          DEFAULT NULL,   -- free-form note from requestor
  status           TEXT          NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
  reviewed_at      TIMESTAMPTZ   DEFAULT NULL,
  reviewed_by      TEXT          DEFAULT NULL    -- name/identifier of the admin who acted
);

-- 2. Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_data_requests_status
  ON public.data_requests (status);

CREATE INDEX IF NOT EXISTS idx_data_requests_created_at
  ON public.data_requests (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_data_requests_request_type
  ON public.data_requests (request_type);

-- 3. Enable Row Level Security
ALTER TABLE public.data_requests ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
--    Allow anyone (anon key) to INSERT new requests
CREATE POLICY "Anyone can submit a request"
  ON public.data_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

--    Allow anyone to SELECT (guests read list, admin reads for approval)
CREATE POLICY "Anyone can read requests"
  ON public.data_requests
  FOR SELECT
  TO anon, authenticated
  USING (true);

--    Only authenticated role can UPDATE (status changes / approvals)
--    In practice your app sends the anon key, so use a service-role key
--    for approvals, OR relax this to anon for simplicity:
CREATE POLICY "Anyone can update request status"
  ON public.data_requests
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Grant table privileges to anon and authenticated roles
GRANT SELECT, INSERT, UPDATE ON public.data_requests
  TO anon, authenticated;

-- 6. Optional: helpful comment
COMMENT ON TABLE public.data_requests IS
  'Stores guest-submitted add/update requests waiting for admin review.
   status: pending → in_progress → completed';

-- ============================================================
--  Verification — run after creation to confirm structure
-- ============================================================
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'data_requests'
ORDER BY ordinal_position;
