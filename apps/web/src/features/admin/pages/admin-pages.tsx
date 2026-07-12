import { Link } from 'react-router';
import {
  Activity,
  AlertTriangle,
  Archive,
  BadgeCheck,
  Building2,
  Gauge,
  Lock,
  ServerCog,
  ShieldCheck,
  Siren,
  UsersRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { AdminRecord } from '@/api/client';
import {
  useEnterpriseCapabilities,
  useEnterpriseDashboard,
  useEnterpriseResource,
  usePlatformHealthDetails,
  usePlatformOverview,
  usePlatformResource,
} from '../hooks/use-admin';

const enterpriseNav = [
  ['/app/admin', 'Dashboard'],
  ['/app/admin/organisations', 'Organisations'],
  ['/app/admin/business-units', 'Business Units'],
  ['/app/admin/users', 'Users'],
  ['/app/admin/roles', 'Roles'],
  ['/app/admin/policies', 'Policies'],
  ['/app/admin/audit', 'Audit'],
  ['/app/admin/security', 'Security'],
  ['/app/admin/compliance', 'Compliance'],
  ['/app/admin/licensing', 'Licensing'],
] as const;

const platformNav = [
  ['/app/admin/platform', 'Platform'],
  ['/app/admin/platform/health', 'Health'],
  ['/app/admin/platform/metrics', 'Metrics'],
  ['/app/admin/platform/jobs', 'Jobs'],
  ['/app/admin/platform/incidents', 'Incidents'],
  ['/app/admin/platform/backups', 'Backups'],
  ['/app/admin/platform/deployments', 'Deployments'],
  ['/app/admin/platform/feature-flags', 'Feature Flags'],
  ['/app/admin/platform/integrations', 'Integrations'],
  ['/app/admin/platform/ai-health', 'AI Health'],
  ['/app/admin/platform/costs', 'Costs'],
] as const;

function rows(data?: { items: AdminRecord[] }) {
  return data?.items ?? [];
}

function AdminShell({
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
          <p className="text-sm text-muted-foreground">Workspace / Administration</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <nav className="flex max-w-5xl flex-wrap gap-2">
          {[...enterpriseNav, ...platformNav].map(([to, label]) => (
            <Link key={to} to={to}>
              <Button variant="outline" size="sm">
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
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <section className="premium-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-3 text-2xl font-semibold">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-md bg-secondary">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{hint}</p>
    </section>
  );
}

function Records({
  title,
  records,
  empty,
}: {
  title: string;
  records: AdminRecord[];
  empty: string;
}) {
  return (
    <section className="premium-card p-5">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-4 grid gap-3">
        {records.map((record) => (
          <div key={record.id} className="rounded-md border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium">
                {record.name ?? record.title ?? record.action ?? record.service ?? record.id}
              </p>
              <span className="rounded-full bg-secondary px-2 py-1 text-xs">
                {record.status ?? record.severity ?? record.module ?? 'Ready'}
              </span>
            </div>
          </div>
        ))}
        {!records.length && (
          <p className="rounded-md border p-5 text-sm text-muted-foreground">{empty}</p>
        )}
      </div>
    </section>
  );
}

export function AdminDashboardPage() {
  const enterprise = useEnterpriseDashboard();
  const platform = usePlatformOverview();
  return (
    <AdminShell
      title="Enterprise administration"
      description="Govern large organisations with hierarchy, business units, custom roles, audit trails, compliance architecture, and operational reliability."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Building2}
          label="Business units"
          value={enterprise.data?.businessUnits ?? 0}
          hint="Hierarchy and delegated administration."
        />
        <StatCard
          icon={UsersRound}
          label="Active sessions"
          value={enterprise.data?.activeSessions ?? 0}
          hint="Session management architecture."
        />
        <StatCard
          icon={ShieldCheck}
          label="Compliance gaps"
          value={enterprise.data?.complianceGaps ?? 0}
          hint="GDPR, SOC2, ISO controls."
        />
        <StatCard
          icon={ServerCog}
          label="Platform status"
          value={platform.data?.status ?? 'OPERATIONAL'}
          hint="Reliability command centre status."
        />
      </div>
    </AdminShell>
  );
}

export function BusinessUnitsPage() {
  const units = useEnterpriseResource('businessUnits');
  return (
    <AdminShell
      title="Business units"
      description="Business unit, department, team, and delegated administration architecture."
    >
      <Records
        title="Business units"
        records={rows(units.data)}
        empty="No business units created yet."
      />
    </AdminShell>
  );
}

export function AdminRolesPage() {
  const roles = useEnterpriseResource('roles');
  return (
    <AdminShell
      title="Role management"
      description="Custom roles, inheritance, temporary access, approval-based permissions, and delegated administration."
    >
      <Records title="Custom roles" records={rows(roles.data)} empty="No custom roles yet." />
    </AdminShell>
  );
}

export function AdminPoliciesPage() {
  const policies = useEnterpriseResource('policies');
  return (
    <AdminShell
      title="Enterprise policies"
      description="Security, access, compliance, AI governance, retention, and administration policies."
    >
      <Records title="Policies" records={rows(policies.data)} empty="No policies yet." />
    </AdminShell>
  );
}

export function AuditViewerPage() {
  const audit = useEnterpriseResource('audit');
  return (
    <AdminShell
      title="Audit explorer"
      description="Searchable audit trail for security, data access, exports, AI actions, workflow execution, and settings changes."
    >
      <Records title="Audit timeline" records={rows(audit.data)} empty="No audit events yet." />
    </AdminShell>
  );
}

export function SecurityCentrePage() {
  const capabilities = useEnterpriseCapabilities();
  return (
    <AdminShell
      title="Security centre"
      description="Authentication health, MFA architecture, suspicious activity, trusted devices, sessions, and recommendations."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          'MFA architecture',
          'IP allow lists',
          'Trusted devices',
          'Password policies',
          'Session controls',
          'SSO readiness',
        ].map((item) => (
          <StatCard
            key={item}
            icon={Lock}
            label={item}
            value="Ready"
            hint="Prepared enterprise security architecture."
          />
        ))}
      </div>
      <pre className="premium-card overflow-auto p-5 text-xs">
        {JSON.stringify(capabilities.data?.aiPreparation ?? {}, null, 2)}
      </pre>
    </AdminShell>
  );
}

export function ComplianceDashboardPage() {
  const compliance = useEnterpriseResource('compliance');
  return (
    <AdminShell
      title="Compliance dashboard"
      description="GDPR readiness, SOC2 readiness, retention policies, legal holds, data exports, and audit history."
    >
      <Records
        title="Compliance records"
        records={rows(compliance.data)}
        empty="No compliance records yet."
      />
    </AdminShell>
  );
}

export function LicensingPage() {
  const enterprise = useEnterpriseDashboard();
  return (
    <AdminShell
      title="Licensing"
      description="Enterprise license usage, seats, plan controls, and future billing governance."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={BadgeCheck}
          label="Plan"
          value={enterprise.data?.licenseUsage.plan ?? 'Unlicensed'}
          hint="Current enterprise plan."
        />
        <StatCard
          icon={UsersRound}
          label="Seats"
          value={enterprise.data?.licenseUsage.seats ?? 0}
          hint="Purchased seats."
        />
        <StatCard
          icon={Activity}
          label="Used seats"
          value={enterprise.data?.licenseUsage.usedSeats ?? 0}
          hint="Current assigned usage."
        />
      </div>
    </AdminShell>
  );
}

export function AdminPlaceholderPage({ title }: { title: string }) {
  return (
    <AdminShell
      title={title}
      description="Enterprise administration architecture prepared for this area."
    >
      <div className="premium-card p-6 text-sm text-muted-foreground">
        Controls, filters, and detailed workflows are prepared for Part 2 polish.
      </div>
    </AdminShell>
  );
}

export function PlatformDashboardPage() {
  const platform = usePlatformOverview();
  return (
    <AdminShell
      title="Operations centre"
      description="Reliability, health, incidents, backups, deployment safety, feature flags, costs, and recovery architecture."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Gauge}
          label="System status"
          value={platform.data?.status ?? 'OPERATIONAL'}
          hint="Operational, degraded, outage, or maintenance."
        />
        <StatCard
          icon={Siren}
          label="Active incidents"
          value={platform.data?.activeIncidents ?? 0}
          hint="Current incident count."
        />
        <StatCard
          icon={Archive}
          label="Backup status"
          value={platform.data?.backupStatus ?? 'not configured'}
          hint="Latest backup verification."
        />
        <StatCard
          icon={AlertTriangle}
          label="Failed jobs"
          value={platform.data?.failedJobs ?? 0}
          hint="Failed and dead-letter job count."
        />
      </div>
    </AdminShell>
  );
}

