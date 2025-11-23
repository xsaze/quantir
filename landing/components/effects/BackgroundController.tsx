'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useScrollContext } from './ScrollContext';
import {
  backgroundConfig,
  defaultBackgroundConfig,
  interpolateScrollParam,
  type BackgroundEffectConfig
} from './backgroundConfig';

interface BackgroundControllerProps {
  /** Override default styling */
  style?: React.CSSProperties;
  /** Additional CSS class */
  className?: string;
  /** Transition duration in ms */
  transitionDuration?: number;
}

/**
 * BackgroundController - Manages section-based background effects with smooth transitions
 *
 * This component:
 * 1. Detects which section is currently active using scroll context
 * 2. Renders both current and next background effects
 * 3. Smoothly fades between backgrounds as you scroll
 * 4. Passes scroll-responsive parameters to the effect components
 *
 * Usage:
 * ```tsx
 * <ScrollProvider>
 *   <BackgroundController />
 *   <YourContent />
 * </ScrollProvider>
 * ```
 */
export const BackgroundController: React.FC<BackgroundControllerProps> = ({
  style,
  className = '',
  transitionDuration = 800
}) => {
  const { activeSection, scrollProgress } = useScrollContext();
  const [previousSection, setPreviousSection] = useState<string | null>(null);
  const [transitionProgress, setTransitionProgress] = useState(1); // 0 = previous, 1 = current

  // Track section changes and trigger transitions
  useEffect(() => {
    if (activeSection !== previousSection) {
      setPreviousSection(activeSection);
      setTransitionProgress(0);

      // Smoothly transition to new background
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / transitionDuration);

        // Ease-in-out function
        const easedProgress = progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

        setTransitionProgress(easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [activeSection, previousSection, transitionDuration]);

  // Get configurations
  const currentConfig: BackgroundEffectConfig = useMemo(() => {
    if (!activeSection) return defaultBackgroundConfig;
    return backgroundConfig[activeSection] || defaultBackgroundConfig;
  }, [activeSection]);

  const prevConfig: BackgroundEffectConfig = useMemo(() => {
    if (!previousSection || previousSection === activeSection) return currentConfig;
    return backgroundConfig[previousSection] || defaultBackgroundConfig;
  }, [previousSection, activeSection, currentConfig]);

  // Calculate scroll-responsive parameters for current section
  const currentScrollProps = useMemo(() => {
    const props: Record<string, any> = {};
    if (currentConfig.scrollParams && currentConfig.scrollParams.length > 0) {
      currentConfig.scrollParams.forEach((paramConfig) => {
        const value = interpolateScrollParam(scrollProgress, paramConfig);
        props[paramConfig.param] = value;
      });
    }
    return props;
  }, [currentConfig, scrollProgress]);

  // Calculate scroll-responsive parameters for previous section
  const prevScrollProps = useMemo(() => {
    const props: Record<string, any> = {};
    if (prevConfig.scrollParams && prevConfig.scrollParams.length > 0) {
      prevConfig.scrollParams.forEach((paramConfig) => {
        const value = interpolateScrollParam(scrollProgress, paramConfig);
        props[paramConfig.param] = value;
      });
    }
    return props;
  }, [prevConfig, scrollProgress]);

  // Build props for both effects
  const baseStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    transition: `opacity ${transitionDuration}ms ease-in-out`,
    ...style
  };

  const currentEffectProps = {
    ...currentConfig.staticProps,
    ...currentScrollProps,
    backgroundImage: currentConfig.backgroundImage,
    scrollProgress,
    isActive: true,
    style: {
      ...baseStyle,
      opacity: transitionProgress
    },
    className
  };

  const prevEffectProps = {
    ...prevConfig.staticProps,
    ...prevScrollProps,
    backgroundImage: prevConfig.backgroundImage,
    scrollProgress,
    isActive: transitionProgress < 1,
    style: {
      ...baseStyle,
      opacity: 1 - transitionProgress
    },
    className
  };

  const CurrentEffect = currentConfig.component;
  const PrevEffect = prevConfig.component;

  return (
    <>
      {/* Previous background (fading out) */}
      {transitionProgress < 1 && previousSection !== activeSection && (
        <PrevEffect {...prevEffectProps} />
      )}

      {/* Current background (fading in) */}
      <CurrentEffect {...currentEffectProps} />
    </>
  );
};

export default BackgroundController;
