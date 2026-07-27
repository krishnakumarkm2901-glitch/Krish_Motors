import React, { createContext, useContext, useEffect, useState } from "react";
import { readJson, SESSION_KEY, USERS_KEY, writeJson } from "../utils/storage";

const AuthContext = createContext(null);
const adminAccount = {
  id: "admin",
  name: "Krish_Motors Admin",
  email: process.env.REACT_APP_ADMIN_EMAIL || "",
  password: process.env.REACT_APP_ADMIN_PASSWORD || "",
  role: "admin",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJson(SESSION_KEY, null));

  useEffect(() => {
    const sync = (event) => {
      if (!event.key || event.key === SESSION_KEY) setUser(readJson(SESSION_KEY, null));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const login = ({ email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = readJson(USERS_KEY, []);
    const account = role === "admin"
      ? adminAccount
      : users.find((item) => item.email === normalizedEmail);
    if (!account || account.email !== normalizedEmail || account.password !== password) {
      return { ok: false, message: "Incorrect email or password." };
    }
    const session = {
      id: account.id, name: account.name, email: account.email,
      phone: account.phone || "", role: account.role,
    };
    writeJson(SESSION_KEY, session);
    if (role === "user") {
      writeJson(USERS_KEY, users.map((item) =>
        item.id === account.id
          ? { ...item, lastLogin: new Date().toISOString() }
          : item
      ));
    }
    setUser(session);
    return { ok: true, user: session };
  };

  const register = ({ name, email, phone, password }) => {
    const users = readJson(USERS_KEY, []);
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((item) => item.email === normalizedEmail)) {
      return { ok: false, message: "An account with this email already exists." };
    }
    const account = {
      id: `user-${Date.now()}`, name: name.trim(), email: normalizedEmail,
      phone: phone.trim(), password, role: "user",
      registeredAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    writeJson(USERS_KEY, [...users, account]);
    const { password: ignored, ...session } = account;
    writeJson(SESSION_KEY, session);
    setUser(session);
    return { ok: true, user: session };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
