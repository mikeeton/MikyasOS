import { Link } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Activity,
  AlertTriangle,
  Archive,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock3,
  Database,
  Gauge,
  GitBranch,
  Lock,
  MapPin,
  Network,
  ServerCog,
  ShieldCheck,
  Siren,
  UsersRound,
  MailPlus,
  UserX,
  KeyRound,
  LogOut,
  Shield,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EnterpriseCard } from '@/components/ui/enterprise-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { enterpriseApi, identityApi, type AdminRecord } from '@/api/client';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import { useAuthStore } from '@/stores/auth-store';
import { formString } from '@/lib/form-data';
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

const permissionModules = [
  'CRM',
  'Projects',
  'Finance',
  'Documents',
  'Analytics',
  'Automation',
  'AI',
  'Settings',
  'Administration',
  'Notifications',
  'Integrations',
] as const;

const permissionActions = [
  'View',
  'Create',
  'Edit',
  'Delete',
  'Approve',
  'Export',
  'Import',
  'Assign',
  'Archive',
  'Restore',
  'Manage',
  'Configure',
  'Delegate',
  'Share',
  'Run AI',
  'Run Automation',
] as const;

const dataScopes = [
  'Own records',
  'Team records',
  'Department records',
  'Business unit records',
  'Organisation records',
  'Global records',
] as const;

const abacAttributes = [
  'Organisation',
  'Department',
  'Business unit',
  'Region',
  'Project ownership',
  'Customer ownership',
  'Employment status',
  'Security clearance',
  'Document classification',
  'Team membership',
  'Location',
  'Time restrictions',
  'Device trust',
] as const;

const roleTemplates = [
  {
    name: 'Owner',
    description: 'Full organisation ownership, billing, security, and deletion authority.',
    permissions: permissionModules.flatMap((module) =>
      permissionActions.map((action) => `${module}.${action}`),
    ),
  },
  {
    name: 'Finance Manager',
    description: 'Finance visibility, invoices, expenses, approvals, exports, and reports.',
    permissions: [
      'Finance.View',
      'Finance.Create',
      'Finance.Edit',
      'Finance.Approve',
      'Finance.Export',
      'Analytics.View',
    ],
  },
  {
    name: 'Project Manager',
    description: 'Project delivery, task assignment, documents, limited CRM visibility.',
    permissions: [
      'Projects.View',
      'Projects.Create',
      'Projects.Edit',
      'Projects.Assign',
      'Documents.View',
      'Documents.Create',
      'CRM.View',
    ],
  },
  {
    name: 'Guest',
    description: 'Restricted assigned work and document upload access.',
    permissions: ['Projects.View', 'Documents.View', 'Documents.Create'],
  },
] as const;

const zeroTrustChecks = [
  ['Identity', 'User and service identity verified for every request.'],
  ['Organisation', 'Tenant boundary checked before data access.'],
  ['Role', 'Least-privilege role grants reviewed by module.'],
  ['Permission', 'Action-level permissions required for sensitive changes.'],
  ['Session', 'Device, browser, IP, activity, and risk signals tracked.'],
  ['Resource', 'Record ownership, scope, and classification checked.'],
  ['Audit', 'Security, data, AI, automation, and export actions recorded.'],
  ['Recovery', 'Backups, incident response, and revocation paths visible.'],
] as const;

const trustIndicators = [
  { label: 'Encryption', value: 'At rest and in transit', tone: 'success' },
  { label: 'Audit trail', value: 'Searchable and exportable', tone: 'success' },
  { label: 'Data exports', value: 'Permission controlled', tone: 'info' },
  { label: 'AI access', value: 'Permission-aware', tone: 'ai' },
  { label: 'File security', value: 'Validation and signed access', tone: 'info' },
  { label: 'Incident response', value: 'Timeline and owner model', tone: 'warning' },
] as const;

const complianceControls = [
  ['Privacy requests', 'Access, deletion, correction, portability, and consent review.'],
  ['Retention', 'Archive, delete, legal hold, and permanent retention policies.'],
  ['File security', 'MIME checks, size limits, secure storage, signed URLs, and access logs.'],
  ['Vulnerability review', 'Dependencies, containers, secrets, certificates, and API endpoints.'],
] as const;

