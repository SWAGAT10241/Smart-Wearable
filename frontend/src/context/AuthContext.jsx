import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi, saveToken, clearToken, getToken } from '../lib/apiClient';

// NOTE (see rules.md §6): storing the JWT in localStorage is acceptable for this
// course-project stage but should move to an httpOnly cookie + CSRF token before
// any real production deployment.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const { user } = await authApi.me();
      setUser(user);
      return user;
    } catch {
      clearToken();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const { token, user } = await authApi.login({ email, password });
    saveToken(token);
    setUser(user);
    return user;
  };

  const register = async (payload) => {
    const { token, user } = await authApi.register(payload);
    saveToken(token);
    setUser(user);
    return user;
  };

  const completeProfile = async (payload) => {
    const { user } = await authApi.completeProfile(payload);
    setUser(user);
    return user;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const value = { user, loading, login, register, completeProfile, logout, refreshUser: loadUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
}
