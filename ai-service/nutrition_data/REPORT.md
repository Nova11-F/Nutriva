# Laporan QA seed nutrisi Nutriva

Dihasilkan otomatis oleh `build_seed.py`. Angka di bawah dihitung ulang setiap build.

## Foods

- 89 bahan kurasi: sumber TKPI 2017 71, USDA SR28 18. Kecocokan nama/jenis: exact 60, close 27, proxy 2.
- 974 bahan TKPI lain lolos uji dan ikut di-seed untuk pencarian (kode `TKPI_<kode>`, ukuran 100 g).
- 95 baris TKPI ditolak uji konsistensi (Atwater > 20% atau proksimat di luar 100 +/- 3 g). Nilai sumber tidak diubah; baris ini hanya tidak di-seed.

### Catatan per bahan kurasi

| kode | sumber | catatan |
|---|---|---|
| TEPUNG_TERIGU | USDA SR28 NDB 20081 (WHEAT FLR,WHITE,ALL-PURPOSE,ENR,BLEACHED) | Sengaja memakai USDA enriched: nilai besi TKPI (1990) mendahului fortifikasi wajib terigu (SNI), sehingga tidak mewakili terigu saat ini |
| TEPUNG_ROTI | USDA SR28 NDB 18079 (BREAD CRUMBS,DRY,GRATED,PLN) |  |
| MIE_TELUR | USDA SR28 NDB 20409 (NOODLES,EGG,DRY,UNENR) | TKPI AP022 tidak dipakai: energi tidak konsisten dengan P/L/KH (selisih 76.3%) |
| SOUN | USDA SR28 NDB 16082 (NOODLES,CHINESE,CELLOPHANE OR LONG RICE (MUNG BNS),DEHYD) |  |
| DAGING_AYAM | USDA SR28 NDB 05011 (CHICKEN,BROILERS OR FRYERS,MEAT ONLY,RAW) | TKPI hanya memuat "Ayam, daging" dengan kulit (BDD 58%, lemak 25 g); untuk daging tanpa kulit dipakai USDA |
| DADA_AYAM | USDA SR28 NDB 05062 (CHICKEN,BROILER OR FRYERS,BRST,SKINLESS,BNLESS,MEAT ONLY,RAW) |  |
| AYAM_GILING | USDA SR28 NDB 05332 (CHICKEN,GROUND,RAW) |  |
| IKAN_LELE | USDA SR28 NDB 15234 (CATFISH,CHANNEL,FARMED,RAW) | PROKSI: USDA tidak memuat Clarias spp.; memakai channel catfish farmed |
| IKAN_NILA | USDA SR28 NDB 15261 (FISH,TILAPIA,RAW) | Tilapia (Oreochromis spp.) |
| IKAN_TUNA | USDA SR28 NDB 15127 (TUNA,FRESH,YELLOWFIN,RAW) | Yellowfin tuna |
| IKAN_TENGGIRI | USDA SR28 NDB 15051 (MACKEREL,SPANISH,RAW) | PROKSI: Scomberomorus commerson memakai Spanish mackerel (S. maculatus) |
| IKAN_KAKAP | TKPI 2017 GR030 (Ikan kakap, segar; data asal DABM- 1964) | Besi TKPI 1 mg berbeda >5x dari USDA 0.18 mg; dipakai USDA sampai diverifikasi ahli gizi |
| UDANG | TKPI 2017 GR084 (Udang, segar; data asal DABM- 1964) | Besi TKPI 8 mg berbeda >5x dari USDA 0.52 mg; dipakai USDA sampai diverifikasi ahli gizi |
| SUSU_SAPI | TKPI 2017 JR006 (Susu sapi, segar; data asal DABM-1964) | Besi TKPI 1.7 mg berbeda >5x dari USDA 0.03 mg; dipakai USDA sampai diverifikasi ahli gizi |
| KEJU_CHEDDAR | TKPI 2017 JP003 (Keju; data asal DABM-1964) | Besi TKPI 1.5 mg berbeda >5x dari USDA 0.14 mg; dipakai USDA sampai diverifikasi ahli gizi |
| ASI | TKPI 2017 JR002 (Susu ibu - ASI; data asal FCTEA-1972) | Besi TKPI 0.2 mg berbeda >5x dari USDA 0.03 mg; dipakai USDA sampai diverifikasi ahli gizi |
| KANGKUNG | USDA SR28 NDB 11503 (SWAMP CABBAGE,(SKUNK CABBAGE),RAW) | TKPI DR100 tidak dipakai: energi tidak konsisten dengan P/L/KH (selisih 26.8%) |
| BROKOLI | USDA SR28 NDB 11090 (BROCCOLI,RAW) |  |
| BUNCIS | USDA SR28 NDB 11052 (BEANS,SNAP,GREEN,RAW) | TKPI DR013 tidak dipakai: energi tidak konsisten dengan P/L/KH (selisih 20.9%) |
| PAKCOY | USDA SR28 NDB 11116 (CABBAGE,CHINESE (PAK-CHOI),RAW) |  |
| TAUGE | USDA SR28 NDB 11043 (MUNG BNS,MATURE SEEDS,SPROUTED,RAW) | TKPI DR148 tidak dipakai: energi tidak konsisten dengan P/L/KH (selisih 25.9%) |
| JAHE | USDA SR28 NDB 11216 (GINGER ROOT,RAW) | TKPI NR018 tidak dipakai: jumlah proksimat 68.8 g (bukan ~100 g) |
| PEPAYA | USDA SR28 NDB 09226 (PAPAYAS,RAW) | TKPI ER073 tidak dipakai: energi tidak konsisten dengan P/L/KH (selisih 245.2%) |
| MANGGA | TKPI 2017 ER054 (Mangga, segar; data asal KZGMI-2001) | Besi TKPI 1 mg berbeda >5x dari USDA 0.16 mg; dipakai USDA sampai diverifikasi ahli gizi |
| SANTAN | TKPI 2017 KP003 (Santan (dengan air); data asal DABM-1964) | Besi TKPI 0.1 mg berbeda >5x dari USDA 1.64 mg; dipakai USDA sampai diverifikasi ahli gizi |
| MENTEGA | TKPI 2017 KP002 (Mentega; data asal DABM- 1964) | Besi TKPI 1.1 mg berbeda >5x dari USDA 0.02 mg; dipakai USDA sampai diverifikasi ahli gizi |

