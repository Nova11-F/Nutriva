-- ============================================================================
-- 1. EKSTENSI DATABASE
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Untuk fitur Search Cepat pada Food Search

-- ============================================================================
-- 2. TABEL PROFILES & CHILDREN (MVP UTAMA - AUTH & ONBOARDING)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  user_segment TEXT DEFAULT 'parent' CHECK (user_segment IN ('parent', 'expecting_mother')),
  avatar_url TEXT,
  ai_context_consent BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nickname TEXT,
  birth_date DATE NOT NULL CHECK (birth_date <= CURRENT_DATE),
  gender TEXT NOT NULL CHECK (gender IN ('Laki-laki', 'Perempuan', 'male', 'female')),
  initial_weight_kg NUMERIC(5,2) NOT NULL CHECK (initial_weight_kg BETWEEN 1.0 AND 50.0),
  initial_height_cm NUMERIC(5,2) NOT NULL CHECK (initial_height_cm BETWEEN 30.0 AND 160.0),
  dietary_preferences TEXT[] DEFAULT '{}',
  avoided_foods TEXT[] DEFAULT '{}',
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. TABEL GROWTH RECORDS (FLOW 2 - GROWTH MONITORING & EARLY INTERVENTION)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.growth_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  measurement_date DATE NOT NULL CHECK (measurement_date <= CURRENT_DATE),
  age_in_months NUMERIC(4,1) NOT NULL,
  weight_kg NUMERIC(5,2) NOT NULL CHECK (weight_kg BETWEEN 1.0 AND 50.0),
  height_cm NUMERIC(5,2) NOT NULL CHECK (height_cm BETWEEN 30.0 AND 160.0),
  head_circumference_cm NUMERIC(5,2) CHECK (head_circumference_cm BETWEEN 20.0 AND 70.0),
  z_score_waz NUMERIC(4,2),
  z_score_haz NUMERIC(4,2),
  z_score_whz NUMERIC(4,2),
  needs_attention BOOLEAN DEFAULT FALSE,
  insight_status TEXT NOT NULL DEFAULT 'normal_routine' CHECK (insight_status IN ('normal_routine', 'early_awareness')),
  insight_message TEXT NOT NULL DEFAULT 'Lanjutkan monitoring rutin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. TABEL RECIPES & SAVED MEAL PLANS (FLOW 1 - PLAN MEAL)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  min_age_months INT NOT NULL CHECK (min_age_months >= 0),
  max_age_months INT NOT NULL CHECK (max_age_months >= min_age_months),
  budget_tier TEXT NOT NULL DEFAULT 'sedang' CHECK (budget_tier IN ('ekonomis', 'sedang', 'premium')),
  portion_size TEXT NOT NULL,
  meal_frequency TEXT NOT NULL,
  main_nutrients JSONB NOT NULL,
  ingredients TEXT[] NOT NULL DEFAULT '{}',
  allergen_tags TEXT[] NOT NULL DEFAULT '{}',
  instructions JSONB NOT NULL DEFAULT '[]',
  source_authority TEXT NOT NULL DEFAULT 'Kemenkes RI & WHO/UNICEF',
  validated_by TEXT NOT NULL DEFAULT 'Ahli Gizi',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.saved_meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  planned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  input_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. TABEL FOODS, FOOD LOGS & FAVORITES (FLOW 1 - LOG FOOD)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.foods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  preparation_type TEXT,
  serving_options JSONB NOT NULL DEFAULT '[{"label": "100 gram", "grams": 100}]',
  calories_per_100g NUMERIC(6,2) NOT NULL,
  protein_per_100g NUMERIC(5,2) NOT NULL,
  fat_per_100g NUMERIC(5,2) NOT NULL,
  carbs_per_100g NUMERIC(5,2) NOT NULL,
  iron_mg_per_100g NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.food_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  food_id UUID REFERENCES public.foods(id) ON DELETE SET NULL,
  custom_food_name TEXT,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  serving_label TEXT NOT NULL,
  portion_grams NUMERIC(6,2) NOT NULL CHECK (portion_grams > 0),
  calculated_nutrition JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.favorite_foods (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, food_id)
);

