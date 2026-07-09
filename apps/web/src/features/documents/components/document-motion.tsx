import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

import { documentEase, documentSpring } from './document-motion-config';

export function DocumentReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.48, delay, ease: documentEase }}
    >
      {children}
    </motion.div>
  );
}

export function DocumentHoverCard(props: HTMLMotionProps<'div'>) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      {...props}
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={documentSpring}
      whileHover={reduceMotion ? undefined : { y: -5, scale: 1.012 }}
    />
  );
}

export function KnowledgePanelMotion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.aside
      className={className}
      initial={reduceMotion ? false : { opacity: 0, x: 24 }}
      animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      transition={{ duration: 0.52, ease: documentEase }}
    >
      {children}
    </motion.aside>
  );
}
