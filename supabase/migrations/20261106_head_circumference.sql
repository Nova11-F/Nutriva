-- ============================================================================
-- Nutriva Head Circumference Migration (2026-11-06)
-- Menambahkan kolom lingkar kepala ke tabel growth_records dan children di Supabase
-- ============================================================================

ALTER TABLE public.growth_records
  ADD COLUMN IF NOT EXISTS head_circumference_cm NUMERIC(5,2) CHECK (head_circumference_cm BETWEEN 20.0 AND 70.0);

ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS initial_head_circumference_cm NUMERIC(5,2);

