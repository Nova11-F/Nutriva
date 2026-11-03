"""
Transkripsi resep balita dari dua buku resep resmi Kementerian Kesehatan RI.

K2023: Kemenkes RI (2023). Makanan Lokal Bayi, Balita dan Ibu Hamil: Buku Resep. Jakarta:
       Kementerian Kesehatan RI. Salinan: https://eprints.poltekkesadisutjipto.ac.id/id/eprint/1953/1/Share%20Buku%20Menu%20Makanan%20Lokal.pdf
K2022: Kemenkes RI, Ditjen Kesehatan Masyarakat, Direktorat Gizi dan KIA (2022). Buku Resep Makanan Lokal
       Balita dan Ibu Hamil. Jakarta. Salinan: https://pkmpati2.patikab.go.id/data_bansos/file/Buku_Resep_Makanan_Lokal_Balita_dan_Ibu_Hamil.pdf

Aturan transkripsi
- Nilai energi/protein/lemak = angka TERCETAK per porsi (K2023 semua resep "untuk 3 porsi").
- Bahan: (teks seperti tercetak, kode foods_catalog atau None, gram atau None).
  gram None = jumlah tidak tercetak dalam gram ("secukupnya", "1 siung", "1 ekor") -> tidak ikut estimasi.
  kode None = bahan tidak ada di katalog (kaldu, bumbu, buah naga, rabuk ikan, kecap manis, ikan tanpa jenis).
- Langkah memasak diparafrasekan singkat dari buku.
- Resep yang sama di kedua edisi memakai versi K2023 (lebih baru); 11 resep K2022 yang tidak ada di K2023 ikut dimasukkan.
"""

SOURCES = {
    "K2023": {"citation": "Kemenkes RI (2023). Makanan Lokal Bayi, Balita dan Ibu Hamil: Buku Resep. Jakarta: Kementerian Kesehatan RI.",
              "url": "https://eprints.poltekkesadisutjipto.ac.id/id/eprint/1953/1/Share%20Buku%20Menu%20Makanan%20Lokal.pdf"},
    "K2022": {"citation": "Kemenkes RI (2022). Buku Resep Makanan Lokal Balita dan Ibu Hamil. Jakarta: Ditjen Kesehatan Masyarakat, Direktorat Gizi dan KIA.",
              "url": "https://pkmpati2.patikab.go.id/data_bansos/file/Buku_Resep_Makanan_Lokal_Balita_dan_Ibu_Hamil.pdf"},
}

# Panduan pemberian makan per kelompok usia (K2023 hlm. 7, 26, 34; K2022 hlm. 3)
AGE_GUIDE = {
    (6, 8): {"portion": "Mulai 2-3 sdm per makan, bertahap hingga 1/2 mangkok (125 ml)",
             "frequency": "2-3 kali/hari makan utama, 1-2 kali/hari selingan", "texture": "Bubur kental / makanan lumat"},
    (9, 11): {"portion": "1/2-3/4 mangkok ukuran 250 ml (125-200 ml)",
              "frequency": "3-4 kali/hari makan utama, 1-2 kali/hari selingan", "texture": "Dicincang halus / makanan yang dapat dipegang"},
    (12, 23): {"portion": "3/4-1 mangkok ukuran 250 ml",
               "frequency": "3-4 kali/hari makan utama, 1-2 kali/hari selingan", "texture": "Makanan keluarga, diiris bila perlu"},
    (24, 59): {"portion": "1 porsi resep (lihat bahan)",
               "frequency": "3-4 kali/hari makan utama, 1-2 kali/hari selingan", "texture": "Makanan keluarga"},
}

R = []


def add(**kw):
    R.append(kw)


# ============================== K2023 ==============================
add(slug="bubur-singkong-isi-ikan-ayam-saus-jeruk", title="Bubur Singkong Isi Ikan dan Ayam dengan Saus Jeruk",
    src="K2023", page=11, age=(6, 8), kind="utama", portions=3, printed=(91, 3.1, 3.5),
    ingredients=[("75 g singkong putih, rebus dan haluskan", "SINGKONG", 75),
                 ("15 g (2 sdm datar) daging ikan kembung cincang halus", "IKAN_KEMBUNG", 15),
                 ("15 g daging ayam cincang rebus", "DAGING_AYAM", 15),
                 ("250 ml air kaldu ayam", None, None),
                 ("5 g (1 sdt) minyak kelapa", "MINYAK_KELAPA", 5),
                 ("20 g (2 sdm) bayam segar, potong halus", "BAYAM", 20),
                 ("1 lembar daun salam, 1 batang sereh", None, None),
                 ("Bumbu halus: 1 siung bawang merah, 1 siung bawang putih", None, None),
                 ("100 g (3 buah kecil) jeruk manis, diambil sarinya", "JERUK_MANIS", 100)],
    steps=["Tumis bumbu halus, masukkan daun salam dan sereh.",
           "Tambahkan kaldu, singkong, ikan, dan ayam; masak setengah matang.",
           "Masukkan bayam hingga matang, lalu saring atau blender sesuai tekstur.",
           "Beri sari jeruk sesaat sebelum disajikan."])

