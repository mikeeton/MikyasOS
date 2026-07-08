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

const readUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(storageKeys.user);
  return stored ? (JSON.parse(stored) as User) : null;
};

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken:
    typeof window === 'undefined' ? null : window.localStorage.getItem(storageKeys.accessToken),
  refreshToken:
    typeof window === 'undefined' ? null : window.localStorage.getItem(storageKeys.refreshToken),
  user: readUser(),
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
    window.localStorage.removeItem(storageKeys.accessToken);
    window.localStorage.removeItem(storageKeys.refreshToken);
    window.localStorage.removeItem(storageKeys.user);
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));
