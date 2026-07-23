import type { ComponentType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type EnterpriseCardProps = {
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  badge?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  selected?: boolean;
  interactive?: boolean;
  accentClassName?: string;
  className?: string;
  children?: ReactNode;
};

export function EnterpriseCard({
  title,
  description,
  icon: Icon,
  badge,
  actions,
  footer,
  selected = false,
  interactive = false,
  accentClassName,
  className,
  children,
}: EnterpriseCardProps) {
  return (
    <section
      className={cn(
        'premium-design-card',
        interactive && 'cursor-pointer',
        selected && 'ring-2 ring-ring',
        accentClassName,
        className,
      )}
      aria-selected={selected || undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span className="module-accent-mark grid size-9 shrink-0 place-items-center rounded-md border">
              <Icon className="size-4" aria-hidden={true} />
            </span>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{title}</h3>
            {description && (
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {badge}
      </div>
      {children && <div className="mt-4">{children}</div>}
      {(actions || footer) && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3">
          <div>{footer}</div>
          <div className="flex flex-wrap gap-2">{actions}</div>
        </div>
      )}
    </section>
  );
}