export function PlatformHealthPage() {
  const details = usePlatformHealthDetails();
  return (
    <AdminShell
      title="Service health"
      description="API, web, PostgreSQL, Redis, BullMQ, storage, AI provider, integrations, WebSockets, pool, and migration status."
    >
      <pre className="premium-card overflow-auto p-5 text-xs">
        {JSON.stringify(details.data, null, 2)}
      </pre>
    </AdminShell>
  );
}

export function PlatformRecordsPage({ title, resource }: { title: string; resource: string }) {
  const records = usePlatformResource(resource);
  return (
    <AdminShell
      title={title}
      description="Operational records, safe actions, and architecture placeholders for authorised administrators."
    >
      <Records
        title={title}
        records={rows(records.data)}
        empty={`No ${title.toLowerCase()} records yet.`}
      />
    </AdminShell>
  );
}

export function PlatformIntegrationsHealthPage() {
  return (
    <AdminShell
      title="Integration health"
      description="External integration circuit breaker, webhook, sync, and degradation architecture."
    >
      <div className="premium-card p-6 text-sm text-muted-foreground">
        Integration health is connected through the Integration Marketplace and platform circuit
        breaker architecture.
      </div>
    </AdminShell>
  );
}

export function AiHealthPage() {
  return (
    <AdminShell
      title="AI provider health"
      description="Provider timeout, fallback, circuit breaker, token usage, and graceful degradation architecture."
    >
      <div className="premium-card p-6 text-sm text-muted-foreground">
        AI provider fallback architecture is ready; provider switching requires configured approval
        rules.
      </div>
    </AdminShell>
  );
}
