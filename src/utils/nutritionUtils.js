/**
 * Utilitas & konstanta nutrisi untuk Sub-Modul Log Food (PRD Bab 5.2B).
 * Acuan target harian: Permenkes RI No. 28 Tahun 2019 (Angka Kecukupan Gizi / AKG).
 */

export const FOOD_CATEGORIES = [
  { value: "semua", label: "Semua Kategori" },
  { value: "lauk hewani", label: "Lauk Hewani" },
  { value: "makanan pokok", label: "Makanan Pokok" },
  { value: "lauk nabati", label: "Lauk Nabati" },
  { value: "sayuran", label: "Sayuran" },
  { value: "buah", label: "Buah" },
  { value: "susu", label: "Susu" },
];

export const MEAL_SLOTS = ["Sarapan", "Makan Siang", "Makan Malam", "Selingan"];

export const PORTION_MULTIPLIERS = [0.5, 1, 1.5, 2];

export const SUGGESTED_FOOD_KEYWORDS = [
  "Nasi putih",
  "Telur ayam",
  "Daging ayam",
  "Ikan kembung",
  "Hati ayam",
  "Bayam",
  "Wortel",
  "Tempe",
];

/**
 * Target estimasi gizi harian anak sesuai kelompok usia (Permenkes RI No. 28/2019).
 */
export function getDailyAkgTarget(ageMonths) {
  const m = Number(ageMonths) || 0;
  if (m < 6) {
    return {
      ageGroup: "0–5 bulan (ASI Eksklusif)",
      calories: 550,
      protein_g: 9,
      fat_g: 31,
      carbs_g: 59,
      iron_mg: 0.3,
      note: "Pada usia 0–5 bulan, sumber nutrisi utama adalah ASI eksklusif sesuai kebutuhan bayi.",
    };
  }
  if (m <= 11) {
    return {
      ageGroup: "6–11 bulan",
      calories: 800,
      protein_g: 15,
      fat_g: 35,
      carbs_g: 105,
      iron_mg: 11,
      note: "Usia 6–11 bulan membutuhkan MPASI kaya protein hewani dan zat besi untuk mencegah stunting.",
    };
  }
  if (m <= 35) {
    return {
      ageGroup: "12–35 bulan (1–3 tahun)",
      calories: 1350,
      protein_g: 20,
      fat_g: 45,
      carbs_g: 215,
      iron_mg: 7,
      note: "Usia 1–3 tahun membutuhkan variasi makanan keluarga padat gizi dan sumber zat besi harian.",
    };
  }
  return {
    ageGroup: "36–59 bulan (4–5 tahun)",
    calories: 1400,
    protein_g: 25,
    fat_g: 50,
    carbs_g: 220,
    iron_mg: 10,
    note: "Usia prasekolah membutuhkan kecukupan energi dan protein seimbang untuk tumbuh kembang aktif.",
  };
}

/**
 * Menghitung gizi berdasarkan takaran gram: (nilai_per_100g * portionGrams) / 100.
 */
export function calculatePortionNutrition(nutritionPer100g = {}, portionGrams = 0, extraPer100g = {}) {
  const grams = Math.max(0, Number(portionGrams) || 0);
  const factor = grams / 100;
  const round1 = (v) => Number(((Number(v) || 0) * factor).toFixed(1));

  const out = {
    calories: Math.round((Number(nutritionPer100g.calories) || 0) * factor),
    protein_g: round1(nutritionPer100g.protein),
    fat_g: round1(nutritionPer100g.fat),
    carbs_g: round1(nutritionPer100g.carbs),
    iron_mg: round1(nutritionPer100g.iron),
  };

  if (extraPer100g && typeof extraPer100g === "object") {
    if (extraPer100g.calcium_mg != null) out.calcium_mg = round1(extraPer100g.calcium_mg);
    if (extraPer100g.zinc_mg != null) out.zinc_mg = round1(extraPer100g.zinc_mg);
    if (extraPer100g.vit_c_mg != null) out.vit_c_mg = round1(extraPer100g.vit_c_mg);
    if (extraPer100g.fiber_g != null) out.fiber_g = round1(extraPer100g.fiber_g);
  }

  return out;
}

/**
 * Normalisasi opsi takaran saji (serving_options) dari database foods.
 */
export function normalizeServingOptions(food) {
  const raw = food?.serving_options;
  if (Array.isArray(raw) && raw.length > 0) {
    const cleaned = raw
      .map((item) => ({
        label: String(item?.label || "").trim() || `${item?.grams || 100} gram`,
        grams: Number(item?.grams) > 0 ? Number(item.grams) : 100,
      }))
      .filter((item) => item.grams > 0);
    if (cleaned.length > 0) return cleaned;
  }
  return [{ label: "100 gram", grams: 100 }];
}

