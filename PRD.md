Product Requirements Document (PRD): Nutriva
Nama Produk: Nutriva  
PNG
Tim Pengembang: Tim GarudaCode (Product Designer, Developer, Researcher)  
JPG
Fokus Dokumen: Spesifikasi Produk End-to-End & Arsitektur Backend MVP  
PNG

- 1
  Status: Siap Implementasi (Integrasi Frontend ke Backend Supabase & AI)  
  PNG

1. Ringkasan Eksekutif & Tujuan Produk (Job to be Done)
   Nutriva adalah platform berbasis web dan mobile-responsive yang dirancang untuk membantu orang tua merencanakan dan mencatat kebutuhan gizi anak, memantau pertumbuhannya, serta memperoleh informasi gizi yang relevan dan terpercaya guna mencegah stunting.  
   PNG

- 3
  Platform ini berfokus pada empat fase pengalaman pengguna utama setelah onboarding:
  Onboarding & Personalization: Mendaftarkan akun dan mendata profil dasar serta antropometri awal anak secara mudah tanpa rasa takut salah input.  
  PNG
- 1
  Nutrition Planning: Memberikan rekomendasi menu, takaran porsi, dan variasi makanan sesuai profil anak dan ketersediaan budget/bahan.  
  PNG
- 1
  Nutrition Tracking: Memungkinkan pencatatan asupan makanan harian dan kalkulasi gizi secara otomatis tanpa perlu menghitung manual.  
  PNG
- 2
  Growth Monitoring & Personalized AI Assistance: Memantau grafik pertumbuhan berat/tinggi badan dengan insight non-diagnostik, serta menyediakan asisten AI kontekstual berbasis sumber medis tepercaya.  
  PNG
- 3

2. Pemangku Kepentingan (Stakeholders) & Standar Regulasi
   Kategori Stakeholder Entitas Spesifik Peran & Implikasi terhadap Sistem
   End User  
   JPG

• Orang Tua / Calon Orang Tua
JPG

• Calon Ibu  
JPG

Pengguna langsung aplikasi yang membutuhkan panduan kesehatan ibu, pemenuhan nutrisi masa kehamilan (1000 HPK), serta pemantauan tumbuh kembang anak.  
JPG

Regulatory & Health Policy Authorities  
JPG

• WHO & UNICEF  
JPG

• Kementerian Kesehatan RI (Kemenkes)  
JPG

Menetapkan standar acuan global dan nasional untuk panduan Infant and Young Child Feeding (IYCF), Minimum Dietary Diversity (MDD), angka kecukupan gizi nasional, serta kurva dan protokol tata laksana malnutrisi/stunting.  
JPG

Researcher / Health Expert
JPG

• Ahli Gizi  
JPG

• Dokter Anak / Bidan  
JPG

Memvalidasi kebutuhan nutrisi, porsi, rekomendasi makanan, konten edukasi gizi, fase 1000 HPK, tanda peringatan (red flags), dan batas aman rekomendasi digital.  
JPG

Healthcare & Referral Partners  
JPG

• Kader Posyandu  
JPG

• Tenaga Kesehatan & Puskesmas  
JPG

Mitra eksternal di lapangan sebagai tujuan rujukan medis, konseling spesifik, dan intervensi klinis apabila sistem mendeteksi pola pertumbuhan atau kondisi yang membutuhkan penanganan medis.  
PNG

- 2

Developers  
JPG

• Tim GarudaCode  
JPG

Tim lintas fungsi yang meriset kebutuhan pengguna, merancang UI/UX, membangun arsitektur sistem, serta menjaga validitas konten gizi di dalam ekosistem aplikasi.  
JPG

3. Arsitektur Teknologi (Technology Adaptation)
   Berikut adalah pemetaan tumpukan teknologi berdasarkan spesifikasi dokumen perencanaan dan penyelarasan terhadap kode repositori frontend (src/):
   Kategori Teknologi Fungsi & Implementasi Arsitektur
   Frontend Development
   PNG

React.js / Next.js  
PNG

Membangun antarmuka pengguna untuk Meal Planner, Food Tracking, Growth Monitoring, dan AI Nutrition Assistant. Pada repositori saat ini diimplementasikan menggunakan struktur SPA modular (src/pages/, src/context/, src/services/).  
PNG

