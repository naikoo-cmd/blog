import { verifyToken } from "./api.js";

const SESSION_KEY = "adminSession";

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

/**
 * Check if user is authenticated by verifying the JWT token with the backend
 */
export const isAdminAuthenticated = async () => {
  const session = readSession();
  if (!session || !session.token) {
    return false;
  }

  // Verify token with backend
  try {
    await verifyToken();
    return true;
  } catch (error) {
    // Token is invalid or expired
    clearAdminSession();
    return false;
  }
};

/**
 * Synchronous check for client-side routing (may not be 100% accurate)
 * For actual protection, use the async version or protect routes on the backend
 */
export const isAdminAuthenticatedSync = () => {
  const session = readSession();
  return Boolean(session && session.token);
};

/**
 * Start admin session with JWT token from backend
 */
export const startAdminSession = (token, user) => {
  const session = {
    token,
    user,
    timestamp: Date.now(),
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

