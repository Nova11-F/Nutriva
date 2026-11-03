import { supabase } from "./supabase";
import { recipes as localRecipes } from "../data/recipe";

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
  async searchFood(searchTerm = "") {
    let query = supabase.from("foods").select("*");

    if (searchTerm.trim()) {
      query = query.ilike("name", `%${searchTerm.trim()}%`);
    }

    const { data, error } = await query.limit(20);
    if (error) {
      console.error("Gagal mencari makanan:", error.message);
      return [];
    }
    return data || [];
  },

  /**
   * Mencatat porsi makanan anak dan hitung gizi
   */
  async logFoodPortion({ childId, foodId, customFoodName, servingLabel, portionGrams, nutritionPer100g }) {
    // Rumus kalkulasi: (nilai_gizi_per_100g * portionGrams) / 100
    const factor = portionGrams / 100;
    const calculatedNutrition = {
      calories: Math.round((nutritionPer100g.calories || 0) * factor),
      protein_g: Number(((nutritionPer100g.protein || 0) * factor).toFixed(1)),
      fat_g: Number(((nutritionPer100g.fat || 0) * factor).toFixed(1)),
      carbs_g: Number(((nutritionPer100g.carbs || 0) * factor).toFixed(1)),
      iron_mg: Number(((nutritionPer100g.iron || 0) * factor).toFixed(1)),
    };

    const { data, error } = await supabase
      .from("food_logs")
      .insert({
        child_id: childId,
        food_id: foodId || null,
        custom_food_name: customFoodName || null,
        serving_label: servingLabel,
        portion_grams: portionGrams,
        calculated_nutrition: calculatedNutrition,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Mengambil ringkasan nutrisi harian anak
   */
  async getDailyNutritionSummary(childId, dateString) {
    const date = dateString || new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("daily_nutrition_summaries")
      .select("*")
      .eq("child_id", childId)
      .eq("log_date", date)
      .maybeSingle();

    if (error) {
      console.error("Gagal mengambil daily summary:", error.message);
      return null;
    }
    return data;
  },
};

