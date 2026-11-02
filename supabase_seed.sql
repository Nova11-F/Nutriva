-- ============================================================================
-- SEED DATA DUMMY: RECIPES & FOODS (NUTRIVA)
-- Jalankan di SQL Editor Supabase setelah supabase_schema.sql
-- ============================================================================

-- 1. SEED DATA RECIPES (MPASI & Makanan Anak)
INSERT INTO public.recipes (
  title,
  slug,
  image_url,
  min_age_months,
  max_age_months,
  budget_tier,
  portion_size,
  meal_frequency,
  main_nutrients,
  ingredients,
  allergen_tags,
  instructions,
  source_authority,
  validated_by
) VALUES
(
  'Bubur Daging Sapi & Wortel Lembut',
  'bubur-daging-sapi-wortel',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
  6,
  8,
  'sedang',
  '2-3 sendok makan (dewasa) per porsi',
  '2-3 kali sehari',
  '{"calories_kcal": 165, "protein_g": 8.5, "fat_g": 5.2, "carbs_g": 20.1, "iron_mg": 2.4}'::jsonb,
  ARRAY['Beras putih', 'Daging sapi giling', 'Wortel cincang halus', 'Minyak kelapa / UB', 'Bawang putih'],
  ARRAY['daging sapi'],
  '[
    {"step": 1, "text": "Masak beras dengan air kaldu sapi hingga menjadi bubur lunak."},
    {"step": 2, "text": "Tumis bawang putih dengan sedikit unsalted butter, masukkan daging sapi giling hingga matang."},
    {"step": 3, "text": "Masukkan wortel cincang ke dalam bubur, lalu campurkan tumisan daging."},
    {"step": 4, "text": "Saring atau blender halus sesuai tekstur usia 6-8 bulan."}
  ]'::jsonb,
  'Kemenkes RI & WHO',
  'Ahli Gizi Nutriva'
),
(
  'Puree Hati Ayam & Bayam Tinggi Zat Besi',
  'puree-hati-ayam-bayam',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60',
  6,
  11,
  'ekonomis',
  '1/2 mangkuk kecil (125 ml)',
  '1-2 kali sehari',
  '{"calories_kcal": 140, "protein_g": 9.8, "fat_g": 4.1, "carbs_g": 14.5, "iron_mg": 4.2}'::jsonb,
  ARRAY['Hati ayam segar', 'Bayam hijau', 'Kentang kukus', 'Minyak kelapa'],
  ARRAY['ayam'],
  '[
    {"step": 1, "text": "Rebus hati ayam dengan jahe dan daun salam untuk menghilangkan bau amis."},
    {"step": 2, "text": "Kukus kentang dan bayam hingga empuk."},
    {"step": 3, "text": "Lumatkan kentang, hati ayam, dan bayam, lalu tambahkan sedikit minyak kelapa murni."}
  ]'::jsonb,
  'Kemenkes RI',
  'Dokter Spesialis Anak'
),
(
  'Nasi Tim Ikan Kembung & Labu Kuning',
  'nasi-tim-ikan-kembung-labu',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60',
  9,
  12,
  'ekonomis',
  '1/2 mangkuk ukuran 250 ml',
  '3-4 kali sehari',
  '{"calories_kcal": 210, "protein_g": 11.2, "fat_g": 6.8, "carbs_g": 26.0, "iron_mg": 2.1}'::jsonb,
  ARRAY['Beras putih', 'Fillet ikan kembung', 'Labu kuning parut', 'Tahu putih', 'Minyak jagung'],
  ARRAY['ikan'],
  '[
    {"step": 1, "text": "Pastikan fillet ikan kembung bersih tanpa duri sama sekali, cincang halus."},
    {"step": 2, "text": "Campur nasi aron dengan kaldu, ikan kembung, tahu halus, dan labu kuning."},
    {"step": 3, "text": "Kukus selama 30 menit hingga tekstur nasi tim empuk dan menyatu."}
  ]'::jsonb,
  'WHO / UNICEF',
  'Ahli Gizi Nutriva'
),
(
  'Sup Bola Telur Puyuh & Sayur Pelangi',
  'sup-bola-telur-puyuh-sayur',
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=60',
  12,
  24,
  'sedang',
  '3/4 mangkuk makan anak',
  '3 kali sehari',
  '{"calories_kcal": 245, "protein_g": 12.0, "fat_g": 7.5, "carbs_g": 31.0, "iron_mg": 2.8}'::jsonb,
  ARRAY['Telur puyuh rebus', 'Ayam giling', 'Wortel iris dadu', 'Buncis iris tipis', 'Kentang dadu kecil'],
  ARRAY['telur', 'ayam'],
  '[
    {"step": 1, "text": "Buat kuah kaldu ayam segar beraroma seledri dan daun bawang."},
    {"step": 2, "text": "Bentuk ayam giling membungkus telur puyuh rebus kecil."},
    {"step": 3, "text": "Rebus bola-bola ke dalam kaldu hingga mengapung, masukkan wortel dan buncis hingga empuk."}
  ]'::jsonb,
  'Kemenkes RI',
  'Bidan Posyandu Pratama'
)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED DATA FOODS (Database Makanan Dasar per 100 gram)
INSERT INTO public.foods (
  name,
  preparation_type,
  serving_options,
  calories_per_100g,
  protein_per_100g,
  fat_per_100g,
  carbs_per_100g,
  iron_mg_per_100g
) VALUES
(
  'Nasi Putih Matang',
  'rebus / tanak',
  '[{"label": "1 centong", "grams": 100}, {"label": "1 sendok makan", "grams": 15}, {"label": "1/2 mangkuk", "grams": 75}]'::jsonb,
  130.00,
  2.70,
  0.30,
  28.20,
  0.20
),
(
  'Daging Ayam Bagian Dada',
  'kukus / rebus',
  '[{"label": "1 potong sedang", "grams": 50}, {"label": "1 sendok makan cincang", "grams": 20}]'::jsonb,
  165.00,
  31.00,
  3.60,
  0.00,
  1.00
),
(
  'Hati Ayam Segar',
  'kukus / rebus',
  '[{"label": "1 potong hati", "grams": 30}, {"label": "1 sdm halus", "grams": 15}]'::jsonb,
  167.00,
  24.50,
  4.80,
  0.90,
  11.60
),
(
  'Telur Ayam Ras',
  'rebus',
  '[{"label": "1 butir utuh", "grams": 55}, {"label": "1/2 butir", "grams": 28}]'::jsonb,
  155.00,
  13.00,
  11.00,
  1.10,
  1.80
),
(
  'Ikan Kembung Segar',
  'kukus',
  '[{"label": "1 ekor sedang fillet", "grams": 60}, {"label": "1 sdm suwir", "grams": 15}]'::jsonb,
  112.00,
  21.40,
  2.30,
  0.00,
  1.40
),
(
  'Tahu Putih Lembut',
  'kukus',
  '[{"label": "1 kotak kecil", "grams": 50}, {"label": "1 sdm hancur", "grams": 15}]'::jsonb,
  76.00,
  8.00,
  4.80,
  1.90,
  1.50
),
(
  'Wortel Manis',
  'kukus cincang',
  '[{"label": "1 sdm cincang", "grams": 15}, {"label": "1 mangkuk kecil", "grams": 80}]'::jsonb,
  41.00,
  0.90,
  0.20,
  9.60,
  0.30
),
(
  'Bayam Hijau',
  'rebus / lumat',
  '[{"label": "1 sdm lumat", "grams": 15}, {"label": "1 mangkuk sayur", "grams": 50}]'::jsonb,
  23.00,
  2.90,
  0.40,
  3.60,
  2.70
)
ON CONFLICT DO NOTHING;

