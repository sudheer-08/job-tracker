import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth.api";
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  setAuthStorage,
} from "../utils/authStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    setToken(null);
  }, []);

  const persistAuth = useCallback((authToken, authUser) => {
    setAuthStorage(authToken, authUser);
    setToken(authToken);
    setUser(authUser);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { data } = await authApi.login(email, password);
      persistAuth(data.token, data.user);
      return data.user;
    },
    [persistAuth]
  );

  const register = useCallback(
    async (name, email, password) => {
      const { data } = await authApi.register(name, email, password);
      persistAuth(data.token, data.user);
      return data.user;
    },
    [persistAuth]
  );

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredToken();

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await authApi.getMe();
        setUser(data.user);
        setToken(storedToken);
        setAuthStorage(storedToken, data.user);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
