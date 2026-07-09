import type { Variants } from 'framer-motion';

export const projectSpring = {
  type: 'spring',
  stiffness: 240,
  damping: 28,
  mass: 0.85,
} as const;

export const projectEase = [0.22, 1, 0.36, 1] as const;

export const projectContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.03,
    },
  },
};

export const projectItem: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.56, ease: projectEase },
  },
};
