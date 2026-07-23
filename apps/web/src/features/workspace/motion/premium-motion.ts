export const premiumSpring = {
  type: 'spring',
  stiffness: 360,
  damping: 34,
  mass: 0.8,
} as const;

export const motionDuration = {
  instant: 0.08,
  fast: 0.16,
  normal: 0.24,
  slow: 0.36,
} as const;

export const motionEase = {
  standard: [0.22, 1, 0.36, 1],
  emphasized: [0.16, 1, 0.3, 1],
  entrance: [0.2, 0.8, 0.2, 1],
  exit: [0.4, 0, 1, 1],
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

export const widgetReveal = {
  initial: { opacity: 0, height: 0, y: -4 },
  animate: { opacity: 1, height: 'auto', y: 0 },
  exit: { opacity: 0, height: 0, y: -4 },
  transition: {
    duration: motionDuration.normal,
    ease: motionEase.standard,
  },
} as const;

export const feedbackPress = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.985 },
  transition: {
    duration: motionDuration.fast,
    ease: motionEase.standard,
  },
} as const;

export const notificationMotion = {
  initial: { opacity: 0, x: 14, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 10, scale: 0.98 },
  transition: premiumSpring,
} as const;

export const aiThinkingMotion = {
  animate: {
    opacity: [0.58, 1, 0.58],
    scale: [0.98, 1, 0.98],
  },
  transition: {
    duration: 2.2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
} as const;
