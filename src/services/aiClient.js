import { supabase } from "./supabase";

/**
 * Klien HTTP ke Nutriva AI Service (FastAPI di Hugging Face Spaces).
 * - Base URL dari VITE_AI_API_URL (tanpa garis miring di akhir).
 * - Setiap request membawa access token Supabase user yang login; service memverifikasinya.
 * - Tidak ada API key LLM di frontend.
 */
const BASE_URL = (import.meta.env.VITE_AI_API_URL || "").replace(/\/+$/, "");

export class AiServiceError extends Error {
  constructor(message, { status = 0, code = "error", requestId = null } = {}) {
    super(message);
    this.name = "AiServiceError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}

export function isAiServiceConfigured() {
  return Boolean(BASE_URL);
}

const FRIENDLY = {
  401: "Sesi Anda berakhir. Silakan login ulang.",
  413: "Pesan terlalu panjang.",
  422: "Data yang dikirim belum lengkap atau tidak valid.",
  429: "Terlalu banyak permintaan. Coba lagi sebentar lagi.",
  503: "Layanan AI sedang sibuk atau baru dinyalakan. Coba lagi dalam beberapa detik.",
};

async function request(path, { method = "GET", body, timeoutMs = 30000, auth = true } = {}) {
  if (!BASE_URL) {
    throw new AiServiceError("Layanan AI belum dikonfigurasi (VITE_AI_API_URL kosong).", { code: "not_configured" });
  }
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (!token) throw new AiServiceError(FRIENDLY[401], { status: 401, code: "no_session" });
    headers.Authorization = `Bearer ${token}`;
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
  } catch (err) {
    const timedOut = err?.name === "AbortError";
    throw new AiServiceError(
      timedOut ? "Layanan AI terlalu lama merespons. Coba lagi." : "Tidak dapat terhubung ke layanan AI.",
      { code: timedOut ? "timeout" : "network" }
    );
  } finally {
    clearTimeout(timer);
  }

  const requestId = res.headers.get("x-request-id");
  let payload;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }
  if (!res.ok) {
    const detail = typeof payload?.detail === "string" ? payload.detail : null;
    throw new AiServiceError(detail || FRIENDLY[res.status] || "Layanan AI mengalami gangguan.", {
      status: res.status,
      code: `http_${res.status}`,
      requestId,
    });
  }
  return payload;
}

export const aiClient = {
  health: () => request("/health", { auth: false, timeoutMs: 10000 }),
  modelInfo: () => request("/v1/model-info", { auth: false }),
  zscores: (body) => request("/v1/growth/zscores", { method: "POST", body }),
  assess: (body) => request("/v1/growth/assess", { method: "POST", body, timeoutMs: 30000 }),
  // LLM gratis bisa lambat (median ~18 detik saat uji); beri waktu cukup.
  chat: (body) => request("/v1/assistant/chat", { method: "POST", body, timeoutMs: 90000 }),
};
