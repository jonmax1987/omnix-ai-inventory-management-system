'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionSettings } from '@/hooks/useMotionSettings';

interface RouteTransitionProps {
  children: ReactNode;
}

// Define transition types for different route patterns
const getTransitionType = (pathname: string) => {
  if (pathname === '/dashboard') return 'fade';
  if (pathname.startsWith('/inventory')) return 'slideLeft';
  if (pathname.startsWith('/forecasts')) return 'slideUp';
  if (pathname.startsWith('/animation-test')) return 'scale';
  return 'fade';
};

const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideLeft: {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  },
  slideRight: {
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 300, opacity: 0 }
  },
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 }
  },
  slideDown: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 }
  },
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.1, opacity: 0 }
  }
};

export const RouteTransition = ({ children }: RouteTransitionProps) => {
  const pathname = usePathname();
  const { shouldAnimate, durations } = useMotionSettings();
  
  // Temporarily simplify for debugging
  if (!shouldAnimate('entrance')) {
    return <div>{children}</div>;
  }
  
  const transitionType = getTransitionType(pathname);
  const variants = transitionVariants[transitionType];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{
          duration: durations.pageTransition,
          ease: [0.4, 0, 0.2, 1]
        }}
        style={{
          width: '100%'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default RouteTransition;