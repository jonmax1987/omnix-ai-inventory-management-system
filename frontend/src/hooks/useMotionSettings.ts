'use client';

import { useAnimation } from '@/context/AnimationContext';
import { DURATION, EASE, SPRING } from '@/utils/animations';

/**
 * Hook that provides motion settings based on user preferences
 */
export const useMotionSettings = () => {
  const { isAnimationEnabled, prefersReducedMotion } = useAnimation();

  // Create animation variants that respect motion preferences
  const createMotionVariants = (variants: Record<string, any>) => {
    if (!isAnimationEnabled) {
      // Return instant transitions for reduced motion
      return Object.keys(variants).reduce((acc, key) => {
        acc[key] = {
          ...variants[key],
          transition: { duration: 0 }
        };
        return acc;
      }, {} as Record<string, any>);
    }

    return variants;
  };

  // Get appropriate duration based on motion preferences
  const getDuration = (normalDuration: number) => {
    if (!isAnimationEnabled) return 0;
    return prefersReducedMotion ? normalDuration * 0.5 : normalDuration;
  };

  // Get appropriate easing curve
  const getEasing = (defaultEasing: number[] = EASE.EASE_OUT) => {
    if (!isAnimationEnabled) return [0, 0, 1, 1]; // Linear, instant
    return defaultEasing;
  };

  // Get spring configuration
  const getSpring = (defaultSpring = SPRING.GENTLE) => {
    if (!isAnimationEnabled) {
      return { duration: 0 };
    }
    
    if (prefersReducedMotion) {
      // Reduce bouncy/elastic effects for sensitive users
      return {
        type: "spring" as const,
        stiffness: defaultSpring.stiffness * 1.5,
        damping: defaultSpring.damping * 1.2,
        mass: defaultSpring.mass * 0.8,
      };
    }
    
    return defaultSpring;
  };

  // Create safe motion props for Framer Motion components
  const getMotionProps = (options: {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    variants?: Record<string, any>;
  } = {}) => {
    if (!isAnimationEnabled) {
      return {
        initial: false,
        animate: options.animate || "visible",
        transition: { duration: 0 },
        variants: options.variants ? createMotionVariants(options.variants) : undefined,
      };
    }

    return {
      initial: options.initial || "hidden",
      animate: options.animate || "visible", 
      exit: options.exit || "exit",
      transition: options.transition,
      variants: options.variants,
    };
  };

  // Utility to check if we should show loading animations
  const shouldAnimate = (animationType: 'entrance' | 'interaction' | 'loading' = 'interaction') => {
    if (!isAnimationEnabled) return false;
    
    // Even with reduced motion, some loading animations might be helpful
    if (prefersReducedMotion && animationType === 'loading') {
      return true; // Allow simple loading indicators
    }
    
    return !prefersReducedMotion;
  };

  return {
    isAnimationEnabled,
    prefersReducedMotion,
    createMotionVariants,
    getDuration,
    getEasing,
    getSpring,
    getMotionProps,
    shouldAnimate,
    
    // Quick access to safe durations
    durations: {
      instant: getDuration(DURATION.INSTANT),
      quick: getDuration(DURATION.QUICK),
      normal: getDuration(DURATION.NORMAL),
      slow: getDuration(DURATION.SLOW),
      pageTransition: getDuration(DURATION.PAGE_TRANSITION),
    }
  };
};

export default useMotionSettings;