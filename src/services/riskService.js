import { supabase } from "./supabase";
import { aiClient } from "./aiClient";
import { cleanRiskFactors } from "../constants/riskFactorOptions";
import { ageInMonthsAt, toApiGender } from "../lib/whoGrowth";

const MEASUREMENT_MAX_AGE_DAYS = 90;

function mapRow(r) {
  return {
    id: r.id,
    assessedAt: r.assessed_at,
    basis: r.basis,
    level: r.level,
    alert: r.alert,
    message: r.message,
    earlyAwareness: r.early_awareness,
    riskScore: r.risk_score === null ? null : Number(r.risk_score),
    modifiableFactors: r.modifiable_factors || [],
    modelVersion: r.model_version,
  };
}

/** Bentuk payload /v1/growth/assess dari profil anak + pengukuran terakhir (bila masih baru). */
export function buildAssessPayload(child, latestRecord) {
  const gender = toApiGender(child.gender);
  const ageNow = ageInMonthsAt(child.birthDate);
  const payload = { child_age_months: ageNow, gender, ...cleanRiskFactors(child.riskFactors || child.risk_factors) };
  if (latestRecord?.date && latestRecord.height > 0 && latestRecord.weight > 0) {
    const days = (Date.now() - new Date(latestRecord.date)) / 86400000;
    if (days <= MEASUREMENT_MAX_AGE_DAYS) {
      payload.child_age_months = Math.floor(latestRecord.ageInMonths);
      payload.height_cm = latestRecord.height;
      payload.weight_kg = latestRecord.weight;
    }
  }
  if (payload.height_cm && payload.birth_length_cm && payload.height_cm < payload.birth_length_cm) {
    delete payload.birth_length_cm; // data tidak konsisten -> biarkan model meng-impute
  }
  return payload;
}

const LOCAL_RISK_KEY = "nutriva_risk_assessments_local";

function getLocalRisk(childId) {
  try {
    const raw = localStorage.getItem(LOCAL_RISK_KEY);
    if (!raw) return null;
    const list = JSON.parse(raw);
    const item = Array.isArray(list) ? list.find((r) => r.child_id === childId) : null;
    return item ? mapRow(item) : null;
  } catch {
    return null;
  }
}

function saveLocalRisk(row) {
  try {
    const raw = localStorage.getItem(LOCAL_RISK_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const filtered = Array.isArray(list) ? list.filter((r) => r.child_id !== row.child_id) : [];
    filtered.unshift(row);
    localStorage.setItem(LOCAL_RISK_KEY, JSON.stringify(filtered.slice(0, 50)));
  } catch (e) {
    console.warn("Gagal simpan asesmen risiko ke localStorage:", e);
  }
}

export const riskService = {
  async getLatest(childId) {
    if (!childId) return null;
    try {
      const { data, error } = await supabase
        .from("risk_assessments")
        .select("*")
        .eq("child_id", childId)
        .order("assessed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!error && data) {
        return mapRow(data);
      }
    } catch {
      // offline / permission fallback
    }
    return getLocalRisk(childId);
  },

  /**
   * Panggil AI service lalu simpan ringkasan hasil (tanpa nama anak).
   * @returns hasil yang sudah dipetakan untuk UI
   */
  async assess(child, latestRecord) {
    const ageNow = ageInMonthsAt(child.birthDate);
    if (ageNow > 59) throw new Error("Profil risiko hanya tersedia untuk anak usia 0–59 bulan.");
    const payload = buildAssessPayload(child, latestRecord);
    const res = await aiClient.assess(payload);

    const row = {
      child_id: child.id,
      growth_record_id: payload.height_cm && latestRecord?.id ? latestRecord.id : null,
      basis: res.basis,
      level: res.level,
      alert: res.alert,
      message: res.message,
      risk_score: res.risk_model?.risk_score ?? null,
      early_awareness: Boolean(res.risk_model?.early_awareness),
      probabilities: res.risk_model?.probabilities || {},
      modifiable_factors: res.modifiable_factors || [],
      model_version: res.risk_model?.model_version || "unknown",
      input_snapshot: { ...payload },
    };
    const localRow = { ...row, id: `local-${Date.now()}`, assessed_at: new Date().toISOString() };
    saveLocalRisk(localRow);

    try {
      const { data, error } = await supabase.from("risk_assessments").insert(row).select().single();
      if (!error && data) {
        saveLocalRisk(data);
        return mapRow(data);
      }
    } catch {
      // gunakan localRow
    }
    return mapRow(localRow);
  },
};
