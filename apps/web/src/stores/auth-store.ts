import { create } from 'zustand';

import type { AuthResponse, User } from '@/api/client';

type AuthStore = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setAuth: (response: AuthResponse) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
};

const storageKeys = {
  accessToken: 'mikyasos.accessToken',
  refreshToken: 'mikyasos.refreshToken',
  user: 'mikyasos.user',
};

type JwtPayload = {
  exp?: number;
};

export const isJwtExpired = (token: string | null) => {
  if (!token) {
    return true;
  }

  try {
    const [, payload] = token.split('.');
    if (!payload) {
      return true;
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = JSON.parse(window.atob(padded)) as JwtPayload;
    return typeof decoded.exp !== 'number' || decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const clearStoredAuth = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(storageKeys.accessToken);
  window.localStorage.removeItem(storageKeys.refreshToken);
  window.localStorage.removeItem(storageKeys.user);
};

const readUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(storageKeys.user);
  try {
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    clearStoredAuth();
    return null;
  }
};

const readInitialAuth = () => {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null, user: null };
  }

  const accessToken = window.localStorage.getItem(storageKeys.accessToken);
  if (isJwtExpired(accessToken)) {
    clearStoredAuth();
    return { accessToken: null, refreshToken: null, user: null };
  }

  return {
    accessToken,
    refreshToken: window.localStorage.getItem(storageKeys.refreshToken),
    user: readUser(),
  };
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...readInitialAuth(),
  setAuth: (response) => {
    window.localStorage.setItem(storageKeys.accessToken, response.accessToken);
    window.localStorage.setItem(storageKeys.refreshToken, response.refreshToken);
    window.localStorage.setItem(storageKeys.user, JSON.stringify(response.user));
    set({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      user: response.user,
    });
  },
  setUser: (user) => {
    if (user) {
      window.localStorage.setItem(storageKeys.user, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(storageKeys.user);
    }
    set({ user });
  },
  clearAuth: () => {
    clearStoredAuth();
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));