add(slug="bubur-soto-ayam-santan", title="Bubur Soto Ayam Santan", src="K2023", page=12, age=(6, 8), kind="utama",
    portions=3, printed=(96, 4.6, 4.1),
    ingredients=[("60 g (6 sdm) nasi putih", "NASI_PUTIH", 60), ("45 g (4,5 sdm) daging ayam cincang", "DAGING_AYAM", 45),
                 ("30 g (1 buah kecil) tahu", "TAHU", 30), ("30 g (3 sdm) labu siam", "LABU_SIAM", 30),
                 ("15 g (1,5 sdm) wortel", "WORTEL", 15), ("1 lembar salam, 1 batang sereh, 1 lembar daun jeruk", None, None),
                 ("5 g minyak goreng", "MINYAK_SAWIT", 5), ("30 ml (3 sdm) santan", "SANTAN", 30),
                 ("300 ml air kaldu ayam", None, None),
                 ("Bumbu halus: 1 siung bawang merah, 1 siung bawang putih, 1 cm kunyit, 1 cm jahe", None, None),
                 ("100 g (3 buah kecil) jeruk, diambil sarinya", "JERUK_MANIS", 100)],
    steps=["Tumis bumbu halus dan ayam hingga berubah warna.",
           "Tambahkan kaldu, santan, dan rempah daun; didihkan.",
           "Masukkan nasi, tahu, labu siam, dan wortel hingga empuk.",
           "Haluskan sesuai tekstur usia dan sajikan hangat dengan sari jeruk."])

add(slug="bubur-sup-ayam-kacang-merah", title="Bubur Sup Daging Kacang Merah", src="K2023", page=13, age=(6, 8),
    kind="utama", portions=3, printed=(98, 45.1, 3.6),
    note="Judul menyebut 'daging' tetapi bahan tercetak adalah daging ayam. Protein tercetak 45,1 g tidak mungkin untuk 98 kkal (salah cetak).",
    ingredients=[("50 g (6 sdm) nasi", "NASI_PUTIH", 50), ("30 g (3 sdm) daging ayam cincang", "DAGING_AYAM", 30),
                 ("25 g (1/2 butir) telur ayam", "TELUR_AYAM", 25), ("10 g (1 sdm) buncis", "BUNCIS", 10),
                 ("10 g (1 sdm) wortel", "WORTEL", 10), ("10 g (1 sdm) kacang merah", "KACANG_MERAH", 10),
                 ("10 g (1 batang) bawang daun", "DAUN_BAWANG", 10), ("1 batang seledri", None, None),
                 ("300 ml kaldu ayam", None, None), ("2,5 g (1/2 sdt) minyak untuk menumis", "MINYAK_SAWIT", 2.5),
                 ("Bumbu halus: 2 siung bawang merah, 2 siung bawang putih", None, None),
                 ("100 g (2 buah) jeruk, diambil sarinya", "JERUK_MANIS", 100)],
    steps=["Rebus kacang merah dalam kaldu hingga empuk.",
           "Tumis bumbu halus dan ayam, lalu masukkan ke dalam kaldu.",
           "Tambahkan nasi, buncis, dan wortel; masukkan telur kocok sambil diaduk hingga matang.",
           "Haluskan sesuai tekstur usia dan sajikan dengan sari jeruk."])

add(slug="bubur-kanju-rumbi-ayam-udang", title="Bubur Kanju Rumbi Ayam dan Udang", src="K2023", page=14, age=(6, 8),
    kind="utama", portions=3, printed=(87, 5.1, 2.9),
    ingredients=[("60 g (6 sdm) nasi putih", "NASI_PUTIH", 60), ("30 g (3 sdm) daging ayam bagian dada", "DADA_AYAM", 30),
                 ("20 g udang segar", "UDANG", 20), ("15 g wortel", "WORTEL", 15), ("15 g jagung pipil", "JAGUNG_MANIS", 15),
                 ("15 ml santan", "SANTAN", 15), ("350 ml kaldu ayam", None, None), ("2 lembar daun pandan", None, None),
                 ("Bumbu halus: bawang merah, bawang putih, kapulaga, ketumbar, kayu manis, cengkeh, merica, jintan, adas, pekak, pala", None, None),
                 ("50 g (6 potong kecil) pepaya", "PEPAYA", 50)],
    steps=["Rebus ayam setengah matang, potong dadu; rebus udang di air yang sama, kupas dan potong.",
           "Tumis bumbu halus dan daun pandan, tambahkan kaldu dan nasi hingga lembek.",
           "Masukkan ayam, udang, wortel, dan jagung; masak hingga matang.",
           "Saring sesuai tekstur usia dan sajikan dengan pepaya."])

add(slug="puding-kentang-ayam-telur", title="Puding Kentang Ayam dan Telur", src="K2023", page=15, age=(6, 8),
    kind="utama", portions=3, printed=(95, 4.0, 3.6),
    ingredients=[("100 g kentang, kukus dan haluskan", "KENTANG", 100), ("30 g (3 sdm) daging ayam cincang", "DAGING_AYAM", 30),
                 ("10 g (1 butir) telur puyuh", "TELUR_PUYUH", 10), ("15 g (1 buah) tahu kecil, potong dadu kecil", "TAHU", 15),
                 ("15 g (1,5 sdm) wortel parut", "WORTEL", 15), ("10 g (1 sdm) labu kuning", "LABU_KUNING", 10),
                 ("15 ml santan", "SANTAN", 15), ("1 batang sereh, 1 lembar daun salam", None, None),
                 ("1 sdm minyak", "MINYAK_SAWIT", 10), ("50 ml air kaldu ayam", None, None),
                 ("Bumbu halus: 2 siung bawang merah, 2 siung bawang putih", None, None),
                 ("100 g (2 buah) jeruk, diambil sarinya", "JERUK_MANIS", 100)],
    steps=["Tumis bumbu halus dengan salam dan sereh, masukkan ayam, lalu sayuran dan tahu.",
           "Tambahkan santan dan kaldu, matikan api, campurkan dengan kentang dan telur kocok.",
           "Tuang ke wadah tahan panas yang diolesi minyak, kukus sekitar 20 menit.",
           "Sajikan hangat dengan sari jeruk."])

