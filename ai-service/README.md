---
title: Nutriva AI Service
emoji: 🥗
colorFrom: green
colorTo: yellow
sdk: docker
app_port: 7860
pinned: false
---

# Nutriva AI Service

Backend AI untuk web Nutriva: z-score WHO 2006, model *early-awareness* risiko stunting (v1.1), dan AI Nutrition Assistant (RAG + guardrail medis). Dipanggil oleh frontend React lewat `VITE_AI_API_URL`; setiap request memakai access token Supabase user yang login. **Bukan alat diagnosis.**

```
Browser (React, Vercel) ──Bearer <supabase access token>──▶ Nutriva AI Service (FastAPI, HF Space)
        │                                                     ├─ verifikasi token → Supabase Auth /auth/v1/user
        │                                                     ├─ WHO LMS z-score (deterministik)
        │                                                     ├─ Random Forest v1.1 (terkalibrasi)
        │                                                     └─ RAG (knowledge_base/) → LLM provider (secret di server)
        └──supabase-js (RLS)──▶ Supabase Postgres: children.risk_factors, growth_records, risk_assessments, chat_messages
```

## Endpoint

| Method | Path | Auth | Fungsi |
|---|---|---|---|
| GET | `/health` | – | liveness + versi model |
| GET | `/v1/model-info` | – | metadata model (tanpa secret/env) |
| POST | `/v1/growth/zscores` | Bearer | HAZ/WAZ/WHZ + kategori Permenkes 2/2020 |
| POST | `/v1/growth/assess` | Bearer | WHO + profil risiko ML + faktor yang bisa diperbaiki |
| POST | `/v1/assistant/chat` | Bearer | jawaban asisten: `answer`, `actions`, `source_details`, `refer_to_professional`, `route`, `degraded` |

Skema lengkap ada di `app/schemas.py` (Pydantic, `extra="forbid"`: field tak dikenal ditolak 422). OpenAPI (`/docs`) aktif di development dan mati di production.

## Menjalankan lokal

```bash
cd ai-service
python -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env                                    # isi SUPABASE_URL, SUPABASE_ANON_KEY, LLM_*
uvicorn app.main:app --reload --port 8000
python -m pytest -q                                     # 55 test, tanpa API key (LLM mock)
```

Untuk mencoba tanpa Supabase: `AUTH_MODE=disabled` (ditolak otomatis bila `APP_ENV=production`). Untuk mencoba tanpa LLM: `LLM_PROVIDER=mock`.

## Deploy ke Hugging Face Spaces

1. Buat Space baru: SDK **Docker**, template *Blank*, hardware CPU basic.
2. Push isi folder `ai-service/` sebagai root repo Space, misalnya dari root repo Nutriva:
   `git subtree push --prefix ai-service https://huggingface.co/spaces/<user>/nutriva-ai main`
   (atau salin isi folder ke clone repo Space lalu push). Header YAML di README ini dibaca HF untuk `sdk: docker` dan `app_port: 7860`.
3. Settings → *Variables and secrets*:
   - Variables: `APP_ENV=production`, `ALLOWED_ORIGINS=https://<domain-frontend>`, `SUPABASE_URL`, `LLM_PROVIDER`, `LLM_BASE_URL`, `LLM_MODEL`, `LLM_JSON_MODE`, `LLM_MAX_TOKENS`, `LLM_TIMEOUT_S`.
   - Secrets: `LLM_API_KEY`, `SUPABASE_ANON_KEY` (anon key sebenarnya publik, tetapi disimpan sebagai secret agar tidak tercetak di log build).
4. Tunggu build selesai, cek `https://<user>-nutriva-ai.hf.space/health`.
5. Di frontend (Vercel/Netlify): set `VITE_AI_API_URL=https://<user>-nutriva-ai.hf.space`, lalu redeploy.

Startup gagal dengan pesan jelas bila konfigurasi production tidak aman (auth dimatikan, CORS `*`, Supabase kosong, debug aktif).

## Keamanan & privasi

- **Tidak ada API key LLM di frontend.** Versi sebelumnya memanggil Gemini langsung dari browser dengan `VITE_GEMINI_API_KEY`, sehingga key ikut ter-bundle ke JavaScript publik. Key Gemini yang pernah dipakai di build mana pun **wajib di-rotate** di Google AI Studio.
- Token Supabase diverifikasi ke `/auth/v1/user` dan di-cache 60 detik (hash SHA-256, bukan token mentah). Service tidak butuh `service_role` key dan tidak menulis ke database; penyimpanan dilakukan frontend di bawah RLS.
- Rate limit per user (default chat 10/menit, assess 60/menit), batas 4 panggilan LLM bersamaan, batas body 32 KB, CORS allowlist.
- Log berformat JSON tanpa isi pertanyaan, nama anak, token, atau angka antropometri; user dicatat sebagai hash 12 karakter. Header `X-Request-ID` dikembalikan untuk pelacakan.
- Konteks anak hanya dikirim ke LLM bila `profiles.ai_context_consent` bernilai true.

## Model & data

- Model: `models/nutriva_stunting_risk_v1_1.joblib` (Random Forest + `class_weight`, kalibrasi isotonic, ambang alert 0,31). Detail, metrik, dan keterbatasan: `docs/MODEL_CARD.md`, `reports/improvement_v1_1.json`.
- `scikit-learn` dan `imbalanced-learn` dipin ke versi saat training karena model disimpan dengan pickle; mengganti versi wajib melatih ulang (`python src/data_prep.py && python src/train.py && python src/improve.py`).
- Data training: Kaggle "Childhood Stunting Risk Factors" (n = 2.523), berindikasi sintetis; label identik dengan kategori HAZ WHO sehingga tinggi/berat tidak dipakai sebagai fitur. Model hanya untuk peringatan dini, bukan diagnosis.
- Knowledge base: `knowledge_base/*.md`. Dokumen `SOURCE_SUMMARY` sudah dicocokkan dengan sumber resmi (URL di front matter), tetapi seluruh KB **belum direviu ahli gizi**; ini syarat sebelum rilis publik.
- Uji silang z-score: `tests/fixtures/who_golden.json` (608 kasus) dipakai test Python dan `npm run test:who` di frontend agar port JavaScript identik.

## Batasan yang diketahui

- Rate limit dan cache in-memory hanya benar untuk 1 replika; untuk >1 replika ganti ke Redis.
- Space gratis dapat tidur bila lama tidak dipakai, sehingga request pertama lambat (cold start). Frontend menampilkan pesan "layanan baru dinyalakan" untuk HTTP 503/timeout.
- Latensi LLM bergantung provider; saat uji Sprint 2 dengan model gratis OpenRouter, median ±18 detik.
- Retrieval memakai TF-IDF lokal (tabel `knowledge_documents`/pgvector di Supabase belum dipakai).
