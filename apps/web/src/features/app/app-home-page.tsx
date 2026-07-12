import {
  ArrowUpRight,
  Bot,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  HeartPulse,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
} from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { workspaceNavigation } from '@/features/workspace/config/navigation';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';

const businessSignals = [
  {
    label: 'Platform health',
    value: 'Check',
    detail: 'API, database, Redis, queues, and providers',
    route: '/app/admin/platform/health',
    icon: HeartPulse,
  },
  {
    label: 'Billing',
    value: 'Manage',
    detail: 'Plans, subscriptions, usage, and checkout',
    route: '/app/billing',
    icon: CreditCard,
  },
  {
    label: 'Security',
    value: 'Review',
    detail: 'Audit, roles, policies, and compliance controls',
    route: '/app/admin/security',
    icon: ShieldCheck,
  },
  {
    label: 'AI workspace',
    value: 'Open',
    detail: 'Memory, prompts, orchestration, and settings',
    route: '/app/ai',
    icon: Sparkles,
  },
];

const operationalTimeline = [
  ['/app/customer-onboarding', 'Today', 'Finish customer onboarding setup'],
  ['/app/admin', 'This week', 'Review enterprise administration and security'],
  ['/app/billing/checklist', 'Next', 'Complete the production launch checklist'],
] as const;

export function AppHomePage() {
  const { currentUser, currentOrganisation, notifications } = useWorkspace();
  const pinnedApps = workspaceNavigation.slice(0, 6);
  const priorityItems = [
    {
      title: 'Review launch readiness',
      detail: 'Billing, onboarding, and admin surfaces are ready for a final customer pass.',
      route: '/app/billing/checklist',
      icon: CheckCircle2,
    },
    {
      title: 'Check platform health',
      detail: 'Confirm API, database, Redis, queues, and provider status before demos.',
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
                  <p className="mt-3 text-2xl font-semibold tracking-tight">{signal.value}</p>
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
              Core systems are available. Prioritise launch verification, platform health, and
              customer onboarding before adding more product surface area.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="status-pill status-pill-info">Grounded context</span>
              <span className="status-pill status-pill-success">No blocked modules</span>
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
            <HealthRow label="Identity" value="Ready" route="/app/admin/users" />
            <HealthRow label="Navigation" value="Ready" route="/app/settings" />
            <HealthRow label="Business modules" value="Loaded" route="/app/analytics" />
            <HealthRow
              label="Production polish"
              value="Review"
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
