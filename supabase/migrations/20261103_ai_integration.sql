-- ============================================================================
-- Nutriva AI integration (2026-11-03)
-- Jalankan di Supabase SQL Editor SETELAH supabase_schema.sql. Idempotent (aman dijalankan ulang).
-- ============================================================================

-- 1. Faktor risiko anak (input model early-awareness). Disimpan sebagai JSONB dengan kunci kontrak API:
--    birth_weight_kg, birth_length_cm, mother_age, mother_height_cm, mother_education, anc_visits,
--    exclusive_breastfeeding, complementary_feeding_start_months, immunization, diarrhea_frequency,
--    drinking_water_source, sanitation, economic_level, residence_type, deworming
ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS risk_factors JSONB NOT NULL DEFAULT '{}'::jsonb;

-- 2. Penanda metode z-score. NULL = baris lama (rumus aproksimasi) -> frontend menghitung ulang saat tampil.
ALTER TABLE public.growth_records
  ADD COLUMN IF NOT EXISTS zscore_method TEXT;

-- 3. Riwayat hasil asesmen AI (WHO + model risiko). Tidak menyimpan nama anak / teks bebas.
CREATE TABLE IF NOT EXISTS public.risk_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  growth_record_id UUID REFERENCES public.growth_records(id) ON DELETE SET NULL,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  basis TEXT NOT NULL CHECK (basis IN ('who_measurement', 'ml_risk_profile')),
  level TEXT NOT NULL CHECK (level IN ('Low', 'Medium', 'High')),
  alert TEXT NOT NULL CHECK (alert IN ('info', 'attention', 'refer')),
  message TEXT NOT NULL,
  risk_score NUMERIC(5,4) CHECK (risk_score BETWEEN 0 AND 1),
  early_awareness BOOLEAN NOT NULL DEFAULT FALSE,
  probabilities JSONB NOT NULL DEFAULT '{}'::jsonb,
  modifiable_factors JSONB NOT NULL DEFAULT '[]'::jsonb,
  model_version TEXT NOT NULL,
  input_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_risk_assessments_child_time
  ON public.risk_assessments(child_id, assessed_at DESC);

ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'risk_assessments'
                 AND policyname = 'Parents can manage own child risk assessments') THEN
    CREATE POLICY "Parents can manage own child risk assessments" ON public.risk_assessments FOR ALL
      USING (EXISTS (SELECT 1 FROM public.children c WHERE c.id = risk_assessments.child_id AND c.user_id = auth.uid()))
      WITH CHECK (EXISTS (SELECT 1 FROM public.children c WHERE c.id = risk_assessments.child_id AND c.user_id = auth.uid()));
  END IF;
END $$;
