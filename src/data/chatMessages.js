export const suggestedQuestions = [
  "Menu MPASI apa yang cocok untuk usia anak saya?",
  "Bagaimana cara mengatasi anak susah makan?",
  "Apa tanda-tanda anak berisiko stunting?",
  "Makanan apa yang kaya protein hewani untuk anak?",
  "Kapan anak perlu dibawa ke posyandu atau dokter?",
];

export const fakeReplies = [
  {
    keywords: ["mpasi", "menu"],
    reply:
      "Untuk MPASI, pastikan ada empat unsur dalam satu porsi: karbohidrat (nasi/kentang), protein hewani (telur, ikan, ayam, hati ayam), lemak tambahan (santan atau minyak), dan sayur. Tekstur disesuaikan usia: halus untuk 6-8 bulan, lembut dan agak kasar untuk 9-11 bulan, lalu makanan keluarga yang dicincang setelah 12 bulan. Kamu bisa lihat resep yang sesuai di halaman Nutrisi.",
  },
  {
    keywords: ["susah makan", "tidak mau makan", "gtm"],
    reply:
      "Anak susah makan biasanya membaik dengan: jadwal makan teratur (3 kali makan utama, 2 kali camilan), durasi makan maksimal 30 menit, tanpa gawai di meja makan, dan mengenalkan makanan baru berulang kali dalam porsi kecil. Hindari memaksa agar makan tidak jadi pengalaman buruk. Jika berat badan tidak naik dalam 2 bulan, konsultasikan ke tenaga kesehatan.",
  },
  {
    keywords: ["stunting"],
    reply:
      "Stunting adalah kondisi tinggi badan anak jauh di bawah standar usianya akibat kekurangan gizi kronis. Tandanya antara lain tinggi badan di bawah kurva pertumbuhan, pertumbuhan melambat dari waktu ke waktu, dan anak tampak lebih kecil dari teman sebayanya. Pantau rutin di halaman Pertumbuhan. Nutriva hanya memberi informasi edukatif, diagnosis tetap oleh tenaga kesehatan.",
  },
  {
    keywords: ["protein"],
    reply:
      "Sumber protein hewani yang baik untuk anak: telur, ikan (kembung, lele, tongkol), daging ayam, hati ayam, dan daging sapi. Protein hewani lebih mudah diserap tubuh dan kaya zat besi serta zink yang penting untuk mencegah stunting. Pastikan matang sempurna dan sesuaikan dengan alergi anak.",
  },
  {
    keywords: ["posyandu", "dokter", "periksa"],
    reply:
      "Bawa anak ke posyandu setiap bulan untuk ditimbang dan diukur. Segera ke dokter atau puskesmas jika berat badan tidak naik atau turun, anak sangat lemas, demam tinggi lebih dari 3 hari, diare lebih dari 2 hari, atau menolak makan dan minum dalam waktu lama.",
  },
];

export const fallbackReply =
  "Terima kasih atas pertanyaannya. Saat ini saya masih dalam tahap pengembangan, jadi jawaban saya terbatas. Coba tanyakan tentang MPASI, anak susah makan, stunting, sumber protein, atau jadwal ke posyandu. Untuk kondisi khusus, konsultasikan dengan tenaga kesehatan.";