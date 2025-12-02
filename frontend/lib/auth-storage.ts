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
    const token = localStorage.getItem(TOKEN_KEY);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-storage.ts:39',message:'getAccessToken called',data:{hasToken:!!token,tokenLength:token?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return token;
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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-storage.ts:78',message:'setSession called',data:{hasAccessToken:!!session.accessToken,hasRefreshToken:!!session.refreshToken,hasUser:!!session.user,expiresInMs:session.expiresInMs},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'L'})}).catch(()=>{});
    // #endregion
    const { accessToken, refreshToken, expiresInMs, user, rememberMe } = session;
    
    // Always calculate token expiry - use provided value or default to 7 days (or 30 days if rememberMe)
    // This ensures auth-provider.tsx doesn't think token is expired immediately after redirect
    const defaultExpiryMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    const finalExpiresInMs = typeof expiresInMs === 'number' && expiresInMs > 0 
      ? expiresInMs 
      : defaultExpiryMs;
    
    // Set localStorage
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    localStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + finalExpiresInMs).toString());
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    if (typeof rememberMe === 'boolean') {
      localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
    }
    
    // Set cookies for server-side proxy.ts to check
    // Use the same expiry as localStorage to ensure consistency
    const expiryDate = new Date(Date.now() + finalExpiresInMs);
    
    // Set token cookie
    document.cookie = `${TOKEN_KEY}=${accessToken}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    
    // Set user cookie
    if (user) {
      document.cookie = `${USER_KEY}=${encodeURIComponent(JSON.stringify(user))}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    }
    
    // #region agent log
    const verifyToken = localStorage.getItem(TOKEN_KEY);
    const verifyUser = localStorage.getItem(USER_KEY);
    const cookieToken = document.cookie.split(';').find(c => c.trim().startsWith(`${TOKEN_KEY}=`));
    fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-storage.ts:110',message:'setSession completed',data:{verifyTokenLength:verifyToken?.length||0,hasVerifyToken:!!verifyToken,hasVerifyUser:!!verifyUser,hasCookieToken:!!cookieToken,cookieTokenLength:cookieToken?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'L'})}).catch(()=>{});
    // #endregion
    emit(AUTH_EVENTS.SESSION_UPDATED, { hasRefreshToken: Boolean(refreshToken) });
  },

  setUser(user: StoredUser) {
    if (!isBrowser) return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    emit(AUTH_EVENTS.SESSION_UPDATED, { user });
  },

  clearSession() {
    if (!isBrowser) return;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/62068610-8d6c-4e16-aeca-25fb5b062aef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth-storage.ts:130',message:'clearSession called',data:{stackTrace:new Error().stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run7',hypothesisId:'O'})}).catch(()=>{});
    // #endregion
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    
    // Clear cookies
    document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${USER_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    emit(AUTH_EVENTS.LOGOUT);
  },
};
