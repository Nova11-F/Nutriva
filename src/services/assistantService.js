import { supabase } from "./supabase";
import { aiClient } from "./aiClient";
import { growthService } from "./growthService";
import { ageInMonthsAt, toApiGender } from "../lib/whoGrowth";

/**
 * AI Nutrition Assistant.
 * LLM, RAG, dan guardrail medis berjalan di server (ai-service/). Frontend hanya mengirim pertanyaan,
 * konteks anak seperlunya (mengikuti persetujuan `profiles.ai_context_consent`), dan riwayat singkat.
 */
const MAX_HISTORY = 6;
const MEASUREMENT_MAX_AGE_DAYS = 90;
let consentCache = { userId: null, value: true };

async function getConsent(userId) {
  if (consentCache.userId === userId) return consentCache.value;
  const { data, error } = await supabase
    .from("profiles")
    .select("ai_context_consent")
    .eq("id", userId)
    .maybeSingle();
  const value = error ? false : data?.ai_context_consent !== false; // gagal baca -> anggap tidak setuju
  consentCache = { userId, value };
  return value;
}

/** Dipanggil saat user mengubah persetujuan di profil. */
export function resetAssistantConsentCache() {
  consentCache = { userId: null, value: true };
}

function daysBetween(a, b) {
  return Math.abs(new Date(b) - new Date(a)) / 86400000;
}

async function buildContext(child, consent) {
  if (!child) return {};
  let gender;
  try {
    gender = toApiGender(child.gender);
  } catch {
    gender = undefined;
  }
  const ageMonths = child.birthDate ? ageInMonthsAt(child.birthDate) : undefined;
  if (!consent) return {}; // tanpa persetujuan: tidak ada data anak yang dikirim

  const childProfile = {
    name: (child.nickname || child.name || "").split(" ")[0] || undefined,
    age_months: Number.isFinite(ageMonths) && ageMonths <= 72 ? ageMonths : undefined,
    gender,
    allergies: (child.allergies || child.avoided_foods || []).slice(0, 15),
    food_preferences: (child.favoriteFoods || child.dietary_preferences || []).slice(0, 15),
  };

  let growthInput;
  if (gender && Number.isFinite(ageMonths) && ageMonths <= 59) {
    const rf = child.risk_factors || {};
    growthInput = { child_age_months: ageMonths, gender, ...rf };
    const latest = await growthService.getLatest(child.id);
    if (latest && daysBetween(latest.date, new Date()) <= MEASUREMENT_MAX_AGE_DAYS && latest.ageInMonths <= 59) {
      // pakai usia saat pengukuran agar z-score konsisten dengan angka tinggi/berat
      growthInput = {
        ...growthInput,
        child_age_months: Math.floor(latest.ageInMonths),
        height_cm: latest.height || undefined,
        weight_kg: latest.weight || undefined,
      };
    }
  }
  return { child_profile: childProfile, growth_input: growthInput };
}

function suggestNavigation(question) {
  const q = question.toLowerCase();
  if (/mp-?asi|resep|menu|masak|makan/.test(q)) {
    return [{ type: "view_recommendation", label: "Lihat resep sesuai usia", targetRoute: "/nutrition/recipes" }];
  }
  if (/tinggi|berat|tumbuh|stunting|pendek|kurus|z-?score/.test(q)) {
    return [{ type: "open_growth", label: "Buka grafik pertumbuhan", targetRoute: "/growth" }];
  }
  return [];
}

function mapDbMessage(msg) {
  const actions = Array.isArray(msg.suggested_actions) ? msg.suggested_actions : [];
  return {
    id: msg.id,
    role: msg.sender === "user" ? "user" : "bot",
    text: msg.message_text,
    createdAt: msg.created_at,
    requiresMedicalReferral: msg.requires_medical_referral,
    sources: Array.isArray(msg.trusted_sources) ? msg.trusted_sources.filter((s) => s?.title) : [],
    steps: actions.filter((a) => a?.type === "step").map((a) => a.label),
    links: actions.filter((a) => a?.targetRoute),
  };
}

export const assistantService = {
  /** Riwayat pesan anak dari tabel chat_messages. */
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
    return (data || []).map(mapDbMessage);
  },

  /**
   * Kirim pertanyaan ke AI service, lalu simpan pertanyaan + jawaban.
   * @param {object} child  profil anak aktif
   * @param {string} questionText
   * @param {Array<{role:'user'|'bot', text:string}>} history  pesan sebelumnya (paling baru di akhir)
   * @throws {AiServiceError} bila layanan AI gagal; pesan tidak disimpan agar riwayat tetap konsisten.
   */
  async sendMessage(child, questionText, history = []) {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    const consent = userId ? await getConsent(userId) : false;
    const context = await buildContext(child, consent);

    const res = await aiClient.chat({
      question: questionText,
      ...context,
      history: history
        .filter((m) => m?.text && !m.failed)
        .slice(-MAX_HISTORY)
        .map((m) => ({ role: m.role === "user" ? "user" : "assistant", text: String(m.text).slice(0, 2000) })),
    });

    const sources = (res.source_details || []).map((s) => ({ title: s.title, reference: s.reference, url: s.url || null }));
    const actions = [
      ...(res.actions || []).map((label) => ({ type: "step", label })),
      ...(res.route === "normal" && !res.degraded ? suggestNavigation(questionText) : []),
    ];

    let saved = null;
    if (userId && child?.id) {
      const base = { user_id: userId, child_id: child.id };
      const { error: userErr } = await supabase
        .from("chat_messages")
        .insert({ ...base, sender: "user", message_text: questionText });
      if (userErr) console.warn("Gagal menyimpan pesan:", userErr.message);
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          ...base,
          sender: "assistant",
          message_text: res.answer,
          requires_medical_referral: Boolean(res.refer_to_professional),
          trusted_sources: sources,
          suggested_actions: actions,
        })
        .select()
        .single();
      if (error) console.warn("Gagal menyimpan jawaban:", error.message);
      saved = data;
    }

    return {
      ...mapDbMessage(
        saved || {
          id: `local-${Date.now()}`,
          sender: "assistant",
          message_text: res.answer,
          created_at: new Date().toISOString(),
          requires_medical_referral: res.refer_to_professional,
          trusted_sources: sources,
          suggested_actions: actions,
        }
      ),
      disclaimer: res.disclaimer,
      degraded: Boolean(res.degraded),
    };
  },

  /** Hapus riwayat percakapan anak. */
  async clearHistory(childId) {
    if (!childId) return;
    const { error } = await supabase.from("chat_messages").delete().eq("child_id", childId);
    if (error) {
      console.error("Gagal menghapus percakapan:", error.message);
      throw error;
    }
  },
};
