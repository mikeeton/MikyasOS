import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  Bot,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
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
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { EnterpriseCard } from '@/components/ui/enterprise-card';
import { DashboardSkeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/ui/status-badge';
import { useEnterpriseDashboard, usePlatformOverview } from '@/features/admin/hooks/use-admin';
import {
  useExecutiveAnalytics,
  useTrackProductEvent,
} from '@/features/analytics/hooks/use-analytics';
import { useBillingOverview } from '@/features/launch/hooks/use-billing';
import { workspaceNavigation } from '@/features/workspace/config/navigation';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import { feedbackPress, widgetReveal } from '@/features/workspace/motion/premium-motion';
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

const defaultCollapsedWidgets: Record<string, boolean> = {
  operatingLayer: false,
  priorities: false,
  briefing: false,
  pinnedApps: false,
  health: false,
  activity: false,
  aiActions: false,
  timeline: false,
};

function readDashboardPreferences() {
  try {
    return {
      ...defaultCollapsedWidgets,
      ...(JSON.parse(
        localStorage.getItem('mikyasos:dashboard-collapsed-widgets') ?? '{}',
      ) as Partial<Record<string, boolean>>),
    };
  } catch {
    return defaultCollapsedWidgets;
  }
}

export function AppHomePage() {
  const { currentUser, currentOrganisation, notifications } = useWorkspace();
  const analytics = useExecutiveAnalytics();
  const platform = usePlatformOverview();
  const billing = useBillingOverview();
  const enterprise = useEnterpriseDashboard();
  const trackEvent = useTrackProductEvent();
  const trackedOrganisationRef = useRef<string | null>(null);
  const [collapsedWidgets, setCollapsedWidgets] = useState(readDashboardPreferences);
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

  const aiRecommendations = [
    {
      title: 'Start with today before opening modules',
      explanation:
        'Today combines due work, calendar follow-ups, finance pressure, and blocked delivery signals.',
      route: '/app/today',
      action: 'Open Today',
    },
    {
      title: 'Review revenue and outstanding invoices',
      explanation: analytics.data
        ? `${formatMoney(analytics.data.outstandingInvoices)} is outstanding, so finance deserves a quick check.`
        : 'Finance signals are still loading, but revenue review remains a high-value daily habit.',
      route: '/app/finance',
      action: 'Review finance',
    },
    {
      title: 'Check projects before adding new work',
      explanation: analytics.data
        ? `${analytics.data.projectsAtRisk} projects are marked at risk across the workspace.`
        : 'Project risk data is loading. Review active projects before committing new timelines.',
      route: '/app/projects',
      action: 'View projects',
    },
  ];

  const toggleWidget = (id: string) => {
    setCollapsedWidgets((current) => {
      const next = { ...current, [id]: !current[id] };
      localStorage.setItem('mikyasos:dashboard-collapsed-widgets', JSON.stringify(next));
      return next;
    });
  };

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
            <StatusBadge tone="success" status="active">
              <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
              {currentOrganisation?.name ?? 'Workspace'}
            </StatusBadge>
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

      {isDashboardLoading && <DashboardSkeleton />}

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

      <DashboardWidget
        id="operatingLayer"
        title="The business operating layer"
        description="mikyasOS keeps people, work, knowledge, money, and intelligence connected in one workspace."
        collapsed={Boolean(collapsedWidgets.operatingLayer)}
        onToggle={toggleWidget}
        action={
          <Button asChild variant="outline" size="sm">
            <Link to="/app/today">Open command centre</Link>
          </Button>
        }
      >
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
      </DashboardWidget>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <DashboardWidget
          id="priorities"
          title="Today's priorities"
          description="High-leverage actions surfaced before you go hunting."
          collapsed={Boolean(collapsedWidgets.priorities)}
          onToggle={toggleWidget}
          icon={<Target className="size-4 text-muted-foreground" aria-hidden="true" />}
        >
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
        </DashboardWidget>

        <DashboardWidget
          id="briefing"
          title="Executive briefing"
          description="Grounded summary for AI-assisted operations."
          collapsed={Boolean(collapsedWidgets.briefing)}
          onToggle={toggleWidget}
          icon={<Bot className="size-4 text-muted-foreground" aria-hidden="true" />}
        >
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
              <StatusBadge tone="success" status="active">
                {analytics.data
                  ? `${analytics.data.activity.workflows} workflows`
                  : 'No blocked modules'}
              </StatusBadge>
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
        </DashboardWidget>
      </div>

      <DashboardWidget
        id="aiActions"
        title="AI recommendations"
        description="Decision support with explanation and safe next actions."
        collapsed={Boolean(collapsedWidgets.aiActions)}
        onToggle={toggleWidget}
        icon={<Sparkles className="size-4 text-muted-foreground" aria-hidden="true" />}
      >
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {aiRecommendations.map((recommendation) => (
            <EnterpriseCard
              key={recommendation.title}
              title={recommendation.title}
              description={recommendation.explanation}
              icon={Sparkles}
              accentClassName="module-accent-ai"
              badge={<StatusBadge tone="ai">Recommended</StatusBadge>}
              actions={
                <Button asChild size="sm" variant="outline">
                  <Link to={recommendation.route}>{recommendation.action}</Link>
                </Button>
              }
            />
          ))}
        </div>
      </DashboardWidget>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <DashboardWidget
          id="pinnedApps"
          title="Pinned apps"
          description="Fast access to the surfaces people use every day."
          collapsed={Boolean(collapsedWidgets.pinnedApps)}
          onToggle={toggleWidget}
          icon={<Star className="size-4 text-muted-foreground" aria-hidden="true" />}
        >
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
        </DashboardWidget>

        <DashboardWidget
          id="health"
          title="Company health"
          description="Enterprise signals for operating confidence."
          collapsed={Boolean(collapsedWidgets.health)}
          onToggle={toggleWidget}
          icon={<HeartPulse className="size-4 text-muted-foreground" aria-hidden="true" />}
        >
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
        </DashboardWidget>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardWidget
          id="activity"
          title="Recent activity"
          description="Important workspace events, grouped for quick scanning."
          collapsed={Boolean(collapsedWidgets.activity)}
          onToggle={toggleWidget}
          icon={<Clock3 className="size-4 text-muted-foreground" aria-hidden="true" />}
          className="xl:col-span-2"
        >
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
        </DashboardWidget>

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

      <DashboardWidget
        id="timeline"
        title="Operational timeline"
        description="Upcoming moments that keep the organisation aligned."
        collapsed={Boolean(collapsedWidgets.timeline)}
        onToggle={toggleWidget}
        icon={<CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />}
      >
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
      </DashboardWidget>
    </section>
  );
}

function DashboardWidget({
  id,
  title,
  description,
  collapsed,
  onToggle,
  icon,
  action,
  className,
  children,
}: {
  id: string;
  title: string;
  description: string;
  collapsed: boolean;
  onToggle: (id: string) => void;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn('premium-section p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {action}
          {icon}
          <motion.div {...feedbackPress}>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${title}`}
              aria-expanded={!collapsed}
              onClick={() => onToggle(id)}
            >
              <ChevronDown
                className={cn('size-4 transition-transform', collapsed && '-rotate-90')}
                aria-hidden="true"
              />
            </Button>
          </motion.div>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div {...widgetReveal} className="overflow-hidden">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
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