### Baris TKPI yang ditolak

| kode | nama | alasan |
|---|---|---|
| AP010 | Jagung muda, rebus | jumlah proksimat 90.0 g (bukan ~100 g) |
| AP016 | Ketan hitam, tapai | jumlah proksimat 90.0 g (bukan ~100 g) |
| AP040 | Bubur tinotuan (Manado) | energi tidak konsisten dengan P/L/KH (selisih 52.9%) |
| AP047 | Emping beras | jumlah proksimat 113.6 g (bukan ~100 g) |
| BR002 | Batatas gembili, segar | jumlah proksimat 95.4 g (bukan ~100 g) |
| BR033 | Umbi Uwi, segar | energi tidak konsisten dengan P/L/KH (selisih 187.4%) |
| BP021 | Beras Siger | energi tidak konsisten dengan P/L/KH (selisih 65.3%) |
| BP024 | Cassavastick | energi tidak konsisten dengan P/L/KH (selisih 47.8%) |
| BP031 | Kabuto | energi tidak konsisten dengan P/L/KH (selisih 30.2%) |
| BP032 | Kapurung | jumlah proksimat 90.3 g (bukan ~100 g) |
| CR018 | Kacang kedelai, segar | energi tidak konsisten dengan P/L/KH (selisih 33.4%) |
| CR043 | Koro loke, biji, segar | energi tidak konsisten dengan P/L/KH (selisih 33.9%) |
| CP006 | Kacang kedelai, goreng | jumlah proksimat 106.1 g (bukan ~100 g) |
| CP015 | Ampas kacang hijau | jumlah proksimat 94.6 g (bukan ~100 g) |
| CP020 | Bungkil biji karet | jumlah proksimat 124.0 g (bukan ~100 g) |
| CP021 | Bungkil kacang tanah | jumlah proksimat 128.0 g (bukan ~100 g) |
| CP022 | Bungkil kelapa | jumlah proksimat 132.0 g (bukan ~100 g) |
| CP024 | Emping (kerupuk melinjo) | jumlah proksimat 126.0 g (bukan ~100 g) |
| CP059 | Saridele, bubuk | energi tidak konsisten dengan P/L/KH (selisih 37.2%) |
| CP060 | Susu kedelai | energi tidak konsisten dengan P/L/KH (selisih 37.8%) |
| CP070 | Tempe bongkrek | jumlah proksimat 245.0 g (bukan ~100 g) |
| CP086 | Tepung kacang kedelai | energi tidak konsisten dengan P/L/KH (selisih 29.3%) |
| DR004 | Andewi, segar | energi tidak konsisten dengan P/L/KH (selisih 87.0%) |
| DR020 | Daun belem, segar | energi tidak konsisten dengan P/L/KH (selisih 22.8%) |
| DR029 | Daun jampang, segar | energi tidak konsisten dengan P/L/KH (selisih 20.3%) |
| DR032 | Daun kacang ma, segar | energi tidak konsisten dengan P/L/KH (selisih 22.8%) |
| DR033 | Daun kacang panjang, segar | energi tidak konsisten dengan P/L/KH (selisih 27.7%) |
| DR035 | Daun katuk, segar | energi tidak konsisten dengan P/L/KH (selisih 25.8%) |
| DR039 | Daun kemang, segar | energi tidak konsisten dengan P/L/KH (selisih 27.2%) |
| DR041 | Daun kesum, segar | energi tidak konsisten dengan P/L/KH (selisih 28.3%) |
| DR042 | Daun kol sawi, segar | energi tidak konsisten dengan P/L/KH (selisih 24.1%) |
| DR043 | Daun koro, segar | energi tidak konsisten dengan P/L/KH (selisih 28.3%) |
| DR045 | Daun kumak, segar | energi tidak konsisten dengan P/L/KH (selisih 22.1%) |
| DR048 | Daun lamtoro, segar | energi tidak konsisten dengan P/L/KH (selisih 23.0%) |
| DR054 | Daun matel ambon, segar | energi tidak konsisten dengan P/L/KH (selisih 23.4%) |
| DR059 | Daun pakis, segar | energi tidak konsisten dengan P/L/KH (selisih 26.2%) |
| DR062 | Daun paku, segar | energi tidak konsisten dengan P/L/KH (selisih 39.7%) |
| DR066 | Daun pohpohan, segar | energi tidak konsisten dengan P/L/KH (selisih 21.1%) |
| DR068 | Daun semanggi, segar | energi tidak konsisten dengan P/L/KH (selisih 24.7%) |
| DR069 | Daun simpur, segar | energi tidak konsisten dengan P/L/KH (selisih 24.0%) |
| DR071 | Daun singkong, segar | energi tidak konsisten dengan P/L/KH (selisih 26.2%) |
| DR073 | Daun singkong ampenan, segar | energi tidak konsisten dengan P/L/KH (selisih 26.2%) |
| DR079 | Daun ubi merah, segar | energi tidak konsisten dengan P/L/KH (selisih 20.6%) |
| DR096 | Kacang mekah, polong, segar | energi tidak konsisten dengan P/L/KH (selisih 22.7%) |
| DR098 | Kacang ranti polong | energi tidak konsisten dengan P/L/KH (selisih 23.8%) |
| DR113 | Kool kembang | energi tidak konsisten dengan P/L/KH (selisih 24.0%) |
| DR118 | Kucai muda (Lokio), segar | energi tidak konsisten dengan P/L/KH (selisih 23.3%) |
| DR128 | Melinjo, segar | energi tidak konsisten dengan P/L/KH (selisih 20.5%) |
| DR142 | Sawi putih / pecai, segar | energi tidak konsisten dengan P/L/KH (selisih 30.0%) |
| DR146 | Selada air, segar | energi tidak konsisten dengan P/L/KH (selisih 35.3%) |
| DR159 | Terung panjang | energi tidak konsisten dengan P/L/KH (selisih 22.0%) |
| DP003 | Buncis, rebus | energi tidak konsisten dengan P/L/KH (selisih 20.7%) |
| DP004 | Daun kacang panjang, kukus | energi tidak konsisten dengan P/L/KH (selisih 23.8%) |
| DP005 | Daun katuk, rebus | energi tidak konsisten dengan P/L/KH (selisih 24.0%) |
| DP008 | Daun singkong, rebus | energi tidak konsisten dengan P/L/KH (selisih 27.1%) |
| DP011 | Kacang panjang ,kukus | energi tidak konsisten dengan P/L/KH (selisih 22.6%) |
| DP013 | Kangkung, kukus | energi tidak konsisten dengan P/L/KH (selisih 26.3%) |
| DP014 | Kangkung, rebus | energi tidak konsisten dengan P/L/KH (selisih 26.4%) |
| DP016 | Selada, rebus | energi tidak konsisten dengan P/L/KH (selisih 27.4%) |
| DP018 | Taoge, seduh | energi tidak konsisten dengan P/L/KH (selisih 25.7%) |
| DP019 | Terung panjang, kukus | energi tidak konsisten dengan P/L/KH (selisih 20.4%) |
| DP042 | Olah-olah | energi tidak konsisten dengan P/L/KH (selisih 908.9%) |
| ER023 | Durian, segar | jumlah proksimat 106.5 g (bukan ~100 g) |
| ER049 | Kokosan, segar | energi tidak konsisten dengan P/L/KH (selisih 30.0%) |
| ER101 | Salak, segar | makronutrien tidak lengkap |
| ER107 | Sowa, segar | jumlah proksimat 109.0 g (bukan ~100 g) |
| ER110 | Sukun tua, segar | jumlah proksimat 95.1 g (bukan ~100 g) |
| FP001 | Ayam, ampela, goreng | jumlah proksimat 60.0 g (bukan ~100 g) |
| FP011 | Sapi, abon | energi tidak konsisten dengan P/L/KH (selisih 90.8%) |
| FP035 | Babi hutan masak rica, masakan | energi tidak konsisten dengan P/L/KH (selisih 49.9%) |
| FP039 | Brongkos | jumlah proksimat 110.0 g (bukan ~100 g) |
| FP040 | Bulgogi, masakan | energi tidak konsisten dengan P/L/KH (selisih 32.4%) |
| FP083 | Soto sukaraja, masakan | jumlah proksimat 92.7 g (bukan ~100 g) |
| GR002 | Belut,laut, segar | jumlah proksimat 104.0 g (bukan ~100 g) |
| GR078 | Lokan, segar | energi tidak konsisten dengan P/L/KH (selisih 63.3%) |
| GP003 | Cumi-cumi, goreng | jumlah proksimat 108.0 g (bukan ~100 g) |
| GP015 | Ikan katombo, asin | jumlah proksimat 95.0 g (bukan ~100 g) |
| GP020 | Ikan mujahir goreng | jumlah proksimat 117.7 g (bukan ~100 g) |
| GP022 | Ikan mujahir, dendeng, mentah | jumlah proksimat 150.0 g (bukan ~100 g) |
| GP035 | Ikan selar kuning, cue, mentah | jumlah proksimat 90.0 g (bukan ~100 g) |
| GP039 | Ikan, tepung, mentah | energi tidak konsisten dengan P/L/KH (selisih 22.9%) |
| GP056 | Bou ninahu ndamate, masakan | energi tidak konsisten dengan P/L/KH (selisih 51.1%) |
| GP060 | Dendeng mujahir, goreng, masakan | jumlah proksimat 130.0 g (bukan ~100 g) |
| GP071 | Jukku pallu kaloa, masakan | energi tidak konsisten dengan P/L/KH (selisih 798.0%) |
| GP085 | Pinda | energi tidak konsisten dengan P/L/KH (selisih 34.0%) |
| HR010 | Telur penyu, segar | jumlah proksimat 30.0 g (bukan ~100 g) |
| HP007 | Kalio telur, masakan | jumlah proksimat 113.1 g (bukan ~100 g) |
| MP002 | Coklat pahit,batang | jumlah proksimat 89.7 g (bukan ~100 g) |
| MP004 | Coklat bubuk | jumlah proksimat 80.2 g (bukan ~100 g) |
| MP009 | Kopi bubuk instant | energi tidak konsisten dengan P/L/KH (selisih 50.2%) |
| MP013 | Melase | makronutrien tidak lengkap |
| MP016 | Teh hijau daun kering | energi tidak konsisten dengan P/L/KH (selisih 23.6%) |
| MP017 | Teh hitam daun kering | energi tidak konsisten dengan P/L/KH (selisih 22.3%) |
| MP018 | Teh melati daun kering | energi tidak konsisten dengan P/L/KH (selisih 21.7%) |
| NP012 | Terasi dobo | jumlah proksimat 113.2 g (bukan ~100 g) |

