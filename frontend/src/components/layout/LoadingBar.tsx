'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionSettings } from '@/hooks/useMotionSettings';
import styled from 'styled-components';

const LoadingBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9999;
  pointer-events: none;
`;

const LoadingBarProgress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary[400]},
    ${({ theme }) => theme.colors.primary[600]},
    ${({ theme }) => theme.colors.primary[400]}
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary[400]}40;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

export const LoadingBar = () => {
  const pathname = usePathname();
  const { shouldAnimate, durations } = useMotionSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);

      // Simulate progress
      let currentProgress = 0;
      const incrementProgress = () => {
        currentProgress += Math.random() * 30;
        if (currentProgress < 90) {
          setProgress(currentProgress);
          progressTimer = setTimeout(incrementProgress, 100 + Math.random() * 200);
        }
      };

      progressTimer = setTimeout(incrementProgress, 50);

      // Complete loading after duration
      timer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 200);
      }, durations.pageTransition * 1000);
    };

    startLoading();

    return () => {
      clearTimeout(timer);
      clearTimeout(progressTimer);
    };
  }, [pathname, durations.pageTransition]);

  if (!shouldAnimate('loading')) {
    return null;
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <LoadingBarContainer>
          <LoadingBarProgress
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            exit={{ 
              width: '100%',
              transition: { duration: 0.2 }
            }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          />
        </LoadingBarContainer>
      )}
    </AnimatePresence>
  );
};

export default LoadingBar;