Database & Backend Service  
PNG

Supabase PostgreSQL  
PNG

Menyimpan data akun pengguna, profil anak, database makanan & resep, meal log, riwayat pertumbuhan (growth data), serta riwayat percakapan aplikasi.
PNG

Authentication  
PNG

Supabase Auth  
PNG

Menangani proses registrasi, login, logout, perubahan kata sandi (ChangePasswordPage.jsx), serta manajemen session pengguna.  
PNG

AI & NLP  
PNG

LLM API + RAG  
PNG

Menjalankan Personalized AI Nutrition Assistant untuk menyusun jawaban edukatif berdasarkan konteks profil anak dan hasil pencarian sumber tepercaya.  
PNG

- 2

Knowledge Base  
PNG

Supabase + pgvector  
PNG

Menyimpan vector embedding dokumen informasi gizi tervalidasi (WHO/UNICEF/Kemenkes) yang digunakan untuk proses retrieval pada AI Assistant.  
PNG

- 1

Nutrition Data Processing  
PNG

Database nutrisi + calculation logic  
PNG

Menghitung kandungan makronutrisi dan mikronutrisi secara deterministik berdasarkan jenis makanan dan takaran porsi yang dipilih pengguna.  
PNG

- 1

Meal Recommendation
PNG

Rule-Based Recommendation  
PNG

Memberikan rekomendasi menu makanan berdasarkan filter usia anak, preferensi bahan tersedia, budget, dan alergi/pantangan tanpa memerlukan model ML yang kompleks.  
PNG

- 1

Growth Visualization
PNG

Chart.js / Recharts  
PNG

Merender riwayat berat badan dan tinggi badan anak ke dalam grafik pertumbuhan yang mudah dipahami oleh orang tua.  
PNG

- 1

Serverless Function
PNG

Supabase Edge Functions / Netlify Functions  
PNG

Menjalankan logika orkestrasi RAG, pemanggilan LLM API, dan validasi keamanan medis di sisi server tanpa mengekspos API key ke client.  
PNG

- 1

Hosting & Version Control  
PNG

Vercel & GitHub  
PNG

Hosting dan deployment aplikasi web Nutriva serta manajemen version control kolaborasi tim.
PNG

4. Struktur Navigasi (Site Map & Frontend Routing)
   Aplikasi mendukung dua tata letak navigasi yang diadaptasi melalui MainLayout.jsx, Sidebar.jsx (Website), dan BottomNav.jsx (Mobile):
   Website Sitemap: Dimulai dari Landing Page yang terhubung ke Authentication (Login, Register) dan Dashboard. Dari Dashboard, pengguna dapat mengakses Child Profile serta tiga pilar fitur:  
   PNG
   Nutrition Planning & Tracking: Meal Planner, Menu Recommendation, Recipe Detail, Food Search, Food Detail, Portion Input, Nutrition Result, Food Log, dan Daily Nutrition Summary.  
   PNG
   Growth Monitoring (tertulis Trusted Nutrition Education pada draf peta situs web): Add Measurement, Growth Chart, Growth History, dan Growth Insight.  
   PNG

- 1
  AI Nutrition Assistant: Personalized Chat, Suggested Action, dan Trusted Sources.  
  PNG
  Mobile Sitemap: Dimulai dari Splash Screen menuju Authentication (Login, Register) dan Home. Navigasi utama dibagi menjadi 4 menu bawah: Nutrition (Meal Planner, Food Search, Food Log, Nutrition Summary), Growth (Add Measurement, Growth Chart, Growth History), AI Assistant (Personalized Chat), dan Profile (Child Profile).  
  PNG
- 1

5. Spesifikasi Fungsional & Alur Logika Backend
   5.1. Modul Autentikasi & Onboarding Profil Anak (Alur MVP Utama)
   User Story: Sebagai orang tua baru di platform, saya ingin membuat akun dan mengisi data dasar anak dengan panduan yang jelas agar sistem dapat memberikan rekomendasi gizi yang sesuai usia anak saya.  
   PNG

