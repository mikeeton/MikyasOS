import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck, Inbox } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useWorkspace } from '../hooks/use-workspace';
import { premiumSpring } from '../motion/premium-motion';

export function NotificationCentre() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllNotificationsRead } = useWorkspace();

  const groupedNotifications = useMemo(
    () =>
      notifications.reduce<Record<string, typeof notifications>>((groups, notification) => {
        const existing = groups[notification.group] ?? [];
        return { ...groups, [notification.group]: [...existing, notification] };
      }, {}),
    [notifications],
  );

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative"
      >
        <Bell className="size-4" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="ai-breathing absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
            {unreadCount}
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
            className="premium-glass absolute right-0 z-40 mt-3 w-[min(24rem,calc(100vw-2rem))] rounded-md"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Notifications</p>
                <p className="text-xs text-muted-foreground">{unreadCount} unread updates</p>
              </div>
              <Button variant="ghost" size="sm" onClick={markAllNotificationsRead}>
                <CheckCheck className="mr-2 size-4" aria-hidden="true" />
                Mark read
              </Button>
            </div>
            <div className="max-h-[26rem] overflow-y-auto p-2">
              {notifications.length === 0 ? (
                <div className="grid gap-2 px-4 py-10 text-center">
                  <Inbox className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm font-medium">Nothing new</p>
                  <p className="text-xs text-muted-foreground">
                    Workspace updates will appear here.
                  </p>
                </div>
              ) : (
                Object.entries(groupedNotifications).map(([group, items]) => (
                  <section key={group} aria-labelledby={`notification-group-${group}`}>
                    <h2
                      id={`notification-group-${group}`}
                      className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {group}
                    </h2>
                    <div className="grid gap-1">
                      {items.map((notification) => (
                        <motion.article
                          key={notification.id}
                          layout
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            'rounded-md px-3 py-3 transition hover:bg-accent',
                            notification.unread && 'bg-accent/60',
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={cn(
                                'mt-1 size-2 rounded-full bg-muted-foreground',
                                notification.unread && 'bg-primary',
                              )}
                              aria-hidden="true"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium">{notification.title}</p>
                              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                {notification.description}
                              </p>
                              <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                                {notification.timestamp}
                              </p>
                            </div>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
