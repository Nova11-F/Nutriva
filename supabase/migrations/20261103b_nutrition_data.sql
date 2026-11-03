-- ============================================================================
-- Nutriva nutrition data provenance (2026-11-03)
-- Jalankan SETELAH supabase_schema.sql, SEBELUM supabase/seed/nutrition_seed.sql. Idempotent.
-- ============================================================================

-- foods: kode stabil untuk upsert + jejak sumber setiap angka
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS extra_nutrients_per_100g JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS match_quality TEXT;
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS data_notes TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS foods_code_key ON public.foods(code);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'foods_match_quality_check') THEN
    ALTER TABLE public.foods ADD CONSTRAINT foods_match_quality_check
      CHECK (match_quality IS NULL OR match_quality IN ('exact', 'close', 'proxy'));
  END IF;
END $$;

-- recipes: tautan sumber dan catatan kualitas data
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS source_reference TEXT;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS data_notes TEXT;

-- Opsional: data dummy lama di supabase_seed.sql memakai klaim validasi yang tidak terverifikasi.
-- Hapus bila belum dipakai meal plan pengguna (saved_meal_plans ikut terhapus karena ON DELETE CASCADE):
-- DELETE FROM public.recipes WHERE slug IN ('bubur-daging-sapi-wortel','puree-hati-ayam-bayam',
--   'nasi-tim-ikan-kembung-labu','sup-bola-telur-puyuh-sayur')
--   AND id NOT IN (SELECT recipe_id FROM public.saved_meal_plans);
-- DELETE FROM public.foods WHERE code IS NULL AND id NOT IN (SELECT food_id FROM public.food_logs WHERE food_id IS NOT NULL);