- 1
  Alur Logika Sistem:
  Pengguna membuka Landing Page (LandingPage.jsx) dan sistem memvalidasi apakah pengguna sudah memiliki akun.  
  PNG
  Jika belum memiliki akun (IF NO), pengguna diarahkan ke halaman Register (RegisterPage.jsx) lalu menuju Login (LoginPage.jsx); jika sudah (if yes), pengguna langsung masuk ke Login.  
  PNG
  Setelah autentikasi berhasil, Onboarding Guard mengecek kondisi Sudah memiliki profil anak? pada tabel children.  
  PNG
  Jika belum (if no), pengguna diarahkan ke halaman Buat Profil Anak (ChildProfilePage.jsx) untuk mengisi: Nama / nickname, Tanggal lahir, Jenis kelamin, Berat badan, Tinggi badan, serta Preferensi dasar.  
  PNG
- 1
  Saat profil anak disimpan, backend secara otomatis menyalin nilai Berat Badan dan Tinggi Badan awal tersebut sebagai entri pertama di tabel riwayat pertumbuhan (growth_records) agar grafik pertumbuhan langsung terisi.  
  PNG
- 1
  Jika profil anak sudah tersedia (if yes), pengguna diarahkan ke Dashboard (HomePage.jsx) untuk memilih aktivitas.  
  PNG
  5.2. Modul 1: Personalized Nutrition & Meal Planning (Flow 1)
  A. Sub-Modul Plan Meal (Rekomendasi Menu & Resep)
  User Story: Sebagai orang tua yang sering bingung menentukan menu harian, variasi, porsi, dan budget, saya ingin mendapatkan rekomendasi resep praktis yang sesuai dengan bahan yang ada di rumah dan profil usia anak saya.  
  PNG
- 1
  Alur Logika Sistem:
  Dari Dashboard / NutritionPage.jsx, pengguna memilih aksi Plan Meal (CreateMealPlanPage.jsx).  
  PNG
  Sistem secara otomatis membaca data Profil Anak (usia dari tanggal lahir, BB/TB, dan preferensi bawaan).  
  PNG
- 1
  Pengguna memasukkan Input Preferensi yang terdiri dari: bahan tersedia, budget, preferensi makanan, dan makanan yang dihindari.  
  PNG
  Backend menjalankan Generate Menu Recommendation berbasis rule-based filtering (recipeService.js) yang mencocokkan kelompok usia IYCF/MDD dengan tag bahan, estimasi budget, dan pantangan alergi.  
  PNG
- 2
  Sistem menampilkan hasil rekomendasi (RecipeListPage.jsx) yang memuat informasi: Menu, Porsi, Frekuensi makan, dan Kandungan utama.  
  PNG
  Pengguna memvalidasi Menu sesuai?:  
  PNG
  Jika Tidak (IF NO): Sistem mengeksekusi Generate Menu Recommendation Alternatif dengan mengecualikan ID resep yang baru saja ditolak, lalu menampilkan kembali daftar menu alternatif.  
  PNG
  Jika Ya (IF YES): Sistem menyimpan pilihan ke Save Menu, menampilkan halaman Recipe Detail (RecipeDetailPage.jsx), lalu mengarahkan alur kembali ke Dashboard.  
  PNG
  B. Sub-Modul Log Food (Pencatatan & Kalkulasi Gizi Harian)
  User Story: Sebagai orang tua yang kesulitan mengetahui kandungan gizi makanan dan enggan menghitung secara manual, saya ingin mencari makanan, memilih ukuran porsi rumah tangga, dan menyimpan catatan makan harian anak dengan cepat.  
  PNG
- 1
  Alur Logika Sistem:
  Dari menu aktivitas nutrisi, pengguna memilih Log Food dan melakukan pencarian makanan pada Search Food (dilengkapi akses cepat recent food dan favorite food).  
  PNG
- 1
  Sistem memvalidasi Food Found? pada database nutrisi:  
  PNG
- 1
  Jika Tidak (IF NO): Sistem mengembalikan pengguna ke pencarian Search Food dengan saran kata kunci atau opsi input makanan manual.  
  PNG
  Jika Ya: Pengguna memilih makanan (Select Food), melihat Food Detail, dan memasukkan takaran porsi pada Input Portion menggunakan satuan saji yang mudah dipilih.  
  PNG
- 2
  Backend menjalankan Nutrition Calculation ((nilai_gizi_per_100g \* berat_gram_porsi) / 100) dan menampilkan Nutrition Result.  
  PNG
