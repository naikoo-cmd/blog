const SESSION_KEY = "adminSession";
const SESSION_TTL_MS = 1000 * 60 * 60 * 4; // 4 hours

const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readSession = () => {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Unable to read admin session", error);
    return null;
  }
};

const persistSession = (session) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.warn("Unable to persist admin session", error);
  }
};

export const isAdminAuthenticated = () => {
  const session = readSession();
  if (!session) return false;

  const expired = typeof session.expiresAt !== "number" || session.expiresAt < Date.now();
  if (expired) {
    clearAdminSession();
    return false;
  }

  return Boolean(session.token);
};

const generateToken = () => {
  if (typeof crypto !== "undefined") {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    if (typeof crypto.getRandomValues === "function") {
      const array = crypto.getRandomValues(new Uint32Array(4));
      return Array.from(array, (value) => value.toString(16)).join("-");
    }
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const startAdminSession = () => {
  const session = {
    token: generateToken(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  };

  persistSession(session);
  return session;
};

export const clearAdminSession = () => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.warn("Unable to clear admin session", error);
  }
};

