'use client';

import { useEffect, useState } from 'react';
import { useAnimation as useAnimationContext } from '@/context/AnimationContext';

/**
 * Hook for animating number values with smooth transitions
 */
export const useAnimatedValue = (
  targetValue: number,
  duration: number = 1000,
  easing: (t: number) => number = (t) => t * t * (3 - 2 * t) // smoothstep
) => {
  const [currentValue, setCurrentValue] = useState(targetValue);
  const { isAnimationEnabled } = useAnimationContext();

  useEffect(() => {
    if (!isAnimationEnabled) {
      setCurrentValue(targetValue);
      return;
    }

    const startValue = currentValue;
    const difference = targetValue - startValue;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = easing(progress);
      const newValue = startValue + (difference * easedProgress);
      
      setCurrentValue(newValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration, easing, isAnimationEnabled, currentValue]);

  return Math.round(currentValue * 100) / 100; // Round to 2 decimal places
};

/**
 * Hook for animating between different states with smooth transitions
 */
export const useAnimatedState = <T>(
  value: T,
  delay: number = 0,
  duration: number = 300
) => {
  const [animatedValue, setAnimatedValue] = useState(value);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isAnimationEnabled } = useAnimationContext();

  useEffect(() => {
    if (!isAnimationEnabled) {
      setAnimatedValue(value);
      return;
    }

    setIsTransitioning(true);
    
    const timeout = setTimeout(() => {
      setAnimatedValue(value);
      
      const endTimeout = setTimeout(() => {
        setIsTransitioning(false);
      }, duration);

      return () => clearTimeout(endTimeout);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay, duration, isAnimationEnabled]);

  return { animatedValue, isTransitioning };
};

export default { useAnimatedValue, useAnimatedState };