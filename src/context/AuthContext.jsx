import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/authService";
import { supabase } from "../services/supabase";
import { AuthContext } from "./AuthContextInstance";

export { AuthContext };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sinkronisasi sesi & listener status auth Supabase secara real-time
  useEffect(() => {
    let mounted = true;

    authService
      .getSession()
      .then((u) => {
        if (mounted) setUser(u);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        if (session?.user) {
          // Cukup set data dasar dari session — profil lengkap sudah
          // di-fetch oleh authService.login() / getSession() sebelumnya.
          // Jangan panggil getProfile lagi di sini agar tidak duplikasi.
          setUser((prev) => {
            // Jika user sudah di-set oleh login(), pertahankan data profil lengkap
            if (prev?.id === session.user.id && prev?.name) return prev;
            // Fallback pertama kali (misal auto-refresh tab)
            return {
              ...session.user,
              name:
                session.user.user_metadata?.full_name ||
                session.user.email.split("@")[0],
              role: "parent",
              avatar_url: null,
            };
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback((data) => authService.register(data), []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (data) => {
      if (!user?.id) return;
      const updated = await authService.updateProfile(user.id, data);
      setUser((prev) => ({
        ...prev,
        ...updated,
        name: updated.full_name || prev.name,
        role: updated.user_segment || prev.role,
      }));
      return updated;
    },
    [user]
  );

  const changePassword = useCallback(
    (data) => {
      if (!user?.id) return;
      return authService.changePassword(user.id, data);
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
    }),
    [user, loading, login, register, logout, updateProfile, changePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
