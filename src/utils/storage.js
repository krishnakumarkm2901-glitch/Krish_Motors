export const USERS_KEY = "krish_motors_users";
export const BOOKINGS_KEY = "bookings";
export const SESSION_KEY = "krish_motors_session";
export const SERVICES_KEY = "krish_motors_services";
export const MESSAGES_KEY = "krish_motors_messages";
export const DATA_EVENT = "krish-motors:data";

const legacyKeys = {
  krish_motors_users: "revtune_users",
  krish_motors_session: "revtune_session",
  krish_motors_services: "revtune_services",
  krish_motors_messages: "revtune_messages",
};

export const readJson = (key, fallback) => {
  try {
    const current = localStorage.getItem(key);
    if (current !== null) return JSON.parse(current) ?? fallback;

    const legacyKey = legacyKeys[key];
    const legacyValue = legacyKey ? localStorage.getItem(legacyKey) : null;
    if (legacyValue !== null) {
      localStorage.setItem(key, legacyValue);
      return JSON.parse(legacyValue) ?? fallback;
    }
    return fallback;
  } catch {
    return fallback;
  }
};

export const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(DATA_EVENT, { detail: { key } }));
};

export const makeId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
