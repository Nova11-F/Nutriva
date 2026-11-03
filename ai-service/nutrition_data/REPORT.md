# Laporan QA seed nutrisi Nutriva

Dihasilkan otomatis oleh `build_seed.py`. Angka di bawah dihitung ulang setiap build.

## Foods

- 79 bahan. Kecocokan dengan SR28: exact 48, close 24, proxy 7.
- `proxy` = spesies/produk lokal tidak ada di SR28 sehingga dipakai padanan terdekat; ganti dengan TKPI bila tersedia.
- Cek konsistensi Atwater per bahan (|E - (4P + 9L + 4KH)| / E):

| kode | E (kkal) | 4P+9L+4KH | selisih % |
|---|---|---|---|
| JAGUNG_MANIS | 86 | 100 | 16 |
| BAYAM | 23 | 29 | 26 |
| KANGKUNG | 19 | 25 | 30 |
| LABU_KUNING | 26 | 31 | 19 |
| LABU_SIAM | 19 | 22 | 18 |
| TOMAT | 18 | 21 | 16 |
| BROKOLI | 34 | 41 | 21 |
| BUNCIS | 31 | 37 | 20 |
| SAWI_HIJAU | 27 | 34 | 26 |
| PAKCOY | 13 | 17 | 27 |
| TAUGE | 30 | 38 | 25 |
| DAUN_KELOR | 64 | 83 | 30 |
| TIMUN | 15 | 18 | 21 |
| TERONG | 25 | 29 | 16 |
| DAUN_BAWANG | 32 | 38 | 20 |
| JERUK_NIPIS | 30 | 47 | 56 |

Hanya bahan dengan selisih > 15% yang ditampilkan. Selisih wajar terjadi karena SR28 memakai faktor Atwater spesifik per bahan (bukan 4/9/4) dan karbohidrat 'by difference' termasuk serat.

## Recipes

- 30 resep; nilai tercetak plausibel: 28; diganti estimasi bahan: 2.
- Energi estimasi-dari-bahan vs tercetak (resep plausibel): median selisih absolut 21% (n = 28). Selisih besar terutama karena bahan tanpa gram (minyak goreng, kaldu, bumbu) tidak ikut estimasi, sehingga estimasi cenderung lebih rendah.

| resep | sumber | E/P/L tercetak | E/P/L estimasi | plausibel | cakupan gram (%) | cek porsi |
|---|---|---|---|---|---|---|
| bubur-singkong-isi-ikan-ayam-saus-jeruk | K2023 hlm.11 | 91/3.1/3.5 | 86/2.9/2.3 | ya | 100.0 |  |
| bubur-soto-ayam-santan | K2023 hlm.12 | 96/4.6/4.1 | 109/5.2/5.1 | ya | 100.0 |  |
| bubur-sup-ayam-kacang-merah | K2023 hlm.13 | 98/45.1/3.6 | 83/4.9/2.1 | TIDAK | 100.0 |  |
| bubur-kanju-rumbi-ayam-udang | K2023 hlm.14 | 87/5.1/2.9 | 69/4.5/1.7 | ya | 100.0 |  |
| puding-kentang-ayam-telur | K2023 hlm.15 | 95/4/3.6 | 104/4.0/5.5 | ya | 100.0 |  |
| nasi-tim-ikan-tuna-telur-puyuh | K2023 hlm.19 | 120/4.6/4.3 | 127/5.3/3.9 | ya | 100.0 |  |
| nasi-tim-ayam-lele-cincang | K2023 hlm.20 | 125/4.5/4.9 | 101/4.0/3.2 | ya | 100.0 |  |
| mie-kukus-telur-puyuh | K2023 hlm.21 | 135/5.1/7.6 | 237/10.9/9.2 | ya | 100.0 | PERIKSA |
| nasi-tim-ikan-telur-sayuran | K2023 hlm.22 | 117/4.8/4.5 | 117/4.7/4.6 | ya | 100.0 |  |
| tim-bubur-manado-daging-udang | K2023 hlm.23 | 119/6.4/4.4 | 79/5.6/3.2 | ya | 53.2 |  |
| nasi-sup-telur-puyuh-bola-tahu-ayam | K2023 hlm.27 | 260/10.4/10.7 | 183/10.6/4.0 | ya | 98.3 |  |
| nasi-soto-ayam-kuah-kuning | K2023 hlm.28 | 263/9.5/10.9 | 141/4.3/5.7 | ya | 100.0 |  |
| sup-telur-puyuh-ikan-nila-labu-kuning | K2023 hlm.29 | 261/13.6/9.1 | 198/14.1/3.3 | ya | 98.5 |  |
| nasi-ikan-kuah-kuning | K2023 hlm.30 | 267/28.5/10.7 | 219/7.6/10.8 | ya | 100.0 |  |
| nugget-tempe-ayam-sayuran | K2023 hlm.31 | 191/10.5/9 | 539/35.8/19.1 | ya | 99.0 | PERIKSA |
| nasi-bakar-ayam-santan | K2023 hlm.35 | 421/18.2/18.2 | 433/19.4/16.1 | ya | 98.8 |  |
| nasi-sup-tabas-udang-sayur | K2023 hlm.37 | 537/23.4/18.9 | 439/22.6/8.7 | ya | 97.6 |  |
| nasi-masak-ayam-kecap-sayur | K2023 hlm.39 | 424/22.9/18.1 | 358/19.8/12.8 | ya | 96.3 |  |
| bola-bola-nasi-rabuk-ikan | K2023 hlm.40 | 468/14.4/17.4 | 417/9.3/16.6 | ya | 52.8 |  |
| bubur-ikan-jagung | K2022 hlm.6 | 190.6/7.5/6.8 | 135/3.0/6.2 | ya | 87.5 |  |
| nasi-tim-ikan-telur-puyuh-wortel | K2022 hlm.7 | 202.7/7.5/7.3 | 181/3.5/6.4 | ya | 85.2 |  |
| tim-ikan-menado | K2022 hlm.10 | 234.3/10.7/8.5 | 175/4.8/7.0 | ya | 87.5 |  |
| nugget-sayuran | K2022 hlm.13 | 270.5/10.6/15.7 | 122/7.6/2.9 | ya | 100.0 |  |
| nasi-ayam-katsu-tumis-sayur-melon | K2022 hlm.14 | 403.3/12/17.7 | 389/16.4/3.3 | ya | 100.0 |  |
| nasi-bakar-ikan-tongkol-pepaya | K2022 hlm.15 | 270.5/10.6/15.7 | 360/17.1/10.4 | TIDAK | 100.0 |  |
| pepes-tahu | K2022 hlm.16 | 304.7/17.9/17 | 223/16.9/11.9 | ya | 97.0 |  |
| omelet-mie-ceria | K2022 hlm.17 | 335.9/15.9/21.7 | 299/15.4/17.9 | ya | 100.0 |  |
| roti-goreng-isi-ragout-ayam-sayuran | K2022 hlm.18 | 319.2/16.8/12 | 128/10.8/5.2 | ya | 100.0 |  |
| stick-ikan-sayur-renyah | K2022 hlm.20 | 315.2/15.3/19.2 | 46/3.7/2.5 | ya | 43.4 |  |
| ikan-bakar-balita | K2022 hlm.22 | 140.6/19.7/5.6 | 0/0.0/0.0 | ya | 0.0 |  |

`cakupan gram` = persen berat bahan bergramasi yang punya komposisi di katalog; besi resep adalah estimasi dari bagian itu saja (batas bawah).
