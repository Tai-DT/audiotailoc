export const TOKEN_KEY = 'audiotailoc_token';
export const REFRESH_TOKEN_KEY = 'audiotailoc_refresh_token';
export const USER_KEY = 'audiotailoc_user';
export const TOKEN_EXPIRY_KEY = 'audiotailoc_token_expiry';
export const REMEMBER_ME_KEY = 'audiotailoc_remember_me';

export const AUTH_EVENTS = {
  SESSION_UPDATED: 'audiotailoc:auth:session-updated',
  LOGOUT: 'audiotailoc:auth:logout',
} as const;

export interface StoredUser {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  [key: string]: unknown;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresInMs?: number;
  user?: StoredUser;
  rememberMe?: boolean;
}

const isBrowser = typeof window !== 'undefined';

const emit = (eventName: (typeof AUTH_EVENTS)[keyof typeof AUTH_EVENTS], detail?: Record<string, unknown>) => {
  if (!isBrowser) return;
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};

export const authStorage = {
  getAccessToken(): string | null {
    if (!isBrowser) return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (!isBrowser) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getUser<T = StoredUser>(): T | null {
    if (!isBrowser) return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      console.error('Failed to parse stored user', error);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  getTokenExpiry(): number | null {
    if (!isBrowser) return null;
    const raw = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!raw) return null;
    const expiry = parseInt(raw, 10);
    if (Number.isNaN(expiry)) {
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      return null;
    }
    return expiry;
  },

  setSession(session: AuthSession) {
    if (!isBrowser) return;
    const { accessToken, refreshToken, expiresInMs, user, rememberMe } = session;
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    if (typeof expiresInMs === 'number') {
      localStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + expiresInMs).toString());
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    if (typeof rememberMe === 'boolean') {
      localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
    }
    emit(AUTH_EVENTS.SESSION_UPDATED, { hasRefreshToken: Boolean(refreshToken) });
  },

  setUser(user: StoredUser) {
    if (!isBrowser) return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    emit(AUTH_EVENTS.SESSION_UPDATED, { user });
  },

  clearSession() {
    if (!isBrowser) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    emit(AUTH_EVENTS.LOGOUT);
  },
};
