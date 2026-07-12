import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  Activity,
  AlertTriangle,
  Bot,
  CalendarClock,
  CheckCircle2,
  Clock3,
  GitBranch,
  History,
  ListFilter,
  Logs,
  Play,
  Plus,
  Radio,
  Settings,
  Sparkles,
  TimerReset,
  Workflow,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Workflow as WorkflowRecord, WorkflowExecution, WorkflowTemplate } from '@/api/client';
import {
  useAutomationCapabilities,
  useCreateWorkflow,
  useExecuteWorkflow,
  useWorkflowExecutions,
  useWorkflowHistory,
  useWorkflowLogs,
  useWorkflowSchedules,
  useWorkflowTemplates,
  useWorkflows,
} from '../hooks/use-automation';

const automationSubnav: Array<{ to: string; label: string }> = [
  { to: '/app/automation', label: 'Dashboard' },
  { to: '/app/automation/workflows', label: 'Workflows' },
  { to: '/app/automation/templates', label: 'Templates' },
  { to: '/app/automation/history', label: 'History' },
  { to: '/app/automation/logs', label: 'Logs' },
  { to: '/app/automation/settings', label: 'Settings' },
];

function items<T>(data?: { items: T[] } | T[]): T[] {
  if (Array.isArray(data)) return data;
  return data?.items ?? [];
}

