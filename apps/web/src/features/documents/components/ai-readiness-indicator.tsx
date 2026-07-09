import { AlertTriangle, CheckCircle2, CircleDashed, Loader2, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';

export type AiReadinessState = 'not-indexed' | 'queued' | 'processing' | 'ready' | 'failed';

const stateConfig: Record<
  AiReadinessState,
  { label: string; className: string; icon: typeof Sparkles }
> = {
  'not-indexed': {
    label: 'Not indexed',
    className: 'border-border bg-muted text-muted-foreground',
    icon: CircleDashed,
  },
  queued: {
    label: 'Queued',
    className: 'document-ai-pulse border-primary/20 bg-primary/5 text-foreground',
    icon: Sparkles,
  },
  processing: {
    label: 'Processing',
    className: 'document-ai-scan border-primary/20 bg-primary/5 text-foreground',
    icon: Loader2,
  },
  ready: {
    label: 'AI ready',
    className:
      'document-ai-ready border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    icon: CheckCircle2,
  },
  failed: {
    label: 'Needs review',
    className: 'border-destructive/30 bg-destructive/10 text-destructive',
    icon: AlertTriangle,
  },
};

export function AiReadinessIndicator({
  state = 'queued',
  compact = false,
}: {
  state?: AiReadinessState;
  compact?: boolean;
}) {
  const config = stateConfig[state];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium',
        config.className,
      )}
    >
      <Icon
        className={cn('size-3.5', state === 'processing' && 'animate-spin')}
        aria-hidden="true"
      />
      {compact ? null : config.label}
    </span>
  );
}
