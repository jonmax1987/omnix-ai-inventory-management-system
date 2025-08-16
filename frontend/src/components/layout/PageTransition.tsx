'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useMotionSettings } from '@/hooks/useMotionSettings';

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();
  const { getMotionProps, durations } = useMotionSettings();
  const [displayLocation, setDisplayLocation] = useState(pathname);

  // Update display location after transition completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayLocation(pathname);
    }, durations.pageTransition * 1000);

    return () => clearTimeout(timer);
  }, [pathname, durations.pageTransition]);

  const transitionVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98
    }
  };

  const motionProps = getMotionProps({
    initial: 'initial',
    animate: 'animate',
    exit: 'exit',
    variants: transitionVariants,
    transition: {
      duration: durations.pageTransition,
      ease: [0.4, 0, 0.2, 1]
    }
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={displayLocation}
        {...motionProps}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;