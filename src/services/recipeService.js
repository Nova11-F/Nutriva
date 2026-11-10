import { supabase } from "./supabase";
import { recipes as localRecipes } from "../data/recipe";
import { todayISO } from "../utils/formatDate";
import { calculatePortionNutrition } from "../utils/nutritionUtils";

const LOCAL_FOOD_LOGS_KEY = "nutriva_food_logs_local";
const LOCAL_RECENT_FOODS_KEY = "nutriva_recent_foods_local";
const LOCAL_FAV_FOODS_PREFIX = "nutriva_favorite_foods_";

function readJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("Gagal menulis localStorage:", err?.message || err);
  }
}

function formatFoodLogRow(row) {
  const calc = row?.calculated_nutrition || {};
  return {
    id: row.id,
    child_id: row.child_id,
    food_id: row.food_id || null,
    log_date: row.log_date,
    displayName:
      row.foods?.name ||
      row.custom_food_name ||
      calc.food_name ||
      "Makanan Anak",
    category: row.foods?.category || calc.category || null,
    source: row.foods?.source || null,
    mealSlot: calc.meal_slot || "Makan Utama",
    serving_label: row.serving_label,
    portion_grams: Number(row.portion_grams) || 0,
    calculated_nutrition: {
      calories: Number(calc.calories) || 0,
      protein_g: Number(calc.protein_g) || 0,
      fat_g: Number(calc.fat_g) || 0,
      carbs_g: Number(calc.carbs_g) || 0,
      iron_mg: Number(calc.iron_mg) || 0,
    },
    created_at: row.created_at,
  };
}

function formatLocalRecipe(r) {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    image_url: r.image,
    image: r.image,
    min_age_months: r.minAgeMonths,
    max_age_months: r.maxAgeMonths,
    minAgeMonths: r.minAgeMonths,
    maxAgeMonths: r.maxAgeMonths,
    budget_tier: r.budgetTier || "sedang",
    portion_size: r.portionSize || "1 porsi",
    meal_frequency: r.mealFrequency || "3x sehari",
    main_nutrients: {
      calories: r.mainNutrients?.calories_kcal || 180,
      calories_kcal: r.mainNutrients?.calories_kcal || 180,
      protein_g: r.mainNutrients?.protein_g || 8,
      fat_g: r.mainNutrients?.fat_g || 5,
      carbs_g: r.mainNutrients?.carbs_g || 20,
      iron_mg: r.mainNutrients?.iron_mg || 2.5,
    },
    ingredients: r.ingredients || [],
    instructions: r.instructions || [],
    allergen_tags: r.allergenTags || (r.cat ? [r.cat] : []),
    cat: r.cat || "Protein Hewani",
    category: r.category || "Menu Utama",
    desc: r.desc || "",
    source_authority: r.sourceAuthority || "Kemenkes RI & WHO",
    validated_by: r.validatedBy || "Ahli Gizi Nutriva",
    kcal: r.kcal || `${r.mainNutrients?.calories_kcal || 180} kkal`,
    protein: r.protein || `${r.mainNutrients?.protein_g || 8}g Protein`,
    time: r.time || "20 Menit",
  };
}

