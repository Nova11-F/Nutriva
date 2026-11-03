import { supabase } from "./supabase";

export const authService = {
  /**
   * Mendaftar pengguna baru ke Supabase Auth
   */
  async register({ name, email, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered") || error.message.includes("already exists")) {
        throw new Error("Email sudah terdaftar, silakan langsung masuk.");
      }
      throw new Error(error.message);
    }

    return data.user;
  },

  /**
   * Masuk menggunakan email & password
   */
  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        throw new Error("Email atau kata sandi salah");
      }
      throw new Error(error.message);
    }

    const profile = await this.getProfile(data.user.id);
    return {
      ...data.user,
      name: profile?.full_name || data.user.user_metadata?.full_name || email.split("@")[0],
      role: profile?.user_segment || "Ibu",
      avatar_url: profile?.avatar_url || null,
      phone: profile?.phone || "",
      city: profile?.city || "",
    };
  },

  /**
   * Keluar / Logout
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Gagal logout:", error.message);
  },

  /**
   * Mendapatkan sesi pengguna aktif
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user) return null;

    const user = session.user;
    const profile = await this.getProfile(user.id);

    return {
      ...user,
      name: profile?.full_name || user.user_metadata?.full_name || user.email.split("@")[0],
      role: profile?.user_segment || "Ibu",
      avatar_url: profile?.avatar_url || null,
      phone: profile?.phone || "",
      city: profile?.city || "",
    };
  },

  /**
   * Mengambil data profil dari public.profiles
   */
  async getProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("Gagal mengambil data profiles:", error.message);
      return null;
    }
    return data;
  },

  /**
   * Memperbarui profil pengguna (Orang Tua)
   */
  async updateProfile(userId, { name, role, avatar_url, phone, city }) {
    const updates = {
      updated_at: new Date().toISOString(),
    };
    if (name) updates.full_name = name;
    if (role) updates.user_segment = role;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (phone !== undefined) updates.phone = phone;
    if (city !== undefined) updates.city = city;

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Mengubah kata sandi pengguna
   */
  async changePassword(userId, { newPassword }) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw new Error(error.message);
    return data.user;
  },
};
