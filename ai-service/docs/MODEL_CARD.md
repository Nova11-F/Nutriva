# Model Card — nutriva-stunting-early-awareness v1.1.0

## Tujuan & batas penggunaan
Memberi **profil risiko** (Low / Medium / High) status stunting anak 0–59 bulan dari faktor non-antropometri, untuk mendorong orang tua melakukan pengukuran dan konsultasi lebih awal. Model **bukan alat diagnosis**. Bila tinggi badan tersedia, keputusan memakai rumus WHO HAZ, bukan model ini.

## Data
Kaggle "Childhood Stunting Risk Factors" (victoriahayes), n = 2.523, 20 kolom, tanpa duplikat, missing 0,5–2,8% per kolom, 2 baris anomali biologis (di-flag, dipertahankan). Distribusi label: Low 65,0%, Medium 18,4%, High 16,6%. Provenance lapangan tidak terdokumentasi oleh pengunggah; laporan Micro sudah mencatat indikasi data sintetis.

## Objective, arsitektur, optimasi
Klasifikasi multikelas. Pipeline: feature engineering (9 fitur turunan: BBLR, panjang lahir < 48 cm, ANC < 4, MP-ASI dini/telat, ibu < 150 cm, ibu < 20 th, skor WASH, kelompok usia) → imputasi median/modus → ordinal encoding (pendidikan ibu, ekonomi, imunisasi) + one-hot → Random Forest (469 pohon, max_depth 4, max_features log2, min_samples_leaf 4, class_weight balanced_subsample). Loss: impurity Gini per pohon; ketidakseimbangan kelas ditangani dengan pembobotan kelas (bukan oversampling, agar tidak ada sampel sintetis yang bocor antar fold).

## Protokol evaluasi
Stratified hold-out 80/20 (seed 42). Seleksi algoritma dan tuning hanya memakai 5-fold stratified CV di data train; test set dipakai sekali. Metrik utama macro-F1; pendamping balanced accuracy, recall High, ROC-AUC. CI 95% via bootstrap 1.000×.

| Metrik (test, n = 505) | Nilai |
|---|---|
| Accuracy | 0,685 |
| Balanced accuracy | 0,598 |
| Macro-F1 | 0,590 (95% CI 0,539–0,636) |
| F1 Low / Medium / High | 0,808 / 0,365 / 0,598 |
| Recall High | 0,619 |
| ROC-AUC OvR macro | 0,800 |
| ROC-AUC stunted vs normal | 0,826 |

CV (train): macro-F1 0,597 ± 0,010. Selisih CV vs test kecil, jadi tidak ada indikasi overfitting berat.

## Keterbatasan & risiko
1. Label adalah status stunting **saat ini** (kategori HAZ), bukan risiko di masa depan; data cross-sectional, sehingga output adalah asosiasi, bukan sebab-akibat atau prognosis.
2. Fitur terpenting adalah usia anak (permutation importance 0,117, jauh di atas fitur lain ≤ 0,019). Pola ini bisa artefak data sintetis dan perlu divalidasi dengan data riil (mis. SSGI/e-PPGBM, Riskesdas/SKI).
3. Kelas Medium sulit dipisahkan (F1 0,365) karena berada di antara dua kelas lain pada skala HAZ yang kontinu.
4. Recall High 0,62 berarti sekitar 4 dari 10 anak kategori High tidak terdeteksi oleh model ini saja. Karena itu UI wajib mendorong pengukuran tinggi badan, yang dinilai dengan rumus WHO tanpa error model.
5. Generalisasi ke populasi Indonesia belum teruji.

## Monitoring (rencana Sprint 3)
Log distribusi input & output per minggu; alarm jika proporsi kelas prediksi bergeser > 10 poin persentase atau PSI fitur > 0,2; evaluasi ulang ketika tersedia ≥ 300 pasangan (faktor risiko, pengukuran WHO) dari pengguna; versi model semantik (MAJOR.MINOR.PATCH) di `model_metadata.json`.

## Perubahan v1.1.0 (2026-11-03, dipakai di produksi)
Sumber angka: `reports/improvement_v1_1.json` (dihasilkan `python src/improve.py`, seed 42, split train/test sama dengan v1.0).

**Balancing** (5-fold CV pada train, resampling di dalam fold): tanpa pembobotan macro-F1 0,540; `class_weight=balanced_subsample` 0,597 ± 0,010 (dipilih); RandomOverSampler 0,589; SMOTENC 0,586. Oversampling sintetis tidak memberi keuntungan dibanding pembobotan kelas, sehingga tidak dipakai.

**Kalibrasi** (test set): log-loss 0,833 → 0,680 dan Brier (stunted vs tidak) 0,211 → 0,160 setelah kalibrasi isotonic (CalibratedClassifierCV, cv=5). ROC-AUC stunted relatif tetap (0,826 → 0,827); macro-F1 argmax turun 0,590 → 0,567, karena keputusan alert tidak lagi memakai argmax melainkan ambang.

**Ambang early-awareness**: alert bila P(Medium)+P(High) ≥ 0,31, dipilih dari prediksi out-of-fold train agar recall stunted ≥ 0,80. Pada test: recall 0,797, presisi 0,592, alert rate 47,1% (prevalensi stunted 35,1%). Artinya hampir separuh anak akan mendapat saran "perlu perhatian"; ini disengaja untuk skrining, tetapi menimbulkan beban false positive yang harus dikomunikasikan sebagai ajakan mengukur, bukan vonis.

**Uji konsistensi literatur**: arah efek 9 faktor pada model (BBLR, ANC < 4, laki-laki, diare berulang, ibu pendek, sanitasi tidak layak, perdesaan, ekonomi rendah, pendidikan ibu rendah) cocok dengan studi Indonesia (Riskesdas 2013, Nutrients 2019; IFLS, PLOS ONE 2021). Ini hanya cek arah, bukan validasi besar efek; dataset tetap berindikasi sintetis.

**Aturan produksi**: bila ada pengukuran ≤ 90 hari, status ditentukan rumus WHO (deterministik) dan model hanya pelengkap. Tanpa pengukuran, model hanya boleh menghasilkan `info` atau `attention` (tidak pernah `refer`) dan selalu menganjurkan pengukuran di Posyandu.

**Latensi inferensi**: median ~260 ms, p95 ~310 ms per request di CPU workspace (5 model RF hasil kalibrasi cv=5). Bila perlu lebih cepat, latih ulang dengan `cv="prefit"` pada data kalibrasi terpisah.
