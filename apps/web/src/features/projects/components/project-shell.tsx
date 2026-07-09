import { motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, BriefcaseBusiness, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { projectEase, projectSpring } from './project-motion-config';
import { MotionGroup, MotionItem } from './project-motion';

type ProjectShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function ProjectShell({
  eyebrow = 'Projects',
  title,
  description,
  actions,
  children,
}: ProjectShellProps) {
  return (
    <MotionGroup className="grid gap-7" aria-live="polite">
      <MotionItem className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <motion.p
            className="text-sm font-medium text-muted-foreground"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.42, ease: projectEase }}
          >
            {eyebrow}
          </motion.p>
          <motion.h2
            className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl"
            layout
            transition={projectSpring}
          >
            {title}
          </motion.h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </MotionItem>
      <MotionItem className="grid gap-6">{children}</MotionItem>
    </MotionGroup>
  );
}

export function ProjectStat({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  hint: string;
  tone?: 'default' | 'success' | 'warning';
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="premium-card project-stat-card p-4"
      initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={projectSpring}
      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={cn(
          'mt-2 text-2xl font-semibold tracking-tight',
          tone === 'success' && 'text-emerald-600 dark:text-emerald-400',
          tone === 'warning' && 'text-amber-600 dark:text-amber-400',
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{hint}</p>
    </motion.div>
  );
}

export function ProjectSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="premium-shimmer h-16 rounded-md border border-border" />
      ))}
    </div>
  );
}

export function ProjectEmptyState({
  title,
  description,
  actionLabel,
  actionTo,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
}) {
  return (
    <div className="premium-card border-dashed p-8 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-md bg-muted">
        <BriefcaseBusiness className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      <Button asChild className="mt-5">
        <Link to={actionTo}>{actionLabel}</Link>
      </Button>
      <p className="mt-4 text-xs text-muted-foreground">
        Future AI recommendations will help plan the next best project action.
      </p>
    </div>
  );
}

export function ProjectErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="premium-card p-6">
      <AlertTriangle className="size-5 text-amber-500" aria-hidden="true" />
      <h3 className="mt-4 font-semibold">We could not load this project view</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        The data is safe. Retry, go back, or report the problem if this keeps happening.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={onRetry}>Retry</Button>
        <Button asChild variant="outline">
          <Link to="/app/projects">Go back</Link>
        </Button>
        <Button variant="ghost">Report problem</Button>
      </div>
    </div>
  );
}

export function ProjectAiPlaceholder({ title }: { title: string }) {
  return (
    <motion.section
      className="premium-card project-ai-card border-dashed p-5"
      aria-label={`${title} coming soon`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: projectEase }}
    >
      <Sparkles className="size-5 text-muted-foreground" aria-hidden="true" />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Placeholder for future AI recommendations. No AI behaviour is connected in this part.
      </p>
    </motion.section>
  );
}
