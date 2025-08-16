'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AnimationContextType {
  prefersReducedMotion: boolean;
  isAnimationEnabled: boolean;
  toggleAnimations: () => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

interface AnimationProviderProps {
  children: React.ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [userPreference, setUserPreference] = useState<boolean | null>(null);

  useEffect(() => {
    // Check system preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Load user preference from localStorage
    const savedPreference = localStorage.getItem('omnix-animations-enabled');
    if (savedPreference !== null) {
      setUserPreference(JSON.parse(savedPreference));
    }

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleAnimations = () => {
    const newPreference = !isAnimationEnabled;
    setUserPreference(newPreference);
    localStorage.setItem('omnix-animations-enabled', JSON.stringify(newPreference));
  };

  // Determine if animations should be enabled
  // Priority: User preference > System preference
  const isAnimationEnabled = userPreference !== null 
    ? userPreference 
    : !prefersReducedMotion;

  const value: AnimationContextType = {
    prefersReducedMotion,
    isAnimationEnabled,
    toggleAnimations,
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

export default AnimationContext;