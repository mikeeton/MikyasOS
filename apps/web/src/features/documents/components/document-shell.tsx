import { AlertTriangle, BrainCircuit, FileText, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AiReadinessIndicator } from './ai-readiness-indicator';
import { DocumentReveal } from './document-motion';

export function DocumentShell({
  eyebrow = 'Documents',
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="document-archive-bg grid gap-7">
      <DocumentReveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </DocumentReveal>
      <DocumentReveal delay={0.08}>{children}</DocumentReveal>
    </section>
  );
}

export function KnowledgeStatsCard({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  hint: string;
  tone?: 'default' | 'ai' | 'warning';
}) {
  return (
    <DocumentReveal className="document-glass-panel p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={cn(
          'mt-2 text-2xl font-semibold',
          tone === 'ai' && 'text-indigo-600 dark:text-indigo-300',
          tone === 'warning' && 'text-amber-600 dark:text-amber-300',
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{hint}</p>
    </DocumentReveal>
  );
}

export function EmptyKnowledgeState({
  title,
  description,
  actionLabel = 'Upload document',
  actionTo = '/app/documents/all',
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="premium-card border-dashed p-8 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-md bg-muted">
        <BrainCircuit className="size-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-5 flex justify-center gap-2">
        <Button asChild>
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/app/documents/search">Search knowledge</Link>
        </Button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        AI suggestions are prepared for a future part.
      </p>
    </div>
  );
}

export function DocumentSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="premium-shimmer h-16 rounded-md border border-border" />
      ))}
    </div>
  );
}

export function DocumentErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="premium-card p-6">
      <AlertTriangle className="size-5 text-amber-500" aria-hidden="true" />
      <h3 className="mt-4 font-semibold">We could not load this knowledge view</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        The documents are safe. Retry, go back, or contact support if this keeps happening.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={onRetry}>Retry</Button>
        <Button asChild variant="outline">
          <Link to="/app/documents">Go back</Link>
        </Button>
        <Button variant="ghost">Contact support</Button>
      </div>
    </div>
  );
}

export function AiKnowledgePlaceholder({
  title,
  compact = false,
}: {
  title: string;
  compact?: boolean;
}) {
  return (
    <section className={cn('document-glass-panel border-dashed p-5', compact && 'p-4')}>
      <div className="flex items-center justify-between gap-3">
        <span className="document-ai-orb grid size-8 place-items-center rounded-md bg-muted">
          <Sparkles className="relative size-4 text-muted-foreground" aria-hidden="true" />
        </span>
        <AiReadinessIndicator state="queued" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Prepared architecture for AI-native memory. No real AI behaviour is connected yet.
      </p>
    </section>
  );
}

export function QuickActionCard({
  title,
  description,
  to,
}: {
  title: string;
  description: string;
  to: string;
}) {
  return (
    <Link
      className="document-card-premium premium-card block p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
      to={to}
    >
      <FileText className="size-5 text-muted-foreground" aria-hidden="true" />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </Link>
  );
}