add(slug="nasi-tim-ikan-tuna-telur-puyuh", title="Nasi Tim Ikan Tuna Telur Puyuh", src="K2023", page=19, age=(9, 11),
    kind="utama", portions=3, printed=(120, 4.6, 4.3),
    ingredients=[("115 g (12 sdm) nasi putih", "NASI_PUTIH", 115), ("30 g (1 potong kecil) ikan tuna segar, haluskan", "IKAN_TUNA", 30),
                 ("30 g (3 butir) telur puyuh", "TELUR_PUYUH", 30), ("15 g wortel", "WORTEL", 15), ("10 g tomat", "TOMAT", 10),
                 ("7,5 g (1,5 sdt) minyak kelapa", "MINYAK_KELAPA", 7.5), ("75 ml (1/3 gelas belimbing) kaldu ayam", None, None),
                 ("50 g pepaya, haluskan (saus)", "PEPAYA", 50), ("180 g (1 potong besar) semangka", "SEMANGKA", 180)],
    steps=["Masukkan nasi, tuna, telur puyuh, dan minyak ke mangkuk tim, lalu tambahkan kaldu.",
           "Masukkan wortel dan tomat, tim hingga matang.",
           "Sajikan dengan saus pepaya dan semangka."])

add(slug="nasi-tim-ayam-lele-cincang", title="Nasi Tim Ayam Lele Cincang", src="K2023", page=20, age=(9, 11), kind="utama",
    portions=3, printed=(125, 4.5, 4.9),
    ingredients=[("100 g (10 sdm) nasi putih", "NASI_PUTIH", 100), ("30 g (3 sdm) daging ayam cincang", "DAGING_AYAM", 30),
                 ("10 g (1 sdm) daging ikan lele", "IKAN_LELE", 10), ("10 g (1 sdm) wortel", "WORTEL", 10),
                 ("5 ml (1 sdt) minyak goreng", "MINYAK_SAWIT", 5), ("10 ml (1 sdm) santan kental", "SANTAN", 10),
                 ("1,5 sdm bawang bombay, iris halus", None, None), ("200 ml kaldu ayam", None, None),
                 ("180 g (1 potong besar) semangka", "SEMANGKA", 180)],
    steps=["Masukkan nasi, ayam, lele, bawang bombay, minyak, dan santan ke mangkuk tim.",
           "Tambahkan kaldu dan wortel, masak hingga lunak.",
           "Sajikan dengan semangka."])

add(slug="mie-kukus-telur-puyuh", title="Mie Kukus Telur Puyuh", src="K2023", page=21, age=(9, 11), kind="utama",
    portions=3, printed=(135, 5.1, 7.6),
    note="Mie instan batita tidak ada di katalog; estimasi besi memakai mie telur kering sebagai proksi.",
    ingredients=[("85 g (3 bungkus) mie instan batita atau mie keriting", "MIE_TELUR", 85),
                 ("60 g (6 butir) telur puyuh", "TELUR_PUYUH", 60), ("50 g (5 sdm) wortel parut", "WORTEL", 50),
                 ("50 g (5 sdm) keju parut", "KEJU_CHEDDAR", 50), ("10 g (1 batang) bawang daun, iris", "DAUN_BAWANG", 10),
                 ("Minyak untuk menggoreng", None, None), ("Bumbu mie instan batita secukupnya", None, None),
                 ("300 ml air", None, None), ("150 g (6 potong kecil) pepaya", "PEPAYA", 150)],
    steps=["Rebus mie hingga lunak, tiriskan, campur dengan wortel, bawang daun, keju, dan bumbu.",
           "Tuang ke wadah tahan panas yang diolesi minyak, selingi telur puyuh rebus, kukus 15 menit.",
           "Sajikan langsung atau goreng hingga kekuningan; lengkapi dengan pepaya."])

add(slug="nasi-tim-ikan-telur-sayuran", title="Nasi Tim Ikan Telur Sayuran", src="K2023", page=22, age=(9, 11), kind="utama",
    portions=3, printed=(117, 4.8, 4.5),
    note="Baris '100 gr nasi' tercetak dua kali; dihitung satu kali (100 g).",
    ingredients=[("100 g (10 sdm) nasi putih", "NASI_PUTIH", 100), ("30 g (3 butir) telur puyuh, kocok", "TELUR_PUYUH", 30),
                 ("30 g (3 sdm) ikan kembung fillet", "IKAN_KEMBUNG", 30), ("10 g (1 sdm) sawi hijau, iris", "SAWI_HIJAU", 10),
                 ("20 g (2 sdm) tomat, cincang", "TOMAT", 20), ("300 ml kaldu ayam", None, None),
                 ("7,5 ml (1,5 sdt) minyak kelapa", "MINYAK_KELAPA", 7.5), ("180 g semangka", "SEMANGKA", 180)],
    steps=["Masak kaldu, nasi, minyak, dan ikan hingga lunak menjadi bubur.",
           "Masukkan sawi dan tomat, lalu telur puyuh kocok sambil diaduk hingga matang.",
           "Sajikan dengan semangka."])

add(slug="tim-bubur-manado-daging-udang", title="Tim Bubur Manado Daging dan Udang", src="K2023", page=23, age=(9, 11),
    kind="utama", portions=3, printed=(119, 6.4, 4.4),
    ingredients=[("50 g (5 sdm) nasi putih", "NASI_PUTIH", 50), ("40 g (4 sdm) labu kuning, potong dadu", "LABU_KUNING", 40),
                 ("40 g (4 sdm) daging sapi cincang", "DAGING_SAPI", 40), ("30 g (3 ekor) udang kupas", "UDANG", 30),
                 ("20 g (2 sdm) jagung pipil", "JAGUNG_MANIS", 20), ("10 g (1 sdm) bayam", "BAYAM", 10),
                 ("5 ml (1 sdt) minyak goreng", "MINYAK_SAWIT", 5), ("Garam secukupnya", None, None),
                 ("10 g (1 batang) daun bawang, iris", "DAUN_BAWANG", 10), ("100 ml kaldu daging", None, None),
                 ("Bumbu halus: 1 siung bawang merah, 1 siung bawang putih", None, None),
                 ("180 g (1 potong) buah naga", None, 180)],
    steps=["Tumis bumbu halus hingga harum, masukkan daging dan udang hingga berubah warna.",
           "Tambahkan kaldu, didihkan, lalu masukkan nasi, labu kuning, jagung, dan bayam.",
           "Tambahkan daun bawang, masak hingga menyusut, beri sedikit garam, sajikan dengan buah naga."])