- 1
  Pengguna menyimpan data melalui Save to Food Log, sistem memperbarui agregasi Daily Nutrition Summary, dan mengarahkan kembali ke Dashboard.  
  PNG
- 1
  5.3. Modul 2: Growth Monitoring & Early Intervention (Flow 2)
  User Story: Sebagai orang tua yang khawatir terhadap tumbuh kembang anak, saya ingin mencatat berat dan tinggi badan anak secara berkala dan melihat grafik sederhana beserta informasi non-diagnostik apakah perkembangan anak saya memerlukan perhatian medis.  
  PNG
- 1
  Alur Logika Sistem:
  Pengguna membuka menu Growth Monitoring (GrowthPage.jsx) dari Dashboard dan memilih Add Measurement (AddMeasurementPage.jsx).  
  PNG
  Pengguna memasukkan input: Berat badan (kg), Tinggi / panjang badan (cm), dan Tanggal pengukuran.  
  PNG
  Backend (growthService.js) menjalankan Process Growth Data dengan menghitung usia anak dalam bulan saat tanggal pengukuran dan membandingkan nilai antropometri terhadap kurva standar WHO/Kemenkes RI, lalu memperbarui Growth Chart & History.  
  PNG
- 1
  Sistem mengevaluasi percabangan Ada pola yang perlu diperhatikan? (misalnya tren berat badan tidak naik (weight faltering) atau berada di bawah ambang batas Z-Score standar):  
  PNG
- 1
  Jika Tidak (IF NO): Sistem menampilkan kartu Growth Insight bertuliskan "Lanjutkan monitoring rutin" dan mengaktifkan pengingat Monitoring Routine sebelum kembali ke Dashboard.  
  PNG
  Jika Ya (IF YES): Sistem memicu status Early Awareness dan menampilkan arahan jelas non-diagnostik: "Pertimbangkan pemeriksaan ke Posyandu/Puskesmas/Nakes" sebelum kembali ke Dashboard.  
  PNG
- 1
  5.4. Modul 3: Personalized AI Nutrition Assistant (Flow 3 & State Machine)
  User Story: Sebagai orang tua yang bingung karena informasi gizi di internet berbeda-beda, saya ingin bertanya langsung kepada asisten AI yang memahami konteks usia dan profil anak saya serta memberikan jawaban bersumber resmi dengan batasan medis yang jelas.  
  PNG
- 2
  Spesifikasi Siklus Finite State Machine (FSM) & Pipeline RAG:
  Tahap Aktivitas Transisi Status (FSM) Proses Backend & Optimasi UX

1. Membuka AI Assistant  
   JPG

[Dashboard] → (Tap AI Nutrition Assistant) → [AI Assistant Ready]
JPG

Pengguna membuka AssistantPage.jsx melalui tombol jelas di dashboard.  
JPG

2. Load User Context  
   JPG

[AI Assistant Ready] → (Load Relevant User Data) → [User Context Loaded]  
JPG

Sistem mengambil data profil anak yang diizinkan (usia, BB/TB terakhir, preferensi/alergi, dan log nutrisi) serta menampilkan indikator transparansi kepada pengguna bahwa konteks anak sedang digunakan.  
PNG

- 1

3. Input Question  
   JPG

[User Context Loaded] → (User Types Question) → [Question Submitted]
JPG

Menyediakan kolom chat sederhana beserta daftar suggested prompt (contoh pertanyaan sesuai usia anak) untuk mengurangi hambatan (low friction).  
PNG

- 1

4. Retrieve Knowledge  
   JPG

[Question Submitted] → (Retrieve Knowledge Base) → [Knowledge Retrieved]  
JPG

Edge Function mengubah pertanyaan menjadi embedding dan melakukan pencarian vektor di Supabase + pgvector (Retrieve Trusted Knowledge), sembari menampilkan status umpan balik langsung "Sedang mencari informasi yang relevan..." di UI.  
PNG

- 2

5. AI Processing  
   JPG

[Knowledge Retrieved] → (LLM Processing) → [Response Generated]
JPG

LLM memproses jawaban dengan menggabungkan system prompt, konteks profil anak, pertanyaan pengguna, dan potongan dokumen resmi dari knowledge base.  
PNG

- 1

6. Safety Check  
   JPG

[Response Generated] → (Safety Validation) → [Response Safe?]  
JPG

