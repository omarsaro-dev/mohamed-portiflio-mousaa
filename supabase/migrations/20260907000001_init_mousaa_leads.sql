-- ─────────────────────────────────────────────────────────────
-- mousaa_leads — admin CRM source of truth
-- Run this once in the Supabase SQL editor (or via supabase db push).
-- It is idempotent: safe to run even if the table already exists.
-- Tables / columns are NOT renamed — the n8n workflow keeps writing here.
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.mousaa_leads (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  email         text NOT NULL,
  phone         text,
  service       text,
  project_type  text,
  budget        text,
  location      text,
  timeline      text,
  message       text,
  lead_score    integer NOT NULL DEFAULT 50,
  lead_status   text NOT NULL DEFAULT 'new'
                CHECK (lead_status IN ('new','contacted','qualified','won','lost','cold','warm','hot')),
  source        text NOT NULL DEFAULT 'architectural-portfolio',
  email_sent    boolean NOT NULL DEFAULT false,
  telegram_sent boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Indexes for the dashboard filters/sorts/pagination
CREATE INDEX IF NOT EXISTS mousaa_leads_created_at_idx ON public.mousaa_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS mousaa_leads_status_idx     ON public.mousaa_leads (lead_status);
CREATE INDEX IF NOT EXISTS mousaa_leads_score_idx      ON public.mousaa_leads (lead_score);
CREATE INDEX IF NOT EXISTS mousaa_leads_service_idx    ON public.mousaa_leads (service);

-- Auto-maintained updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- If the table already existed (pre-created by n8n / elsewhere) without the
-- status CHECK constraint, add it — both the admin statuses and the n8n
-- score-bucket statuses are allowed.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.mousaa_leads'::regclass
      AND conname = 'mousaa_leads_lead_status_check'
  ) THEN
    ALTER TABLE public.mousaa_leads
      ADD CONSTRAINT mousaa_leads_lead_status_check
      CHECK (lead_status IN ('new','contacted','qualified','won','lost','cold','warm','hot'));
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_mousaa_leads_updated_at ON public.mousaa_leads;
CREATE TRIGGER trg_mousaa_leads_updated_at
  BEFORE UPDATE ON public.mousaa_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE public.mousaa_leads ENABLE ROW LEVEL SECURITY;

-- Public website / n8n may INSERT new inquiries only (never read).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'mousaa_leads' AND policyname = 'mousaa_leads_anon_insert'
  ) THEN
    CREATE POLICY mousaa_leads_anon_insert
      ON public.mousaa_leads FOR INSERT TO anon
      WITH CHECK (true);
  END IF;
END;
$$;

-- Signed-in admins can read, update and delete leads.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'mousaa_leads' AND policyname = 'mousaa_leads_auth_select'
  ) THEN
    CREATE POLICY mousaa_leads_auth_select
      ON public.mousaa_leads FOR SELECT TO authenticated
      USING (true);
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'mousaa_leads' AND policyname = 'mousaa_leads_auth_update'
  ) THEN
    CREATE POLICY mousaa_leads_auth_update
      ON public.mousaa_leads FOR UPDATE TO authenticated
      USING (true) WITH CHECK (true);
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'mousaa_leads' AND policyname = 'mousaa_leads_auth_delete'
  ) THEN
    CREATE POLICY mousaa_leads_auth_delete
      ON public.mousaa_leads FOR DELETE TO authenticated
      USING (true);
  END IF;
END;
$$;

-- Authorize n8n / backend writes via the service role (service_role bypasses RLS).

-- ── Realtime (live "new lead" notifications) ────────────────
-- Realtime is RLS-aware on Supabase, so anonymous users cannot
-- observe inserts — only authenticated admins see them.
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.mousaa_leads;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN others THEN NULL;
  END;
END;
$$;

-- Optional: create the first admin auth user in the dashboard UI
-- (Supabase Auth → Users → Invite user). No admin users are created here.