add(slug="nasi-sup-telur-puyuh-bola-tahu-ayam", title="Nasi Sup Telur Puyuh Bola Tahu Ayam", src="K2023", page=27,
    age=(12, 23), kind="utama", portions=3, printed=(260, 10.4, 10.7),
    ingredients=[("150 g (15 sdm) nasi putih", "NASI_PUTIH", 150), ("45 g (1 potong kecil) tahu putih", "TAHU", 45),
                 ("60 g (5 sdm) daging ayam cincang", "DAGING_AYAM", 60), ("60 g (6 butir) telur puyuh rebus", "TELUR_PUYUH", 60),
                 ("30 g (3 sdm) wortel", "WORTEL", 30), ("30 g (3 sdm) jagung pipil kuning", "JAGUNG_MANIS", 30),
                 ("30 g (3 sdm) brokoli", "BROKOLI", 30), ("10 g (1 batang) seledri, iris", "SELEDRI", 10),
                 ("10 g (1 batang) daun bawang, iris", "DAUN_BAWANG", 10), ("15 g (1,5 sdm) tepung tapioka", "TEPUNG_TAPIOKA", 15),
                 ("Garam, gula, merica secukupnya", None, None), ("10 g (1 sdm) bawang goreng", None, 10),
                 ("135 g (3 potong) melon", "MELON", 135)],
    steps=["Haluskan tahu, ayam, bumbu, dan tapioka; bentuk bola kecil lalu rebus hingga mengapung.",
           "Masukkan wortel dan jagung, lalu brokoli dan telur puyuh.",
           "Bumbui secukupnya, tambahkan daun bawang dan seledri.",
           "Sajikan dengan nasi, taburan bawang goreng, dan melon."])

add(slug="nasi-soto-ayam-kuah-kuning", title="Nasi Soto Ayam Kuah Kuning", src="K2023", page=28, age=(12, 23),
    kind="utama", portions=3, printed=(263, 9.5, 10.9),
    note="Ayam tercetak 100 g dengan tulang; berat bagian yang dapat dimakan tidak tercetak sehingga tidak ikut estimasi.",
    ingredients=[("150 g (15 sdm) nasi", "NASI_PUTIH", 150), ("100 g (2 potong) ayam dengan tulang", "DAGING_AYAM", None),
                 ("10 g (1 sdm) soun", "SOUN", 10), ("60 g (6 butir) telur puyuh", "TELUR_PUYUH", 60),
                 ("30 g (3 sdm) tauge", "TAUGE", 30), ("10 g (1 sdm) minyak goreng", "MINYAK_SAWIT", 10),
                 ("Daun salam, serai, daun jeruk, lengkuas, garam, gula, merica", None, None),
                 ("Bumbu halus: kemiri, bawang merah, bawang putih, jahe, kunyit, jintan, ketumbar", None, None),
                 ("Pelengkap: daun bawang, seledri, bawang goreng", None, None)],
    steps=["Rebus ayam dengan serai, daun salam, daun jeruk, dan lengkuas.",
           "Tumis bumbu halus hingga harum, masukkan ke rebusan; bumbui dan masak hingga ayam empuk, lalu suwir.",
           "Sajikan dengan nasi, soun, tauge, telur puyuh, dan taburan pelengkap."])

add(slug="sup-telur-puyuh-ikan-nila-labu-kuning", title="Sup Telur Puyuh Ikan Air Tawar Labu Kuning", src="K2023", page=29,
    age=(12, 23), kind="utama", portions=3, printed=(261, 13.6, 9.1),
    ingredients=[("150 g (15 sdm) nasi putih", "NASI_PUTIH", 150), ("70 g (7 sdm) kentang, potong dadu", "KENTANG", 70),
                 ("50 g (5 sdm) labu kuning, potong dadu", "LABU_KUNING", 50), ("120 g (12 sdm) ikan nila kukus, suwir", "IKAN_NILA", 120),
                 ("60 g (6 butir) telur puyuh rebus", "TELUR_PUYUH", 60), ("15 g (3 sdt) kacang merah", "KACANG_MERAH", 15),
                 ("45 g (4,5 sdm) tomat, potong dadu", "TOMAT", 45), ("10 g (1 batang) bawang daun", "DAUN_BAWANG", 10),
                 ("5 g bawang merah goreng, 5 g bawang putih goreng", None, 10), ("150 ml kaldu ayam", None, None),
                 ("Garam, gula, merica secukupnya", None, None), ("150 g (6 potong) pepaya", "PEPAYA", 150)],
    steps=["Didihkan kaldu, masukkan kentang, kacang merah, dan labu kuning hingga setengah matang.",
           "Tambahkan ikan, bawang goreng, tomat, bawang daun, dan telur puyuh; bumbui secukupnya.",
           "Sajikan dengan nasi dan pepaya."])

