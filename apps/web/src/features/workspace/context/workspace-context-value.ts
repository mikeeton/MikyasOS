import { createContext } from 'react';

import type { Organisation, User } from '@/api/client';
import type { ThemePreference } from '@/stores/theme-store';

export type WorkspaceNotification = {
  id: string;
  group: 'System' | 'Workspace' | 'Security';
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
};

export type WorkspaceContextValue = {
  currentUser: User | null;
  currentOrganisation: Organisation | null;
  organisations: Organisation[];
  isLoadingOrganisations: boolean;
  switchOrganisation: (organisationId: string) => void;
  isSwitchingOrganisation: boolean;
  theme: ThemePreference;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemePreference) => void;
  permissions: string[];
  featureFlags: Record<string, boolean>;
  notifications: WorkspaceNotification[];
  unreadCount: number;
  markAllNotificationsRead: () => void;
  aiStatus: 'idle' | 'placeholder';
};

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);
