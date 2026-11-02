import { supabase } from "./supabase";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = "gemini-3.5-flash-lite";

/**
 * Prompt Sistem Medis & Nutrisi Sesuai PRD Nutriva:
 * - Standar WHO / Kemenkes RI
 * - Personalisasi sesuai konteks usia & pantangan anak
 * - Guardrail: Larang diagnosis penyakit atau dosis obat klinis
 */
const SYSTEM_PROMPT = `
Anda adalah Asisten Gizi & Tumbuh Kembang Balita AI dari Nutriva, berpedoman pada standar resmi WHO, UNICEF, dan Kementerian Kesehatan RI (Kemenkes).
Peran Anda: Memberikan edukasi, rekomendasi menu, takaran porsi MPASI, dan tips nutrisi secara ramah, empati, dan mudah dimengerti orang tua.

Pedoman Penting:
1. Personalisasi: Sesuaikan teks jawaban dengan nama anak, usia anak, dan pantangan makanannya jika ada.
2. Keamanan Medis (Medical Guardrail):
   - Anda BUKAN pengganti dokter atau tenaga medis.
   - JANGAN PERNAH mendiagnosis penyakit secara klinis atau memberikan resep dosis obat/suplemen medis keras.
   - Jika orang tua menanyakan gejala gawat darurat (demam tinggi berkepanjangan, dehidrasi parah, penurunan kesadaran, sesak napas, muntah terus-menerus), segera berikan peringatan tegas untuk membawa anak ke Puskesmas, Posyandu, atau Dokter Anak.
3. Gaya Bahasa: Bahasa Indonesia yang hangat, suportif, informatif, dan praktis dengan poin-poin singkat yang mudah dibaca di ponsel.
`;

export const assistantService = {
  /**
   * Mengambil riwayat pesan anak dari tabel chat_messages di Supabase
   */
  async getHistory(childId) {
    if (!childId) return [];
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("child_id", childId)
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("Gagal mengambil riwayat pesan:", error.message);
      return [];
    }

    return (data || []).map((msg) => ({
      id: msg.id,
      role: msg.sender === "user" ? "user" : "bot",
      text: msg.message_text,
      createdAt: msg.created_at,
      requiresMedicalReferral: msg.requires_medical_referral,
    }));
  },

  /**
   * Mengirim pertanyaan ke Gemini API dengan konteks anak
   */
  async sendMessage(child, questionText) {
    const childId = child?.id;
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // 1. Simpan pesan pengguna ke Supabase
    if (userId && childId) {
      await supabase
        .from("chat_messages")
        .insert({
          user_id: userId,
          child_id: childId,
          sender: "user",
          message_text: questionText,
        });
    }

    // 2. Susun konteks profil anak
    const childContext = child
      ? `[Konteks Profil Anak]:
- Nama: ${child.name || "Anak"}
- Usia: ${child.age || (child.birth_date ? `Lahir ${child.birth_date}` : "Belum ditentukan")}
- Berat Badan Terakhir: ${child.weight || child.initial_weight_kg || "-"} kg
- Pantangan/Alergi: ${child.allergy || (child.avoided_foods?.length ? child.avoided_foods.join(", ") : "Tidak ada")}
- Preferensi Makanan: ${child.dietary_preferences?.length ? child.dietary_preferences.join(", ") : "-"}`
      : "Konteks profil anak umum.";

    const prompt = `${SYSTEM_PROMPT}

${childContext}

Pertanyaan Orang Tua: "${questionText}"
Berikan jawaban terstruktur:`;

    // 3. Panggil Gemini API
    let botReplyText;
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const json = await res.json();
      if (json.error) {
        throw new Error(json.error.message || "Gagal memproses jawaban AI");
      }

      const candidate = json.candidates?.[0];
      botReplyText = candidate?.content?.parts?.[0]?.text || "Maaf, asisten AI sedang tidak dapat memberikan jawaban.";
    } catch (err) {
      console.error("Gemini API Error:", err);
      botReplyText =
        "Maaf, koneksi ke asisten gizi AI sedang bermasalah. Silakan coba kembali beberapa saat lagi.";
    }

    // Deteksi apakah jawaban menyarankan rujukan medis darurat
    const requiresReferral =
      botReplyText.toLowerCase().includes("puskesmas") ||
      botReplyText.toLowerCase().includes("dokter spesialis anak") ||
      botReplyText.toLowerCase().includes("segera periksakan");

    // 4. Simpan jawaban AI ke Supabase
    let botMsgId = Date.now() + 1;
    if (userId && childId) {
      const { data } = await supabase
        .from("chat_messages")
        .insert({
          user_id: userId,
          child_id: childId,
          sender: "assistant",
          message_text: botReplyText,
          requires_medical_referral: requiresReferral,
          trusted_sources: [{ authority: "Kemenkes RI & WHO", title: "Pedoman Gizi Balita & PMBA" }],
        })
        .select()
        .single();
      if (data) botMsgId = data.id;
    }

    return {
      id: botMsgId,
      role: "bot",
      text: botReplyText,
      createdAt: new Date().toISOString(),
      requiresMedicalReferral: requiresReferral,
    };
  },

  /**
   * Menghapus riwayat percakapan anak
   */
  async clearHistory(childId) {
    if (!childId) return;
    const { error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("child_id", childId);

    if (error) {
      console.error("Gagal menghapus percakapan:", error.message);
      throw error;
    }
  },
};