add(slug="nasi-ikan-kuah-kuning", title="Nasi Ikan Kuah Kuning", src="K2023", page=30, age=(12, 23), kind="utama",
    portions=3, printed=(267, 28.5, 10.7),
    note="Ikan kembung tercetak 360 g (3 ekor), berat utuh termasuk tulang; tidak ikut estimasi besi.",
    ingredients=[("150 g (15 sdm) nasi", "NASI_PUTIH", 150), ("360 g (3 ekor) ikan kembung", "IKAN_KEMBUNG", None),
                 ("75 g (7,5 sdm) labu siam", "LABU_SIAM", 75), ("75 g (7,5 sdm) tempe", "TEMPE", 75),
                 ("60 g (1 buah besar) tomat", "TOMAT", 60), ("15 ml (1,5 sdm) minyak goreng", "MINYAK_SAWIT", 15),
                 ("35 ml (3,5 sdm) santan", "SANTAN", 35), ("Daun salam, sereh, laos, garam, gula, 2 buah jeruk nipis, 750 ml air", None, None),
                 ("Bumbu halus: bawang merah, bawang putih, kemiri, jahe, kunyit", None, None),
                 ("270 g semangka", "SEMANGKA", 270)],
    steps=["Lumuri ikan dengan garam dan jeruk nipis, bilas, lalu goreng hingga matang.",
           "Tumis bumbu halus dengan sereh, salam, dan laos; tambahkan air, labu siam, dan tempe hingga matang.",
           "Masukkan santan, ikan, dan tomat; bumbui secukupnya.",
           "Sajikan dengan nasi dan semangka."])

add(slug="nugget-tempe-ayam-sayuran", title="Nugget Tempe Ayam Sayuran", src="K2023", page=31, age=(12, 23), kind="selingan",
    portions=3, printed=(191, 10.5, 9.0),
    ingredients=[("200 g tempe, potong kecil, kukus", "TEMPE", 200), ("100 g daging ayam cincang, haluskan", "DAGING_AYAM", 100),
                 ("100 g (2 butir) telur ayam, kocok", "TELUR_AYAM", 100), ("50 g (5 sdm) wortel", "WORTEL", 50),
                 ("50 g (5 sdm) keju parut", "KEJU_CHEDDAR", 50), ("10 g (1 batang) bawang daun, iris halus", "DAUN_BAWANG", 10),
                 ("10 g bawang goreng halus", None, 10), ("10 g bawang putih halus", "BAWANG_PUTIH", 10),
                 ("20 g (2 sdm) tepung terigu (adonan)", "TEPUNG_TERIGU", 20), ("20 g (2 sdm) tepung tapioka", "TEPUNG_TAPIOKA", 20),
                 ("30 g (3 sdm) tepung terigu (pelapis)", "TEPUNG_TERIGU", 30), ("100 g (10 sdm) tepung panir", "TEPUNG_ROTI", 100),
                 ("100 ml air; minyak untuk menggoreng", None, None), ("270 g semangka", "SEMANGKA", 270)],
    steps=["Campur semua bahan adonan, tuang ke loyang berolesi minyak, kukus 30 menit.",
           "Setelah dingin potong-potong, celup ke larutan terigu lalu gulingkan di tepung panir.",
           "Dinginkan sebentar di kulkas, lalu goreng hingga matang. Sajikan dengan semangka."])

add(slug="nasi-bakar-ayam-santan", title="Nasi Bakar Ayam Santan", src="K2023", page=35, age=(24, 59), kind="utama",
    portions=3, printed=(421, 18.2, 18.2),
    ingredients=[("150 g (15 sdm) beras putih", "BERAS_PUTIH", 150), ("20 g (2 sdm) minyak goreng", "MINYAK_SAWIT", 20),
                 ("10 g (1 sdm) margarin", "MARGARIN", 10), ("5 g bawang putih goreng, 5 g bawang merah goreng", None, 10),
                 ("120 g (12 sdm) fillet dada ayam, potong kotak", "DADA_AYAM", 120), ("60 g (3 potong) tahu, potong kotak", "TAHU", 60),
                 ("60 g (6 ekor) udang", "UDANG", 60), ("30 g (3 sdm) daun bayam", "BAYAM", 30), ("30 g (3 sdm) wortel", "WORTEL", 30),
                 ("50 ml (5 sdm) santan kental", "SANTAN", 50),
                 ("Bumbu: bawang merah, bawang putih, ketumbar, kemiri, jinten, jahe, daun jeruk, salam, sereh, pandan, garam", None, None),
                 ("300 g pepaya", "PEPAYA", 300)],
    steps=["Masak beras dengan bumbu gurih (margarin, bawang goreng, daun-daunan) hingga menjadi nasi.",
           "Tumis bumbu halus dengan jahe, salam, sereh, daun jeruk; masak ayam dan udang, tambahkan santan, tahu, wortel, bayam.",
           "Bungkus nasi dan isian dengan daun pisang, kukus 10 menit, lalu panggang 10 menit.",
           "Sajikan dengan pepaya."])

add(slug="nasi-sup-tabas-udang-sayur", title="Nasi Sup Tabas Udang Sayur", src="K2023", page=37, age=(24, 59), kind="utama",
    portions=3, printed=(537, 23.4, 18.9),
    ingredients=[("300 g (3 centong) nasi putih", "NASI_PUTIH", 300), ("150 g (15 sdm) ikan tenggiri cincang", "IKAN_TENGGIRI", 150),
                 ("1 butir putih telur", None, None), ("20 g (2 sdm) tepung tapioka", "TEPUNG_TAPIOKA", 20),
                 ("90 g (9 sdm) tahu", "TAHU", 90), ("20 g (2 batang) daun bawang", "DAUN_BAWANG", 20),
                 ("10 g bawang goreng", None, 10), ("10 g saos tiram, 5 g kecap ikan", None, 15),
                 ("10 g (1 sdm) minyak wijen", None, 10), ("5 g garam, 2,5 g merica", None, None),
                 ("90 g (9 sdm) udang rebus", "UDANG", 90), ("500 ml air kaldu udang", None, None),
                 ("60 g (6 sdm) pokcoy", "PAKCOY", 60), ("60 g (6 sdm) soun, rendam", "SOUN", 60),
                 ("60 g (6 sdm) wortel", "WORTEL", 60), ("10 g (1 batang) seledri", "SELEDRI", 10),
                 ("10 g (1 sdm) minyak untuk menumis", "MINYAK_SAWIT", 10),
                 ("Bumbu halus: 2 siung bawang merah, 1 siung bawang putih; 1 cm jahe", None, None),
                 ("540 g semangka", "SEMANGKA", 540)],
    steps=["Campur ikan, tapioka, bumbu, dan putih telur hingga bisa dibentuk; isikan ke tahu yang dilubangi, kukus 15-20 menit.",
           "Tumis bumbu halus, tambahkan kaldu udang, udang, wortel, dan bumbu.",
           "Masukkan tahu tabas, pokcoy, dan soun; siramkan kuah ke mangkuk berisi nasi.",
           "Sajikan dengan semangka."])

