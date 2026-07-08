import {
  Bot,
  Building2,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Plus,
  Settings,
  Star,
} from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { workspaceNavigation } from '@/features/workspace/config/navigation';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';

export function AppHomePage() {
  const { currentUser, currentOrganisation, notifications } = useWorkspace();
  const pinnedApps = workspaceNavigation.slice(0, 6);

  return (
    <section className="grid gap-6">
      <div className="rounded-md border border-border bg-background p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {currentOrganisation?.name ?? 'Workspace'}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Welcome back, {currentUser?.name ?? 'there'}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Your permanent mikyasOS workspace shell is ready. Business modules will attach here in
              future milestones without changing the navigation foundation.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/organisations/new">
                <Plus className="mr-2 size-4" aria-hidden="true" />
                New organisation
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/app/settings">
                <Settings className="mr-2 size-4" aria-hidden="true" />
                Workspace settings
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-md border border-border bg-background p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Pinned apps</h3>
              <p className="text-sm text-muted-foreground">
                Core surfaces prepared for future modules.
              </p>
            </div>
            <Star className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {pinnedApps.map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="flex h-full flex-col rounded-md border border-border p-4 transition hover:border-foreground/20 hover:bg-accent">
                  <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                  <p className="mt-4 font-medium">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.disabled ? 'Placeholder ready' : 'Open workspace'}
                  </p>
                </div>
              );

              return item.disabled ? (
                <div key={item.title} aria-label={`${item.title} coming soon`}>
                  {content}
                </div>
              ) : (
                <Link key={item.title} to={item.route}>
                  {content}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-md border border-border bg-background p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Company health</h3>
              <p className="text-sm text-muted-foreground">
                Placeholder signals for later modules.
              </p>
            </div>
            <HeartPulse className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="mt-4 grid gap-3">
            <HealthRow label="Identity" value="Ready" />
            <HealthRow label="Navigation" value="Ready" />
            <HealthRow label="Business data" value="Pending modules" muted />
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-md border border-border bg-background p-5 xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Recent activity</h3>
              <p className="text-sm text-muted-foreground">
                Mock workspace events until modules land.
              </p>
            </div>
            <Clock3 className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="mt-4 grid gap-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex gap-3 rounded-md border border-border p-3">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-dashed border-border bg-background p-5">
          <Bot className="size-5 text-muted-foreground" aria-hidden="true" />
          <h3 className="mt-4 font-semibold">AI briefing</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Reserved for future organisation context, daily summaries, and AI memory. No AI chat or
            business data is connected in this milestone.
          </p>
        </section>
      </div>
    </section>
  );
}

function HealthRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
      <span className="flex items-center gap-2">
        <Building2 className="size-4 text-muted-foreground" aria-hidden="true" />
        {label}
      </span>
      <span className={muted ? 'text-muted-foreground' : 'font-medium'}>{value}</span>
    </div>
  );
}
