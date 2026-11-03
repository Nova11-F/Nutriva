import { supabase } from "./supabase";
import { growthRecords as initialRecords } from "../data/growthRecords";

const LOCAL_GROWTH_KEY = "nutriva_growth_records";

function getLocalRecords(childId) {
  try {
    const raw = localStorage.getItem(LOCAL_GROWTH_KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (list.length === 0 && (String(childId) === "1" || !childId)) {
      const seeded = initialRecords.map((r) => {
        const z = calculateZScores(18, r.weight, r.height, "Perempuan");
        return {
          id: r.id,
          childId: r.childId,
          date: r.date,
          ageInMonths: 18,
          weight: r.weight,
          height: r.height,
          headCircumference: r.headCircumference || 47.5,
          zScoreWaz: z.z_score_waz,
          zScoreHaz: z.z_score_haz,
          zScoreWhz: z.z_score_whz,
          needsAttention: z.needs_attention,
          insightStatus: z.insight_status,
          insightMessage: z.insight_message,
          createdAt: new Date(r.date).toISOString(),
        };
      });
      localStorage.setItem(LOCAL_GROWTH_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return String(childId) ? list.filter((r) => String(r.childId) === String(childId)) : list;
  } catch {
    return [];
  }
}

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

    let dbRecords = [];
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(childId);

    if (isUUID) {
      try {
        const { data, error } = await supabase
          .from("growth_records")
          .select("*")
          .eq("child_id", childId)
          .order("measurement_date", { ascending: true });

        if (!error && data) {
          dbRecords = data.map((row) => ({
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
        }
      } catch (err) {
        console.warn("Supabase growth query notice:", err.message);
      }
    }

    const localList = getLocalRecords(childId);
    const map = new Map();
    dbRecords.forEach((r) => map.set(r.id, r));
    localList.forEach((r) => map.set(r.id, r));
    const merged = Array.from(map.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
    return merged;
  },

  /**
   * Mengambil pengukuran pertumbuhan terakhir
   */
  async getLatest(childId) {
    if (!childId) return null;
    const all = await this.getByChild(childId);
    if (all.length === 0) return null;
    return all[all.length - 1];
  },

  /**
   * Menambahkan data pengukuran baru ke Supabase
   */
  async add({ childId, date, weight, height, headCircumference, ageInMonths, gender = "Perempuan" }) {
    if (!childId) throw new Error("ID anak wajib diisi");
    if (!date) throw new Error("Tanggal pengukuran wajib diisi");
    if (!weight) throw new Error("Berat badan wajib diisi");
    if (!height) throw new Error("Tinggi badan wajib diisi");

    const calculatedAge = Number(ageInMonths) || 0;
    const zScores = calculateZScores(calculatedAge, Number(weight), Number(height), gender);
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(childId);

    if (isUUID) {
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

      try {
        const { data, error } = await supabase
          .from("growth_records")
          .insert([payload])
          .select()
          .single();

        if (!error && data) {
          return {
            id: data.id,
            childId: data.child_id,
            date: data.measurement_date,
            ageInMonths: Number(data.age_in_months),
            weight: Number(data.weight_kg),
            height: Number(data.height_cm),
            headCircumference: headCircumference ? Number(headCircumference) : null,
            zScoreWaz: data.z_score_waz,
            zScoreHaz: data.z_score_haz,
            zScoreWhz: data.z_score_whz,
            needsAttention: data.needs_attention,
            insightStatus: data.insight_status,
            insightMessage: data.insight_message,
          };
        }
      } catch (err) {
        console.warn("Gagal simpan ke Supabase, simpan ke lokal:", err.message);
      }
    }

    // Simpan ke localStorage
    const localRecord = {
      id: "local-" + Date.now(),
      childId: childId,
      date: date,
      ageInMonths: calculatedAge,
      weight: Number(weight),
      height: Number(height),
      headCircumference: headCircumference ? Number(headCircumference) : null,
      zScoreWaz: zScores.z_score_waz,
      zScoreHaz: zScores.z_score_haz,
      zScoreWhz: zScores.z_score_whz,
      needsAttention: zScores.needs_attention,
      insightStatus: zScores.insight_status,
      insightMessage: zScores.insight_message,
      createdAt: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem(LOCAL_GROWTH_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.push(localRecord);
      localStorage.setItem(LOCAL_GROWTH_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Gagal simpan ke localStorage:", e);
    }

    return localRecord;
  },

  /**
   * Menghapus record pengukuran
   */
  async remove(id) {
    if (!id) return;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      try {
        await supabase.from("growth_records").delete().eq("id", id);
      } catch (err) {
        console.warn("Supabase growth remove notice:", err.message);
      }
    }
    try {
      const raw = localStorage.getItem(LOCAL_GROWTH_KEY);
      if (raw) {
        const list = JSON.parse(raw);
        localStorage.setItem(LOCAL_GROWTH_KEY, JSON.stringify(list.filter((r) => r.id !== id)));
      }
    } catch {
      //
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