add(slug="nasi-masak-ayam-kecap-sayur", title="Nasi Masak Ayam Kecap Sayur", src="K2023", page=39, age=(24, 59), kind="utama",
    portions=3, printed=(424, 22.9, 18.1),
    ingredients=[("300 g (3 centong) nasi putih", "NASI_PUTIH", 300), ("120 g (12 sdm) dada ayam fillet, iris tipis", "DADA_AYAM", 120),
                 ("60 g (6 butir) telur puyuh rebus", "TELUR_PUYUH", 60), ("150 g (2 buah besar) tahu putih, potong dadu", "TAHU", 150),
                 ("100 g (10 sdm) pakcoy, potong 3 cm", "PAKCOY", 100), ("40 g (4 sdm) kecap manis", None, 40),
                 ("50 ml (5 sdm) air", None, None), ("20 g (2 sdm) minyak", "MINYAK_SAWIT", 20),
                 ("1 siung bawang putih, 1/4 bawang bombay, daun bawang", None, None),
                 ("Garam, gula, merica secukupnya", None, None), ("300 g (3 buah) jeruk", "JERUK_MANIS", 300)],
    steps=["Tumis bawang putih lalu bawang bombay hingga harum, masukkan ayam hingga berubah warna.",
           "Tambahkan tahu, telur puyuh, pakcoy, kecap manis, bumbu, dan air; masak hingga matang.",
           "Taburi daun bawang, sajikan dengan nasi dan jeruk."])

add(slug="bola-bola-nasi-rabuk-ikan", title="Bola-bola Nasi Rabuk Ikan", src="K2023", page=40, age=(24, 59), kind="utama",
    portions=3, printed=(468, 14.4, 17.4),
    ingredients=[("150 g beras, dimasak menjadi nasi", "BERAS_PUTIH", 150), ("40 g (4 sdm) minyak sayur", "MINYAK_SAWIT", 40),
                 ("18 g (2 sdm) buncis, iris", "BUNCIS", 18), ("10 g (1 sdm) wortel, cincang", "WORTEL", 10),
                 ("45 g (4,5 sdm) jagung pipil, cincang kasar", "JAGUNG_MANIS", 45), ("50 g (5 sdm) tepung terigu", "TEPUNG_TERIGU", 50),
                 ("30 g (1/2 butir) telur ayam", "TELUR_AYAM", 30), ("50 g (5 sdm) rabuk ikan", None, 50),
                 ("10 g (2 sdm) bawang bombay iris", "BAWANG_BOMBAY", 10), ("5 g bawang putih goreng, 5 g bawang merah goreng", None, 10),
                 ("Daun bawang, lada, garam, kaldu jamur secukupnya", None, None),
                 ("Pelapis: 50 g (1 butir) telur ayam, tepung roti secukupnya", "TELUR_AYAM", 50),
                 ("300 g buah naga", None, 300)],
    steps=["Tumis bawang bombay lalu sayuran hingga setengah matang.",
           "Campur dengan nasi, terigu, telur, bawang goreng, dan bumbu hingga kalis.",
           "Pipihkan adonan, isi dengan rabuk ikan, bentuk bulat; lapisi terigu, telur kocok, dan tepung roti.",
           "Diamkan minimal 1 jam lalu goreng. Sajikan dengan buah naga."])

# ============================== K2022 (yang tidak ada padanannya di K2023) ==============================
add(slug="bubur-ikan-jagung", title="Bubur Ikan Jagung", src="K2022", page=6, age=(6, 8), kind="utama", portions=1,
    printed=(190.6, 7.5, 6.8), note="Jumlah porsi tidak tercetak; nilai gizi dianggap untuk 1 resep = 1 porsi. Jenis ikan tidak disebut.",
    ingredients=[("15 g (1,5 sdm) tepung jagung", "TEPUNG_JAGUNG", 15), ("10 g (1 sdm) ikan", None, 10),
                 ("5 g (1 sdt) tempe", "TEMPE", 5), ("25 g pisang kepok", "PISANG", 25), ("20 g daun kangkung", "KANGKUNG", 20),
                 ("1 sdt minyak kelapa", "MINYAK_KELAPA", 5), ("Air matang secukupnya", None, None)],
    steps=["Rebus ikan, tempe, dan pisang hingga matang, tambahkan kangkung, lalu saring.",
           "Larutkan tepung jagung dengan sedikit air, masak bersama air dan minyak hingga kental.",
           "Campurkan hasil saringan ke bubur jagung dan sajikan."])

add(slug="nasi-tim-ikan-telur-puyuh-wortel", title="Nasi Tim Ikan Telur Puyuh Wortel", src="K2022", page=7, age=(9, 11),
    kind="utama", portions=1, printed=(202.7, 7.5, 7.3),
    note="Jumlah porsi tidak tercetak; dianggap 1 porsi. Jenis ikan tidak disebut.",
    ingredients=[("25 g beras", "BERAS_PUTIH", 25), ("20 g ikan segar", None, 20), ("1 butir telur puyuh", "TELUR_PUYUH", 10),
                 ("15 g wortel", "WORTEL", 15), ("10 g tomat", "TOMAT", 10), ("5 g (1 sdt) minyak kelapa", "MINYAK_KELAPA", 5),
                 ("75 ml (1/3 gelas belimbing) kaldu", None, None), ("50 g pepaya", "PEPAYA", 50)],
    steps=["Masukkan beras, ikan, telur puyuh, dan minyak ke mangkuk tim, tambahkan kaldu, tim hingga matang.",
           "Masukkan wortel dan tomat, tim kembali hingga lunak.",
           "Sajikan dengan saus pepaya."])