-- ============================================================================
-- 6. TABEL KNOWLEDGE BASE & CHAT MESSAGES (FLOW 3 - AI NUTRITION ASSISTANT)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_authority TEXT NOT NULL,
  validated_by TEXT,
  age_group_tag TEXT,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES public.children(id) ON DELETE SET NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
  message_text TEXT NOT NULL,
  requires_medical_referral BOOLEAN DEFAULT FALSE,
  trusted_sources JSONB DEFAULT '[]',
  suggested_actions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. INDEKS OPTIMASI QUERY (INDEXING)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_children_user_id ON public.children(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_child_date ON public.growth_records(child_id, measurement_date DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_age_budget ON public.recipes(min_age_months, max_age_months, budget_tier);
CREATE INDEX IF NOT EXISTS idx_recipes_ingredients_gin ON public.recipes USING GIN (ingredients);
CREATE INDEX IF NOT EXISTS idx_foods_name_trgm ON public.foods USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_food_logs_child_date ON public.food_logs(child_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_child_created ON public.chat_messages(child_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_knowledge_embedding_hnsw ON public.knowledge_documents USING hnsw (embedding vector_cosine_ops);

-- ============================================================================
-- 8. TRIGGER OTOMATIS PROFIL & BB/TB AWAL
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.seed_initial_growth_record()
RETURNS TRIGGER AS $$
DECLARE
  v_age_months NUMERIC(4,1);
BEGIN
  v_age_months := ROUND((CURRENT_DATE - NEW.birth_date) / 30.4375, 1);
  
  INSERT INTO public.growth_records (
    child_id,
    measurement_date,
    age_in_months,
    weight_kg,
    height_cm,
    needs_attention,
    insight_status,
    insight_message
  ) VALUES (
    NEW.id,
    CURRENT_DATE,
    GREATEST(v_age_months, 0),
    NEW.initial_weight_kg,
    NEW.initial_height_cm,
    FALSE,
    'normal_routine',
    'Data awal berhasil dicatat. Lanjutkan monitoring rutin.'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_child_profile_created ON public.children;
CREATE TRIGGER on_child_profile_created
  AFTER INSERT ON public.children
  FOR EACH ROW EXECUTE FUNCTION public.seed_initial_growth_record();

-- ============================================================================
-- 9. VIEW DAILY NUTRITION SUMMARY
-- ============================================================================
CREATE OR REPLACE VIEW public.daily_nutrition_summaries AS
SELECT
  child_id,
  log_date,
  COUNT(id) AS total_logged_items,
  SUM((calculated_nutrition->>'calories')::NUMERIC) AS total_calories_kcal,
  SUM((calculated_nutrition->>'protein_g')::NUMERIC) AS total_protein_g,
  SUM((calculated_nutrition->>'fat_g')::NUMERIC) AS total_fat_g,
  SUM((calculated_nutrition->>'carbs_g')::NUMERIC) AS total_carbs_g
FROM public.food_logs
GROUP BY child_id, log_date;

-- ============================================================================
-- 10. RPC FUNCTION UNTUK RAG SIMILARITY SEARCH
-- ============================================================================
CREATE OR REPLACE FUNCTION public.match_knowledge_documents(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.75,
  match_count INT DEFAULT 4
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  source_authority TEXT,
  validated_by TEXT,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    kd.id,
    kd.title,
    kd.content,
    kd.source_authority,
    kd.validated_by,
    1 - (kd.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_documents kd
  WHERE 1 - (kd.embedding <=> query_embedding) > match_threshold
  ORDER BY kd.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  -- Profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own profile') THEN
    CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
  END IF;

  -- Children
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Parents can manage own children') THEN
    CREATE POLICY "Parents can manage own children" ON public.children FOR ALL USING (auth.uid() = user_id);
  END IF;

  -- Growth Records
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Parents can manage own child growth records') THEN
    CREATE POLICY "Parents can manage own child growth records" ON public.growth_records FOR ALL USING (
      EXISTS (SELECT 1 FROM public.children c WHERE c.id = growth_records.child_id AND c.user_id = auth.uid())
    );
  END IF;

  -- Saved Meal Plans
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Parents can manage own saved meal plans') THEN
    CREATE POLICY "Parents can manage own saved meal plans" ON public.saved_meal_plans FOR ALL USING (
      EXISTS (SELECT 1 FROM public.children c WHERE c.id = saved_meal_plans.child_id AND c.user_id = auth.uid())
    );
  END IF;

  -- Food Logs
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Parents can manage own child food logs') THEN
    CREATE POLICY "Parents can manage own child food logs" ON public.food_logs FOR ALL USING (
      EXISTS (SELECT 1 FROM public.children c WHERE c.id = food_logs.child_id AND c.user_id = auth.uid())
    );
  END IF;

  -- Favorite Foods
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own favorite foods') THEN
    CREATE POLICY "Users can manage own favorite foods" ON public.favorite_foods FOR ALL USING (auth.uid() = user_id);
  END IF;

  -- Chat Messages
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own chat messages') THEN
    CREATE POLICY "Users can manage own chat messages" ON public.chat_messages FOR ALL USING (auth.uid() = user_id);
  END IF;

  -- Public Reference Tables (Read-Only)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read recipes') THEN
    CREATE POLICY "Anyone can read recipes" ON public.recipes FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read foods') THEN
    CREATE POLICY "Anyone can read foods" ON public.foods FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read knowledge documents') THEN
    CREATE POLICY "Anyone can read knowledge documents" ON public.knowledge_documents FOR SELECT USING (true);
  END IF;
END $$;

-- Izinkan anonim dan user login membaca katalog referensi umum
GRANT SELECT ON public.recipes TO anon, authenticated;
GRANT SELECT ON public.foods TO anon, authenticated;
GRANT SELECT ON public.knowledge_documents TO anon, authenticated;


