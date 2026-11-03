-- ============================================================================
-- FIX CONSTRAINT: PROFILES USER_SEGMENT CHECK
-- Menyesuaikan constraint user_segment agar menerima input peran dari UI:
-- 'Ibu', 'Ayah', 'Wali / Pengasuh', 'parent', 'expecting_mother', dll.
-- ============================================================================

-- 1. Hapus batasan check constraint yang terlalu kaku
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_segment_check;

-- 2. Buat batasan baru yang lebih fleksibel
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_segment_check 
  CHECK (user_segment IN ('Ibu', 'Ayah', 'Wali / Pengasuh', 'parent', 'expecting_mother', 'wali', 'other'));

-- 3. Tambahkan kolom pendukung kontak orang tua di tabel profiles jika belum ada
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;