## Recipes

- 30 resep; nilai tercetak plausibel: 28; diganti estimasi bahan: 2.
- Energi estimasi-dari-bahan vs tercetak: median selisih absolut 17% (n = 28); untuk resep dengan cakupan gram >= 95%: 13% (n = 23). Estimasi cenderung lebih rendah karena minyak goreng, kaldu, dan bumbu tanpa gram tidak ikut dihitung.

| resep | sumber | E/P/L tercetak | E/P/L estimasi | plausibel | cakupan gram (%) | cek porsi |
|---|---|---|---|---|---|---|
| bubur-singkong-isi-ikan-ayam-saus-jeruk | K2023 hlm.11 | 91/3.1/3.5 | 81/2.8/2.1 | ya | 100.0 |  |
| bubur-soto-ayam-santan | K2023 hlm.12 | 96/4.6/4.1 | 109/5.5/3.8 | ya | 100.0 |  |
| bubur-sup-ayam-kacang-merah | K2023 hlm.13 | 98/45.1/3.6 | 91/4.9/2.2 | TIDAK | 100.0 |  |
| bubur-kanju-rumbi-ayam-udang | K2023 hlm.14 | 87/5.1/2.9 | 76/4.7/0.9 | ya | 100.0 |  |
| puding-kentang-ayam-telur | K2023 hlm.15 | 95/4/3.6 | 94/4.2/4.8 | ya | 100.0 |  |
| nasi-tim-ikan-tuna-telur-puyuh | K2023 hlm.19 | 120/4.6/4.3 | 140/5.2/3.5 | ya | 100.0 |  |
| nasi-tim-ayam-lele-cincang | K2023 hlm.20 | 125/4.5/4.9 | 113/4.0/2.7 | ya | 100.0 |  |
| mie-kukus-telur-puyuh | K2023 hlm.21 | 135/5.1/7.6 | 215/10.4/6.3 | ya | 100.0 | PERIKSA |
| nasi-tim-ikan-telur-sayuran | K2023 hlm.22 | 117/4.8/4.5 | 125/4.7/3.8 | ya | 100.0 |  |
| tim-bubur-manado-daging-udang | K2023 hlm.23 | 119/6.4/4.4 | 142/6.8/5.6 | ya | 100.0 |  |
| nasi-sup-telur-puyuh-bola-tahu-ayam | K2023 hlm.27 | 260/10.4/10.7 | 208/10.9/3.3 | ya | 98.3 |  |
| nasi-soto-ayam-kuah-kuning | K2023 hlm.28 | 263/9.5/10.9 | 157/3.9/4.9 | ya | 100.0 |  |
| sup-telur-puyuh-ikan-nila-labu-kuning | K2023 hlm.29 | 261/13.6/9.1 | 217/14.0/2.6 | ya | 98.5 |  |
| nasi-ikan-kuah-kuning | K2023 hlm.30 | 267/28.5/10.7 | 236/7.8/8.8 | ya | 100.0 |  |
| nugget-tempe-ayam-sayuran | K2023 hlm.31 | 191/10.5/9 | 532/36.0/16.1 | ya | 99.0 | PERIKSA |
| nasi-bakar-ayam-santan | K2023 hlm.35 | 421/18.2/18.2 | 412/20.6/14.3 | ya | 98.8 |  |
| nasi-sup-tabas-udang-sayur | K2023 hlm.37 | 537/23.4/18.9 | 488/23.9/8.8 | ya | 97.6 |  |
| nasi-masak-ayam-kecap-sayur | K2023 hlm.39 | 424/22.9/18.1 | 399/21.0/12.0 | ya | 96.3 |  |
| bola-bola-nasi-rabuk-ikan | K2023 hlm.40 | 468/14.4/17.4 | 568/16.4/23.8 | ya | 98.7 |  |
| bubur-ikan-jagung | K2022 hlm.6 | 190.6/7.5/6.8 | 138/3.2/6.2 | ya | 87.5 |  |
| nasi-tim-ikan-telur-puyuh-wortel | K2022 hlm.7 | 202.7/7.5/7.3 | 174/3.7/6.3 | ya | 85.2 |  |
| tim-ikan-menado | K2022 hlm.10 | 234.3/10.7/8.5 | 237/6.4/7.2 | ya | 87.5 |  |
| nugget-sayuran | K2022 hlm.13 | 270.5/10.6/15.7 | 173/7.6/3.4 | ya | 100.0 |  |
| nasi-ayam-katsu-tumis-sayur-melon | K2022 hlm.14 | 403.3/12/17.7 | 430/16.5/3.5 | ya | 100.0 |  |
| nasi-bakar-ikan-tongkol-pepaya | K2022 hlm.15 | 270.5/10.6/15.7 | 404/14.3/5.8 | TIDAK | 100.0 |  |
| pepes-tahu | K2022 hlm.16 | 304.7/17.9/17 | 230/21.2/12.3 | ya | 97.0 |  |
| omelet-mie-ceria | K2022 hlm.17 | 335.9/15.9/21.7 | 305/15.2/18.6 | ya | 100.0 |  |
| roti-goreng-isi-ragout-ayam-sayuran | K2022 hlm.18 | 319.2/16.8/12 | 129/10.9/5.5 | ya | 100.0 |  |
| stick-ikan-sayur-renyah | K2022 hlm.20 | 315.2/15.3/19.2 | 48/3.6/2.8 | ya | 43.4 |  |
| ikan-bakar-balita | K2022 hlm.22 | 140.6/19.7/5.6 | 0/0.0/0.0 | ya | 0.0 |  |

`cakupan gram` = persen berat bahan bergramasi yang punya komposisi di katalog; besi resep adalah estimasi dari bagian itu saja (batas bawah).
