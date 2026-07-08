import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  cascadeContainer,
  cascadeItem,
  pageTransition,
} from '@/features/workspace/motion/premium-motion';
import { cn } from '@/lib/utils';

type CrmShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function CrmShell({
  eyebrow = 'CRM',
  title,
  description,
  actions,
  children,
}: CrmShellProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="grid gap-7"
      {...(reduceMotion ? {} : pageTransition)}
      aria-live="polite"
    >
      <motion.div
        className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        variants={reduceMotion ? undefined : cascadeContainer}
        initial="initial"
        animate="animate"
      >
        <div>
          <motion.p
            variants={reduceMotion ? undefined : cascadeItem}
            className="text-sm font-medium text-muted-foreground"
          >
            {eyebrow}
          </motion.p>
          <motion.h2
            variants={reduceMotion ? undefined : cascadeItem}
            className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl"
          >
            {title}
          </motion.h2>
          <motion.p
            variants={reduceMotion ? undefined : cascadeItem}
            className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground"
          >
            {description}
          </motion.p>
        </div>
        {actions && (
          <motion.div
            variants={reduceMotion ? undefined : cascadeItem}
            className="flex flex-wrap gap-2"
          >
            {actions}
          </motion.div>
        )}
      </motion.div>
      <motion.div
        variants={reduceMotion ? undefined : cascadeContainer}
        initial="initial"
        animate="animate"
        className="grid gap-6"
      >
        {children}
      </motion.div>
    </motion.section>
  );
}

export function CrmStat({
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
  const displayValue = useAnimatedDisplayValue(value);

  return (
    <motion.div
      variants={cascadeItem}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="premium-card p-4"
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={cn(
          'mt-2 text-2xl font-semibold tracking-tight',
          tone === 'success' && 'text-emerald-600 dark:text-emerald-400',
          tone === 'warning' && 'text-amber-600 dark:text-amber-400',
        )}
      >
        {displayValue}
      </p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{hint}</p>
    </motion.div>
  );
}

export function CrmEmptyState({
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
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="premium-card border-dashed p-8 text-center"
    >
      <div className="ai-breathing mx-auto grid size-12 place-items-center rounded-md bg-muted text-lg font-semibold">
        CRM
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      <Button asChild className="mt-5">
        <Link to={actionTo}>{actionLabel}</Link>
      </Button>
      <p className="mt-4 text-xs text-muted-foreground">
        Future AI suggestions will help decide the next best customer action.
      </p>
    </motion.div>
  );
}

export function CrmSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="premium-shimmer h-16 rounded-md border border-border" />
      ))}
    </div>
  );
}

export function CrmErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="premium-card p-6"
    >
      <h3 className="font-semibold">We could not load this CRM view</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        The data is safe. Try again, or return to the CRM dashboard and continue from there.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={onRetry}>Retry</Button>
        <Button asChild variant="outline">
          <Link to="/app/crm">Return to CRM</Link>
        </Button>
        <Button variant="ghost">Report issue</Button>
      </div>
    </motion.div>
  );
}

function useAnimatedDisplayValue(value: string | number) {
  const [display, setDisplay] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplay(value);
      previousValue.current = value;
      return;
    }

    let frame = 0;
    const totalFrames = 22;
    const start = typeof previousValue.current === 'number' ? previousValue.current : 0;
    const delta = value - start;
    previousValue.current = value;

    const tick = () => {
      frame += 1;
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      setDisplay(Math.round(start + delta * progress));
      if (frame < totalFrames) {
        window.requestAnimationFrame(tick);
      }
    };

    window.requestAnimationFrame(tick);
  }, [value]);

  return display;
}
