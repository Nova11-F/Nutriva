import { supabase } from "./supabase";

export const recipeService = {
  /**
   * Mengambil semua resep atau filter berdasarkan umur (bulan) & budget
   */
  async getAllRecipes({ ageMonths, budgetTier } = {}) {
    let query = supabase.from("recipes").select("*").order("created_at", { ascending: false });

    if (ageMonths !== undefined && ageMonths !== null) {
      query = query.lte("min_age_months", ageMonths).gte("max_age_months", ageMonths);
    }

    if (budgetTier) {
      query = query.eq("budget_tier", budgetTier);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Gagal mengambil daftar resep:", error.message);
      return [];
    }
    return data || [];
  },

  /**
   * Mengambil detail resep berdasarkan id atau slug
   */
  async getRecipeDetail(idOrSlug) {
    let query = supabase.from("recipes").select("*");

    // Deteksi apakah UUID atau slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    if (isUUID) {
      query = query.eq("id", idOrSlug);
    } else {
      query = query.eq("slug", idOrSlug);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      console.error("Gagal mengambil detail resep:", error.message);
      return null;
    }
    return data;
  },

  /**
   * Rule-Based Recommendation: Merekomendasikan resep sesuai anak & bahan
   */
  async generateMenuRecommendation({ childAgeMonths, availableIngredients = [], excludedRecipeIds = [] } = {}) {
    let query = supabase.from("recipes").select("*");

    if (childAgeMonths) {
      query = query.lte("min_age_months", childAgeMonths).gte("max_age_months", childAgeMonths);
    }

    if (excludedRecipeIds.length > 0) {
      query = query.not("id", "in", `(${excludedRecipeIds.join(",")})`);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Gagal rekomendasi menu:", error.message);
      return [];
    }

    if (!data || data.length === 0) return [];

    // Jika ada bahan tersedia, prioritaskan yang bahannya paling cocok
    if (availableIngredients.length > 0) {
      const lowerIngs = availableIngredients.map((i) => i.toLowerCase().trim());
      return [...data].sort((a, b) => {
        const matchA = a.ingredients?.filter((ing) => lowerIngs.some((i) => ing.toLowerCase().includes(i))).length || 0;
        const matchB = b.ingredients?.filter((ing) => lowerIngs.some((i) => ing.toLowerCase().includes(i))).length || 0;
        return matchB - matchA;
      });
    }

    return data;
  },

  /**
   * Menyimpan meal plan untuk anak
   */
  async saveMealPlan(childId, recipeId, inputPreferences = {}) {
    const { data, error } = await supabase
      .from("saved_meal_plans")
      .insert({
        child_id: childId,
        recipe_id: recipeId,
        input_preferences: inputPreferences,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Mengambil riwayat meal plan anak
   */
  async getSavedMealPlans(childId) {
    const { data, error } = await supabase
      .from("saved_meal_plans")
      .select("*, recipes(*)")
      .eq("child_id", childId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil saved meal plans:", error.message);
      return [];
    }
    return data || [];
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