add(slug="tim-ikan-menado", title="Tim Ikan Menado", src="K2022", page=10, age=(12, 23), kind="utama", portions=1,
    printed=(234.3, 10.7, 8.5),
    note="Satuan labu kuning (60), ikan segar (30), dan pisang ambon (50) tidak tercetak; diasumsikan gram. Jumlah porsi tidak tercetak.",
    ingredients=[("60 g jagung muda pipil", "JAGUNG_MANIS", 60), ("60 labu kuning (satuan tidak tercetak)", "LABU_KUNING", 60),
                 ("30 ikan segar (satuan tidak tercetak)", None, 30), ("10 g (1 sdm) telur ayam", "TELUR_AYAM", 10),
                 ("15 g daun kangkung", "KANGKUNG", 15), ("10 g tomat", "TOMAT", 10),
                 ("50 pisang ambon (satuan tidak tercetak)", "PISANG", 50), ("5 g (1 sdt) minyak kelapa", "MINYAK_KELAPA", 5),
                 ("100 ml kaldu ayam", None, None)],
    steps=["Susun jagung, labu kuning, ikan, dan telur di mangkuk tim, tambahkan kaldu.",
           "Masukkan pisang, kangkung, tomat, dan minyak; tim hingga matang."])

add(slug="nugget-sayuran", title="Nugget Sayuran", src="K2022", page=13, age=(12, 23), kind="selingan", portions=2,
    printed=(270.5, 10.6, 15.7),
    ingredients=[("150 g ubi jalar merah, rebus dan haluskan", "UBI_JALAR", 150), ("50 g (1 butir) telur ayam, kocok", "TELUR_AYAM", 50),
                 ("30 g daging ayam", "DAGING_AYAM", 30), ("1 cangkir bayam, cincang kasar", "BAYAM", None),
                 ("20 g (2 sdm) wortel, parut kasar", "WORTEL", 20), ("3 siung bawang putih, cincang", None, None),
                 ("Garam secukupnya; minyak untuk menggoreng", None, None)],
    steps=["Campur bayam, wortel, ubi, telur, ayam, bawang putih, dan garam hingga rata.",
           "Bentuk pipih bulat, celupkan ke kocokan telur, lalu goreng hingga matang dan tiriskan."])

add(slug="nasi-ayam-katsu-tumis-sayur-melon", title="Nasi Ayam Katsu, Tumis Sayuran + Melon", src="K2022", page=14,
    age=(24, 59), kind="utama", portions=3, printed=(403.3, 12.0, 17.7),
    note="Tepung terigu tercetak '10 sdm' (dihitung 100 g dengan 1 sdm = 10 g). Minyak goreng tidak tercetak.",
    ingredients=[("225 g nasi putih", "NASI_PUTIH", 225), ("75 g ayam fillet", "DADA_AYAM", 75),
                 ("10 sdm tepung terigu", "TEPUNG_TERIGU", 100), ("10 g tepung jagung", "TEPUNG_JAGUNG", 10),
                 ("50 g tepung roti", "TEPUNG_ROTI", 50), ("1/2 butir telur ayam", "TELUR_AYAM", 25),
                 ("30 g wortel", "WORTEL", 30), ("30 g buncis", "BUNCIS", 30), ("30 g jagung pipil kuning", "JAGUNG_MANIS", 30),
                 ("30 g bawang bombay", "BAWANG_BOMBAY", 30), ("30 g bawang putih", "BAWANG_PUTIH", 30),
                 ("Garam, gula, merica, air secukupnya", None, None), ("3 potong melon", "MELON", 135)],
    steps=["Pipihkan ayam, beri garam dan merica, lapisi adonan tepung, telur, lalu tepung roti; goreng hingga kuning keemasan.",
           "Tumis bawang, masukkan wortel, jagung, buncis, sedikit air, garam, dan gula.",
           "Sajikan dengan nasi dan melon."])

add(slug="nasi-bakar-ikan-tongkol-pepaya", title="Nasi Bakar Ikan Tongkol + Pepaya", src="K2022", page=15, age=(24, 59),
    kind="utama", portions=2, printed=(270.5, 10.6, 15.7), printed_suspect=True,
    note="Nilai gizi tercetak identik dengan Nugget Sayuran (hlm. 13); kemungkinan salah cetak sehingga tidak dipakai. Jumlah pepaya tidak tercetak.",
    ingredients=[("330 g nasi putih", "NASI_PUTIH", 330), ("90 g ikan tongkol kukus", "IKAN_TONGKOL", 90),
                 ("15 g bayam", "BAYAM", 15), ("45 g tahu, dihancurkan", "TAHU", 45), ("70 ml santan", "SANTAN", 70),
                 ("Jahe, lengkuas, serai, daun salam, kemangi, garam, gula", None, None),
                 ("Bumbu halus: 2 siung bawang merah, 2 siung bawang putih, 2 butir kemiri", None, None),
                 ("Daun pisang; minyak untuk menumis", None, None), ("Pepaya", "PEPAYA", None)],
    steps=["Tumis bumbu halus dengan daun salam, serai, dan lengkuas; masukkan tongkol suwir, tahu, santan, dan bayam.",
           "Bungkus nasi dengan daun pisang, beri isian dan kemangi.",
           "Bakar atau kukus hingga daun kering. Sajikan dengan pepaya."])

