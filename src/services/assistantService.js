import { supabase } from "./supabase";
import { aiClient } from "./aiClient";
import { growthService } from "./growthService";
import { ageInMonthsAt, toApiGender } from "../lib/whoGrowth";
import { fakeReplies, fallbackReply } from "../data/chatMessages";

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
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("ai_context_consent")
      .eq("id", userId)
      .maybeSingle();
    const value = error ? false : data?.ai_context_consent !== false; // gagal baca -> anggap tidak setuju
    consentCache = { userId, value };
    return value;
  } catch {
    return false;
  }
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
    const rf = child.risk_factors || child.riskFactors || {};
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

function getLocalFallbackReply(questionText) {
  const q = questionText.toLowerCase();
  for (const item of fakeReplies) {
    if (item.keywords.some((kw) => q.includes(kw))) {
      return item.reply;
    }
  }
  return fallbackReply;
}

export const assistantService = {
  /** Riwayat pesan anak dari tabel chat_messages. */
  async getHistory(childId) {
    if (!childId) return [];
    try {
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
    } catch {
      return [];
    }
  },

  /**
   * Kirim pertanyaan ke AI service, lalu simpan pertanyaan + jawaban.
   * @param {object} child  profil anak aktif
   * @param {string} questionText
   * @param {Array<{role:'user'|'bot', text:string}>} history  pesan sebelumnya (paling baru di akhir)
   */
  async sendMessage(child, questionText, history = []) {
    let userId = null;
    let consent = false;
    try {
      const { data } = await supabase.auth.getSession();
      userId = data?.session?.user?.id || null;
      if (userId) consent = await getConsent(userId);
    } catch {
      //
    }

    const context = await buildContext(child, consent);
    let res = null;
    let degraded = false;

    try {
      res = await aiClient.chat({
        question: questionText,
        ...context,
        history: history
          .filter((m) => m?.text && !m.failed)
          .slice(-MAX_HISTORY)
          .map((m) => ({ role: m.role === "user" ? "user" : "assistant", text: String(m.text).slice(0, 2000) })),
      });
    } catch (err) {
      console.warn("AI service call unavailable, falling back to local response:", err.message);
      // Graceful fallback response jika AI backend belum running atau unconfigured
      degraded = true;
      res = {
        answer: getLocalFallbackReply(questionText),
        refer_to_professional: /kejang|pingsan|sesak|darurat|biru|tidak sadar/.test(questionText.toLowerCase()),
        source_details: [
          { title: "Buku Bagan MTBS Kemenkes RI", reference: "Kemenkes RI", url: null },
        ],
        actions: [],
        route: "normal",
        degraded: true,
      };
    }

    const sources = (res.source_details || []).map((s) => ({ title: s.title, reference: s.reference, url: s.url || null }));
    const actions = [
      ...(res.actions || []).map((label) => ({ type: "step", label })),
      ...(res.route === "normal" && !res.degraded ? suggestNavigation(questionText) : suggestNavigation(questionText)),
    ];

    let saved = null;
    if (userId && child?.id) {
      try {
        const base = { user_id: userId, child_id: child.id };
        await supabase
          .from("chat_messages")
          .insert({ ...base, sender: "user", message_text: questionText });
        const { data } = await supabase
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
        saved = data;
      } catch (err) {
        console.warn("Gagal menyimpan pesan ke Supabase:", err.message);
      }
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
      degraded: Boolean(res.degraded || degraded),
    };
  },

  /** Hapus riwayat percakapan anak. */
  async clearHistory(childId) {
    if (!childId) return;
    try {
      await supabase.from("chat_messages").delete().eq("child_id", childId);
    } catch (error) {
      console.error("Gagal menghapus percakapan:", error.message);
      throw error;
    }
  },
};
