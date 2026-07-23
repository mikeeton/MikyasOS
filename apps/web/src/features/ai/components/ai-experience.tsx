import { ArrowUpRight, CheckCircle2, FileSearch, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { EnterpriseCard } from '@/components/ui/enterprise-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils';

export function AiConfidence({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const tone =
    normalized.includes('high') || normalized.includes('0.8')
      ? 'success'
      : normalized.includes('low')
        ? 'warning'
        : 'info';

  return (
    <StatusBadge tone={tone} status={tone === 'success' ? 'success' : 'info'}>
      Confidence: {value}
    </StatusBadge>
  );
}

export function AiCitationChip({
  type,
  title,
  href,
}: {
  type: string;
  title: string;
  href?: string;
}) {
  const content = (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs text-muted-foreground">
      <FileSearch className="size-3" aria-hidden={true} />
      <span className="font-medium text-foreground">{type}</span>
      <span className="max-w-48 truncate">{title}</span>
      {href && <ArrowUpRight className="size-3" aria-hidden={true} />}
    </span>
  );

  return href ? <Link to={href}>{content}</Link> : content;
}

export function AiActionProposal({
  label,
  confidence,
  onConfirm,
}: {
  label: string;
  confidence?: string;
  onConfirm?: () => void;
}) {
  return (
    <div className="rounded-md border border-border/70 bg-background/70 p-3">
      <div className="flex items-start gap-2">
        <span className="module-accent-ai module-accent-mark grid size-8 shrink-0 place-items-center rounded-md border">
          <Sparkles className="size-4" aria-hidden={true} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            This is a proposed action. mikyasOS will ask before making changes.
          </p>
          {confidence && (
            <p className="mt-2 text-xs text-muted-foreground">Confidence: {confidence}</p>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={onConfirm}>
          Review action
        </Button>
        <Button size="sm" variant="outline">
          Dismiss
        </Button>
      </div>
    </div>
  );
}

export function AiSafetyStrip({
  grounded,
  permissionsApplied,
  destructiveBlocked,
}: {
  grounded: boolean;
  permissionsApplied: boolean;
  destructiveBlocked: boolean;
}) {
  const items = [
    ['Grounded', grounded],
    ['Permissions applied', permissionsApplied],
    ['Destructive blocked', destructiveBlocked],
  ] as const;

  return (
    <div className="grid gap-2 rounded-md border border-border/70 bg-background/70 p-3 text-xs text-muted-foreground sm:grid-cols-3">
      {items.map(([label, active]) => (
        <span key={label} className={cn('flex items-center gap-2', active && 'text-foreground')}>
          <CheckCircle2 className="size-3" aria-hidden={true} />
          {label}: {active ? 'yes' : 'no'}
        </span>
      ))}
    </div>
  );
}

export function AiRecommendationCard({
  title,
  reason,
  impact,
  action,
  route,
}: {
  title: string;
  reason: string;
  impact: string;
  action: string;
  route: string;
}) {
  return (
    <EnterpriseCard
      title={title}
      description={reason}
      icon={ShieldCheck}
      accentClassName="module-accent-ai"
      badge={<StatusBadge tone="ai">AI</StatusBadge>}
      footer={<span className="text-xs text-muted-foreground">{impact}</span>}
      actions={
        <Button asChild size="sm" variant="outline">
          <Link to={route}>{action}</Link>
        </Button>
      }
    />
  );
}