const scalabilityLayers = [
  ['Frontend', 'Lazy routes, bounded bundle growth, CDN-ready assets, responsive shell.'],
  ['Backend', 'Modular NestJS domains with extractable service boundaries.'],
  ['Database', 'PostgreSQL with migration discipline, pooling, indexes, and replica strategy.'],
  ['Queues', 'BullMQ jobs for AI, automation, imports, exports, webhooks, and reports.'],
  ['Cache', 'Redis namespaces for sessions, dashboards, flags, search, and AI context.'],
  ['Storage', 'Provider abstraction for R2, S3, Azure Blob, GCS, and local development.'],
  ['Search', 'Dedicated search strategy for OpenSearch, Meilisearch, Typesense, or Elasticsearch.'],
  ['Observability', 'Logs, metrics, traces, health, performance budgets, and business signals.'],
] as const;

const deliveryReadiness = [
  {
    title: 'Modular monolith',
    description:
      'CRM, Projects, Finance, Analytics, Documents, Automation, AI, and Identity remain extractable.',
    icon: GitBranch,
  },
  {
    title: 'Event-driven core',
    description:
      'Business events can feed analytics, notifications, automation, integrations, AI, and audit.',
    icon: Network,
  },
  {
    title: 'CI/CD confidence',
    description:
      'Format, lint, typecheck, tests, build, security scans, Docker, smoke tests, and approval stages.',
    icon: CheckCircle2,
  },
  {
    title: 'Performance budgets',
    description:
      'Bundle size, API latency, search, dashboards, AI response time, and job duration stay measurable.',
    icon: Gauge,
  },
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
      description="Govern large organisations with hierarchy, business units, custom roles, audit trails, compliance controls, and operational reliability."
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
          hint="Session management controls."
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
      <section className="grid gap-4 lg:grid-cols-3">
        <EnterpriseCard
          title="Tenant isolation"
          description="Every enterprise query is scoped by organisation before business data is exposed."
          icon={ShieldCheck}
          accentClassName="module-accent-admin"
          badge={
            <StatusBadge tone="success" status="active">
              Protected
            </StatusBadge>
          }
        />
        <EnterpriseCard
          title="Hierarchy ready"
          description="Parent organisations, business units, departments, teams, and delegated administration are represented in the admin model."
          icon={GitBranch}
          accentClassName="module-accent-admin"
          badge={<StatusBadge tone="info">Flexible</StatusBadge>}
        />
        <EnterpriseCard
          title="Audit-first governance"
          description="Role changes, invitations, policy changes, AI actions, exports, and security events are designed to produce audit records."
          icon={Database}
          accentClassName="module-accent-admin"
          badge={<StatusBadge tone="ai">Traceable</StatusBadge>}
        />
      </section>
    </AdminShell>
  );
}

export function AdminOrganisationsPage() {
  const { currentOrganisation, organisations } = useWorkspace();

  const hierarchy = [
    {
      title: currentOrganisation?.name ?? 'Current organisation',
      description:
        'Highest ownership boundary for users, data, billing, storage, AI memory, and audit.',
      icon: Building2,
      badge: 'Organisation',
    },
    {
      title: 'Business units',
      description: 'Independent dashboards, budgets, reports, permissions, and AI memory scope.',
      icon: GitBranch,
      badge: 'Next layer',
    },
    {
      title: 'Departments',
      description:
        'Finance, Engineering, Sales, Support, Operations, HR, Legal, Security, and custom departments.',
      icon: Network,
      badge: 'Flexible',
    },
    {
      title: 'Teams',
      description:
        'Users may belong to multiple teams for delivery, permissions, notifications, and collaboration.',
      icon: UsersRound,
      badge: 'Many-to-many',
    },
  ];

  return (
    <AdminShell
      title="Organisation hierarchy"
      description="Manage the highest ownership boundary, hierarchy, tenant isolation, branding, business units, departments, teams, and delegated administration."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Building2}
          label="Organisations"
          value={organisations.length}
          hint="Tenant-visible organisations for the current user."
        />
        <StatCard
          icon={ShieldCheck}
          label="Isolation"
          value="Mandatory"
          hint="Business records remain scoped to one organisation."
        />
        <StatCard
          icon={MapPin}
          label="Data residency"
          value="Policy"
          hint="Regional controls and compliance settings are available from the governance model."
        />
      </div>

      <section className="grid gap-4 lg:grid-cols-4">
        {hierarchy.map((item) => (
          <EnterpriseCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            accentClassName="module-accent-admin"
            badge={<StatusBadge tone="info">{item.badge}</StatusBadge>}
          />
        ))}
      </section>

      <section className="premium-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Organisation branding and ownership</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep customer ownership without breaking the mikyasOS product identity.
            </p>
          </div>
          <StatusBadge tone="success" status="active">
            Tenant scoped
          </StatusBadge>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {['Logo and workspace icon', 'Theme and accent colours', 'Email and login branding'].map(
            (item) => (
              <div key={item} className="premium-muted-panel p-3 text-sm">
                {item}
              </div>
            ),
          )}
        </div>
      </section>
    </AdminShell>
  );
}

