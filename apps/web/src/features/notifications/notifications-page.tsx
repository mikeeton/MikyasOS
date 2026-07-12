import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  Archive,
  Bell,
  CheckCheck,
  Filter,
  Inbox,
  Pin,
  RotateCcw,
  Search,
  Settings,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useNotificationCentre, type NotificationFilter } from './use-notification-centre';

const filters: Array<{ key: NotificationFilter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
  { key: 'archived', label: 'Archived' },
  { key: 'pinned', label: 'Pinned' },
  { key: 'deleted', label: 'Deleted' },
];

export function NotificationsPage() {
  const centre = useNotificationCentre();
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const modules = useMemo(
    () =>
      Array.from(
        new Set(centre.notifications.map((item) => item.sourceModule ?? item.group)),
      ).sort(),
    [centre.notifications],
  );

  const filtered = centre.notifications.filter((notification) => {
    const pinned = centre.pinnedIds.includes(notification.id);
    const q = query.trim().toLowerCase();
    if (filter === 'pinned' && !pinned) return false;
    if (filter !== 'all' && filter !== 'pinned' && notification.status !== filter) return false;
    if (
      moduleFilter !== 'all' &&
      (notification.sourceModule ?? notification.group) !== moduleFilter
    ) {
      return false;
    }
    if (priorityFilter !== 'all' && notification.priority !== priorityFilter) return false;
    if (!q) return true;
    return [
      notification.title,
      notification.description,
      notification.sourceModule,
      notification.relatedUser,
      notification.organisationName,
      notification.type,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q));
  });

  const selected =
    centre.notifications.find((item) => item.id === selectedId) ?? filtered[0] ?? null;

  return (
    <section className="grid gap-6">
      <header className="premium-section premium-hero p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="status-pill status-pill-info">
              <Bell className="size-3" />
              Enterprise notifications
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Notification centre</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Search, triage, archive, pin, delete, and inspect operational notifications across
              calendar, projects, finance, automation, security, and the workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={centre.markAllRead}>
              <CheckCheck className="mr-2 size-4" />
              Mark all read
            </Button>
            <Button variant="outline" onClick={centre.deleteAllRead}>
              <Trash2 className="mr-2 size-4" />
              Delete read
            </Button>
            {centre.lastDeleted && (
              <Button variant="outline" onClick={centre.undoDelete}>
                <RotateCcw className="mr-2 size-4" />
                Undo delete
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat
          label="Unread"
          value={centre.notifications.filter((item) => item.status === 'unread').length}
        />
        <Stat label="Pinned" value={centre.pinnedIds.length} />
        <Stat
          label="Archived"
          value={centre.notifications.filter((item) => item.status === 'archived').length}
        />
        <Stat label="Muted modules" value={centre.mutedModules.length} />
      </div>

      <section className="premium-card p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
          <label className="premium-input flex items-center gap-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, module, user, project, company..."
              className="min-w-0 flex-1 bg-transparent outline-none"
            />
          </label>
          <select
            className="premium-input"
            value={moduleFilter}
            onChange={(event) => setModuleFilter(event.target.value)}
          >
            <option value="all">All modules</option>
            {modules.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>
          <select
            className="premium-input"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
          >
            <option value="all">All priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <Button variant="outline" onClick={() => setQuery('')}>
            <Filter className="mr-2 size-4" />
            Reset
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              className={cn(
                'rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground',
                filter === item.key && 'bg-foreground text-background',
              )}
              onClick={() => setFilter(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="grid gap-3">
          {filtered.map((notification) => (
            <article
              key={notification.id}
              className={cn(
                'premium-list-link p-4',
                selected?.id === notification.id && 'ring-2 ring-ring',
                notification.status === 'unread' && 'border-primary/30 bg-primary/5',
              )}
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => setSelectedId(notification.id)}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{notification.sourceModule ?? notification.group}</Badge>
                    <Badge>{notification.priority ?? 'medium'}</Badge>
                    <Badge>{notification.status}</Badge>
                  </div>
                </div>
              </button>
              <div className="mt-4 flex flex-wrap gap-2 border-t pt-3">
                <Action onClick={() => centre.markRead(notification.id)}>Read</Action>
                <Action onClick={() => centre.togglePin(notification.id)}>
                  <Pin className="mr-1 size-3" />
                  Pin
                </Action>
                <Action onClick={() => centre.archive(notification.id)}>
                  <Archive className="mr-1 size-3" />
                  Archive
                </Action>
                <Action
                  onClick={() => centre.muteModule(notification.sourceModule ?? notification.group)}
                >
                  Mute module
                </Action>
                <Action onClick={() => centre.deleteNotification(notification.id)} danger>
                  <Trash2 className="mr-1 size-3" />
                  Delete
                </Action>
                <Button asChild size="sm" variant="outline" className="ml-auto">
                  <Link to={notification.route ?? '/app/today'}>Open object</Link>
                </Button>
              </div>
            </article>
          ))}
          {!filtered.length && (
            <div className="premium-card grid place-items-center p-12 text-center">
              <Inbox className="size-8 text-muted-foreground" />
              <h2 className="mt-4 font-semibold">No notifications match this view</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Change the filters, search another module, or wait for live workspace signals.
              </p>
            </div>
          )}
        </section>

        <aside className="grid content-start gap-6">
          <section className="premium-card p-5">
            <h2 className="font-semibold">Notification details</h2>
            {selected ? (
              <div className="mt-4 grid gap-4">
                <div>
                  <p className="text-lg font-semibold">{selected.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {selected.description}
                  </p>
                </div>
                <div className="grid gap-2 text-sm">
                  <Detail label="Triggered by" value={selected.relatedUser ?? 'System'} />
                  <Detail
                    label="Organisation"
                    value={selected.organisationName ?? 'Current organisation'}
                  />
                  <Detail label="Module" value={selected.sourceModule ?? selected.group} />
                  <Detail label="Priority" value={selected.priority ?? 'medium'} />
                  <Detail label="Status" value={selected.status ?? 'unread'} />
                  <Detail label="Time" value={selected.timestamp} />
                </div>
                <div className="rounded-md border bg-secondary/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Timeline
                  </p>
                  <ol className="mt-3 grid gap-3 text-sm">
                    <li>Notification created from live workspace signal.</li>
                    <li>Delivered to in-app notification centre.</li>
                    <li>Awaiting user action or archive.</li>
                  </ol>
                </div>
                <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  AI summary placeholder: notification summaries will use grounded workspace context
                  when real AI execution is enabled.
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Select a notification to inspect it.
              </p>
            )}
          </section>

          <section className="premium-card p-5">
            <div className="flex items-center gap-2">
              <Settings className="size-4" />
              <h2 className="font-semibold">Preferences</h2>
            </div>
            <div className="mt-4 grid gap-3 text-sm">
              {Object.entries(centre.preferences).map(([key, value]) => (
                <Detail key={key} label={key.replace(/[A-Z]/g, ' $&')} value={String(value)} />
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <section className="premium-metric">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border bg-background/70 px-2 py-1 text-xs text-muted-foreground">
      {children}
    </span>
  );
}

function Action({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        'premium-focus inline-flex items-center rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground',
        danger && 'hover:bg-destructive/10 hover:text-destructive',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-background/60 px-3 py-2">
      <span className="capitalize text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
