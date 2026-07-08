import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState, type ReactNode } from 'react';

import { identityApi } from '@/api/client';
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth-store';
import { useThemeStore } from '@/stores/theme-store';

import {
  WorkspaceContext,
  type WorkspaceContextValue,
  type WorkspaceNotification,
} from './workspace-context-value';

const mockNotifications: WorkspaceNotification[] = [
  {
    id: 'identity-ready',
    group: 'System',
    title: 'Identity platform is active',
    description: 'Authentication, organisations, and role foundations are available.',
    timestamp: 'Today',
    unread: true,
  },
  {
    id: 'workspace-shell',
    group: 'Workspace',
    title: 'Workspace shell prepared',
    description: 'Navigation, search, notifications, and command surfaces are ready.',
    timestamp: 'Today',
    unread: true,
  },
  {
    id: 'security-audit',
    group: 'Security',
    title: 'Audit trail enabled',
    description: 'Identity events are recorded by the API for future administration views.',
    timestamp: 'Yesterday',
    unread: false,
  },
];

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentUser = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const { theme, resolvedTheme, setTheme } = useThemeStore();
  const [notifications, setNotifications] = useState(mockNotifications);

  const organisationsQuery = useQuery({
    queryKey: ['organisations'],
    queryFn: () => identityApi.organisations(accessToken!),
    enabled: Boolean(accessToken),
  });

  const switchOrganisationMutation = useMutation({
    mutationFn: (organisationId: string) =>
      identityApi.switchOrganisation(accessToken!, organisationId),
    onSuccess: (response) => {
      setAuth(response);
      void queryClient.invalidateQueries({ queryKey: ['organisations'] });
    },
  });

  const organisations = useMemo(() => organisationsQuery.data ?? [], [organisationsQuery.data]);
  const currentOrganisation =
    organisations.find((organisation) => organisation.id === currentUser?.activeOrganisationId) ??
    organisations[0] ??
    null;

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      currentUser,
      currentOrganisation,
      organisations,
      isLoadingOrganisations: organisationsQuery.isLoading,
      switchOrganisation: (organisationId) => switchOrganisationMutation.mutate(organisationId),
      isSwitchingOrganisation: switchOrganisationMutation.isPending,
      theme,
      resolvedTheme,
      setTheme,
      permissions: ['workspace.read'],
      featureFlags: {
        crm: false,
        projects: false,
        tasks: false,
        documents: false,
        calendar: false,
        finance: false,
        analytics: false,
        automation: false,
        ai: false,
      },
      notifications,
      unreadCount: notifications.filter((notification) => notification.unread).length,
      markAllNotificationsRead: () =>
        setNotifications((items) => items.map((item) => ({ ...item, unread: false }))),
      aiStatus: 'placeholder',
    }),
    [
      currentOrganisation,
      currentUser,
      notifications,
      organisations,
      organisationsQuery.isLoading,
      resolvedTheme,
      setTheme,
      switchOrganisationMutation,
      theme,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}