Sistem mengevaluasi percabangan Pertanyaan membutuhkan diagnosis / penanganan medis?.
PNG

- 1

7. Review Answer / Medical Guardrail  
   PNG

- 1

• Jalur Aman (If Safe): [Answer Displayed] → (User Reads Answer) → [User Informed]  
JPG

• Jalur Medis (IF YES): [Medical Warning] → [Referral / Dashboard]
PNG

- 1

• Jika Aman (Edukatif/Gizi Harian): Menampilkan Personalized Educational Answer dengan bahasa sederhana, poin singkat, sumber rujukan (Trusted Sources), serta Suggested Action / Related Information.
PNG

- 2

• Jika Membutuhkan Penanganan Medis (IF YES): Sistem menahan diagnosis klinis, hanya menampilkan Informasi umum & batasan, memunculkan peringatan Sarankan tenaga kesehatan, dan mengarahkan pengguna ke tindakan rujukan / kembali ke Dashboard.  
PNG

- 1

8. Next Action  
   JPG

[User Informed] → (Continue Chat / View Recommendation / Referral) → [Next Action Selected]  
JPG

Menyediakan tombol aksi lanjutan (Next Best Action): "Tanya Lagi" (Continue Chat? → IF YES kembali ke User Input Question), "Lihat Rekomendasi Menu" (navigasi ke Meal Planner), atau "Cari Tenaga Kesehatan".
PNG

- 1

