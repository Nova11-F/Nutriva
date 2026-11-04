# Knowledge Base Nutriva AI Assistant

Status: **v0.2.** Dokumen berstatus `SOURCE_SUMMARY` sudah dicocokkan dengan sumber resmi (URL di front matter) tetapi tetap **belum direviu ahli gizi**; dokumen `SEED` belum dicocokkan. Isi berupa ringkasan prinsip umum yang sudah mapan.
Sebelum rilis ke pengguna, setiap dokumen WAJIB:
1. dicocokkan dengan teks sumber aslinya (nomor halaman/bab dicatat di `source_detail`),
2. direviu ahli gizi / tenaga kesehatan (isi `reviewed_by`, `reviewed_at`).

Format tiap file: front matter (`id`, `title`, `source`, `source_detail`, `topics`, `status`) lalu isi.
Retriever memecah isi per paragraf (dipisah baris kosong). Satu paragraf = satu gagasan.
Tambah dokumen baru cukup dengan menaruh file `.md` baru di folder ini.
