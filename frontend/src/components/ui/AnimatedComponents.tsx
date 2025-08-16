'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useMotionSettings } from '@/hooks/useMotionSettings';
import { 
  FADE, 
  SLIDE_UP, 
  SLIDE_DOWN, 
  SLIDE_LEFT, 
  SLIDE_RIGHT, 
  SCALE,
  BUTTON_VARIANTS,
  CARD_VARIANTS,
  createStaggeredList
} from '@/utils/animations';

// Base animated component
interface AnimatedBoxProps extends HTMLMotionProps<'div'> {
  variant?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale';
  delay?: number;
}

export const AnimatedBox: React.FC<AnimatedBoxProps> = ({ 
  children, 
  variant = 'fade',
  delay = 0,
  ...props 
}) => {
  const { getMotionProps } = useMotionSettings();
  
  const variants = {
    fade: FADE,
    slideUp: SLIDE_UP,
    slideDown: SLIDE_DOWN,
    slideLeft: SLIDE_LEFT,
    slideRight: SLIDE_RIGHT,
    scale: SCALE,
  };

  const selectedVariants = variants[variant];
  
  // Add delay to the visible state
  const variantsWithDelay = {
    ...selectedVariants,
    visible: {
      ...selectedVariants.visible,
      transition: {
        ...selectedVariants.visible.transition,
        delay,
      }
    }
  };

  const motionProps = getMotionProps({
    variants: variantsWithDelay,
  });

  return (
    <motion.div {...motionProps} {...props}>
      {children}
    </motion.div>
  );
};

// Animated button with micro-interactions
interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  ...props
}) => {
  const { getMotionProps, shouldAnimate } = useMotionSettings();
  
  const buttonMotionProps = shouldAnimate('interaction') 
    ? {
        variants: BUTTON_VARIANTS,
        initial: "rest",
        whileHover: disabled ? "rest" : "hover",
        whileTap: disabled ? "rest" : "tap",
      }
    : {};

  return (
    <motion.button
      {...buttonMotionProps}
      disabled={disabled || loading}
      {...props}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...props.style
      }}
    >
      {loading && (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ marginRight: 8, display: 'inline-block' }}
        >
          ⟳
        </motion.span>
      )}
      {children}
    </motion.button>
  );
};

// Animated card with hover effects
interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  hoverable?: boolean;
  clickable?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  hoverable = true,
  clickable = false,
  onClick,
  ...props
}) => {
  const { shouldAnimate } = useMotionSettings();
  
  const cardMotionProps = shouldAnimate('interaction') && hoverable
    ? {
        variants: CARD_VARIANTS,
        initial: "rest",
        whileHover: "hover",
        whileTap: clickable ? "hover" : undefined,
      }
    : {};

  return (
    <motion.div
      {...cardMotionProps}
      onClick={onClick}
      style={{
        cursor: clickable ? 'pointer' : 'default',
        ...props.style
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Staggered list container
interface AnimatedListProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  staggerDelay = 0.1,
  className,
}) => {
  const { getMotionProps } = useMotionSettings();
  
  const childrenArray = React.Children.toArray(children);
  const listVariants = createStaggeredList(childrenArray.length, staggerDelay);
  
  const motionProps = getMotionProps({
    variants: listVariants,
  });

  return (
    <motion.div className={className} {...motionProps}>
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode;
  variant?: 'fade' | 'slideUp' | 'slideLeft';
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  variant = 'fade'
}) => {
  const { getMotionProps } = useMotionSettings();
  
  const transitionVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slideUp: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -20, opacity: 0 }
    },
    slideLeft: {
      initial: { x: 300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -300, opacity: 0 }
    }
  };

  const motionProps = getMotionProps({
    initial: transitionVariants[variant].initial,
    animate: transitionVariants[variant].animate,
    exit: transitionVariants[variant].exit,
  });

  return (
    <motion.div {...motionProps}>
      {children}
    </motion.div>
  );
};

// Loading skeleton with shimmer effect
interface AnimatedSkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const AnimatedSkeleton: React.FC<AnimatedSkeletonProps> = ({
  width = '100%',
  height = 20,
  className,
}) => {
  const { shouldAnimate } = useMotionSettings();

  return (
    <div
      className={className}
      style={{
        width,
        height,
        backgroundColor: '#e2e8f0',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {shouldAnimate('loading') && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
};

export default {
  AnimatedBox,
  AnimatedButton,
  AnimatedCard,
  AnimatedList,
  PageTransition,
  AnimatedSkeleton,
};