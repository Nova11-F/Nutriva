import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    authService
      .getSession()
      .then((u) => {
        if (!ignore) setUser(u);
      })
      .catch(() => {
        if (!ignore) setUser(null);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback((data) => authService.register(data), []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);


  const updateProfile = useCallback(
    async (data) => {
      const updated = await authService.updateProfile(user.id, data);
      setUser(updated);
      return updated;
    },
    [user],
  );

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile }),
    [user, loading, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
