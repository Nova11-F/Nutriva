# Data Nutrisi Nutriva (foods & recipes)

Seed tabel `foods` dan `recipes` untuk fitur Plan Meal, Log Food, dan rekomendasi menu. Setiap angka bisa ditelusuri ke sumbernya. Laporan QA lengkap ada di `REPORT.md`, dibuat ulang setiap build.

**Status: belum divalidasi ahli gizi.** Sesuai PRD (peran *Researcher / Health Expert*), ahli gizi wajib mereview sebelum rilis publik. Setiap resep menyimpan `validated_by = 'Belum divalidasi ahli gizi Nutriva'`; ubah kolom ini hanya setelah review benar-benar dilakukan.

## Sumber

| Data | Sumber | Catatan |
|---|---|---|
| Komposisi gizi 79 bahan (per 100 g) | USDA National Nutrient Database for Standard Reference, Release 28 (2015), domain publik | Snapshot baris yang dipakai ada di `sources/sr28_subset.csv`, lengkap dengan sha256 file `ABBREV.txt` asli (8.789 bahan). Integritas dicek dengan nilai telur ayam mentah (NDB 01123: 143 kkal; 12,56 g protein; 9,51 g lemak; 1,75 mg besi). |
| 19 resep balita | Kemenkes RI (2023). *Makanan Lokal Bayi, Balita dan Ibu Hamil: Buku Resep*. Jakarta: Kementerian Kesehatan RI | Semua resep untuk 3 porsi. Nilai energi, protein, dan lemak per porsi dicetak di buku. |
| 11 resep balita | Kemenkes RI, Ditjen Kesmas, Direktorat Gizi dan KIA (2022). *Buku Resep Makanan Lokal Balita dan Ibu Hamil*. Jakarta | Hanya resep yang tidak ada padanannya di edisi 2023. |
| Porsi, frekuensi, dan tekstur per usia | Kedua buku di atas (K2023 hlm. 7, 26, 34; K2022 hlm. 3) | 6–8, 9–11, 12–23, dan 24–59 bulan. |
| Ukuran rumah tangga (sdm, butir, centong) | Padanan gram yang tercetak di kedua buku resep | Ukuran yang tidak tercetak tidak dikarang; bahan itu hanya punya opsi "100 gram". |

Tautan salinan PDF buku ada di `recipes_kemenkes.py` (`SOURCES`).

## Kenapa USDA, bukan TKPI?

Untuk Indonesia, acuan utama komposisi gizi seharusnya **Tabel Komposisi Pangan Indonesia (TKPI)** Kemenkes. Situs dan PDF TKPI (panganku.org dan Google Drive Kemenkes) tidak bisa diakses dari lingkungan build ini, jadi angkanya tidak bisa diverifikasi. Mirror pihak ketiga juga sengaja tidak dipakai. Sebagai gantinya dipakai SR28 yang resmi dan bisa diverifikasi, dengan mitigasi berikut:

- Setiap bahan diberi `match_quality`: `exact` (bahan dan kondisinya sama), `close` (varietas atau olahan sedikit berbeda), atau `proxy` (spesies atau produk lokal tidak ada di SR28). Ada 7 proxy: ikan kembung, lele, mujair, tongkol, tenggiri, tahu, dan seledri.
- Bayam dipetakan ke *Amaranthus* (amaranth leaves), bukan *Spinacia*. Kangkung dipetakan ke *Ipomoea aquatica* (swamp cabbage). Beras dipakai versi tanpa fortifikasi. Terigu dipakai versi *enriched* karena terigu di Indonesia wajib difortifikasi besi.
- **Rekomendasi:** unduh TKPI dari panganku.org, tambahkan kolom `tkpi_code` di `foods_catalog.csv`, lalu prioritaskan angka TKPI di `build_seed.py`. Mulailah dari 7 bahan `proxy`.

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
  foods_catalog.csv      79 bahan: kode, nama, kategori, NDB SR28, match_quality, ukuran rumah tangga, catatan
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

- Komposisi gizi bahan lokal belum memakai TKPI (lihat di atas).
- Transkripsi buku dilakukan dari teks PDF, termasuk dua kali pembacaan silang untuk nilai gizi. Ahli gizi tetap perlu mencocokkannya dengan buku cetak, terutama resep yang punya `data_notes`.
- `image_url` dibiarkan kosong karena tidak ada foto berlisensi jelas; UI memakai gambar default.
- Resep untuk 24–59 bulan memakai porsi "1 porsi resep", karena buku tidak memberi ukuran mangkok untuk usia ini.
