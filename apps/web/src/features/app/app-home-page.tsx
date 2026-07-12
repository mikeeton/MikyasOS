import {
  ArrowUpRight,
  Bot,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  HeartPulse,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  UsersRound,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { useEnterpriseDashboard, usePlatformOverview } from '@/features/admin/hooks/use-admin';
import {
  useExecutiveAnalytics,
  useTrackProductEvent,
} from '@/features/analytics/hooks/use-analytics';
import { useBillingOverview } from '@/features/launch/hooks/use-billing';
import { workspaceNavigation } from '@/features/workspace/config/navigation';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import { cn } from '@/lib/utils';

const operationalTimeline = [
  ['/app/customer-onboarding', 'Today', 'Finish customer onboarding setup'],
  ['/app/admin', 'This week', 'Review enterprise administration and security'],
  ['/app/billing/checklist', 'Next', 'Complete the production launch checklist'],
] as const;

const operatingPillars = [
  {
    label: 'People',
    detail: 'Customers, team members, roles, sessions, and relationships.',
    route: '/app/crm',
    icon: UsersRound,
    accent: 'module-accent-crm',
  },
  {
    label: 'Work',
    detail: 'Projects, tasks, meetings, approvals, and delivery signals.',
    route: '/app/today',
    icon: Target,
    accent: 'module-accent-projects',
  },
  {
    label: 'Knowledge',
    detail: 'Documents, notes, activity, memory, and business context.',
    route: '/app/documents',
    icon: FileText,
    accent: 'module-accent-documents',
  },
  {
    label: 'Money',
    detail: 'Invoices, revenue, subscriptions, expenses, and forecasts.',
    route: '/app/finance',
    icon: CreditCard,
    accent: 'module-accent-finance',
  },
  {
    label: 'Intelligence',
    detail: 'AI briefings, recommendations, automation, and analytics.',
    route: '/app/ai',
    icon: Bot,
    accent: 'module-accent-ai',
  },
] as const;

export function AppHomePage() {
  const { currentUser, currentOrganisation, notifications } = useWorkspace();
  const analytics = useExecutiveAnalytics();
  const platform = usePlatformOverview();
  const billing = useBillingOverview();
  const enterprise = useEnterpriseDashboard();
  const trackEvent = useTrackProductEvent();
  const trackedOrganisationRef = useRef<string | null>(null);
  const pinnedApps = workspaceNavigation.slice(0, 6);
  const hasDashboardError =
    analytics.isError || platform.isError || billing.isError || enterprise.isError;
  const isDashboardLoading =
    analytics.isLoading || platform.isLoading || billing.isLoading || enterprise.isLoading;

  const businessSignals = [
    {
      label: 'Health score',
      value: analytics.data ? `${analytics.data.companyHealthScore}/100` : 'Loading',
      detail: analytics.data
        ? `${analytics.data.projectsAtRisk} projects at risk, ${analytics.data.activity.tasks} tasks open`
        : 'Reading executive analytics',
      route: '/app/analytics',
      icon: HeartPulse,
    },
    {
      label: 'Revenue',
      value: analytics.data ? formatMoney(analytics.data.revenue) : 'Loading',
      detail: analytics.data
        ? `${formatMoney(analytics.data.outstandingInvoices)} outstanding invoices`
        : 'Reading finance signals',
      route: '/app/finance',
      icon: CreditCard,
    },
    {
      label: 'Platform',
      value: platform.data?.status ?? 'Loading',
      detail: platform.data
        ? `${platform.data.activeIncidents} incidents, ${platform.data.failedJobs} failed jobs`
        : 'Checking operational health',
      route: '/app/admin/platform/health',
      icon: ShieldCheck,
    },
    {
      label: 'Plan',
      value: billing.data?.plan.name ?? 'Loading',
      detail: billing.data
        ? `${billing.data.usage.length} tracked usage metrics, ${billing.data.invoices.length} invoices`
        : 'Reading subscription state',
      route: '/app/billing',
      icon: Sparkles,
    },
  ];

  const priorityItems = [
    {
      title: 'Review launch readiness',
      detail: billing.data?.onboarding?.status
        ? `Customer onboarding is ${billing.data.onboarding.status.toLowerCase()}. Review checklist.`
        : 'Review billing, onboarding, and admin surfaces before inviting customers.',
      route: '/app/billing/checklist',
      icon: CheckCircle2,
    },
    {
      title: 'Check platform health',
      detail: platform.data
        ? `${platform.data.status}: ${platform.data.latencyMs}ms latency, ${platform.data.errorRate}% error rate.`
        : 'Confirm API, database, Redis, queues, and provider status before demos.',
      route: '/app/admin/platform/health',
      icon: HeartPulse,
    },
    {
      title: 'Open AI workspace',
      detail: 'Review memory, prompts, and orchestration readiness from the intelligence layer.',
      route: '/app/ai',
      icon: Bot,
    },
  ];

  useEffect(() => {
    if (!currentOrganisation?.id || trackedOrganisationRef.current === currentOrganisation.id) {
      return;
    }

    trackedOrganisationRef.current = currentOrganisation.id;
    trackEvent.mutate({
      name: 'dashboard_viewed',
      source: 'workspace_home',
      metadata: { route: '/app' },
    });
  }, [currentOrganisation?.id, trackEvent]);

  return (
    <section className="grid gap-6">
      <div className="premium-section project-ai-card overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="status-pill status-pill-success">
              <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
              {currentOrganisation?.name ?? 'Workspace'}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Mission Control
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Welcome back, {currentUser?.name ?? 'there'}. Your operating system is online across
              customers, projects, knowledge, finance, automation, AI, and enterprise controls.
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

      {hasDashboardError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
          <p className="font-medium">Some live dashboard data could not load.</p>
          <p className="mt-1 text-muted-foreground">
            Static navigation is still available. Retry by refreshing, or open Platform Health for
            diagnostics.
          </p>
        </div>
      )}

      {isDashboardLoading && (
        <div className="grid gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="premium-section p-4">
              <div className="premium-shimmer h-3 w-24 rounded-full" />
              <div className="premium-shimmer mt-4 h-7 w-20 rounded-full" />
              <div className="premium-shimmer mt-4 h-3 w-full rounded-full" />
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {businessSignals.map((signal) => {
          const Icon = signal.icon;
          return (
            <Link
              key={signal.label}
              to={signal.route}
              className="premium-interactive premium-section block p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {signal.label}
                  </p>
                  <p className="premium-number mt-3 text-2xl font-semibold">{signal.value}</p>
                </div>
                <span className="grid size-9 place-items-center rounded-md border border-border bg-background/70">
                  <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-xs leading-5 text-muted-foreground">{signal.detail}</p>
                <ArrowUpRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </Link>
          );
        })}
      </div>

      <section className="premium-section p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-semibold">The business operating layer</h3>
            <p className="text-sm text-muted-foreground">
              mikyasOS keeps people, work, knowledge, money, and intelligence connected in one
              workspace.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/app/today">Open command centre</Link>
          </Button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {operatingPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.label}
                to={pillar.route}
                className={cn('premium-design-card block', pillar.accent)}
              >
                <span className="module-accent-mark grid size-9 place-items-center rounded-md border">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm font-semibold">{pillar.label}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{pillar.detail}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <section className="premium-section p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Today's priorities</h3>
              <p className="text-sm text-muted-foreground">
                High-leverage actions surfaced before you go hunting.
              </p>
            </div>
            <Target className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="mt-4 grid gap-3">
            {priorityItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.route}
                  className="premium-interactive premium-muted-panel flex items-start gap-3 px-3 py-3"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-background/70">
                    <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{item.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                      {item.detail}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="premium-section p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Executive briefing</h3>
              <p className="text-sm text-muted-foreground">
                A grounded summary layer prepared for AI-assisted operations.
              </p>
            </div>
            <Bot className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="mt-4 rounded-md border border-border/80 bg-background/70 p-4">
            <p className="text-sm leading-6">
              {analytics.data?.aiExecutiveBriefing.note ??
                'Core systems are available. Prioritise launch verification, platform health, and customer onboarding before adding more product surface area.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="status-pill status-pill-info">
                {analytics.data
                  ? `${analytics.data.activity.documents} documents`
                  : 'Grounded context'}
              </span>
              <span className="status-pill status-pill-success">
                {analytics.data
                  ? `${analytics.data.activity.workflows} workflows`
                  : 'No blocked modules'}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link to="/app/ai">Open AI</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/app/admin/platform/health">View health</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="premium-section p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Pinned apps</h3>
              <p className="text-sm text-muted-foreground">
                Fast access to the surfaces people use every day.
              </p>
            </div>
            <Star className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {pinnedApps.map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="premium-interactive flex h-full flex-col rounded-md border border-border/80 bg-background/70 p-4 hover:border-foreground/20 hover:bg-accent">
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

        <section className="premium-section p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Company health</h3>
              <p className="text-sm text-muted-foreground">
                Enterprise signals for operating confidence.
              </p>
            </div>
            <HeartPulse className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="mt-4 grid gap-3">
            <HealthRow
              label="Identity"
              value={enterprise.data ? `${enterprise.data.activeSessions} sessions` : 'Ready'}
              route="/app/admin/users"
            />
            <HealthRow label="Navigation" value="Ready" route="/app/settings" />
            <HealthRow
              label="Business modules"
              value={
                analytics.data
                  ? `${analytics.data.activity.projects + analytics.data.activity.documents} records`
                  : 'Loaded'
              }
              route="/app/analytics"
            />
            <HealthRow
              label="Production polish"
              value={platform.data?.backupStatus ?? 'Review'}
              route="/app/billing/checklist"
              muted
            />
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="premium-section p-5 xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Recent activity</h3>
              <p className="text-sm text-muted-foreground">
                Important workspace events, grouped for quick scanning.
              </p>
            </div>
            <Clock3 className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="mt-4 grid gap-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="premium-muted-panel flex gap-3 px-3 py-3">
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

        <section className="premium-section project-ai-card p-5">
          <div className="relative grid size-10 place-items-center rounded-md border border-border bg-background shadow-sm">
            <Bot className="size-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="mt-4 font-semibold">AI briefing</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Prepared for organisation context, daily summaries, and AI memory. Responses stay
            grounded in accessible workspace data.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="status-pill status-pill-info">Memory ready</span>
            <span className="status-pill status-pill-warning">Provider gated</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/app/ai/memory">Memory</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/app/ai/prompts">Prompts</Link>
            </Button>
          </div>
        </section>
      </div>

      <section className="premium-section p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Operational timeline</h3>
            <p className="text-sm text-muted-foreground">
              Upcoming moments that keep the organisation aligned.
            </p>
          </div>
          <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {operationalTimeline.map(([route, time, detail]) => (
            <Link
              key={time}
              to={route}
              className="premium-interactive premium-muted-panel block p-3"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {time}
              </p>
              <div className="mt-2 flex items-start justify-between gap-3">
                <p className="text-sm leading-6">{detail}</p>
                <ArrowUpRight
                  className="mt-1 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function HealthRow({
  label,
  value,
  route,
  muted = false,
}: {
  label: string;
  value: string;
  route: string;
  muted?: boolean;
}) {
  return (
    <Link
      to={route}
      className="premium-interactive premium-muted-panel flex items-center justify-between px-3 py-2 text-sm"
    >
      <span className="flex items-center gap-2">
        <Building2 className="size-4 text-muted-foreground" aria-hidden="true" />
        {label}
      </span>
      <span className="flex items-center gap-2">
        <span className={muted ? 'text-muted-foreground' : 'font-medium'}>{value}</span>
        <ArrowUpRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
      </span>
    </Link>
  );
}