export function BusinessUnitsPage() {
  const units = useEnterpriseResource('businessUnits');
  return (
    <AdminShell
      title="Business units"
      description="Business unit, department, team, and delegated administration controls."
    >
      <Records
        title="Business units"
        records={rows(units.data)}
        empty="No business units created yet."
      />
    </AdminShell>
  );
}

export function AdminUsersPage() {
  const token = useAuthStore((state) => state.accessToken);
  const { currentOrganisation, currentUser } = useWorkspace();
  const queryClient = useQueryClient();
  const roles = useQuery({
    queryKey: ['admin', currentOrganisation?.id, 'identity-roles'],
    queryFn: () => identityApi.roles(token!, currentOrganisation!.id),
    enabled: Boolean(token && currentOrganisation?.id),
  });
  const invite = useMutation({
    mutationFn: (body: { email: string; roleId: string }) =>
      identityApi.inviteUser(token!, currentOrganisation!.id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
  const defaultRole = roles.data?.[0]?.id ?? '';

  return (
    <AdminShell
      title="Enterprise users"
      description="Invite, govern, review, and secure users across roles, departments, sessions, teams, and organisation access."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={UsersRound}
          label="Known users"
          value={currentUser ? 1 : 0}
          hint="Current tenant-visible users."
        />
        <StatCard
          icon={MailPlus}
          label="Invitations"
          value={invite.isSuccess ? 1 : 0}
          hint="Invitations sent this session."
        />
        <StatCard
          icon={LogOut}
          label="Active sessions"
          value="Live"
          hint="Session management controls connected."
        />
        <StatCard
          icon={Shield}
          label="Sensitive controls"
          value="Protected"
          hint="Billing, secrets, audit, and security remain guarded."
        />
      </div>

      <section className="premium-card premium-hero p-5">
        <h2 className="font-semibold">Invite user</h2>
        <form
          className="mt-4 grid gap-3 lg:grid-cols-[1fr_260px_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const email = formString(form, 'email').trim();
            const roleId = formString(form, 'roleId') || defaultRole;
            if (email && roleId) invite.mutate({ email, roleId });
          }}
        >
          <input
            name="email"
            type="email"
            required
            placeholder="teammate@company.com"
            className="premium-input"
          />
          <select name="roleId" required className="premium-input" defaultValue={defaultRole}>
            {roles.data?.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <Button type="submit" disabled={invite.isPending || !defaultRole}>
            {invite.isPending ? 'Sending...' : 'Send invite'}
          </Button>
        </form>
        {invite.error && <p className="mt-3 text-sm text-destructive">{invite.error.message}</p>}
        {invite.isSuccess && (
          <p className="mt-3 text-sm text-muted-foreground">
            Invitation created. Email delivery can be connected through the communications provider.
          </p>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="premium-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">User directory</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Current user profile plus enterprise management controls.
              </p>
            </div>
            <label className="premium-input flex items-center gap-2">
              <Search className="size-4 text-muted-foreground" />
              <input placeholder="Search users" className="bg-transparent outline-none" />
            </label>
          </div>
          <article className="premium-list-link mt-4 p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-md bg-foreground text-sm font-semibold text-background">
                  {(currentUser?.name ?? currentUser?.email ?? 'U').slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <p className="font-medium">{currentUser?.name ?? 'Current user'}</p>
                  <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {currentOrganisation?.name} · Owner candidate · Active
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['View activity', 'Assign role', 'Force logout', 'Reset password'].map(
                  (action) => (
                    <Button key={action} variant="outline" size="sm">
                      {action}
                    </Button>
                  ),
                )}
              </div>
            </div>
          </article>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ['Department', 'Unassigned'],
              ['Manager', 'Not configured'],
              ['Timezone', Intl.DateTimeFormat().resolvedOptions().timeZone],
            ].map(([label, value]) => (
              <div key={label} className="premium-muted-panel p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-2 text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="grid content-start gap-4">
          {[
            {
              label: 'Suspend user',
              Icon: UserX,
              detail: 'Requires owner approval and audit event.',
            },
            {
              label: 'Transfer ownership',
              Icon: KeyRound,
              detail: 'Multi-step confirmation before ownership changes.',
            },
            {
              label: 'Bulk invite CSV',
              Icon: MailPlus,
              detail: 'CSV upload supports structured invite batches.',
            },
          ].map(({ label, Icon, detail }) => (
            <section key={String(label)} className="premium-card p-4">
              <div className="flex items-center gap-2">
                <Icon className="size-4" />
                <h3 className="font-semibold">{label}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
            </section>
          ))}
        </aside>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <EnterpriseCard
          title="Session management"
          description="Review current session, recent devices, IP, country, browser, operating system, and last activity before terminating access."
          icon={Clock3}
          accentClassName="module-accent-admin"
          badge={
            <StatusBadge tone="success" status="active">
              Audited
            </StatusBadge>
          }
          actions={
            <Button size="sm" variant="outline">
              View sessions
            </Button>
          }
        />
        <EnterpriseCard
          title="Device trust"
          description="Trusted-device and suspicious-activity signals prepare safer access decisions for enterprise administrators."
          icon={ShieldCheck}
          accentClassName="module-accent-admin"
          badge={<StatusBadge tone="info">Risk aware</StatusBadge>}
          actions={
            <Button size="sm" variant="outline">
              Review devices
            </Button>
          }
        />
        <EnterpriseCard
          title="Bulk administration"
          description="CSV import/export, bulk invite, bulk role assignment, and deactivation workflows require confirmation and audit logs."
          icon={MailPlus}
          accentClassName="module-accent-admin"
          badge={<StatusBadge tone="warning">Confirm first</StatusBadge>}
          actions={
            <Button size="sm" variant="outline">
              Prepare import
            </Button>
          }
        />
      </section>
    </AdminShell>
  );
}

export function AdminRolesPage() {
  const roles = useEnterpriseResource('roles');
  const token = useAuthStore((state) => state.accessToken);
  const { currentOrganisation } = useWorkspace();
  const queryClient = useQueryClient();
  const createRole = useMutation({
    mutationFn: (template: (typeof roleTemplates)[number]) =>
      enterpriseApi.createRole(token!, currentOrganisation!.id, {
        name: `${template.name} ${Date.now().toString().slice(-4)}`,
        permissions: [...template.permissions],
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin'] }),
  });

  return (
    <AdminShell
      title="Role management"
      description="Custom roles, inheritance, temporary access, approval-based permissions, and delegated administration."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {roleTemplates.map((template) => (
          <section key={template.name} className="premium-card p-5">
            <h2 className="font-semibold">{template.name}</h2>
            <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
              {template.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {template.permissions.length} permissions
            </p>
            <Button
              className="mt-4 w-full"
              variant="outline"
              onClick={() => createRole.mutate(template)}
            >
              Clone template
            </Button>
          </section>
        ))}
      </div>

      <section className="premium-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Permission matrix</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Module-based permissions with view, create, edit, delete, approve, export, import,
              assign, and manage actions.
            </p>
          </div>
          <label className="premium-input flex items-center gap-2">
            <Search className="size-4 text-muted-foreground" />
            <input placeholder="Search permissions" className="bg-transparent outline-none" />
          </label>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-2 text-left">Module</th>
                {permissionActions.map((action) => (
                  <th key={action} className="px-2 py-2 text-center">
                    {action}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionModules.map((module) => (
                <tr key={module} className="border-t">
                  <td className="py-3 font-medium">{module}</td>
                  {permissionActions.map((action) => (
                    <td key={action} className="px-2 py-3 text-center">
                      <span className="inline-flex size-5 items-center justify-center rounded border bg-secondary text-[10px]">
                        ✓
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="premium-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Data scopes</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Visibility should scale from personal work to global administration.
              </p>
            </div>
            <StatusBadge tone="info">Scope-aware</StatusBadge>
          </div>
          <div className="mt-4 grid gap-2">
            {dataScopes.map((scope) => (
              <div
                key={scope}
                className="premium-muted-panel flex items-center justify-between px-3 py-2 text-sm"
              >
                <span>{scope}</span>
                <StatusBadge
                  tone={scope === 'Global records' ? 'warning' : 'neutral'}
                  showIcon={false}
                >
                  {scope === 'Global records' ? 'Elevated' : 'Available'}
                </StatusBadge>
              </div>
            ))}
          </div>
        </section>

        <section className="premium-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">ABAC attributes</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Attribute rules prepare secure access beyond static roles.
              </p>
            </div>
            <StatusBadge tone="ai">Policy engine</StatusBadge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {abacAttributes.map((attribute) => (
              <span
                key={attribute}
                className="rounded-full border bg-background/70 px-3 py-1 text-xs"
              >
                {attribute}
              </span>
            ))}
          </div>
        </section>
      </div>

      <Records
        title="Custom roles"
        records={rows(roles.data)}
        empty="No custom roles yet. Clone a template above to create one."
      />
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
      description="Zero-trust controls for authentication, MFA, suspicious activity, trusted devices, sessions, API access, and recommendations."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ShieldCheck}
          label="Security score"
          value="96/100"
          hint="Composite signal from sessions, MFA, audit, permissions, and platform health."
        />
        <StatCard
          icon={Lock}
          label="MFA controls"
          value="Configurable"
          hint="Authenticator apps, OTP, hardware keys, passkeys, backup codes, and recovery methods."
        />
        <StatCard
          icon={KeyRound}
          label="Session security"
          value="Visible"
          hint="Device, browser, operating system, IP, location, activity, and risk review."
        />
        <StatCard
          icon={Siren}
          label="Risk alerts"
          value="Monitored"
          hint="Failed logins, suspicious activity, data exports, API usage, and AI risk signals."
        />
      </div>

      <section className="premium-card p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold">Zero-trust verification</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Every request should verify identity, organisation, role, permission, session,
              resource scope, risk, and audit requirements.
            </p>
          </div>
          <StatusBadge tone="success" status="active">
            Verify everything
          </StatusBadge>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {zeroTrustChecks.map(([label, detail]) => (
            <div key={label} className="premium-muted-panel p-4">
              <p className="text-sm font-semibold">{label}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        {trustIndicators.map((indicator) => (
          <EnterpriseCard
            key={indicator.label}
            title={indicator.label}
            description={indicator.value}
            icon={Shield}
            accentClassName="module-accent-ai"
            badge={<StatusBadge tone={indicator.tone}>Trust signal</StatusBadge>}
            actions={
              <Button asChild size="sm" variant="outline">
                <Link to="/app/admin/audit">View audit</Link>
              </Button>
            }
          />
        ))}
      </section>

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
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {complianceControls.map(([title, detail]) => (
          <EnterpriseCard
            key={title}
            title={title}
            description={detail}
            icon={ShieldCheck}
            accentClassName="module-accent-ai"
            badge={<StatusBadge tone="info">Compliant</StatusBadge>}
          />
        ))}
      </section>
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
      description="Enterprise license usage, seats, plan controls, and billing governance."
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

export function PlatformDashboardPage() {
  const platform = usePlatformOverview();
  return (
    <AdminShell
      title="Operations centre"
      description="Reliability, health, incidents, backups, deployment safety, feature flags, costs, and recovery controls."
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

      <section className="premium-card p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold">Scalability readiness</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Each subsystem should scale independently while the product remains simple,
              observable, modular, and deployable.
            </p>
          </div>
          <StatusBadge tone="success" status="active">
            Modular scale
          </StatusBadge>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {scalabilityLayers.map(([label, detail]) => (
            <div key={label} className="premium-muted-panel p-4">
              <p className="text-sm font-semibold">{label}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-4">
        {deliveryReadiness.map((item) => (
          <EnterpriseCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            accentClassName="module-accent-admin"
            badge={<StatusBadge tone="info">Operational</StatusBadge>}
            actions={
              <Button asChild size="sm" variant="outline">
                <Link to="/app/admin/platform/health">Inspect health</Link>
              </Button>
            }
          />
        ))}
      </section>
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
      description="Operational records and safe actions for authorised administrators."
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
      description="External integration circuit breaker, webhook, sync, and degradation controls."
    >
      <div className="premium-card p-6 text-sm text-muted-foreground">
        Integration health is connected through the Integration Marketplace and platform circuit
        breaker controls.
      </div>
    </AdminShell>
  );
}

export function AiHealthPage() {
  return (
    <AdminShell
      title="AI provider health"
      description="Provider timeout, fallback, circuit breaker, token usage, and graceful degradation controls."
    >
      <div className="premium-card p-6 text-sm text-muted-foreground">
        AI provider fallback is ready; provider switching requires configured approval rules.
      </div>
    </AdminShell>
  );
}
