/**
 * Animation Constants and Configuration
 * Centralized animation settings for consistent motion across the app
 */

// Animation durations (in seconds)
export const DURATION = {
  // Quick interactions
  INSTANT: 0.15,
  QUICK: 0.2,
  FAST: 0.3,
  
  // Standard interactions
  NORMAL: 0.4,
  MODERATE: 0.5,
  MEDIUM: 0.6,
  
  // Slow/complex animations
  SLOW: 0.8,
  SLOWER: 1.0,
  SLOWEST: 1.2,
  
  // Page transitions
  PAGE_TRANSITION: 0.6,
  MODAL_TRANSITION: 0.3,
  
  // Loading states
  SKELETON_SHIMMER: 1.5,
  SPINNER: 1.0,
} as const;

// Easing curves for natural motion
export const EASE = {
  // Standard easing
  EASE_OUT: [0.25, 0.46, 0.45, 0.94],
  EASE_IN: [0.55, 0.055, 0.675, 0.19],
  EASE_IN_OUT: [0.645, 0.045, 0.355, 1],
  
  // Spring physics
  SPRING_BOUNCE: [0.68, -0.55, 0.265, 1.55],
  SPRING_SOFT: [0.25, 1, 0.5, 1],
  SPRING_SNAPPY: [0.4, 0, 0.2, 1],
  
  // Specialized curves
  BACK_OUT: [0.175, 0.885, 0.32, 1.275],
  BACK_IN: [0.6, -0.28, 0.735, 0.045],
  EXPO_OUT: [0.19, 1, 0.22, 1],
  EXPO_IN: [0.95, 0.05, 0.795, 0.035],
  
  // Elastic effects
  ELASTIC_OUT: [0.68, -0.55, 0.265, 1.55],
  ELASTIC_IN: [0.25, 0.46, 0.45, 0.94],
} as const;

// Spring configurations for physics-based animations
export const SPRING = {
  GENTLE: { 
    type: "spring" as const, 
    stiffness: 300, 
    damping: 30, 
    mass: 1 
  },
  SNAPPY: { 
    type: "spring" as const, 
    stiffness: 400, 
    damping: 25, 
    mass: 0.8 
  },
  BOUNCY: { 
    type: "spring" as const, 
    stiffness: 200, 
    damping: 15, 
    mass: 1.2 
  },
  WOBBLY: { 
    type: "spring" as const, 
    stiffness: 180, 
    damping: 12, 
    mass: 1 
  },
  STIFF: { 
    type: "spring" as const, 
    stiffness: 500, 
    damping: 35, 
    mass: 0.6 
  },
} as const;

// Standard animation variants
export const FADE = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: DURATION.NORMAL, ease: EASE.EASE_OUT }
  },
  exit: { 
    opacity: 0,
    transition: { duration: DURATION.QUICK, ease: EASE.EASE_IN }
  }
} as const;

export const SLIDE_UP = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: DURATION.NORMAL, ease: EASE.EASE_OUT }
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: { duration: DURATION.QUICK, ease: EASE.EASE_IN }
  }
} as const;

export const SLIDE_DOWN = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: DURATION.NORMAL, ease: EASE.EASE_OUT }
  },
  exit: { 
    y: 20, 
    opacity: 0,
    transition: { duration: DURATION.QUICK, ease: EASE.EASE_IN }
  }
} as const;

export const SLIDE_LEFT = {
  hidden: { x: 20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: DURATION.NORMAL, ease: EASE.EASE_OUT }
  },
  exit: { 
    x: -20, 
    opacity: 0,
    transition: { duration: DURATION.QUICK, ease: EASE.EASE_IN }
  }
} as const;

export const SLIDE_RIGHT = {
  hidden: { x: -20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: DURATION.NORMAL, ease: EASE.EASE_OUT }
  },
  exit: { 
    x: 20, 
    opacity: 0,
    transition: { duration: DURATION.QUICK, ease: EASE.EASE_IN }
  }
} as const;

export const SCALE = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: DURATION.NORMAL, ease: EASE.SPRING_SOFT }
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    transition: { duration: DURATION.QUICK, ease: EASE.EASE_IN }
  }
} as const;

export const SCALE_BOUNCE = {
  hidden: { scale: 0 },
  visible: { 
    scale: 1,
    transition: SPRING.BOUNCY
  },
  exit: { 
    scale: 0,
    transition: { duration: DURATION.QUICK, ease: EASE.EASE_IN }
  }
} as const;

