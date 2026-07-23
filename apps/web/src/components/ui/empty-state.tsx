import type { ComponentType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type EmptyStateProps = {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  description: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  suggestion?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  suggestion,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('premium-card grid place-items-center p-8 text-center', className)}>
      <span className="module-accent-ai module-accent-mark grid size-12 place-items-center rounded-md border">
        <Icon className="size-6" aria-hidden={true} />
      </span>
      <h2 className="mt-4 text-base font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {(primaryAction || secondaryAction) && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
      {suggestion && (
        <div className="mt-5 w-full max-w-lg rounded-md border border-border/70 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          {suggestion}
        </div>
      )}
    </div>
  );
}
