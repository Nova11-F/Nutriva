import { supabase } from "./supabase";
import { ageInMonthsAt, assessMeasurement } from "../lib/whoGrowth";

/**
 * Z-score memakai tabel LMS resmi WHO Child Growth Standards 2006 (src/lib/whoGrowth.js),
 * identik dengan engine Python di AI service. Rumus aproksimasi lama sudah dihapus.
 */
export const ZSCORE_METHOD = "who_lms_2006";

/** Dipertahankan untuk kompatibilitas pemanggil lama. */
export function calculateZScores(ageMonths, weightKg, heightCm, gender = "Perempuan") {
  const r = assessMeasurement({ ageMonths, gender, weightKg, heightCm });
  return {
    z_score_waz: r.zWaz,
    z_score_haz: r.zHaz,
    z_score_whz: r.zWhz,
    needs_attention: r.needsAttention,
    insight_status: r.insightStatus,
    insight_message: r.insightMessage,
  };
}

function mapRow(row) {
  const base = {
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
  };
  // Baris lama (rumus aproksimasi) atau baris awal dari trigger (tanpa z-score): hitung ulang untuk tampilan.
  const gender = row.children?.gender;
  if (row.zscore_method !== ZSCORE_METHOD && gender && base.weight > 0 && base.height > 0) {
    try {
      const r = assessMeasurement({
        ageMonths: Math.floor(base.ageInMonths),
        gender,
        weightKg: base.weight,
        heightCm: base.height,
      });
      Object.assign(base, {
        zScoreWaz: r.zWaz,
        zScoreHaz: r.zHaz,
        zScoreWhz: r.zWhz,
        needsAttention: r.needsAttention,
        insightStatus: r.insightStatus,
        insightMessage: r.insightMessage,
      });
    } catch (err) {
      console.warn("Gagal menghitung ulang z-score:", err.message);
    }
  }
  return base;
}

async function insertRecord(payload) {
  let res = await supabase.from("growth_records").insert([payload]).select("*, children(gender)").single();
  // Migrasi 20261103 belum dijalankan -> kolom zscore_method belum ada; simpan tanpa kolom itu.
  if (res.error && /zscore_method/.test(res.error.message || "")) {
    const rest = { ...payload };
    delete rest.zscore_method;
    res = await supabase.from("growth_records").insert([rest]).select("*, children(gender)").single();
  }
  return res;
}

export const growthService = {
  /** Semua riwayat pertumbuhan anak (urut tanggal naik). */
  async getByChild(childId) {
    if (!childId) return [];
    const { data, error } = await supabase
      .from("growth_records")
      .select("*, children(gender)")
      .eq("child_id", childId)
      .order("measurement_date", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data pertumbuhan:", error.message);
      return [];
    }
    return (data || []).map(mapRow);
  },

  /** Pengukuran terakhir. */
  async getLatest(childId) {
    if (!childId) return null;
    const { data, error } = await supabase
      .from("growth_records")
      .select("*, children(gender)")
      .eq("child_id", childId)
      .order("measurement_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Gagal mengambil pengukuran terakhir:", error.message);
      return null;
    }
    return data ? mapRow(data) : null;
  },

  /**
   * Menambahkan pengukuran baru.
   * Usia dihitung dari tanggal lahir pada tanggal pengukuran bila `birthDate` diberikan.
   */
  async add({ childId, date, weight, height, ageInMonths, birthDate, gender }) {
    if (!childId) throw new Error("ID anak wajib diisi");
    if (!date) throw new Error("Tanggal pengukuran wajib diisi");
    if (!weight) throw new Error("Berat badan wajib diisi");
    if (!height) throw new Error("Tinggi badan wajib diisi");
    if (!gender) throw new Error("Jenis kelamin anak wajib diketahui untuk menghitung z-score");

    const age = birthDate ? ageInMonthsAt(birthDate, date) : Math.floor(Number(ageInMonths));
    if (!Number.isFinite(age) || age < 0) throw new Error("Usia anak pada tanggal pengukuran tidak valid");

    const r = assessMeasurement({ ageMonths: age, gender, weightKg: Number(weight), heightCm: Number(height) });
    const payload = {
      child_id: childId,
      measurement_date: date,
      age_in_months: age,
      weight_kg: Number(weight),
      height_cm: Number(height),
      z_score_waz: r.zWaz,
      z_score_haz: r.zHaz,
      z_score_whz: r.zWhz,
      needs_attention: r.needsAttention,
      insight_status: r.insightStatus,
      insight_message: r.insightMessage,
      zscore_method: ZSCORE_METHOD,
    };

    const { data, error } = await insertRecord(payload);
    if (error) {
      if (error.code === "23505") throw new Error("Pengukuran pada tanggal ini sudah pernah dicatat.");
      throw new Error(error.message || "Gagal menyimpan data pertumbuhan.");
    }
    return mapRow(data);
  },

  /** Menghapus satu pengukuran. */
  async remove(id) {
    if (!id) return;
    const { error } = await supabase.from("growth_records").delete().eq("id", id);
    if (error) throw new Error(error.message || "Gagal menghapus data pengukuran.");
  },

  /** Menghapus semua riwayat pengukuran anak. */
  async removeByChild(childId) {
    if (!childId) return;
    const { error } = await supabase.from("growth_records").delete().eq("child_id", childId);
    if (error) throw new Error(error.message || "Gagal menghapus riwayat pertumbuhan.");
  },
};