add(slug="pepes-tahu", title="Pepes Tahu", src="K2022", page=16, age=(24, 59), kind="selingan", portions=2,
    printed=(304.7, 17.9, 17.0),
    ingredients=[("300 g tahu putih, haluskan", "TAHU", 300), ("100 g wortel, parut", "WORTEL", 100),
                 ("2 siung bawang putih, 3 siung bawang merah, iris", None, None), ("10 g daging ayam", "DAGING_AYAM", 10),
                 ("50 g (1 butir) telur ayam", "TELUR_AYAM", 50), ("15 g kerupuk aci", None, 15),
                 ("10 g daun bawang", "DAUN_BAWANG", 10), ("5 g margarin", "MARGARIN", 5),
                 ("15 g (1 sdm) tepung tapioka", "TEPUNG_TAPIOKA", 15), ("Daun pisang", None, None)],
    steps=["Campur tahu halus, wortel, bawang, ayam, kerupuk aci yang direndam, tapioka, dan telur kocok.",
           "Ambil 2 sdm adonan, bungkus dengan daun pisang.",
           "Kukus hingga matang."])

add(slug="omelet-mie-ceria", title="Omelet Mie Ceria", src="K2022", page=17, age=(24, 59), kind="selingan", portions=2,
    printed=(335.9, 15.9, 21.7),
    ingredients=[("50 g daging ayam giling", "AYAM_GILING", 50), ("100 g (2 butir) telur ayam", "TELUR_AYAM", 100),
                 ("40 g sawi hijau, iris tipis", "SAWI_HIJAU", 40), ("50 g tauge", "TAUGE", 50),
                 ("10 g (1 batang) daun bawang, iris tipis", "DAUN_BAWANG", 10), ("7,5 ml (1,5 sdt) kecap asin", "KECAP_ASIN", 7.5),
                 ("3 g (1/2 sdt) merica", None, None), ("50 g wortel", "WORTEL", 50), ("20 ml (2 sdm) minyak", "MINYAK_SAWIT", 20),
                 ("40 g mie kering", "MIE_TELUR", 40)],
    steps=["Rebus mie hingga matang dan tiriskan, lalu aduk dengan semua bahan kecuali minyak.",
           "Panaskan minyak di wajan antilengket, masak adonan dalam dua bagian hingga kedua sisi matang.",
           "Potong sesuai selera dan sajikan hangat."])

add(slug="roti-goreng-isi-ragout-ayam-sayuran", title="Roti Goreng isi Ragout Ayam Sayuran", src="K2022", page=18,
    age=(24, 59), kind="selingan", portions=5, printed=(319.2, 16.8, 12.0),
    note="Daging ayam tercetak dalam keadaan rebus; estimasi memakai komposisi ayam mentah sehingga cenderung rendah. Berat roti tawar tidak tercetak.",
    ingredients=[("300 ml susu cair", "SUSU_SAPI", 300), ("10 lembar roti tawar, potong segitiga", "ROTI_TAWAR", None),
                 ("1/2 buah bawang bombay, cincang halus", None, None), ("1 sdt gula pasir, 1 sdt garam", None, None),
                 ("7,5 g margarin", "MARGARIN", 7.5), ("160 g daging ayam rebus", "DAGING_AYAM", 160),
                 ("60 g wortel, cincang", "WORTEL", 60), ("30 g buncis, potong kecil", "BUNCIS", 30),
                 ("3 sdm tepung terigu", "TEPUNG_TERIGU", 30), ("1 butir telur ayam", "TELUR_AYAM", 50),
                 ("1/2 sdm seledri; tepung panir secukupnya", None, None)],
    steps=["Tumis bawang bombay dengan margarin, tambahkan terigu, lalu tuang susu sedikit demi sedikit sambil diaduk.",
           "Masukkan wortel, buncis, ayam, dan bumbu hingga mengental menjadi ragout.",
           "Olesi roti dengan susu, beri isian, tutup roti lain; celup ke telur dan tepung panir, lalu goreng."])

add(slug="stick-ikan-sayur-renyah", title="Stick Ikan dan Sayur Renyah", src="K2022", page=20, age=(24, 59), kind="selingan",
    portions=2, printed=(315.2, 15.3, 19.2), note="Jenis ikan tidak disebut. Tepung bumbu serbaguna tidak ada di katalog.",
    ingredients=[("100 g fillet ikan segar", None, 100), ("40 g (4 sdm) wortel", "WORTEL", 40), ("25 g kangkung", "KANGKUNG", 25),
                 ("1 butir telur ayam", "TELUR_AYAM", 50), ("50 g (5 sdm) tepung bumbu serbaguna", None, 50),
                 ("Air es secukupnya; minyak untuk menggoreng", None, None)],
    steps=["Cincang halus wortel dan kangkung, campur dengan tepung dan telur.",
           "Tambahkan air es sedikit demi sedikit hingga adonan mengental.",
           "Celupkan potongan fillet ikan ke adonan, goreng hingga matang."])

add(slug="ikan-bakar-balita", title="Ikan Bakar Balita", src="K2022", page=22, age=(24, 59), kind="lauk", portions=4,
    printed=(140.6, 19.7, 5.6), note="Berat ikan tidak tercetak (1 ekor ikan air tawar).",
    ingredients=[("1 ekor ikan air tawar", None, None), ("2 buah jeruk nipis", "JERUK_NIPIS", None),
                 ("Bumbu halus: 1 siung bawang putih, 5 butir bawang merah, 1/2 sdm ketumbar, 1 cm jahe, 1 cm kunyit", None, None),
                 ("Garam secukupnya (boleh tidak dipakai)", None, None)],
    steps=["Lumuri ikan dengan air jeruk nipis.",
           "Bakar di atas bara sambil dioles bumbu halus hingga matang, lalu sajikan."])

RECIPES = R