6. Perancangan Skema Database (Supabase PostgreSQL & pgvector)
   Skema di bawah ini dirancang untuk menggantikan penyimpanan sementara src/services/fakeDb.js dan mock data di src/data/ (users.js, children.js, recipe.js, growthRecords.js, chatMessages.js) menjadi tabel relasional di Supabase PostgreSQL:  
   PNG
   SQL
   -- Aktifkan ekstensi UUID dan pgvector untuk Knowledge Base AI
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Tabel Profil Pengguna (Terhubung dengan auth.users di Supabase Auth)
CREATE TABLE public.profiles (
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
full_name TEXT NOT NULL,
role_type TEXT DEFAULT 'parent' CHECK (role_type IN ('parent', 'expecting_mother')),
avatar_url TEXT,
ai_context_consent BOOLEAN DEFAULT TRUE,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Profil Anak (Mendukung relasi 1 Orang Tua : Banyak Anak)
CREATE TABLE public.children (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
name TEXT NOT NULL,
nickname TEXT,
birth_date DATE NOT NULL,
gender TEXT NOT NULL CHECK (gender IN ('Laki-laki', 'Perempuan', 'male', 'female')),
initial_weight_kg NUMERIC(5,2) NOT NULL,
initial_height_cm NUMERIC(5,2) NOT NULL,
dietary_preferences TEXT[] DEFAULT '{}',
avoided_foods TEXT[] DEFAULT '{}',
photo_url TEXT,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Riwayat Pertumbuhan Anak (Flow 2 - Growth Monitoring)
CREATE TABLE public.growth_records (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
measurement_date DATE NOT NULL,
age_in_months NUMERIC(4,1) NOT NULL,
weight_kg NUMERIC(5,2) NOT NULL,
height_cm NUMERIC(5,2) NOT NULL,
z_score_waz NUMERIC(4,2), -- Weight-for-Age Z-score
z_score_haz NUMERIC(4,2), -- Height-for-Age Z-score
z_score_whz NUMERIC(4,2), -- Weight-for-Height Z-score
needs_attention BOOLEAN DEFAULT FALSE,
insight_status TEXT NOT NULL, -- 'normal_routine' atau 'early_awareness_referral'
insight_message TEXT NOT NULL,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Master Resep & Menu (Flow 1 - Plan Meal)
CREATE TABLE public.recipes (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
title TEXT NOT NULL,
slug TEXT UNIQUE NOT NULL,
image_url TEXT,
min_age_months INT NOT NULL,
max_age_months INT NOT NULL,
budget_tier TEXT CHECK (budget_tier IN ('rendah', 'sedang', 'tinggi')),
portion_size TEXT NOT NULL,
meal_frequency TEXT NOT NULL,
main_nutrients JSONB NOT NULL, -- { calories_kcal, protein_g, fat_g, carbs_g, iron_mg }
ingredients TEXT[] NOT NULL,
allergen_tags TEXT[] DEFAULT '{}',
instructions JSONB NOT NULL,
source_authority TEXT DEFAULT 'Kemenkes RI / WHO',
validated_by TEXT DEFAULT 'Ahli Gizi GarudaCode',
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Rencana Makan Tersimpan (Save Menu pada Flow 1)
CREATE TABLE public.saved_meal_plans (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
planned_date DATE DEFAULT CURRENT_DATE,
input_preferences JSONB, -- Menyimpan snapshot bahan tersedia, budget, pantangan
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabel Master Database Makanan (Flow 1 - Log Food)
CREATE TABLE public.foods (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name TEXT NOT NULL,
preparation_type TEXT, -- contoh: 'kukus', 'goreng', 'rebus', 'mentah'
serving_Options JSONB NOT NULL, -- [{ "label": "1 mangkuk kecil", "grams": 100 }, { "label": "1 sdm", "grams": 15 }]
calories_per_100g NUMERIC(6,2) NOT NULL,
protein_per_100g NUMERIC(5,2) NOT NULL,
fat_per_100g NUMERIC(5,2) NOT NULL,
carbs_per_100g NUMERIC(5,2) NOT NULL,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabel Catatan Makanan Harian (Food Log & Daily Nutrition Summary)
CREATE TABLE public.food_logs (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
food_id UUID REFERENCES public.foods(id) ON DELETE SET NULL,
custom_food_name TEXT,
log_date DATE NOT NULL DEFAULT CURRENT_DATE,
serving_label TEXT NOT NULL,
portion_grams NUMERIC(6,2) NOT NULL,
calculated_nutrition JSONB NOT NULL, -- Hasil kalkulasi nutrisi untuk porsi tersebut
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabel Makanan Favorit Pengguna (Mendukung UX Favorite Food)
CREATE TABLE public.favorite_foods (
user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
food_id UUID NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
created_at TIMESTAMPTZ DEFAULT NOW(),
PRIMARY KEY (user_id, food_id)
);

-- 9. Tabel Knowledge Base Vektor (Flow 3 - RAG Trusted Knowledge)
CREATE TABLE public.knowledge_documents (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
title TEXT NOT NULL,
content TEXT NOT NULL,
source_authority TEXT NOT NULL, -- 'WHO', 'UNICEF', 'Kemenkes RI'
validated_by TEXT, -- 'Ahli Gizi', 'Dokter Anak / Bidan'
age_group_tag TEXT,
embedding VECTOR(1536), -- Dimensi vektor disesuaikan dengan model embedding LLM
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Tabel Riwayat Percakapan AI Assistant (Flow 3)
CREATE TABLE public.chat_messages (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
child_id UUID REFERENCES public.children(id) ON DELETE SET NULL,
sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
message_text TEXT NOT NULL,
requires_medical_referral BOOLEAN DEFAULT FALSE,
trusted_sources JSONB DEFAULT '[]',
suggested_actions JSONB DEFAULT '[]',
created_at TIMESTAMPTZ DEFAULT NOW()
); 7. Spesifikasi Kontrak Layanan (src/services/) & Serverless Endpoints
Sebagai panduan migrasi dari src/services/fakeDb.js ke backend produksi, berikut adalah kontrak fungsi yang harus diimplementasikan oleh Backend Developer:
File Service di Frontend Fungsi Utama yang Diimplementasikan ke Supabase Metode & Target Backend
src/services/authService.js
• register(email, password, fullName)

• login(email, password)

• logout()

• changePassword(newPassword)

Menggunakan supabase.auth.signUp(), signInWithPassword(), signOut(), dan updateUser() pada Supabase Auth.  
PNG

src/services/childService.js
• getChildrenByUser()

• createChildProfile(payload)

• updateChildProfile(childId, payload)

• uploadChildPhoto(file)

Operasi CRUD ke tabel public.children, trigger insert otomatis ke public.growth_records untuk BB/TB awal, dan unggah foto ke Supabase Storage.
PNG

- 2

src/services/recipeService.js
• generateMenuRecommendation(childId, preferences, excludedIds)

• getRecipeDetail(recipeId)

• saveMealPlan(childId, recipeId, preferences)

• searchFood(query) & logFoodPortion(payload)

Query berfilter aturan (Rule-Based) pada tabel public.recipes dan public.foods, serta fungsi kalkulasi nutrisi dan agregasi harian di public.food_logs.
PNG

- 1

src/services/growthService.js
• getGrowthHistory(childId)

• addMeasurement(childId, { weight, height, date })

Menyimpan data ke public.growth_records dan mengeksekusi fungsi evaluasi pola pertumbuhan untuk mengembalikan flag needs_attention (IF YES / IF NO) beserta pesan insight.  
PNG

- 1

src/services/assistantService.js
• getChatHistory(childId)

• sendQuestion(childId, questionText)

• getSuggestedPrompts(childAgeMonths)

Memanggil Supabase Edge Function POST /functions/v1/ai-nutrition-assistant agar proses context loading, pencarian vektor pgvector, pemanggilan LLM API, dan medical safety check berjalan aman di sisi server.  
PNG

- 2

Contoh Kontrak Payload JSON: POST /functions/v1/ai-nutrition-assistant
Request Body:
JSON
{
"childId": "c1a2b3d4-e5f6-7890-abcd-1234567890ab",
"question": "Anak saya umur 9 bulan susah makan sayur, menu penggantinya apa ya?"
}
Response Body (Status 200 OK):
JSON
{
"status": "success",
"fsmState": "Answer Displayed",
"contextUsed": {
"childName": "Budi",
"ageMonths": 9,
"avoidedFoods": ["Udang"]
},
"safetyCheck": {
"requiresMedicalDiagnosis": false,
"redirectToDashboard": false
},
"answer": "Pada usia 9 bulan, tekstur MPASI dapat berupa makanan cincang halus (minced). Jika anak menolak sayur tertentu, Ibu dapat mengombinasikan sayuran berwarna cerah seperti wortel atau labu kuning ke dalam bubur daging sapi...",
"trustedSources": [
{
"authority": "Kemenkes RI & WHO",
"title": "Panduan Pemberian Makan Bayi dan Anak (PMBA / IYCF)"
}
],
"nextBestActions": [
{ "type": "continue_chat", "label": "Tanya Lagi" },
{ "type": "view_recommendation", "label": "Lihat Rekomendasi Menu", "targetRoute": "/nutrition/recipes" }
]
} 8. Keamanan Sistem, Validasi & Penanganan Edge Cases
Row Level Security (RLS) pada Supabase PostgreSQL:
Seluruh tabel (profiles, children, growth_records, saved_meal_plans, food_logs, chat_messages) wajib mengaktifkan kebijakan RLS (auth.uid() = user_id) sehingga orang tua hanya dapat membaca dan memodifikasi data profil anaknya sendiri.  
PNG
Validasi Batas Wajar Input Antropometri (onboardingValidators.js & Database Check):
Untuk mengatasi rasa takut salah input saat onboarding maupun saat Add Measurement, sistem menerapkan validasi nilai minimum dan maksimum yang masuk akal untuk berat badan (misal: 1,5 kg – 40 kg) dan tinggi/panjang badan (misal: 35 cm – 150 cm) serta menolak tanggal pengukuran di masa depan.  
PNG

- 1
  Pencegahan Infinite Loop pada Pencarian Makanan & Rekomendasi Alternatif:
  Jika pencarian makanan pada Search Food tidak menemukan hasil (Food Found? → IF NO), sistem menampilkan komponen EmptyState.jsx yang mengizinkan pengguna memasukkan estimasi makanan secara manual agar pengguna tidak terjebak di layar pencarian.  
  PNG
  Saat pengguna menekan IF NO pada Menu sesuai? (Generate Menu Recommendation Alternatif), parameter excludedRecipeIds dikirimkan ke backend agar sistem mengambil alternatif menu berikutnya dan mereset daftar jika seluruh menu yang memenuhi kriteria sudah ditampilkan.  
  PNG
  Hard Medical Safety Guardrail pada AI Assistant:
  Apabila klasifikasi Safety Check mendeteksi pertanyaan terkait gejala klinis gawat darurat, dosis obat, atau permintaan diagnosis penyakit (Pertanyaan membutuhkan diagnosis / penanganan medis? → IF YES), sistem wajib menghentikan saran diet mandiri, hanya memberikan informasi umum & batasan aplikasi, serta memunculkan peringatan rujukan ke Posyandu, Puskesmas, atau Tenaga Kesehatan.  
  PNG
- 2
