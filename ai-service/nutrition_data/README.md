# Data Nutrisi Nutriva (foods & recipes)

Seed tabel `foods` (1.063 bahan) dan `recipes` (30 resep) untuk fitur Plan Meal, Log Food, dan rekomendasi menu. Setiap angka bisa ditelusuri ke sumbernya. Laporan QA lengkap ada di `REPORT.md`, dibuat ulang setiap build.

**Status: belum divalidasi ahli gizi.** Sesuai PRD (peran *Researcher / Health Expert*), ahli gizi wajib mereview sebelum rilis publik. Setiap resep menyimpan `validated_by = 'Belum divalidasi ahli gizi Nutriva'`; ubah kolom ini hanya setelah review benar-benar dilakukan.

## Sumber

| Data | Sumber | Catatan |
|---|---|---|
| Komposisi gizi (utama) | Kemenkes RI (2018). *Tabel Komposisi Pangan Indonesia 2017*. ISBN 978-602-416-407-2 | 1.146 bahan diekstrak dari PDF resmi ke `sources/tkpi2017.csv` (`tools/extract_tkpi.py`, sha256 PDF tercatat di header CSV). |
| Komposisi gizi (pelengkap) | USDA National Nutrient Database for Standard Reference, Release 28 (2015), domain publik | Dipakai hanya bila bahan tidak ada di TKPI atau baris TKPI gagal uji konsistensi. Snapshot di `sources/sr28_subset.csv` + sha256 `ABBREV.txt`. |
| 19 resep balita | Kemenkes RI (2023). *Makanan Lokal Bayi, Balita dan Ibu Hamil: Buku Resep* | Semua resep "untuk 3 porsi"; energi/protein/lemak per porsi tercetak. |
| 11 resep balita | Kemenkes RI (2022). *Buku Resep Makanan Lokal Balita dan Ibu Hamil* | Hanya resep yang tidak ada padanannya di edisi 2023. |
| Porsi, frekuensi, tekstur per usia | Kedua buku resep (K2023 hlm. 7, 26, 34; K2022 hlm. 3) | 6–8, 9–11, 12–23, 24–59 bulan. |
| Ukuran rumah tangga (sdm, butir, centong) | Padanan gram yang tercetak di kedua buku resep | Ukuran yang tidak tercetak tidak dikarang; bahan itu hanya punya opsi "100 gram". |

### Ekstraksi TKPI dan verifikasinya

- Kolom ditentukan dari posisi token satuan di header setiap halaman (21 kolom gizi + BDD). Sel kosong tetap kosong, tidak diisi 0. Angka yang terbungkus dua baris digabung.
- Hasil: 1.146 baris dengan 1.146 kode unik, sama dengan jumlah bahan TKPI 2017.
- Verifikasi visual baris demi baris terhadap gambar halaman PDF (AR001–AR017, AP021–AP024, NR016–NR018, GR050, DR008, HR011, CP061) cocok 100%, termasuk sel kosong.
- Uji internal: 96,7% baris punya jumlah air + protein + lemak + KH + abu = 100 ± 3 g. Baris yang menyimpang sudah dicek ke gambar dan memang tercetak begitu di sumber (misalnya Mi kering, KH 6,3 g), jadi bukan kesalahan ekstraksi.

### Lampiran TKPI (Bab 5–7) juga diekstrak

Semua tabel di halaman PDF 16–134 sudah menjadi CSV. Halaman 135 kosong.

| Bab (hlm. PDF) | File | Baris | Isi |
|---|---|---|---|
| 4 Tabel komposisi (16–70) | `sources/tkpi2017.csv` | 1.146 | 22 zat gizi + BDD per 100 g |
| 5 Indeks (71–99) | `sources/tkpi2017_index.csv` | 623 | nama Latin (spesies, genus, famili) dan nama Inggris; semua 558 bahan mentah tercakup |
| 6 Glosari (100–115) | `sources/tkpi2017_glossary.csv` | 238 | nama daerah/lokal dan deskripsi masakan |
| 7 Kode (116–134) | `sources/tkpi2017_code_map.csv` | 1.149 | kode lama TKPI 2009 → kode baru, nama, kelompok, jenis |

