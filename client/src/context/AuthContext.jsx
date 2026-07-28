import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);
const SESSION_KEY = "krish_motors_session";
const TOKEN_KEY = "krish_motors_token";

const savedSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
  catch { return null; }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(savedSession);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return setLoading(false);
    api("/auth/me")
      .then(({ user: current }) => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(current));
        setUser(current);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const authenticate = async (path, body) => {
    try {
      const result = await api(path, { method: "POST", body: JSON.stringify(body) });
      localStorage.setItem(TOKEN_KEY, result.token);
      localStorage.setItem(SESSION_KEY, JSON.stringify(result.user));
      setUser(result.user);
      return { ok: true, user: result.user };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  };

  const login = ({ email, password, role }) => authenticate("/auth/login", { email, password, role });
  const register = ({ name, email, phone, password }) => authenticate("/auth/register", { name, email, phone, password });
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