// Stagger configurations for sequential animations
export const STAGGER = {
  FAST: { delayChildren: 0.1, staggerChildren: 0.05 },
  NORMAL: { delayChildren: 0.2, staggerChildren: 0.1 },
  SLOW: { delayChildren: 0.3, staggerChildren: 0.15 },
} as const;

// Page transition variants
export const PAGE_TRANSITIONS = {
  fade: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: DURATION.PAGE_TRANSITION, ease: EASE.EASE_OUT }
    },
    exit: { 
      opacity: 0,
      transition: { duration: DURATION.FAST, ease: EASE.EASE_IN }
    }
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: DURATION.PAGE_TRANSITION, ease: EASE.EASE_OUT }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: { duration: DURATION.FAST, ease: EASE.EASE_IN }
    }
  },
  slideLeft: {
    initial: { x: 300, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: { duration: DURATION.PAGE_TRANSITION, ease: EASE.EASE_OUT }
    },
    exit: { 
      x: -300, 
      opacity: 0,
      transition: { duration: DURATION.FAST, ease: EASE.EASE_IN }
    }
  }
} as const;

// Modal animation variants
export const MODAL_VARIANTS = {
  backdrop: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: DURATION.MODAL_TRANSITION }
    },
    exit: { 
      opacity: 0,
      transition: { duration: DURATION.MODAL_TRANSITION, delay: 0.1 }
    }
  },
  modal: {
    hidden: { 
      scale: 0.8, 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: DURATION.MODAL_TRANSITION, 
        ease: EASE.SPRING_SOFT,
        delay: 0.1 
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0, 
      y: 20,
      transition: { duration: DURATION.MODAL_TRANSITION, ease: EASE.EASE_IN }
    }
  }
} as const;

// Button interaction variants
export const BUTTON_VARIANTS = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: DURATION.QUICK, ease: EASE.EASE_OUT }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: DURATION.INSTANT, ease: EASE.EASE_IN }
  }
} as const;

// Card interaction variants
export const CARD_VARIANTS = {
  rest: { 
    scale: 1, 
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  },
  hover: { 
    scale: 1.02, 
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: { duration: DURATION.NORMAL, ease: EASE.EASE_OUT }
  }
} as const;

// Loading animation variants
export const LOADING_VARIANTS = {
  spinner: {
    rotate: 360,
    transition: {
      duration: DURATION.SPINNER,
      repeat: Infinity,
      ease: "linear"
    }
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: DURATION.SPINNER,
      repeat: Infinity,
      ease: EASE.EASE_IN_OUT
    }
  },
  shimmer: {
    x: ["-100%", "100%"],
    transition: {
      duration: DURATION.SKELETON_SHIMMER,
      repeat: Infinity,
      ease: "linear"
    }
  }
} as const;

// Animation utilities
export const ANIMATION_CONFIG = {
  // Global settings
  reducedMotion: typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false,
    
  // Performance settings
  layoutAnimation: true,
  enableGPU: true,
  
  // Debug mode
  debug: process.env.NODE_ENV === 'development',
} as const;

// Helper function to create staggered list animations
export const createStaggeredList = (itemCount: number, staggerDelay = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: staggerDelay,
      when: "beforeChildren"
    }
  }
});

// Helper function to create entrance animation
export const createEntranceAnimation = (
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  distance = 20
) => {
  const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
  const value = direction === 'up' || direction === 'left' ? distance : -distance;
  
  return {
    hidden: { [axis]: value, opacity: 0 },
    visible: { 
      [axis]: 0, 
      opacity: 1,
      transition: { duration: DURATION.NORMAL, ease: EASE.EASE_OUT }
    }
  };
};

export default {
  DURATION,
  EASE,
  SPRING,
  FADE,
  SLIDE_UP,
  SLIDE_DOWN,
  SLIDE_LEFT,
  SLIDE_RIGHT,
  SCALE,
  SCALE_BOUNCE,
  STAGGER,
  PAGE_TRANSITIONS,
  MODAL_VARIANTS,
  BUTTON_VARIANTS,
  CARD_VARIANTS,
  LOADING_VARIANTS,
  ANIMATION_CONFIG,
  createStaggeredList,
  createEntranceAnimation,
};