Extractor: `tools/extract_tkpi_appendix.py`. Tabel di bab ini bergaris, jadi dibaca dengan `pdfplumber.extract_tables()`. Dua baris di Bab 7 (DR077, FP036) selnya tergabung di PDF, sehingga diambil dari lapisan teks.

Kelengkapan dicek dengan dua cara:
- Jumlah baris tiap CSV sama dengan jumlah kode unik yang muncul di teks halaman bab tersebut.
- Beberapa baris dicocokkan langsung dengan gambar halaman.

`foods.scientific_name` dan `foods.name_en` diisi dari Bab 5. Indeks ini juga mengonfirmasi bahwa "Bayam" di TKPI adalah *Amaranthus tricolor* dan "Ikan kembung" adalah *Rastrelliger kanagurta*.

**Inkonsistensi yang tercetak di buku TKPI 2017.** Semuanya dipertahankan apa adanya di CSV, tidak "dibetulkan":

- Bab 7 menukar HR010 dan HR011 (puyuh ↔ penyu). Bab 4 dan Bab 5 sepakat bahwa HR011 = telur burung puyuh. Nutriva mengikuti Bab 4.
- Bab 7 memuat HP008 "Kalio telur" dan HP007 "Gulai telur ikan", sedangkan tabel komposisi hanya sampai HP007 = "Kalio telur". Jadi "Gulai telur ikan" tidak punya data gizi.
- Baris IDA001→AR001 dan IDA002→AR002 tercetak dua kali di hlm. 116.
- 7 nama di Bab 5 dan 23 nama di Bab 7 berbeda ejaan dari Bab 4 (mis. "Ikan bilih" vs "Ikan bili").
- Ada salah ketik nama Latin/Inggris, misalnya "Cotumix", "fress", "Rastrellliger".
- Ada isian yang tertukar atau keliru: Kentang "Yam, fresh"; Margarin "Butter" dan Mentega "Margarine"; bawang merah *Allium fistulosum*.

### Aturan pemilihan sumber per bahan

1. TKPI dipakai bila ada padanan bahan yang sama **dan** lolos uji konsistensi: |E − (4P + 9L + 4KH)|/E ≤ 20% serta jumlah proksimat 100 ± 3 g. Dari 1.146 baris, 95 ditolak; daftarnya ada di `REPORT.md`.
2. Bila tidak lolos, dipakai USDA SR28 dan alasannya dicatat di `data_notes`. Contoh: pepaya, kangkung, tauge, buncis, jahe, mi kering.
3. Pengecualian yang disengaja:
   - **Terigu** memakai USDA *enriched*, karena data TKPI (1990) mendahului fortifikasi besi wajib (SNI).
   - **Daging ayam tanpa kulit** memakai USDA, karena TKPI hanya memuat ayam dengan kulit (lemak 25 g/100 g).
4. **Penjaga besi:** bila besi TKPI dan USDA berbeda lebih dari 5 kali, dipakai USDA dan dicatat. Contoh: susu sapi 1,7 vs 0,03 mg, udang 8,0 vs 0,52 mg. Nilai TKPI aslinya tetap tersimpan di CSV sumber untuk diverifikasi ahli gizi.
5. Hasilnya, dari 89 bahan kurasi, 71 memakai TKPI dan 18 memakai USDA. Proksi tinggal 2 (lele dan tenggiri, karena tidak ada di TKPI maupun USDA).
6. Seluruh baris TKPI lain yang lolos uji (974 bahan) ikut di-seed dengan kode `TKPI_<kode>`, supaya fitur pencarian makanan di Log Food punya database lokal yang lengkap.

Validasi silang: setelah memakai TKPI, selisih median energi estimasi-dari-bahan terhadap angka tercetak di buku Kemenkes turun dari 21% (USDA saja) ke 17%, dan ke 13% untuk resep dengan cakupan bahan ≥ 95%. Ini konsisten dengan dugaan bahwa buku resep Kemenkes menghitung gizinya dengan basis data lokal.

## Cara angka resep diturunkan

