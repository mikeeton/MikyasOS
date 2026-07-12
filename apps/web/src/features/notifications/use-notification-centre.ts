import { useEffect, useMemo, useState } from 'react';

import { useTodayCommandCentre } from '@/features/today/use-today-command-centre';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import type { WorkspaceNotification } from '@/features/workspace/context/workspace-context-value';

export type NotificationFilter = 'all' | 'unread' | 'read' | 'archived' | 'pinned' | 'deleted';

type NotificationState = {
  readIds: string[];
  archivedIds: string[];
  deletedIds: string[];
  pinnedIds: string[];
  mutedModules: string[];
  mutedTypes: string[];
};

const emptyState: NotificationState = {
  readIds: [],
  archivedIds: [],
  deletedIds: [],
  pinnedIds: [],
  mutedModules: [],
  mutedTypes: [],
};

const storageKey = 'mikyasos:notification-centre';

function readState(): NotificationState {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored
      ? { ...emptyState, ...(JSON.parse(stored) as Partial<NotificationState>) }
      : emptyState;
  } catch {
    return emptyState;
  }
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function removeValue(values: string[], value: string) {
  return values.filter((item) => item !== value);
}

function normalizeNotification(
  notification: WorkspaceNotification,
  organisationName?: string,
): WorkspaceNotification {
  const sourceModule = notification.sourceModule ?? notification.group;
  const priority =
    notification.priority ??
    (notification.group === 'Finance'
      ? 'high'
      : notification.group === 'Security'
        ? 'critical'
        : notification.unread
          ? 'medium'
          : 'low');

  return {
    ...notification,
    sourceModule,
    priority,
    type: notification.type ?? notification.group.toLowerCase(),
    status: notification.unread ? 'unread' : 'read',
    organisationName,
  };
}

export function useNotificationCentre() {
  const today = useTodayCommandCentre();
  const { notifications, currentOrganisation, currentUser } = useWorkspace();
  const [state, setState] = useState<NotificationState>(() => readState());
  const [lastDeleted, setLastDeleted] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const sourceNotifications = today.notifications.length > 0 ? today.notifications : notifications;

  const notificationsWithState = useMemo(
    () =>
      sourceNotifications
        .map((notification) => normalizeNotification(notification, currentOrganisation?.name))
        .filter(
          (notification) =>
            !state.mutedModules.includes(notification.sourceModule ?? notification.group) &&
            !state.mutedTypes.includes(notification.type ?? notification.group),
        )
        .map((notification) => {
          const deleted = state.deletedIds.includes(notification.id);
          const archived = state.archivedIds.includes(notification.id);
          const read =
            state.readIds.includes(notification.id) || (!notification.unread && !deleted);
          return {
            ...notification,
            unread: !read && !archived && !deleted,
            status: deleted ? 'deleted' : archived ? 'archived' : read ? 'read' : 'unread',
            relatedUser:
              notification.relatedUser ?? currentUser?.name ?? currentUser?.email ?? 'System',
          } satisfies WorkspaceNotification;
        }),
    [
      currentOrganisation?.name,
      currentUser?.email,
      currentUser?.name,
      sourceNotifications,
      state.archivedIds,
      state.deletedIds,
      state.mutedModules,
      state.mutedTypes,
      state.readIds,
    ],
  );

  const setList = (key: keyof NotificationState, updater: (values: string[]) => string[]) => {
    setState((current) => ({ ...current, [key]: updater(current[key]) }));
  };

  return {
    notifications: notificationsWithState,
    unreadCount: notificationsWithState.filter((notification) => notification.status === 'unread')
      .length,
    pinnedIds: state.pinnedIds,
    mutedModules: state.mutedModules,
    mutedTypes: state.mutedTypes,
    lastDeleted,
    preferences: {
      email: true,
      inApp: true,
      desktop: false,
      sound: false,
      digest: 'Daily digest',
      quietHours: '22:00 - 07:00',
      workingHours: '09:00 - 17:30',
    },
    markRead: (id: string) => setList('readIds', (values) => unique([...values, id])),
    markAllRead: () =>
      setList('readIds', (values) =>
        unique([...values, ...notificationsWithState.map((item) => item.id)]),
      ),
    archive: (id: string) => setList('archivedIds', (values) => unique([...values, id])),
    deleteNotification: (id: string) => {
      setLastDeleted(id);
      setList('deletedIds', (values) => unique([...values, id]));
    },
    deleteAllRead: () =>
      setList('deletedIds', (values) =>
        unique([
          ...values,
          ...notificationsWithState
            .filter((notification) => notification.status === 'read')
            .map((notification) => notification.id),
        ]),
      ),
    undoDelete: () => {
      if (!lastDeleted) return;
      setList('deletedIds', (values) => removeValue(values, lastDeleted));
      setLastDeleted(null);
    },
    togglePin: (id: string) =>
      setList('pinnedIds', (values) =>
        values.includes(id) ? removeValue(values, id) : unique([...values, id]),
      ),
    muteModule: (module: string) =>
      setList('mutedModules', (values) => unique([...values, module])),
    muteType: (type: string) => setList('mutedTypes', (values) => unique([...values, type])),
    restore: (id: string) => {
      setList('deletedIds', (values) => removeValue(values, id));
      setList('archivedIds', (values) => removeValue(values, id));
    },
  };
}
