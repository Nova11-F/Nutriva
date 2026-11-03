import { supabase } from "./supabase";

export const childService = {
  /**
   * Mengambil semua profil anak milik user dari Supabase
   */
  async getAllByUserId(userId) {
    if (!userId) return [];
    const { data, error } = await supabase
      .from("children")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data anak:", error.message);
      return [];
    }

    return (data || []).map((c) => ({
      ...c,
      birthDate: c.birth_date,
      initialWeight: c.initial_weight_kg,
      initialHeight: c.initial_height_cm,
      allergies: c.avoided_foods || [],
      favoriteFoods: c.dietary_preferences || [],
    }));
  },

  /**
   * Membuat profil anak baru di Supabase
   */
  async create(userId, data) {
    const payload = {
      user_id: userId,
      name: data.name,
      nickname: data.nickname || data.name.split(" ")[0],
      birth_date: data.birthDate,
      gender: data.gender,
      initial_weight_kg: Number(data.weight || data.initialWeight || 3.0),
      initial_height_cm: Number(data.height || data.initialHeight || 50.0),
      dietary_preferences: data.favoriteFoods || [],
      avoided_foods: data.allergies || [],
      photo_url: data.photo || null,
    };

    const { data: created, error } = await supabase
      .from("children")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Gagal membuat profil anak:", error.message);
      throw error;
    }

    return {
      ...created,
      birthDate: created.birth_date,
      initialWeight: created.initial_weight_kg,
      initialHeight: created.initial_height_cm,
      allergies: created.avoided_foods || [],
      favoriteFoods: created.dietary_preferences || [],
    };
  },

  /**
   * Memperbarui profil anak di Supabase
   */
  async update(id, data) {
    const updates = {
      updated_at: new Date().toISOString(),
    };
    if (data.name) updates.name = data.name;
    if (data.birthDate) updates.birth_date = data.birthDate;
    if (data.gender) updates.gender = data.gender;
    if (data.allergies) updates.avoided_foods = data.allergies;
    if (data.favoriteFoods) updates.dietary_preferences = data.favoriteFoods;
    if (data.photo !== undefined) updates.photo_url = data.photo;

    const { data: updated, error } = await supabase
      .from("children")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Gagal update profil anak:", error.message);
      throw error;
    }

    return {
      ...updated,
      birthDate: updated.birth_date,
      initialWeight: updated.initial_weight_kg,
      initialHeight: updated.initial_height_cm,
      allergies: updated.avoided_foods || [],
      favoriteFoods: updated.dietary_preferences || [],
    };
  },

  /**
   * Menghapus profil anak dari Supabase
   */
  async remove(id) {
    const { error } = await supabase
      .from("children")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Gagal menghapus profil anak:", error.message);
      throw error;
    }
  },
};
