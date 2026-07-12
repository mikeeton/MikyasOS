import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCheck,
  CircleDollarSign,
  Inbox,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Workflow,
  Archive,
  Pin,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { useNotificationCentre } from '@/features/notifications/use-notification-centre';
import { cn } from '@/lib/utils';

import { premiumSpring } from '../motion/premium-motion';

const groupStyles = {
  Calendar: {
    icon: CalendarDays,
    className:
      'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-100',
  },
  Projects: {
    icon: BriefcaseBusiness,
    className:
      'border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-900/60 dark:bg-violet-950/30 dark:text-violet-100',
  },
  Finance: {
    icon: CircleDollarSign,
    className:
      'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100',
  },
  Automation: {
    icon: Workflow,
    className:
      'border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-100',
  },
  Communication: {
    icon: MessageSquareText,
    className:
      'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100',
  },
  Security: {
    icon: ShieldCheck,
    className:
      'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-100',
  },
  System: {
    icon: Sparkles,
    className:
      'border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100',
  },
  Workspace: {
    icon: Sparkles,
    className:
      'border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100',
  },
} as const;

function getGroupStyle(group: string) {
  return groupStyles[group as keyof typeof groupStyles] ?? groupStyles.Workspace;
}

export function NotificationCentre() {
  const [open, setOpen] = useState(false);
  const notificationCentre = useNotificationCentre();
  const liveNotifications = notificationCentre.notifications.filter(
    (notification) => notification.status !== 'deleted' && notification.status !== 'archived',
  );
  const liveUnreadCount = notificationCentre.unreadCount;

  const groupedNotifications = useMemo(
    () =>
      liveNotifications.reduce<Record<string, typeof liveNotifications>>((groups, notification) => {
        const existing = groups[notification.group] ?? [];
        return { ...groups, [notification.group]: [...existing, notification] };
      }, {}),
    [liveNotifications],
  );

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        aria-label={`Notifications${liveUnreadCount > 0 ? `, ${liveUnreadCount} unread` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative"
      >
        <Bell className="size-4" aria-hidden="true" />
        {liveUnreadCount > 0 && (
          <span className="ai-breathing absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
            {liveUnreadCount}
          </span>
        )}
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={premiumSpring}
            className="premium-glass absolute right-0 z-40 mt-3 w-[min(29rem,calc(100vw-2rem))] overflow-hidden rounded-md shadow-2xl"
          >
            <div className="relative overflow-hidden border-b border-border px-4 py-4">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.18),transparent_34rem)]"
                aria-hidden="true"
              />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-md border bg-background/70">
                    {liveUnreadCount > 0 ? (
                      <AlertTriangle className="size-4 text-amber-500" aria-hidden="true" />
                    ) : (
                      <CheckCheck className="size-4 text-emerald-500" aria-hidden="true" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Notification centre</p>
                    <p className="text-xs text-muted-foreground">
                      {liveUnreadCount > 0
                        ? `${liveUnreadCount} live workspace signal${liveUnreadCount === 1 ? '' : 's'}`
                        : 'No urgent signals right now'}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={notificationCentre.markAllRead}>
                  <CheckCheck className="mr-2 size-4" aria-hidden="true" />
                  Mark read
                </Button>
              </div>
            </div>
            <div className="border-b border-border px-4 py-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md border bg-background/65 px-2 py-2">
                  <p className="text-sm font-semibold">{liveNotifications.length}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</p>
                </div>
                <div className="rounded-md border bg-background/65 px-2 py-2">
                  <p className="text-sm font-semibold">{liveUnreadCount}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Unread
                  </p>
                </div>
                <div className="rounded-md border bg-background/65 px-2 py-2">
                  <p className="text-sm font-semibold">
                    {Object.keys(groupedNotifications).length}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Groups
                  </p>
                </div>
              </div>
            </div>
            <div className="max-h-[26rem] overflow-y-auto p-2.5">
              {liveNotifications.length === 0 ? (
                <div className="grid gap-2 px-4 py-12 text-center">
                  <span className="mx-auto grid size-12 place-items-center rounded-md border bg-secondary">
                    <Inbox className="size-6 text-muted-foreground" aria-hidden="true" />
                  </span>
                  <p className="mt-2 text-sm font-medium">Everything is quiet</p>
                  <p className="text-xs text-muted-foreground">
                    Due work, upcoming meetings, finance follow-ups, and blocked projects will
                    appear here automatically.
                  </p>
                </div>
              ) : (
                Object.entries(groupedNotifications).map(([group, items]) => (
                  <section key={group} aria-labelledby={`notification-group-${group}`}>
                    <div className="sticky top-0 z-10 flex items-center justify-between rounded-md bg-background/90 px-2 py-2 backdrop-blur">
                      <h2
                        id={`notification-group-${group}`}
                        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                      >
                        {(() => {
                          const style = getGroupStyle(group);
                          const Icon = style.icon;
                          return (
                            <span
                              className={cn(
                                'grid size-6 place-items-center rounded-md border',
                                style.className,
                              )}
                            >
                              <Icon className="size-3.5" aria-hidden="true" />
                            </span>
                          );
                        })()}
                        {group}
                      </h2>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                        {items.length}
                      </span>
                    </div>
                    <div className="grid gap-2 pb-2">
                      {items.slice(0, 5).map((notification) => (
                        <motion.article
                          key={notification.id}
                          layout
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            'premium-list-link overflow-hidden',
                            notification.unread && 'border-primary/25 bg-primary/5',
                          )}
                        >
                          <Link
                            to={notification.route ?? '/app/today'}
                            onClick={() => setOpen(false)}
                            className="flex items-start gap-3 px-3 py-3"
                          >
                            {(() => {
                              const style = getGroupStyle(notification.group);
                              const Icon = style.icon;
                              return (
                                <span
                                  className={cn(
                                    'mt-0.5 grid size-9 shrink-0 place-items-center rounded-md border',
                                    style.className,
                                  )}
                                >
                                  <Icon className="size-4" aria-hidden="true" />
                                </span>
                              );
                            })()}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium">{notification.title}</p>
                                {notification.unread && (
                                  <span
                                    className="mt-1 size-2 shrink-0 rounded-full bg-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]"
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                {notification.description}
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                                  {notification.timestamp}
                                </span>
                                <span className="rounded-full border bg-background/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                                  {notification.priority ?? 'medium'}
                                </span>
                                {notification.unread && (
                                  <span className="status-pill status-pill-info px-2 py-0.5 text-[10px]">
                                    Open
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                          <div className="flex border-t bg-background/50 px-3 py-2">
                            <button
                              type="button"
                              className="premium-focus rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                              onClick={() => notificationCentre.markRead(notification.id)}
                            >
                              Read
                            </button>
                            <button
                              type="button"
                              className="premium-focus rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                              onClick={() => notificationCentre.togglePin(notification.id)}
                            >
                              <Pin className="mr-1 inline size-3" />
                              Pin
                            </button>
                            <button
                              type="button"
                              className="premium-focus rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                              onClick={() => notificationCentre.archive(notification.id)}
                            >
                              <Archive className="mr-1 inline size-3" />
                              Archive
                            </button>
                            <button
                              type="button"
                              className="premium-focus ml-auto rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => notificationCentre.deleteNotification(notification.id)}
                            >
                              <Trash2 className="mr-1 inline size-3" />
                              Delete
                            </button>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
            <div className="border-t p-3">
              <Button asChild className="w-full" variant="outline" size="sm">
                <Link to="/app/notifications" onClick={() => setOpen(false)}>
                  View full notification centre
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
