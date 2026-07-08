export const premiumSpring = {
  type: 'spring',
  stiffness: 360,
  damping: 34,
  mass: 0.8,
} as const;

export const pageTransition = {
  initial: { opacity: 0, y: 14, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.99 },
  transition: premiumSpring,
} as const;

export const cascadeContainer = {
  animate: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
} as const;

export const cascadeItem = {
  initial: { opacity: 0, y: 10, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: premiumSpring,
} as const;
