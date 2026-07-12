import { useState } from 'react';
import { Link } from 'react-router';
import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  Database,
  FileText,
  History,
  LockKeyhole,
  MessageSquareText,
  Play,
  Settings,
  Sparkles,
  Workflow,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  useAiActions,
  useAiCapabilities,
  useAiConversations,
  useAiMemory,
  useAiOrchestrate,
  useAiPrompts,
  useAiRetrievalStatus,
  useAiSettings,
} from '../hooks/use-ai-os';

const aiSubnav: Array<{ to: string; label: string }> = [
  { to: '/app/ai', label: 'Workspace' },
  { to: '/app/ai/history', label: 'History' },
  { to: '/app/ai/memory', label: 'Memory' },
  { to: '/app/ai/prompts', label: 'Prompts' },
  { to: '/app/ai/settings', label: 'Settings' },
];

function AiShell({
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
          <p className="text-sm text-muted-foreground">Workspace / AI Operating System</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {aiSubnav.map(({ to, label }) => (
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

function StatusCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'default',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  hint: string;
  tone?: 'default' | 'ai';
}) {
  return (
    <section className={cn('premium-card p-5', tone === 'ai' && 'border-primary/25')}>
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

function LoadingCard() {
  return <div className="premium-card premium-shimmer min-h-32" />;
}

function ErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="premium-card p-5">
      <p className="font-medium">AI workspace data could not load.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Authentication and organisation isolation are still protecting the page.
      </p>
      <Button className="mt-4" onClick={onRetry}>
        Retry
      </Button>
    </section>
  );
}

export function AiWorkspacePage() {
  const [message, setMessage] = useState('Show me what needs attention in this workspace');
  const capabilities = useAiCapabilities();
  const memory = useAiMemory();
  const retrieval = useAiRetrievalStatus();
  const actions = useAiActions();
  const orchestrate = useAiOrchestrate();
  const operationalPrompts = [
    'What needs my attention today?',
    'Which projects are at risk?',
    'Who should I follow up with?',
    'What invoices are overdue?',
  ];

  const runPreview = () => orchestrate.mutate({ message, currentPage: '/app/ai' });

  return (
    <AiShell
      title="AI command centre"
      description="The intelligence layer for business context, memory, retrieval, reasoning, and confirmation-ready actions."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          icon={BrainCircuit}
          label="Orchestrator"
          value={capabilities.data?.orchestrator ?? 'Loading'}
          hint="Every AI request routes through one protected orchestration path."
          tone="ai"
        />
        <StatusCard
          icon={Database}
          label="Knowledge"
          value={retrieval.data?.pgvectorPrepared ? 'RAG ready' : 'Preparing'}
          hint="pgvector architecture is reserved for business-grounded retrieval."
        />
        <StatusCard
          icon={LockKeyhole}
          label="Security"
          value={capabilities.data?.security.rbac ? 'RBAC' : 'Checking'}
          hint="Organisation isolation and permission filters protect AI context."
        />
        <StatusCard
          icon={Workflow}
          label="Actions"
          value={actions.data?.actions.length ?? 0}
          hint="All actions are prepared as confirmation-required proposals."
        />
      </div>

      {(capabilities.isError || retrieval.isError) && (
        <ErrorCard
          onRetry={() => {
            void capabilities.refetch();
            void retrieval.refetch();
          }}
        />
      )}

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="premium-card p-5">
          <div className="flex items-center gap-3">
            <span className="ai-breathing grid size-10 place-items-center rounded-md bg-primary text-primary-foreground">
              <Bot className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold">Conversation preview</h2>
              <p className="text-sm text-muted-foreground">
                Streaming, markdown, citations, and structured results are wired for Part 2.
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-md border bg-background/70 p-4">
            <p className="text-sm font-medium">Ask mikyasOS</p>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="premium-input mt-3 min-h-28 w-full resize-y py-3"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={runPreview} disabled={orchestrate.isPending}>
                <Play className="mr-2 size-4" />
                {orchestrate.isPending ? 'Thinking...' : 'Run AI preview'}
              </Button>
              <Button variant="outline" disabled>
                Stream response
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {operationalPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={() => setMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
          {orchestrate.data ? (
            <div className="mt-4 rounded-md border bg-secondary/40 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="size-4" />
                Structured result · confidence {orchestrate.data.response.confidence}
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {orchestrate.data.response.answer}
              </p>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Source citations
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {orchestrate.data.response.citations.length ? (
                      orchestrate.data.response.citations.map((citation) => (
                        <span key={`${citation.type}-${citation.id}`} className="status-pill">
                          {citation.type}: {citation.title}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No matching business records were found, so no citations were attached.
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Suggested actions
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {orchestrate.data.response.suggestedActions.map((action) => (
                      <span key={action.key} className="status-pill status-pill-info">
                        {action.label} · confirm first
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-2 rounded-md border border-border/70 bg-background/70 p-3 text-xs text-muted-foreground sm:grid-cols-3">
                <span>
                  Grounded: {orchestrate.data.response.safety.groundedInBusinessData ? 'yes' : 'no'}
                </span>
                <span>
                  Permissions:{' '}
                  {orchestrate.data.response.safety.permissionsApplied ? 'applied' : 'missing'}
                </span>
                <span>
                  Destructive blocked:{' '}
                  {orchestrate.data.response.safety.destructiveActionBlocked ? 'yes' : 'no'}
                </span>
              </div>
            </div>
          ) : null}
        </section>

        <div className="grid gap-4">
          <section className="premium-card p-5">
            <h2 className="font-semibold">Recent memories</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {memory.data?.businessMemory.companyCount ?? 0} companies ·{' '}
              {memory.data?.businessMemory.projectCount ?? 0} projects ·{' '}
              {memory.data?.businessMemory.documentCount ?? 0} documents
            </p>
            <div className="mt-4 grid gap-2">
              {(memory.data?.recentActions ?? []).slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-md border p-3 text-sm">
                  <span className="font-medium">{item.action}</span>
                  <span className="block text-xs text-muted-foreground">{item.entityType}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="premium-card p-5">
            <h2 className="font-semibold">Business health</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              AI answers are grounded through organisation context, citations, permission checks,
              and confirmation-required actions. Today, calendar, finance, and project signals are
              now available as operational prompts.
            </p>
          </section>
        </div>
      </div>

      {!capabilities.data && capabilities.isLoading ? <LoadingCard /> : null}
    </AiShell>
  );
}

export function AiHistoryPage() {
  const conversations = useAiConversations();

  return (
    <AiShell
      title="AI history"
      description="Threading, markdown, citations, streaming metadata, and future voice mode history are prepared."
    >
      <section className="premium-card p-5">
        <div className="flex items-center gap-2">
          <History className="size-4" />
          <h2 className="font-semibold">Conversation threads</h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {conversations.data?.conversations.length ?? 0} saved conversations. Streaming prepared:{' '}
          {String(conversations.data?.streamingPrepared ?? true)}.
        </p>
      </section>
    </AiShell>
  );
}

export function AiMemoryPage() {
  const memory = useAiMemory();

  return (
    <AiShell
      title="AI memory"
      description="Conversation memory, business memory, preferences, facts, recent actions, and pinned memories."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard
          icon={BrainCircuit}
          label="Companies"
          value={memory.data?.businessMemory.companyCount ?? 0}
          hint="CRM memory source prepared."
        />
        <StatusCard
          icon={Workflow}
          label="Projects"
          value={memory.data?.businessMemory.projectCount ?? 0}
          hint="Delivery memory source prepared."
        />
        <StatusCard
          icon={FileText}
          label="Documents"
          value={memory.data?.businessMemory.documentCount ?? 0}
          hint="Knowledge memory source prepared."
        />
      </div>
    </AiShell>
  );
}

export function AiPromptsPage() {
  const prompts = useAiPrompts();

  return (
    <AiShell
      title="Prompt library"
      description="Reusable prompts for agents and modules. Prompts live in the manager, not hidden inside services."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {(prompts.data?.templates ?? []).map((template) => (
          <section key={template.key} className="premium-card p-5">
            <div className="flex items-center gap-2">
              <MessageSquareText className="size-4" />
              <h2 className="font-semibold">{template.title}</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{template.objective}</p>
            <div className="mt-4 grid gap-2">
              {template.guardrails.map((guardrail) => (
                <span
                  key={guardrail}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <CheckCircle2 className="size-3" />
                  {guardrail}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
      {prompts.isLoading ? <LoadingCard /> : null}
    </AiShell>
  );
}

export function AiSettingsPage() {
  const settings = useAiSettings();
  const retrieval = useAiRetrievalStatus();

  return (
    <AiShell
      title="AI settings"
      description="Provider readiness, guardrails, retrieval settings, and action confirmation policy."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="premium-card p-5">
          <div className="flex items-center gap-2">
            <Settings className="size-4" />
            <h2 className="font-semibold">Provider</h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {settings.data?.provider.name ?? 'OpenRouter'} configured:{' '}
            {String(settings.data?.provider.configured ?? false)}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Model calls remain disabled for this milestone. The orchestration, context, memory,
            audit, and retrieval contract is ready.
          </p>
        </section>
        <section className="premium-card p-5">
          <div className="flex items-center gap-2">
            <Database className="size-4" />
            <h2 className="font-semibold">Retrieval</h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(retrieval.data?.retrievableSources ?? []).map((source) => (
              <span key={source} className="rounded-md border px-2 py-1 text-xs">
                {source}
              </span>
            ))}
          </div>
        </section>
      </div>
    </AiShell>
  );
}