function AutomationShell({
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
          <p className="text-sm text-muted-foreground">Workspace / Automation Engine</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {automationSubnav.map(({ to, label }) => (
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

function WorkflowBuilderPreview() {
  const nodes = [
    { id: 'trigger', label: 'Customer created', type: 'Trigger', x: '8%', y: '38%' },
    {
      id: 'condition',
      label: 'If tier contains enterprise',
      type: 'Condition',
      x: '36%',
      y: '22%',
    },
    { id: 'approval', label: 'Manager approval', type: 'Approval', x: '60%', y: '42%' },
    { id: 'action', label: 'Create onboarding project', type: 'Action', x: '80%', y: '18%' },
  ];

  return (
    <section className="premium-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
        <div>
          <h2 className="font-semibold">Visual workflow builder</h2>
          <p className="text-sm text-muted-foreground">
            Canvas architecture for triggers, conditions, approvals, delays, actions, webhooks, and
            AI decision placeholders.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Zoom', 'Pan', 'Mini-map', 'Undo', 'Redo', 'Auto layout'].map((tool) => (
            <span key={tool} className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
              {tool}
            </span>
          ))}
        </div>
      </div>
      <div className="relative min-h-[360px] bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:28px_28px] p-6">
        <svg className="absolute inset-0 size-full" aria-hidden>
          <path
            d="M 190 178 C 290 178 320 118 430 118"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeDasharray="6 6"
            strokeWidth="2"
          />
          <path
            d="M 555 140 C 650 160 665 198 735 198"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeDasharray="6 6"
            strokeWidth="2"
          />
          <path
            d="M 850 185 C 940 160 955 112 1035 112"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeDasharray="6 6"
            strokeWidth="2"
          />
        </svg>
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute w-56 rounded-md border bg-background/95 p-4 shadow-sm backdrop-blur"
            style={{ left: node.x, top: node.y }}
          >
            <span className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">
              {node.type}
            </span>
            <p className="mt-3 font-medium">{node.label}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Configurable, validated, logged, and permission-aware.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WorkflowRow({
  workflow,
  onExecute,
  executing,
}: {
  workflow: WorkflowRecord;
  onExecute: (id: string) => void;
  executing: boolean;
}) {
  return (
    <div className="grid gap-3 rounded-md border p-4 lg:grid-cols-[1fr_140px_140px_auto] lg:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium">{workflow.name}</h3>
          <span className="rounded-md bg-secondary px-2 py-1 text-xs">{workflow.status}</span>
          {workflow.enabled ? (
            <span className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">Enabled</span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {workflow.description ?? 'No description yet.'}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">{workflow.triggerType.replaceAll('_', ' ')}</p>
      <p className="text-sm text-muted-foreground">
        {workflow.actions?.length ?? 0} actions · {workflow._count?.executions ?? 0} runs
      </p>
      <Button size="sm" onClick={() => onExecute(workflow.id)} disabled={executing}>
        <Play className="mr-2 size-4" />
        Run
      </Button>
    </div>
  );
}

function TemplateCard({ template }: { template: WorkflowTemplate }) {
  return (
    <section className="premium-card p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">
          {template.category}
        </span>
        <Sparkles className="size-4 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-semibold">{template.name}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {template.description ?? 'Workflow template prepared for duplication.'}
      </p>
      <Button className="mt-5 w-full" variant="outline">
        Duplicate template
      </Button>
    </section>
  );
}

function ExecutionTimeline({ executions }: { executions: WorkflowExecution[] }) {
  return (
    <div className="grid gap-3">
      {executions.map((execution) => (
        <div
          key={execution.id}
          className="grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_140px_140px]"
        >
          <div>
            <p className="font-medium">{execution.workflow?.name ?? execution.workflowId}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {execution.logs?.[0]?.message ?? 'Execution created and tracked.'}
            </p>
          </div>
          <span className="text-sm text-muted-foreground">{execution.status}</span>
          <span className="text-sm text-muted-foreground">
            {execution.durationMs ? `${execution.durationMs}ms` : 'Pending'}
          </span>
        </div>
      ))}
      {!executions.length && (
        <div className="rounded-md border p-6 text-sm text-muted-foreground">
          No workflow executions yet. Run a workflow to see validation, conditions, actions, logs,
          retries, and safe execution history here.
        </div>
      )}
    </div>
  );
}

export function AutomationDashboardPage() {
  const workflows = useWorkflows({ pageSize: 20 });
  const executions = useWorkflowExecutions();
  const templates = useWorkflowTemplates();
  const schedules = useWorkflowSchedules();
  const capabilities = useAutomationCapabilities();
  const executeWorkflow = useExecuteWorkflow();
  const createWorkflow = useCreateWorkflow();

  const workflowItems = items(workflows.data);
  const executionItems = executions.data ?? [];
  const failedExecutions = executionItems.filter((execution) => execution.status === 'FAILED');
  const runningExecutions = executionItems.filter((execution) => execution.status === 'RUNNING');

  const createDemoWorkflow = () =>
    createWorkflow.mutate({
      name: `Customer onboarding ${Date.now().toString().slice(-4)}`,
      description: 'Creates a safe onboarding flow from a manual trigger.',
      status: 'ACTIVE',
      enabled: true,
      triggerType: 'MANUAL',
      actions: [
        { type: 'CREATE_PROJECT', name: 'Prepare project shell', config: { safeMode: true } },
        { type: 'SEND_NOTIFICATION', name: 'Notify owner', config: { channel: 'in-app' } },
      ],
    });

  return (
    <AutomationShell
      title="Automation command centre"
      description="The workflow engine for triggers, conditions, variables, schedules, approvals, queues, templates, and AI-ready recommendations."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Workflow}
          label="Active workflows"
          value={workflowItems.filter((workflow) => workflow.enabled).length}
          hint="Enabled automations ready for manual, scheduled, and event-driven execution."
        />
        <StatCard
          icon={Radio}
          label="Running executions"
          value={runningExecutions.length}
          hint="BullMQ-backed execution architecture is prepared for background work."
        />
        <StatCard
          icon={AlertTriangle}
          label="Failed executions"
          value={failedExecutions.length}
          hint="Failures, retries, and workflow errors are tracked through execution history."
        />
        <StatCard
          icon={CalendarClock}
          label="Scheduled jobs"
          value={schedules.data?.length ?? 0}
          hint="Once, hourly, daily, weekly, monthly, and cron schedules are timezone-aware."
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={createDemoWorkflow} disabled={createWorkflow.isPending}>
          <Plus className="mr-2 size-4" />
          Create demo workflow
        </Button>
        <Link to="/app/automation/templates">
          <Button variant="outline">Browse templates</Button>
        </Link>
        <Link to="/app/automation/history">
          <Button variant="outline">Open history</Button>
        </Link>
      </div>

      <WorkflowBuilderPreview />

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="premium-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Recent workflows</h2>
            <Link to="/app/automation/workflows">
              <Button variant="outline" size="sm">
                View all
              </Button>
            </Link>
          </div>
          <div className="mt-4 grid gap-3">
            {workflowItems.slice(0, 4).map((workflow) => (
              <WorkflowRow
                key={workflow.id}
                workflow={workflow}
                onExecute={(id) => executeWorkflow.mutate({ id })}
                executing={executeWorkflow.isPending}
              />
            ))}
            {!workflowItems.length && (
              <p className="rounded-md border p-5 text-sm text-muted-foreground">
                No workflows yet. Use the demo action or duplicate a template to start the engine.
              </p>
            )}
          </div>
        </section>

        <section className="premium-card p-5">
          <h2 className="font-semibold">AI preparation</h2>
          <div className="mt-4 grid gap-3">
            {[
              'Workflow recommendations',
              'Workflow generation',
              'Workflow optimisation',
              'Workflow explanation',
              'Automation risk scoring',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-md border p-3 text-sm">
                <Bot className="size-4" />
                {item}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Capability services loaded: {Object.keys(capabilities.data?.aiPreparation ?? {}).length}
          </p>
        </section>
      </div>

      <section className="premium-card p-5">
        <h2 className="font-semibold">Workflow templates</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {(templates.data ?? []).slice(0, 3).map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>
    </AutomationShell>
  );
}

export function AutomationWorkflowsPage() {
  const [search, setSearch] = useState('');
  const workflows = useWorkflows({ pageSize: 50, search });
  const executeWorkflow = useExecuteWorkflow();
  const workflowItems = items(workflows.data);

  return (
    <AutomationShell
      title="Workflow operations"
      description="Create, inspect, run, and monitor workflow definitions with trigger, condition, action, approval, and schedule architecture."
    >
      <section className="premium-card p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative">
            <ListFilter className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search workflows..."
              className="premium-input w-full pl-9 md:w-80"
            />
          </div>
          <Button>
            <Plus className="mr-2 size-4" />
            New workflow
          </Button>
        </div>
      </section>
      <section className="premium-card p-5">
        <div className="grid gap-3">
          {workflowItems.map((workflow) => (
            <WorkflowRow
              key={workflow.id}
              workflow={workflow}
              onExecute={(id) => executeWorkflow.mutate({ id })}
              executing={executeWorkflow.isPending}
            />
          ))}
          {!workflowItems.length && (
            <p className="rounded-md border p-6 text-sm text-muted-foreground">
              No matching workflows. Templates can seed customer onboarding, lead follow-up,
              approvals, meeting follow-up, task escalation, and operations flows.
            </p>
          )}
        </div>
      </section>
    </AutomationShell>
  );
}

export function AutomationTemplatesPage() {
  const templates = useWorkflowTemplates();
  const grouped = useMemo(() => {
    return (templates.data ?? []).reduce<Record<string, WorkflowTemplate[]>>((acc, template) => {
      acc[template.category] = [...(acc[template.category] ?? []), template];
      return acc;
    }, {});
  }, [templates.data]);

  return (
    <AutomationShell
      title="Workflow templates"
      description="Reusable automation patterns for sales, CRM, projects, HR, operations, finance, support, and marketing."
    >
      {Object.entries(grouped).map(([category, categoryTemplates]) => (
        <section key={category} className="grid gap-4">
          <h2 className="font-semibold">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categoryTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </section>
      ))}
    </AutomationShell>
  );
}

export function AutomationHistoryPage() {
  const history = useWorkflowHistory();
  return (
    <AutomationShell
      title="Execution history"
      description="Chronological workflow execution status, duration, actions executed, errors, retries, user context, and timestamps."
    >
      <section className="premium-card p-5">
        <ExecutionTimeline executions={history.data ?? []} />
      </section>
    </AutomationShell>
  );
}

export function AutomationLogsPage() {
  const logs = useWorkflowLogs();
  return (
    <AutomationShell
      title="Automation logs"
      description="A professional log viewer for step-level execution traces, severity, grouping, filtering, and future retry diagnostics."
    >
      <section className="premium-card p-4">
        <div className="grid gap-3">
          {(logs.data ?? []).map((log) => (
            <div
              key={log.id}
              className="grid gap-3 rounded-md border p-4 md:grid-cols-[120px_1fr_160px]"
            >
              <span className="text-sm font-medium">{log.severity}</span>
              <div>
                <p className="font-medium">{log.step}</p>
                <p className="mt-1 text-sm text-muted-foreground">{log.message}</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
          {!logs.data?.length && (
            <p className="rounded-md border p-6 text-sm text-muted-foreground">
              No logs yet. Executed workflows will record trigger validation, context building,
              condition checks, action validation, retries, and errors.
            </p>
          )}
        </div>
      </section>
    </AutomationShell>
  );
}

export function AutomationSettingsPage() {
  const capabilities = useAutomationCapabilities();
  const schedules = useWorkflowSchedules();
  const executions = useWorkflowExecutions();
  const settings = [
    {
      icon: Zap,
      label: 'Execution mode',
      value: 'Safe execution',
      hint: 'Actions are validated and logged before running.',
    },
    {
      icon: TimerReset,
      label: 'Retries',
      value: 'Prepared',
      hint: 'BullMQ retry architecture is available for background workers.',
    },
    {
      icon: GitBranch,
      label: 'Branching',
      value: 'Prepared',
      hint: 'Conditions and future merge points are modelled in workflow data.',
    },
    {
      icon: Clock3,
      label: 'Scheduler',
      value: `${schedules.data?.length ?? 0} jobs`,
      hint: 'Timezone-aware schedules support once, recurring, and cron jobs.',
    },
    {
      icon: Activity,
      label: 'Queue',
      value: capabilities.data?.queue.queue ?? 'Loading',
      hint: 'Background execution, notifications, AI tasks, imports, and exports share queue patterns.',
    },
    {
      icon: History,
      label: 'History retention',
      value: `${executions.data?.length ?? 0} runs`,
      hint: 'Execution and log tables keep operational evidence.',
    },
    {
      icon: CheckCircle2,
      label: 'Approvals',
      value: 'Enabled',
      hint: 'Destructive and external actions can require human confirmation.',
    },
    {
      icon: Logs,
      label: 'Audit',
      value: 'Enabled',
      hint: 'Workflow creation, execution, and change events are audit-ready.',
    },
    {
      icon: Settings,
      label: 'Risk controls',
      value: 'AI prepared',
      hint: 'Automation risk service is scaffolded without LLM generation.',
    },
  ];

  return (
    <AutomationShell
      title="Automation settings"
      description="Operational controls for queues, scheduling, approvals, variables, audit, safe execution, and AI preparation."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {settings.map(({ icon: Icon, label, value, hint }) => (
          <StatCard key={label} icon={Icon} label={label} value={value} hint={hint} />
        ))}
      </div>
    </AutomationShell>
  );
}
