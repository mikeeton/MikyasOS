import { Link } from 'react-router';
import {
  Activity,
  AreaChart,
  BarChart3,
  Bot,
  BrainCircuit,
  Gauge,
  LineChart,
  PieChart,
  Plus,
  Target,
  TrendingUp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { AnalyticsDashboard, AnalyticsRecord } from '@/api/client';
import {
  useAnalyticsCapabilities,
  useAnalyticsCharts,
  useAnalyticsDashboards,
  useAnalyticsForecasts,
  useAnalyticsKpis,
  useAnalyticsReports,
  useAnalyticsSnapshots,
  useCreateAnalyticsDashboard,
  useCreateAnalyticsForecast,
  useCreateAnalyticsKpi,
  useCreateAnalyticsReport,
  useCreateAnalyticsSnapshot,
  useExecutiveAnalytics,
} from '../hooks/use-analytics';

const analyticsSubnav = [
  { to: '/app/analytics', label: 'Executive' },
  { to: '/app/dashboards', label: 'Dashboards' },
  { to: '/app/reports', label: 'Reports' },
  { to: '/app/kpis', label: 'KPIs' },
  { to: '/app/forecasts', label: 'Forecasts' },
  { to: '/app/snapshots', label: 'Snapshots' },
];

function items<T>(data?: { items: T[] } | T[]): T[] {
  if (Array.isArray(data)) return data;
  return data?.items ?? [];
}

function money(value?: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(
    value ?? 0,
  );
}

function AnalyticsShell({
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
          <p className="text-sm text-muted-foreground">Workspace / Business Intelligence</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {analyticsSubnav.map(({ to, label }) => (
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

function RecordList<T extends { id: string }>({
  rows,
  empty,
  render,
}: {
  rows: T[];
  empty: string;
  render: (row: T) => React.ReactNode;
}) {
  return (
    <section className="premium-card p-5">
      <div className="grid gap-3">
        {rows.map((row) => (
          <div key={row.id} className="rounded-md border p-4">
            {render(row)}
          </div>
        ))}
        {!rows.length && (
          <p className="rounded-md border p-5 text-sm text-muted-foreground">{empty}</p>
        )}
      </div>
    </section>
  );
}

function ChartWall() {
  const charts: Array<[string, React.ComponentType<{ className?: string }>]> = [
    ['Line', LineChart],
    ['Bar', BarChart3],
    ['Area', AreaChart],
    ['Pie', PieChart],
    ['Gauge', Gauge],
    ['Funnel', TrendingUp],
  ];
  return (
    <section className="premium-card p-5">
      <h2 className="font-semibold">Chart system</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Line, bar, area, pie, scatter, heatmap, treemap, gauge, funnel, and radar chart
        architecture.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {charts.map(([label, Icon]) => (
          <div key={String(label)} className="rounded-md border p-4">
            <Icon className="size-5" />
            <p className="mt-3 font-medium">{label}</p>
            <div className="mt-3 h-16 rounded-md bg-secondary premium-shimmer" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function AnalyticsDashboardPage() {
  const executive = useExecutiveAnalytics();
  const capabilities = useAnalyticsCapabilities();
  return (
    <AnalyticsShell
      title="Executive command centre"
      description="Business performance across revenue, customers, projects, finance, automation, communication, documents, and AI readiness."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Gauge}
          label="Company health"
          value={`${executive.data?.companyHealthScore ?? 0}/100`}
          hint="Composite score from finance, cash flow, risk, and delivery signals."
        />
        <StatCard
          icon={TrendingUp}
          label="Revenue"
          value={money(executive.data?.revenue)}
          hint="Invoice-backed revenue across the organisation."
        />
        <StatCard
          icon={Activity}
          label="Cash flow"
          value={money(executive.data?.cashFlow)}
          hint="Net inflow and outflow prepared for forecasting."
        />
        <StatCard
          icon={Target}
          label="Projects at risk"
          value={executive.data?.projectsAtRisk ?? 0}
          hint="Urgent or blocked delivery signals."
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="premium-card p-5">
          <h2 className="font-semibold">Performance map</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ['Profit', money(executive.data?.profit)],
              ['Sales pipeline', `${executive.data?.salesPipeline.leads ?? 0} leads`],
              ['Employee capacity', `${executive.data?.employeeCapacity.tasks ?? 0} tasks`],
              ['Outstanding invoices', money(executive.data?.outstandingInvoices)],
              ['Documents', executive.data?.activity.documents ?? 0],
              ['Meetings', executive.data?.activity.meetings ?? 0],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-md border p-4">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="premium-card p-5">
          <div className="flex items-center gap-3">
            <span className="ai-breathing grid size-10 place-items-center rounded-md bg-primary text-primary-foreground">
              <Bot className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold">AI executive briefing</h2>
              <p className="text-sm text-muted-foreground">
                Prepared architecture only. No LLM generation.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {Object.keys(capabilities.data?.aiPreparation ?? {}).map((key) => (
              <div key={key} className="rounded-md border p-3 text-sm">
                {key}
              </div>
            ))}
          </div>
        </section>
      </div>
      <ChartWall />
    </AnalyticsShell>
  );
}

export function DashboardsPage() {
  const dashboards = useAnalyticsDashboards({ pageSize: 50 });
  const createDashboard = useCreateAnalyticsDashboard();
  return (
    <AnalyticsShell
      title="Custom dashboards"
      description="Create dashboards, add widgets, resize layouts, drag widgets, save layouts, and share views."
    >
      <Button
        className="w-fit"
        onClick={() =>
          createDashboard.mutate({ name: `Executive dashboard ${Date.now().toString().slice(-4)}` })
        }
      >
        <Plus className="mr-2 size-4" />
        New dashboard
      </Button>
      <RecordList
        rows={items(dashboards.data)}
        empty="No dashboards yet."
        render={(dashboard: AnalyticsDashboard) => (
          <>
            <p className="font-medium">{dashboard.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {dashboard.visibility} dashboard · widgets and layout ready.
            </p>
          </>
        )}
      />
    </AnalyticsShell>
  );
}

export function AnalyticsReportsPage() {
  const reports = useAnalyticsReports({ pageSize: 50 });
  const createReport = useCreateAnalyticsReport();
  return (
    <AnalyticsShell
      title="Report builder"
      description="Drag-and-drop report architecture with filters, date ranges, PDF/Excel export, schedules, and saved reports."
    >
      <Button
        className="w-fit"
        onClick={() =>
          createReport.mutate({ name: 'Executive summary', type: 'EXECUTIVE_SUMMARY' })
        }
      >
        <Plus className="mr-2 size-4" />
        New report
      </Button>
      <RecordList
        rows={items(reports.data)}
        empty="No analytics reports yet."
        render={(report: AnalyticsRecord) => (
          <>
            <p className="font-medium">{report.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {report.type} · filters, schedules, PDF, and Excel prepared.
            </p>
          </>
        )}
      />
    </AnalyticsShell>
  );
}

export function KpisPage() {
  const kpis = useAnalyticsKpis({ pageSize: 50 });
  const createKpi = useCreateAnalyticsKpi();
  return (
    <AnalyticsShell
      title="KPIs"
      description="Track business metrics, targets, owners, current values, health, and trend direction."
    >
      <Button
        className="w-fit"
        onClick={() => createKpi.mutate({ name: 'Revenue growth', target: 100000 })}
      >
        <Plus className="mr-2 size-4" />
        New KPI
      </Button>
      <RecordList
        rows={items(kpis.data)}
        empty="No KPIs yet."
        render={(kpi: AnalyticsRecord) => <p className="font-medium">{kpi.name}</p>}
      />
    </AnalyticsShell>
  );
}

export function ForecastsPage() {
  const forecasts = useAnalyticsForecasts({ pageSize: 50 });
  const createForecast = useCreateAnalyticsForecast();
  return (
    <AnalyticsShell
      title="Forecasts"
      description="Revenue, cash flow, sales, project delivery, and resource forecasting architecture."
    >
      <Button
        className="w-fit"
        onClick={() => createForecast.mutate({ name: 'Revenue prediction', type: 'REVENUE' })}
      >
        <BrainCircuit className="mr-2 size-4" />
        Prepare forecast
      </Button>
      <RecordList
        rows={items(forecasts.data)}
        empty="No forecasts yet."
        render={(forecast: AnalyticsRecord) => (
          <p className="font-medium">{forecast.name ?? forecast.type}</p>
        )}
      />
    </AnalyticsShell>
  );
}

export function SnapshotsPage() {
  const snapshots = useAnalyticsSnapshots({ pageSize: 50 });
  const createSnapshot = useCreateAnalyticsSnapshot();
  const charts = useAnalyticsCharts({ pageSize: 20 });
  return (
    <AnalyticsShell
      title="Business snapshots"
      description="Daily historical snapshots for revenue, projects, customers, employees, tasks, documents, automations, and financial health."
    >
      <Button className="w-fit" onClick={() => createSnapshot.mutate()}>
        <Plus className="mr-2 size-4" />
        Capture snapshot
      </Button>
      <div className="grid gap-4 xl:grid-cols-2">
        <RecordList
          rows={items(snapshots.data)}
          empty="No snapshots yet."
          render={(snapshot: AnalyticsRecord) => (
            <p className="font-medium">{new Date(snapshot.createdAt).toLocaleString()}</p>
          )}
        />
        <RecordList
          rows={items(charts.data)}
          empty="No chart configurations yet."
          render={(chart: AnalyticsRecord) => (
            <p className="font-medium">{chart.name ?? chart.type}</p>
          )}
        />
      </div>
    </AnalyticsShell>
  );
}
