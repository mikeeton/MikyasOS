import { create } from 'zustand';

export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeStore = {
  theme: ThemePreference;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
};

const storageKey = 'mikyasos.theme';

const getSystemTheme = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

const applyTheme = (theme: ThemePreference) => {
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }

  return resolvedTheme;
};

const getInitialTheme = (): ThemePreference => {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const stored = window.localStorage.getItem(storageKey);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    applyTheme(stored);
    return stored;
  }

  applyTheme('system');
  return 'system';
};

const initialTheme = getInitialTheme();

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: initialTheme,
  resolvedTheme: applyTheme(initialTheme),
  setTheme: (theme) => {
    const resolvedTheme = applyTheme(theme);
    window.localStorage.setItem(storageKey, theme);
    set({ theme, resolvedTheme });
  },
  toggleTheme: () => {
    const nextTheme = get().resolvedTheme === 'dark' ? 'light' : 'dark';
    get().setTheme(nextTheme);
  },
}));