export const recipeService = {
  /**
   * Mengambil semua resep atau filter berdasarkan umur (bulan) & budget
   */
  async getAllRecipes({ ageMonths, budgetTier } = {}) {
    try {
      let query = supabase.from("recipes").select("*").order("created_at", { ascending: false });

      if (ageMonths !== undefined && ageMonths !== null) {
        query = query.lte("min_age_months", ageMonths).gte("max_age_months", ageMonths);
      }

      if (budgetTier) {
        query = query.eq("budget_tier", budgetTier);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn("Gagal ambil resep dari Supabase, beralih ke katalog lokal:", err.message);
    }

    // Fallback ke data/recipe.js
    let filtered = localRecipes.map(formatLocalRecipe);
    if (ageMonths !== undefined && ageMonths !== null) {
      const byAge = filtered.filter(
        (r) => r.min_age_months <= ageMonths && r.max_age_months >= ageMonths
      );
      if (byAge.length > 0) {
        filtered = byAge;
      }
    }

    if (budgetTier) {
      const byTier = filtered.filter((r) => r.budget_tier === budgetTier);
      if (byTier.length > 0) {
        filtered = byTier;
      }
    }

    return filtered;
  },

  /**
   * Mengambil detail resep berdasarkan id atau slug
   */
  async getRecipeDetail(idOrSlug) {
    if (!idOrSlug) return null;

    try {
      let query = supabase.from("recipes").select("*");

      // Deteksi apakah UUID atau slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      if (isUUID) {
        query = query.eq("id", idOrSlug);
      } else {
        query = query.eq("slug", idOrSlug);
      }

      const { data, error } = await query.maybeSingle();
      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn("Gagal ambil detail dari Supabase, beralih ke katalog lokal:", err.message);
    }

    // Fallback ke data/recipe.js
    const matched = localRecipes.find(
      (r) =>
        r.slug === idOrSlug ||
        String(r.id) === String(idOrSlug) ||
        r.title?.toLowerCase() === String(idOrSlug).toLowerCase()
    );

    if (matched) {
      return formatLocalRecipe(matched);
    }

    return localRecipes[0] ? formatLocalRecipe(localRecipes[0]) : null;
  },

  /**
   * Rule-Based Recommendation: Merekomendasikan resep sesuai anak & bahan
   */
  async generateMenuRecommendation({ childAgeMonths, availableIngredients = [], excludedRecipeIds = [] } = {}) {
    let list = await this.getAllRecipes({ ageMonths: childAgeMonths });
    if (!list || list.length === 0) {
      list = localRecipes.map(formatLocalRecipe);
    }

    if (excludedRecipeIds.length > 0) {
      list = list.filter((r) => !excludedRecipeIds.includes(r.id) && !excludedRecipeIds.includes(r.slug));
    }

    // Jika ada bahan tersedia, prioritaskan yang bahannya paling cocok
    if (availableIngredients.length > 0) {
      const lowerIngs = availableIngredients.map((i) => i.toLowerCase().trim());
      return [...list].sort((a, b) => {
        const getIngNames = (rec) => {
          if (!rec.ingredients) return [];
          return rec.ingredients.map((ing) => (typeof ing === "string" ? ing : ing.name || ""));
        };
        const matchA = getIngNames(a).filter((ing) => lowerIngs.some((i) => ing.toLowerCase().includes(i))).length;
        const matchB = getIngNames(b).filter((ing) => lowerIngs.some((i) => ing.toLowerCase().includes(i))).length;
        return matchB - matchA;
      });
    }

    return list;
  },

  /**
   * Menyimpan meal plan untuk anak (Mendukung signature objek maupun multi-arg)
   */
  async saveMealPlan(arg1, arg2, arg3) {
    let childId = arg1;
    let recipeId = arg2;
    let inputPreferences = arg3 || {};
    let plannedDate = new Date().toISOString().split("T")[0];

    // Dukung pemanggilan dengan objek tunggal: saveMealPlan({ childId, recipeId, plannedDate, preferences })
    if (typeof arg1 === "object" && arg1 !== null) {
      childId = arg1.childId;
      recipeId = arg1.recipeId;
      inputPreferences = arg1.preferences || arg1.inputPreferences || {};
      plannedDate = arg1.plannedDate || plannedDate;
    }

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(recipeId);

    if (isUUID) {
      try {
        const { data, error } = await supabase
          .from("saved_meal_plans")
          .insert({
            child_id: childId,
            recipe_id: recipeId,
            planned_date: plannedDate,
            input_preferences: inputPreferences,
          })
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn("Gagal simpan ke Supabase, simpan ke lokal:", err.message);
      }
    }

    // Fallback simpan ke localStorage agar tidak pernah gagal sistem
    const localKey = "nutriva_saved_meal_plans";
    const existing = JSON.parse(localStorage.getItem(localKey) || "[]");
    const newPlan = {
      id: "local-" + Date.now(),
      child_id: childId,
      recipe_id: recipeId,
      planned_date: plannedDate,
      input_preferences: inputPreferences,
      created_at: new Date().toISOString(),
    };
    existing.unshift(newPlan);
    localStorage.setItem(localKey, JSON.stringify(existing));
    return newPlan;
  },

  /**
   * Mengambil riwayat meal plan anak
   */
  async getSavedMealPlans(childId) {
    let dbPlans = [];
    try {
      const { data, error } = await supabase
        .from("saved_meal_plans")
        .select("*, recipes(*)")
        .eq("child_id", childId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        dbPlans = data;
      }
    } catch (err) {
      console.warn("Gagal mengambil saved meal plans dari Supabase:", err.message);
    }

    // Gabungkan dengan localStorage
    try {
      const localKey = "nutriva_saved_meal_plans";
      const local = JSON.parse(localStorage.getItem(localKey) || "[]");
      const matchedLocal = local.filter((p) => p.child_id === childId);
      return [...dbPlans, ...matchedLocal];
    } catch {
      return dbPlans;
    }
  },

  /**
   * Pencarian database makanan dasar (Flow 1 - Log Food)
   */
  async searchFood(searchTerm = "", { category = "semua", curatedOnly = false, limit = 36 } = {}) {
    try {
      let query = supabase.from("foods").select("*");
      const term = String(searchTerm || "").trim();

      if (term) {
        query = query.ilike("name", `%${term}%`);
      }

      if (category && category !== "semua") {
        query = query.eq("category", category);
      }

      if (curatedOnly && !term) {
        // Utamakan 89 bahan kurasi (kode selain TKPI_*) yang punya ukuran rumah tangga
        query = query.not("code", "is", null).not("code", "like", "TKPI_%");
      }

      const { data, error } = await query.limit(limit);
      if (error) {
        console.warn("Gagal mencari makanan di Supabase:", error.message);
        return [];
      }

      // Prioritaskan bahan dengan variasi takaran rumah tangga (>1 serving option)
      return [...(data || [])].sort((a, b) => {
        const lenA = Array.isArray(a.serving_options) ? a.serving_options.length : 0;
        const lenB = Array.isArray(b.serving_options) ? b.serving_options.length : 0;
        return lenB - lenA;
      });
    } catch (err) {
      console.warn("Kesalahan jaringan saat mencari makanan:", err?.message || err);
      return [];
    }
  },

  /**
   * Mencatat makanan ke daftar baru saja dicatat (Recent Food)
   */
  recordRecentFood(food) {
    if (!food?.id && !food?.name) return;
    const list = readJsonStorage(LOCAL_RECENT_FOODS_KEY, []);
    const key = food.id || food.name.toLowerCase();
    const filtered = list.filter((item) => (item.id || item.name?.toLowerCase()) !== key);
    filtered.unshift(food);
    writeJsonStorage(LOCAL_RECENT_FOODS_KEY, filtered.slice(0, 10));
  },

  /**
   * Mengambil daftar makanan yang baru saja dicatat
   */
  getRecentFoods() {
    return readJsonStorage(LOCAL_RECENT_FOODS_KEY, []);
  },

  /**
   * Mengambil daftar makanan favorit user (Supabase + fallback lokal)
   */
  async getFavoriteFoods(userId) {
    const localKey = `${LOCAL_FAV_FOODS_PREFIX}${userId || "anon"}`;
    const localFavs = readJsonStorage(localKey, []);
    if (!userId) return localFavs;

    try {
      const { data, error } = await supabase
        .from("favorite_foods")
        .select("food_id, foods(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        const dbFoods = data.map((row) => row.foods).filter(Boolean);
        if (dbFoods.length > 0) return dbFoods;
      }
    } catch (err) {
      console.warn("Gagal membaca makanan favorit dari Supabase:", err?.message || err);
    }

    return localFavs;
  },

  /**
   * Menambah / menghapus makanan favorit user
   */
  async toggleFavoriteFood(userId, food) {
    if (!food?.id) return [];
    const localKey = `${LOCAL_FAV_FOODS_PREFIX}${userId || "anon"}`;
    const current = readJsonStorage(localKey, []);
    const exists = current.some((item) => item.id === food.id);
    const nextLocal = exists
      ? current.filter((item) => item.id !== food.id)
      : [food, ...current].slice(0, 30);
    writeJsonStorage(localKey, nextLocal);

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(food.id);
    if (userId && isUUID) {
      try {
        if (exists) {
          await supabase
            .from("favorite_foods")
            .delete()
            .eq("user_id", userId)
            .eq("food_id", food.id);
        } else {
          await supabase
            .from("favorite_foods")
            .upsert({ user_id: userId, food_id: food.id }, { onConflict: "user_id,food_id" });
        }
      } catch (err) {
        console.warn("Sinkronisasi favorit ke Supabase tertunda:", err?.message || err);
      }
    }

    return nextLocal;
  },

  /**
   * Mencatat porsi makanan anak dan hitung gizi ((nilai_gizi_per_100g * portionGrams) / 100)
   */
  async logFoodPortion({
    childId,
    foodId,
    foodName,
    foodSnapshot,
    customFoodName,
    logDate,
    mealSlot = "Makan Utama",
    servingLabel,
    portionGrams,
    nutritionPer100g,
    extraPer100g,
  }) {
    if (!childId) throw new Error("Profil anak belum dipilih.");
    const grams = Number(portionGrams);
    if (!Number.isFinite(grams) || grams <= 0) {
      throw new Error("Berat porsi (gram) harus lebih dari 0.");
    }

    const effectiveDate = logDate || todayISO();
    const calculated = calculatePortionNutrition(nutritionPer100g, grams, extraPer100g);
    const displayName = customFoodName || foodName || foodSnapshot?.name || "Makanan Anak";
    const calculatedNutrition = {
      ...calculated,
      food_name: displayName,
      meal_slot: mealSlot,
      category: foodSnapshot?.category || null,
    };

    if (foodSnapshot) {
      this.recordRecentFood(foodSnapshot);
    }

    const isChildUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(childId);
    const isFoodUUID =
      foodId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(foodId);

    if (isChildUUID) {
      try {
        const { data, error } = await supabase
          .from("food_logs")
          .insert({
            child_id: childId,
            food_id: isFoodUUID ? foodId : null,
            custom_food_name: isFoodUUID ? null : displayName,
            log_date: effectiveDate,
            serving_label: servingLabel || `${grams} gram`,
            portion_grams: grams,
            calculated_nutrition: calculatedNutrition,
          })
          .select("*, foods(id, name, category, preparation_type, source)")
          .single();

        if (!error && data) {
          return formatFoodLogRow(data);
        }
        if (error) {
          console.warn("Simpan food_logs ke Supabase gagal, gunakan fallback lokal:", error.message);
        }
      } catch (err) {
        console.warn("Gagal simpan food_logs ke Supabase, gunakan fallback lokal:", err?.message || err);
      }
    }

    // Fallback aman ke localStorage jika Supabase belum sinkron / RLS tertahan
    const localRows = readJsonStorage(LOCAL_FOOD_LOGS_KEY, []);
    const fallbackRow = {
      id: `local-food-${Date.now()}`,
      child_id: childId,
      food_id: isFoodUUID ? foodId : null,
      custom_food_name: displayName,
      log_date: effectiveDate,
      serving_label: servingLabel || `${grams} gram`,
      portion_grams: grams,
      calculated_nutrition: calculatedNutrition,
      foods: foodSnapshot
        ? {
            name: foodSnapshot.name,
            category: foodSnapshot.category,
            source: foodSnapshot.source,
          }
        : null,
      created_at: new Date().toISOString(),
    };
    localRows.unshift(fallbackRow);
    writeJsonStorage(LOCAL_FOOD_LOGS_KEY, localRows.slice(0, 200));
    return formatFoodLogRow(fallbackRow);
  },

  /**
   * Mengambil daftar log makanan anak per tanggal (Supabase + fallback lokal)
   */
  async getFoodLogs(childId, dateString) {
    if (!childId) return [];
    const date = dateString || todayISO();
    let dbRows = [];

    const isChildUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(childId);
    if (isChildUUID) {
      try {
        const { data, error } = await supabase
          .from("food_logs")
          .select("*, foods(id, name, category, preparation_type, source)")
          .eq("child_id", childId)
          .eq("log_date", date)
          .order("created_at", { ascending: false });

        if (!error && Array.isArray(data)) {
          dbRows = data.map(formatFoodLogRow);
        }
      } catch (err) {
        console.warn("Gagal mengambil riwayat food_logs:", err?.message || err);
      }
    }

    const localRows = readJsonStorage(LOCAL_FOOD_LOGS_KEY, [])
      .filter((row) => row.child_id === childId && row.log_date === date)
      .map(formatFoodLogRow);

    const seen = new Set(dbRows.map((r) => r.id));
    return [...dbRows, ...localRows.filter((r) => !seen.has(r.id))];
  },

  /**
   * Menghapus catatan log makanan anak
   */
  async deleteFoodLog(logId) {
    if (!logId) return;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(logId);

    if (isUUID) {
      try {
        const { error } = await supabase.from("food_logs").delete().eq("id", logId);
        if (error) {
          console.warn("Gagal hapus food_log dari Supabase:", error.message);
        }
      } catch (err) {
        console.warn("Kesalahan saat hapus food_log:", err?.message || err);
      }
    }

    const localRows = readJsonStorage(LOCAL_FOOD_LOGS_KEY, []);
    const nextRows = localRows.filter((row) => row.id !== logId);
    if (nextRows.length !== localRows.length) {
      writeJsonStorage(LOCAL_FOOD_LOGS_KEY, nextRows);
    }
  },

  /**
   * Mengambil ringkasan nutrisi harian anak (termasuk zat besi & sinkronisasi fallback lokal)
   */
  async getDailyNutritionSummary(childId, dateString) {
    if (!childId) return null;
    const date = dateString || todayISO();

    try {
      const logs = await this.getFoodLogs(childId, date);
      if (logs.length > 0) {
        const totals = logs.reduce(
          (acc, item) => {
            const n = item.calculated_nutrition || {};
            acc.total_calories_kcal += Number(n.calories) || 0;
            acc.total_protein_g += Number(n.protein_g) || 0;
            acc.total_fat_g += Number(n.fat_g) || 0;
            acc.total_carbs_g += Number(n.carbs_g) || 0;
            acc.total_iron_mg += Number(n.iron_mg) || 0;
            return acc;
          },
          {
            total_calories_kcal: 0,
            total_protein_g: 0,
            total_fat_g: 0,
            total_carbs_g: 0,
            total_iron_mg: 0,
          }
        );

        return {
          child_id: childId,
          log_date: date,
          total_logged_items: logs.length,
          total_calories_kcal: Math.round(totals.total_calories_kcal),
          total_protein_g: Number(totals.total_protein_g.toFixed(1)),
          total_fat_g: Number(totals.total_fat_g.toFixed(1)),
          total_carbs_g: Number(totals.total_carbs_g.toFixed(1)),
          total_iron_mg: Number(totals.total_iron_mg.toFixed(1)),
        };
      }
    } catch (err) {
      console.warn("Gagal agregasi dari getFoodLogs, coba view summary:", err?.message || err);
    }

    const { data, error } = await supabase
      .from("daily_nutrition_summaries")
      .select("*")
      .eq("child_id", childId)
      .eq("log_date", date)
      .maybeSingle();

    if (error) {
      console.warn("Gagal mengambil daily summary:", error.message);
      return null;
    }
    return data;
  },
};

