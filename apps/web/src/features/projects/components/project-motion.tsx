import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

import { projectContainer, projectItem } from './project-motion-config';

export function MotionGroup({
  children,
  className,
  'aria-live': ariaLive,
}: {
  children: ReactNode;
  className?: string;
  'aria-live'?: 'off' | 'polite' | 'assertive';
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} aria-live={ariaLive}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={projectContainer}
      initial="hidden"
      animate="visible"
      aria-live={ariaLive}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({
  children,
  className,
  ...props
}: HTMLMotionProps<'div'> & { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={projectItem} {...props}>
      {children}
    </motion.div>
  );
}
