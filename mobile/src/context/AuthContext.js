import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../lib/apiClient";
import { saveToken, getToken, clearToken } from "../lib/storage";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokenReady, setTokenReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      const token = await getToken();

      if (token) {
        try {
          const response = await authApi.me();
          setUser(response.user || response);
        } catch {
          await clearToken();
          setUser(null);
        }
      }
    } finally {
      setTokenReady(true);
      setLoading(false);
    }
  }

  async function login(username, password) {
    const response = await authApi.login({
      username,
      password,
    });

    const receivedToken =
      response.token || response.accessToken || response.jwt;

    if (!receivedToken) {
      throw new Error("Login succeeded but no token was returned");
    }

    await saveToken(receivedToken);
    setUser(response.user || response);
    return response;
  }

  async function register(payload) {
    const response = await authApi.register(payload);

    const receivedToken = response.token || response.accessToken || response.jwt;

    if (receivedToken) {
      await saveToken(receivedToken);
      setUser(response.user || response);
    }

    return response;
  }

  async function completeProfile(payload) {
    const response = await authApi.completeProfile(payload);
    setUser(response.user || response);
    return response;
  }

  async function logout() {
    await clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        tokenReady,
        isAuthenticated: !!user,
        login,
        register,
        completeProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
