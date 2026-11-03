-- ============================================================================
-- FIX PERMISSIONS: GRANT HAK AKSES TABEL KE ROLE AUTHENTICATED & ANON
-- Jalankan skrip ini di SQL Editor Supabase untuk mengatasi
-- "permission denied for table profiles" dan tabel lainnya
-- ============================================================================

-- 1. Berikan hak akses skema public
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 2. Berikan izin CRUD pada tabel-tabel milik user ke authenticated (pengguna yang sudah login)
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.children TO authenticated;
GRANT ALL ON TABLE public.growth_records TO authenticated;
GRANT ALL ON TABLE public.saved_meal_plans TO authenticated;
GRANT ALL ON TABLE public.food_logs TO authenticated;
GRANT ALL ON TABLE public.favorite_foods TO authenticated;
GRANT ALL ON TABLE public.chat_messages TO authenticated;

-- 3. Berikan izin baca pada tabel referensi publik untuk anon dan authenticated
GRANT SELECT ON TABLE public.recipes TO anon, authenticated;
GRANT SELECT ON TABLE public.foods TO anon, authenticated;
GRANT SELECT ON TABLE public.knowledge_documents TO anon, authenticated;
GRANT SELECT ON TABLE public.daily_nutrition_summaries TO authenticated;

-- 4. Berikan izin sequences (jika ada auto-increment)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

