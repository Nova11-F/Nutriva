/**
 * Faktor risiko untuk model early-awareness Nutriva (kontrak: ai-service/app/schemas.py AssessRequest).
 * Semua opsional. Nilai kategori memakai kode API (bahasa Inggris), label untuk UI.
 * Rentang angka harus sama dengan validasi API agar request tidak ditolak (422).
 */
export const RISK_NUMBER_FIELDS = [
  { key: "birth_weight_kg", label: "Berat lahir (kg)", step: "0.01", min: 0.51, max: 5.99, placeholder: "3.1" },
  { key: "birth_length_cm", label: "Panjang lahir (cm)", step: "0.1", min: 35.1, max: 59.9, placeholder: "49" },
  { key: "mother_age", label: "Usia ibu (tahun)", step: "1", min: 12, max: 60, placeholder: "28" },
  { key: "mother_height_cm", label: "Tinggi badan ibu (cm)", step: "0.1", min: 120.1, max: 199.9, placeholder: "155" },
  { key: "anc_visits", label: "Jumlah pemeriksaan kehamilan (ANC)", step: "1", min: 0, max: 20, placeholder: "6", integer: true,
    hint: "Lihat catatan di Buku KIA." },
  { key: "complementary_feeding_start_months", label: "Usia mulai MP-ASI (bulan)", step: "1", min: 0, max: 24, placeholder: "6",
    hint: "Kosongkan bila belum mulai MP-ASI." },
  { key: "diarrhea_frequency", label: "Jumlah kejadian diare (perkiraan)", step: "1", min: 0, max: 30, placeholder: "0", integer: true,
    hint: "Perkiraan berapa kali anak diare belakangan ini." },
];

export const RISK_SELECT_FIELDS = [
  { key: "mother_education", label: "Pendidikan terakhir ibu", options: [
    { value: "No Education", label: "Tidak sekolah" },
    { value: "Elementary/Middle School", label: "SD / SMP" },
    { value: "High School", label: "SMA / SMK" },
    { value: "University", label: "Diploma / Sarjana" },
  ] },
  { key: "exclusive_breastfeeding", label: "ASI eksklusif sampai 6 bulan?", options: [
    { value: "Yes", label: "Ya" }, { value: "No", label: "Tidak" },
  ] },
  { key: "immunization", label: "Status imunisasi", options: [
    { value: "Complete", label: "Lengkap sesuai usia" },
    { value: "Incomplete", label: "Belum lengkap" },
    { value: "Not Immunized", label: "Belum pernah" },
  ] },
  { key: "deworming", label: "Sudah pernah minum obat cacing?", options: [
    { value: "Yes", label: "Sudah" }, { value: "No", label: "Belum" },
  ] },
  { key: "drinking_water_source", label: "Sumber air minum", options: [
    { value: "Protected", label: "Terlindungi (PDAM, air kemasan, sumur/mata air terlindung)" },
    { value: "Unprotected", label: "Tidak terlindungi (sumur terbuka, sungai, dll.)" },
  ] },
  { key: "sanitation", label: "Jamban / sanitasi", options: [
    { value: "Improved", label: "Layak (jamban leher angsa + septic tank)" },
    { value: "Unimproved", label: "Belum layak" },
  ] },
  { key: "economic_level", label: "Kondisi ekonomi keluarga", options: [
    { value: "Low", label: "Rendah" }, { value: "Middle", label: "Menengah" }, { value: "High", label: "Tinggi" },
  ] },
  { key: "residence_type", label: "Tempat tinggal", options: [
    { value: "Urban", label: "Perkotaan" }, { value: "Rural", label: "Perdesaan" },
  ] },
];

const NUM = Object.fromEntries(RISK_NUMBER_FIELDS.map((f) => [f.key, f]));
const SEL = Object.fromEntries(RISK_SELECT_FIELDS.map((f) => [f.key, new Set(f.options.map((o) => o.value))]));

/** Buang nilai kosong/di luar rentang/tidak dikenal; ubah angka ke Number. */
export function cleanRiskFactors(input = {}) {
  const out = {};
  for (const [k, raw] of Object.entries(input || {})) {
    if (raw === "" || raw === null || raw === undefined) continue;
    if (NUM[k]) {
      const n = Number(raw);
      if (!Number.isFinite(n) || n < NUM[k].min || n > NUM[k].max) continue;
      out[k] = NUM[k].integer ? Math.round(n) : n;
    } else if (SEL[k]?.has(raw)) {
      out[k] = raw;
    }
  }
  return out;
}

export function countFilledRiskFactors(rf) {
  return Object.keys(cleanRiskFactors(rf)).length;
}
