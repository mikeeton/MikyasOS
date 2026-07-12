import { Link, useParams } from 'react-router';
import {
  Activity,
  AppWindow,
  CheckCircle2,
  Cloud,
  Code2,
  KeyRound,
  PlugZap,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  Webhook,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { IntegrationConnector, IntegrationRecord } from '@/api/client';
import {
  useInstallConnector,
  useInstalledIntegrations,
  useIntegrationCapabilities,
  useIntegrationHealth,
  useIntegrationLogs,
  useIntegrationSyncs,
  useIntegrationWebhooks,
  useMarketplaceConnectors,
  useOAuthArchitecture,
} from '../hooks/use-integrations';

const subnav = [
  { to: '/app/integrations', label: 'Overview' },
  { to: '/app/integrations/marketplace', label: 'Marketplace' },
  { to: '/app/integrations/installed', label: 'Installed' },
  { to: '/app/integrations/logs', label: 'Logs' },
  { to: '/app/integrations/settings', label: 'Settings' },
];

function rows<T>(data?: { items: T[] } | T[]): T[] {
  if (Array.isArray(data)) return data;
  return data?.items ?? [];
}

function IntegrationShell({
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
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Workspace / Integrations</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {subnav.map((item) => (
            <Link key={item.to} to={item.to}>
              <Button variant="outline" size="sm">
                {item.label}
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

function ConnectorCard({ connector }: { connector: IntegrationConnector }) {
  const install = useInstallConnector();
  return (
    <section className="premium-card p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-12 place-items-center rounded-lg bg-primary text-primary-foreground">
          <PlugZap className="size-5" />
        </span>
        <div className="flex gap-2">
          {connector.verified && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-700">
              Verified
            </span>
          )}
          {connector.featured && (
            <span className="rounded-full bg-secondary px-2 py-1 text-xs">Featured</span>
          )}
        </div>
      </div>
      <div className="mt-5">
        <h2 className="font-semibold">{connector.name}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{connector.description}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border px-2 py-1 text-xs">{connector.category}</span>
        {connector.authTypes.map((auth) => (
          <span key={auth} className="rounded-full border px-2 py-1 text-xs">
            {auth}
          </span>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <Button size="sm" onClick={() => install.mutate(connector.key)}>
          Install
        </Button>
        <Link to={`/app/integrations/${connector.key}`}>
          <Button variant="outline" size="sm">
            Details
          </Button>
        </Link>
      </div>
    </section>
  );
}

function RecordPanel({
  title,
  empty,
  records,
}: {
  title: string;
  empty: string;
  records: IntegrationRecord[];
}) {
  return (
    <section className="premium-card p-5">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-4 grid gap-3">
        {records.map((record) => (
          <div key={record.id} className="rounded-md border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium">{record.name ?? record.message ?? record.entity}</p>
              <span className="rounded-full bg-secondary px-2 py-1 text-xs">
                {record.status ?? record.severity ?? record.category ?? 'Ready'}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {record.provider ?? record.mode ?? record.key ?? record.createdAt}
            </p>
          </div>
        ))}
        {!records.length && (
          <p className="rounded-md border p-5 text-sm text-muted-foreground">{empty}</p>
        )}
      </div>
    </section>
  );
}

export function IntegrationsDashboardPage() {
  const capabilities = useIntegrationCapabilities();
  const installed = useInstalledIntegrations({ pageSize: 10 });
  const syncs = useIntegrationSyncs({ pageSize: 10 });
  const health = useIntegrationHealth({ pageSize: 10 });
  return (
    <IntegrationShell
      title="Integration command centre"
      description="Connect business systems, manage credentials, prepare syncs, receive webhooks, and feed future AI context from external services."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Store}
          label="Marketplace"
          value={capabilities.data?.supportedIntegrations.length ?? 0}
          hint="Prepared connectors across cloud, communication, accounting, storage, dev, CRM, and payments."
        />
        <StatCard
          icon={PlugZap}
          label="Installed"
          value={installed.data?.pagination.total ?? 0}
          hint="Connectors installed for this organisation."
        />
        <StatCard
          icon={RefreshCw}
          label="Sync jobs"
          value={syncs.data?.pagination.total ?? 0}
          hint="Manual, scheduled, webhook, incremental, and full sync architecture."
        />
        <StatCard
          icon={ShieldCheck}
          label="Health checks"
          value={health.data?.pagination.total ?? 0}
          hint="Connector health and credential review records."
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <RecordPanel
          title="Installed connectors"
          empty="No integrations installed yet. Open the marketplace to connect your first service."
          records={rows(installed.data)}
        />
        <section className="premium-card p-5">
          <h2 className="font-semibold">AI integration readiness</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Recommendations, sync optimisation, credential analysis, connector health, and
            automation suggestions are prepared without LLM generation.
          </p>
          <div className="mt-4 grid gap-2">
            {Object.keys(capabilities.data?.aiPreparation ?? {}).map((key) => (
              <div key={key} className="rounded-md border p-3 text-sm">
                {key}
              </div>
            ))}
          </div>
        </section>
      </div>
    </IntegrationShell>
  );
}

export function IntegrationsMarketplacePage() {
  const marketplace = useMarketplaceConnectors();
  const connectors = marketplace.data ?? [];
  return (
    <IntegrationShell
      title="Integration marketplace"
      description="A premium connector marketplace for Google Workspace, Microsoft 365, Slack, GitHub, Stripe, Xero, HubSpot, custom APIs, and future services."
    >
      <section className="premium-card p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground">
            <Search className="size-4" />
            Search connectors, categories, and providers
          </div>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="mr-2 size-4" />
            Filters
          </Button>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {connectors.map((connector) => (
          <ConnectorCard key={connector.key} connector={connector} />
        ))}
      </div>
    </IntegrationShell>
  );
}

export function InstalledIntegrationsPage() {
  const installed = useInstalledIntegrations({ pageSize: 50 });
  const syncs = useIntegrationSyncs({ pageSize: 20 });
  return (
    <IntegrationShell
      title="Installed connectors"
      description="Manage connection status, authentication, sync frequency, recent errors, and connector health."
    >
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <RecordPanel
          title="Connections"
          empty="No installed connectors yet."
          records={rows(installed.data)}
        />
        <RecordPanel
          title="Sync dashboard"
          empty="No syncs have run yet."
          records={rows(syncs.data)}
        />
      </div>
    </IntegrationShell>
  );
}

export function IntegrationDetailPage() {
  const { id = 'google-workspace' } = useParams();
  const marketplace = useMarketplaceConnectors();
  const oauth = useOAuthArchitecture(id.includes('google') ? 'google' : id);
  const connector = marketplace.data?.find((item) => item.key === id);
  const install = useInstallConnector();
  return (
    <IntegrationShell
      title={connector?.name ?? 'Integration details'}
      description={connector?.description ?? 'Connector detail and configuration architecture.'}
    >
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="premium-card p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-lg bg-primary text-primary-foreground">
              <AppWindow className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold">{connector?.name ?? id}</h2>
              <p className="text-sm text-muted-foreground">
                Version 0.1.0 · mikyasOS connector SDK
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {(connector?.actions ?? ['authenticate', 'sync', 'webhook']).map((action) => (
              <div key={action} className="rounded-md border p-4">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <p className="mt-2 font-medium">{action.replaceAll('_', ' ')}</p>
                <p className="mt-1 text-sm text-muted-foreground">Architecture ready</p>
              </div>
            ))}
          </div>
          <Button className="mt-5" onClick={() => install.mutate(id)}>
            Install connector
          </Button>
        </section>
        <section className="premium-card p-5">
          <h2 className="font-semibold">OAuth architecture</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <div className="rounded-md border p-3">
              Provider: {oauth.data?.provider ?? 'prepared'}
            </div>
            <div className="rounded-md border p-3">
              PKCE required: {String(oauth.data?.pkceRequired ?? true)}
            </div>
            <div className="rounded-md border p-3">
              Token storage: {oauth.data?.tokenStorage ?? 'encrypted credentials'}
            </div>
          </div>
        </section>
      </div>
    </IntegrationShell>
  );
}

export function IntegrationLogsPage() {
  const logs = useIntegrationLogs({ pageSize: 50 });
  const webhooks = useIntegrationWebhooks({ pageSize: 20 });
  return (
    <IntegrationShell
      title="Integration logs"
      description="Searchable connector, webhook, sync, retry, and credential activity logs."
    >
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <RecordPanel
          title="Log viewer"
          empty="No integration logs yet."
          records={rows(logs.data)}
        />
        <RecordPanel
          title="Webhook endpoints"
          empty="No webhook endpoints configured."
          records={rows(webhooks.data)}
        />
      </div>
    </IntegrationShell>
  );
}

export function IntegrationSettingsPage() {
  const tiles: Array<[React.ComponentType<{ className?: string }>, string, string]> = [
    [KeyRound, 'Credential vault', 'Encrypted credential storage and rotation architecture.'],
    [Webhook, 'Webhook signing', 'Incoming and outgoing webhook verification architecture.'],
    [RefreshCw, 'Retry queue', 'Backoff, replay, conflict detection, and retry controls.'],
    [Cloud, 'Storage sync', 'Files, calendars, contacts, emails, invoices, and projects.'],
    [Code2, 'Connector SDK', 'Authenticate, health check, connect, sync, send, receive, validate.'],
    [Activity, 'Health monitor', 'Latency, expiry, degradation, and recent error tracking.'],
  ];

  return (
    <IntegrationShell
      title="Integration settings"
      description="Credential management, secret rotation, permission review, webhook signing, rate limits, and developer settings."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tiles.map(([TileIcon, title, description]) => {
          return (
            <section key={String(title)} className="premium-card p-5">
              <TileIcon className="size-5" />
              <h2 className="mt-4 font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </section>
          );
        })}
      </div>
    </IntegrationShell>
  );
}
