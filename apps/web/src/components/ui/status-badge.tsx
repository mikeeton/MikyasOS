import { AlertTriangle, CheckCircle2, Clock3, Info, PauseCircle, XCircle } from 'lucide-react';
import type { ComponentType, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'ai';

const toneStyles: Record<StatusTone, string> = {
  neutral: 'border-border bg-secondary text-muted-foreground',
  success: 'border-success/25 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  danger: 'border-destructive/30 bg-destructive/10 text-destructive',
  info: 'border-info/30 bg-info/10 text-info',
  ai: 'module-accent-ai module-accent-mark',
};

const statusIcons: Record<
  string,
  ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  active: CheckCircle2,
  completed: CheckCircle2,
  success: CheckCircle2,
  pending: Clock3,
  scheduled: Clock3,
  running: Clock3,
  paused: PauseCircle,
  warning: AlertTriangle,
  failed: XCircle,
  error: XCircle,
  cancelled: XCircle,
  info: Info,
};

export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: StatusTone;
  status?: string;
  showIcon?: boolean;
};

export function StatusBadge({
  tone = 'neutral',
  status,
  showIcon = true,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  const label = children ?? status ?? 'Status';
  const Icon = status ? (statusIcons[status.toLowerCase()] ?? Info) : Info;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        toneStyles[tone],
        className,
      )}
      {...props}
    >
      {showIcon && <Icon className="size-3" aria-hidden={true} />}
      {label}
    </span>
  );
}
