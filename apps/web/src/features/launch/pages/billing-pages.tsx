import { Link } from 'react-router';
import {
  ArrowUpRight,
  BadgeCheck,
  CreditCard,
  Database,
  FileDown,
  Gauge,
  LifeBuoy,
  ListChecks,
  Rocket,
  Upload,
} from 'lucide-react';

import type { AdminRecord } from '@/api/client';
import { Button } from '@/components/ui/button';
import {
  useBillingOverview,
  useBillingPlans,
  useBillingResource,
  useLaunchChecklist,
} from '../hooks/use-billing';

function LaunchShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Workspace / Production Launch</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {(
            [
              ['/app/billing', 'Billing'],
              ['/app/billing/usage', 'Usage'],
              ['/app/billing/portal', 'Portal'],
              ['/app/billing/imports', 'Imports'],
              ['/app/billing/exports', 'Exports'],
              ['/app/billing/checklist', 'Checklist'],
            ] as const
          ).map(([to, label]) => (
            <Link key={to} to={to}>
              <Button size="sm" variant="outline">
                {label}
              </Button>
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof CreditCard;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <Icon className="size-5" />
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{helper}</p>
    </div>
  );
}

function RecordsTable({ items }: { items?: AdminRecord[] }) {
  const rows = items ?? [];
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Record</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((item) => (
              <tr key={String(item.id)} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">
                  {String(item.name ?? item.title ?? item.metric ?? item.type ?? item.id)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {String(item.status ?? item.interval ?? 'ready')}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {String(item.updatedAt ?? item.createdAt ?? '-').slice(0, 10)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-10 text-center text-muted-foreground" colSpan={3}>
                No records yet. The architecture is ready for the first production customer.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function BillingDashboardPage() {
  const overview = useBillingOverview();
  const plans = useBillingPlans();
  const current = overview.data;

  return (
    <LaunchShell
      title="SaaS billing"
      description="Manage subscription readiness, plan limits, usage, customer portal architecture and support access."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CreditCard}
          label="Current plan"
          value={current?.plan?.name ?? 'Starter'}
          helper="Plan catalog supports Starter, Professional, Business and Enterprise."
        />
        <StatCard
          icon={Gauge}
          label="Usage metrics"
          value={String(current?.usage?.length ?? 0)}
          helper="Storage, AI tokens, API requests, documents and automation usage are tracked."
        />
        <StatCard
          icon={FileDown}
          label="Invoices"
          value={String(current?.invoices?.length ?? 0)}
          helper="Invoice records and provider invoice links are prepared."
        />
        <StatCard
          icon={LifeBuoy}
          label="Support"
          value={current?.support?.level ?? 'Email'}
          helper="Portal, billing history and status support are ready."
        />
      </div>
      <section className="rounded-md border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Plan comparison</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Commercial plan limits loaded from the launch architecture.
            </p>
          </div>
          <Button asChild>
            <Link to="/pricing">
              Public pricing <ArrowUpRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(plans.data ?? []).map((plan) => (
            <div key={plan.tier} className="rounded-md border border-border p-4">
              <p className="font-medium">{plan.name}</p>
              <p className="mt-2 text-2xl font-semibold">
                {Number(plan.monthlyPrice) ? `$${plan.monthlyPrice}` : 'Custom'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{plan.maxUsers} users</p>
              <p className="text-sm text-muted-foreground">{plan.storageGb} GB storage</p>
              <p className="text-sm text-muted-foreground">{plan.supportLevel}</p>
            </div>
          ))}
        </div>
      </section>
    </LaunchShell>
  );
}

export function CustomerOnboardingPage() {
  const steps = [
    ['Create organisation', true],
    ['Upload logo', false],
    ['Invite team', false],
    ['Choose timezone', true],
    ['Choose industry', true],
    ['Import existing data', false],
    ['Finish onboarding', false],
  ] as const;

  return (
    <LaunchShell
      title="Customer onboarding"
      description="A polished first-run path with walkthrough, sample workspace, AI introduction and progress tracking."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <section className="rounded-md border border-border bg-card p-5">
          <h2 className="font-semibold">Launch checklist</h2>
          <div className="mt-5 grid gap-3">
            {steps.map(([step, complete]) => (
              <div key={step} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  {complete ? (
                    <BadgeCheck className="size-5 text-primary" />
                  ) : (
                    <Rocket className="size-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">{step}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {complete ? 'Complete' : 'Prepared'}
                </span>
              </div>
            ))}
          </div>
        </section>
        <aside className="rounded-md border border-border bg-muted/30 p-5">
          <p className="font-medium">AI introduction</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The walkthrough prepares users to understand how AI will use CRM, projects, documents,
            meetings and analytics safely.
          </p>
          <Button className="mt-5 w-full">Continue walkthrough</Button>
        </aside>
      </div>
    </LaunchShell>
  );
}

export function BillingRecordsPage({
  title,
  resource,
}: {
  title: string;
  resource: 'subscriptions' | 'usage' | 'checkout' | 'portal' | 'imports' | 'exports';
}) {
  const query = useBillingResource(resource);
  const icons = {
    subscriptions: CreditCard,
    usage: Gauge,
    checkout: CreditCard,
    portal: LifeBuoy,
    imports: Upload,
    exports: FileDown,
  };
  const Icon = icons[resource];

  return (
    <LaunchShell
      title={title}
      description="Production SaaS records with tenant isolation and provider-ready architecture."
    >
      <div className="rounded-md border border-border bg-card p-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="size-5" />
            <p className="font-medium">{title}</p>
          </div>
          <Button variant="outline" size="sm">
            Prepared action
          </Button>
        </div>
        <RecordsTable items={query.data?.items} />
      </div>
    </LaunchShell>
  );
}

export function LaunchChecklistPage() {
  const checklist = useLaunchChecklist();
  return (
    <LaunchShell
      title="Version 1.0 checklist"
      description="Final release readiness areas for production launch."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(checklist.data ?? []).map((item) => (
          <div key={String(item.title)} className="rounded-md border border-border bg-card p-5">
            <ListChecks className="size-5" />
            <p className="mt-4 font-medium">{String(item.title)}</p>
            <p className="mt-2 text-sm text-muted-foreground">{String(item.status)}</p>
          </div>
        ))}
      </div>
    </LaunchShell>
  );
}

export function DataPortabilityPage() {
  return (
    <LaunchShell
      title="Data portability"
      description="CSV, Excel, PDF, JSON and organisation backup architecture for production trust."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-border bg-card p-5">
          <Database className="size-5" />
          <h2 className="mt-4 font-semibold">Imports</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Prepared for CSV, Excel, CRM, contacts, projects, tasks and documents.
          </p>
        </div>
        <div className="rounded-md border border-border bg-card p-5">
          <FileDown className="size-5" />
          <h2 className="mt-4 font-semibold">Exports</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Prepared for CSV, Excel, PDF, JSON and full organisation backup workflows.
          </p>
        </div>
      </div>
    </LaunchShell>
  );
}