- **Energi, protein, dan lemak** memakai angka tercetak di buku Kemenkes, setelah lolos uji plausibilitas Atwater (4P + 9L ≤ E, toleransi 5%).
  - Dua resep gagal dan diganti estimasi dari bahan: *Bubur Sup Daging Kacang Merah* (protein tercetak 45,1 g untuk 98 kkal) dan *Nasi Bakar Ikan Tongkol* (nilainya identik dengan resep lain).
- **Karbohidrat** tidak tercetak di buku, jadi diturunkan dengan rumus (E − 4P − 9L)/4.
- **Zat besi** diestimasi dari bahan bergramasi (gram × komposisi SR28 ÷ jumlah porsi). Nilainya batas bawah, karena bumbu, kaldu, dan minyak goreng tanpa gram tidak ikut dihitung. Besi tidak ditampilkan (`null`) bila kurang dari 80% berat bahan punya data komposisi.
- **Cek porsi:** dua resep (*Mie Kukus Telur Puyuh* dan *Nugget Tempe Ayam Sayuran*) punya energi 1/3 resep yang jauh di atas angka tercetak. Kemungkinan porsi yang dimaksud buku lebih kecil. Kedua resep ditandai di `data_notes` agar direview ahli gizi.
- **Alergen** dideteksi otomatis dari bahan: telur, susu, ikan, udang/krustasea, moluska, kedelai, gandum, kacang tanah, dan wijen. Tetap perlu dicek manual, misalnya isi bumbu instan dan kemiri.
- **`budget_tier`** adalah heuristik transparan, bukan perhitungan harga:
  - `premium` bila ada daging sapi, udang, tenggiri, tuna, atau keju;
  - `sedang` bila sumber hewaninya ayam;
  - `ekonomis` untuk sisanya (telur, ikan lokal, tempe, tahu).
  - Urutan ini konsisten dengan harga PIHPS BI 26 Okt 2026: sapi Rp128–142 rb/kg, ayam Rp50,1 rb/kg, telur Rp33,5 rb/kg. Harga ikan dan udang tidak tersedia di data itu.

## Struktur & pemakaian

```
nutrition_data/
  foods_catalog.csv      89 bahan kurasi: kode, nama, kategori, kode TKPI, NDB SR28, match_quality, ukuran rumah tangga, catatan
  sources/tkpi2017.csv   1.146 baris TKPI 2017 hasil ekstraksi (+ kolom QA proximate_sum, atwater_dev_pct)
  tools/extract_tkpi.py  ekstraktor PDF TKPI -> CSV
  recipes_kemenkes.py    30 resep: transkripsi bahan (gram), langkah, nilai tercetak, halaman sumber
  sources/sr28_subset.csv  snapshot nilai SR28 yang dipakai (+ checksum file asli)
  build_seed.py          -> ../../supabase/seed/nutrition_seed.sql dan REPORT.md
```

```bash
cd ai-service/nutrition_data && python build_seed.py
# Supabase SQL Editor: jalankan supabase/migrations/20261103b_nutrition_data.sql, lalu supabase/seed/nutrition_seed.sql
```

Seed bersifat idempoten (upsert berdasarkan `foods.code` dan `recipes.slug`) dan sudah diuji dua kali berturut-turut di PostgreSQL 16 di atas data dummy lama. Test `tests/test_nutrition_data.py` menjaga integritas katalog, mendeteksi dua salah cetak sumber, memeriksa alergen, dan memastikan SQL yang di-commit sinkron dengan data.

## Batasan

- Sebagian besar nilai TKPI berasal dari data lama (1964–2001; lihat kolom `sumber`). Nilai yang bertentangan antarsumber sudah ditandai, tetapi tetap perlu verifikasi ahli gizi.
- Transkripsi buku dilakukan dari teks PDF, termasuk dua kali pembacaan silang untuk nilai gizi. Ahli gizi tetap perlu mencocokkannya dengan buku cetak, terutama resep yang punya `data_notes`.
- `image_url` dibiarkan kosong karena tidak ada foto berlisensi jelas; UI memakai gambar default.
- Resep untuk 24–59 bulan memakai porsi "1 porsi resep", karena buku tidak memberi ukuran mangkok untuk usia ini.
