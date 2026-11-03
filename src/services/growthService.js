import { supabase } from "./supabase";

/**
 * Menghitung perkiraan Z-score berdasarkan standar WHO sederhana
 * @param {number} ageMonths Usia dalam bulan
 * @param {number} weightKg Berat badan (kg)
 * @param {number} heightCm Tinggi / Panjang badan (cm)
 * @param {string} gender 'Laki-laki' / 'Perempuan' / 'male' / 'female'
 */
export function calculateZScores(ageMonths, weightKg, heightCm, gender = "Perempuan") {
  const isMale = gender === "Laki-laki" || gender === "male";
  
  // Median estimasi WHO sederhana
  // BB lahir: 3.3 kg (L) / 3.2 kg (P), naik bertahap
  const medianWeight = isMale 
    ? 3.3 + (ageMonths * (ageMonths <= 6 ? 0.8 : ageMonths <= 12 ? 0.4 : 0.2))
    : 3.2 + (ageMonths * (ageMonths <= 6 ? 0.75 : ageMonths <= 12 ? 0.38 : 0.2));
  const sdWeight = medianWeight * 0.12;
  const zWaz = Number(((weightKg - medianWeight) / sdWeight).toFixed(2));

  // TB lahir: 50 cm (L) / 49 cm (P)
  const medianHeight = isMale
    ? 50 + (ageMonths * (ageMonths <= 6 ? 2.5 : ageMonths <= 12 ? 1.5 : 0.9))
    : 49 + (ageMonths * (ageMonths <= 6 ? 2.4 : ageMonths <= 12 ? 1.4 : 0.9));
  const sdHeight = medianHeight * 0.045;
  const zHaz = Number(((heightCm - medianHeight) / sdHeight).toFixed(2));

  // BB/TB (WHZ)
  const expectedWeightForHeight = Math.pow(heightCm / 100, 2) * (isMale ? 16.5 : 16.0);
  const sdWhz = expectedWeightForHeight * 0.11;
  const zWhz = Number(((weightKg - expectedWeightForHeight) / sdWhz).toFixed(2));

  const needsAttention = zHaz < -2 || zWaz < -2 || zWhz < -2;
  const insightStatus = needsAttention ? "early_awareness" : "normal_routine";
  const insightMessage = needsAttention
    ? "Pertumbuhan si kecil di bawah kurva standar WHO. Disarankan berkonsultasi dengan posyandu atau dokter anak."
    : "Pertumbuhan dan status gizi si kecil berada pada kurva normal standar WHO.";

  return {
    z_score_waz: zWaz,
    z_score_haz: zHaz,
    z_score_whz: zWhz,
    needs_attention: needsAttention,
    insight_status: insightStatus,
    insight_message: insightMessage,
  };
}

export const growthService = {
  /**
   * Mengambil semua riwayat pertumbuhan anak dari Supabase
   */
  async getByChild(childId) {
    if (!childId) return [];

    const { data, error } = await supabase
      .from("growth_records")
      .select("*")
      .eq("child_id", childId)
      .order("measurement_date", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data pertumbuhan:", error.message);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      childId: row.child_id,
      date: row.measurement_date,
      ageInMonths: Number(row.age_in_months) || 0,
      weight: Number(row.weight_kg) || 0,
      height: Number(row.height_cm) || 0,
      headCircumference: row.head_circumference_cm ? Number(row.head_circumference_cm) : null,
      zScoreWaz: row.z_score_waz,
      zScoreHaz: row.z_score_haz,
      zScoreWhz: row.z_score_whz,
      needsAttention: row.needs_attention,
      insightStatus: row.insight_status,
      insightMessage: row.insight_message,
      createdAt: row.created_at,
    }));
  },

  /**
   * Mengambil pengukuran pertumbuhan terakhir
   */
  async getLatest(childId) {
    if (!childId) return null;

    const { data, error } = await supabase
      .from("growth_records")
      .select("*")
      .eq("child_id", childId)
      .order("measurement_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Gagal mengambil pengukuran terakhir:", error.message);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      childId: data.child_id,
      date: data.measurement_date,
      ageInMonths: Number(data.age_in_months) || 0,
      weight: Number(data.weight_kg) || 0,
      height: Number(data.height_cm) || 0,
      headCircumference: data.head_circumference_cm ? Number(data.head_circumference_cm) : null,
      zScoreWaz: data.z_score_waz,
      zScoreHaz: data.z_score_haz,
      zScoreWhz: data.z_score_whz,
      needsAttention: data.needs_attention,
      insightStatus: data.insight_status,
      insightMessage: data.insight_message,
      createdAt: data.created_at,
    };
  },

  /**
   * Menambahkan data pengukuran baru ke Supabase
   */
  async add({ childId, date, weight, height, headCircumference: _headCircumference, ageInMonths, gender = "Perempuan" }) {
    if (!childId) throw new Error("ID anak wajib diisi");
    if (!date) throw new Error("Tanggal pengukuran wajib diisi");
    if (!weight) throw new Error("Berat badan wajib diisi");
    if (!height) throw new Error("Tinggi badan wajib diisi");

    const calculatedAge = Number(ageInMonths) || 0;
    const zScores = calculateZScores(calculatedAge, Number(weight), Number(height), gender);

    const payload = {
      child_id: childId,
      measurement_date: date,
      age_in_months: calculatedAge,
      weight_kg: Number(weight),
      height_cm: Number(height),
      z_score_waz: zScores.z_score_waz,
      z_score_haz: zScores.z_score_haz,
      z_score_whz: zScores.z_score_whz,
      needs_attention: zScores.needs_attention,
      insight_status: zScores.insight_status,
      insight_message: zScores.insight_message,
    };

    const { data, error } = await supabase
      .from("growth_records")
      .insert([payload])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error("Pengukuran pada tanggal ini sudah pernah dicatat.");
      }
      throw new Error(error.message || "Gagal menyimpan data pertumbuhan.");
    }

    return {
      id: data.id,
      childId: data.child_id,
      date: data.measurement_date,
      ageInMonths: Number(data.age_in_months),
      weight: Number(data.weight_kg),
      height: Number(data.height_cm),
      zScoreWaz: data.z_score_waz,
      zScoreHaz: data.z_score_haz,
      zScoreWhz: data.z_score_whz,
      needsAttention: data.needs_attention,
      insightStatus: data.insight_status,
      insightMessage: data.insight_message,
    };
  },

  /**
   * Menghapus record pengukuran
   */
  async remove(id) {
    if (!id) return;
    const { error } = await supabase.from("growth_records").delete().eq("id", id);
    if (error) {
      throw new Error(error.message || "Gagal menghapus data pengukuran.");
    }
  },

  /**
   * Menghapus semua riwayat pengukuran anak
   */
  async removeByChild(childId) {
    if (!childId) return;
    const { error } = await supabase.from("growth_records").delete().eq("child_id", childId);
    if (error) {
      throw new Error(error.message || "Gagal menghapus riwayat pertumbuhan.");
    }
  },
};
