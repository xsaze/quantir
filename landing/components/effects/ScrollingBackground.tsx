'use client';

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useScrollContext } from './ScrollContext';

export type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic';

export interface ScrollParamConfig {
  param: string;
  startValue: number;
  endValue: number;
  easing?: EasingFunction;
}

// Easing functions for smooth animations
const easingFunctions: Record<EasingFunction, (t: number) => number> = {
  linear: (t) => t,
  easeIn: (t) => t * t,
  easeOut: (t) => t * (2 - t),
  easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => (--t) * t * t + 1,
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
};

interface BackgroundSection {
  /** Section ID that this background corresponds to */
  sectionId: string;
  /** Background image path */
  imagePath: string;
  /** Optional: Apply an effect component over this section */
  effectComponent?: React.ComponentType<any>;
  /** Optional: Effect-specific props */
  effectProps?: Record<string, any>;
  /** Optional: Mobile-specific effect props */
  mobileEffectProps?: Record<string, any>;
  /** Optional: Flip background horizontally */
  flipHorizontal?: boolean;
  /** Optional: Scroll-responsive parameters */
  scrollParams?: ScrollParamConfig[];
}

interface ScrollingBackgroundProps {
  /** Array of background sections in order */
  sections: BackgroundSection[];
  /** Parallax speed multiplier (0.5 = half speed, 1 = normal) */
  parallaxSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ScrollingBackground - A single long background that scrolls with the page
 *
 * Creates a vertically scrolling background where each section has its own image
 * that appears as you scroll through that section.
 */
export const ScrollingBackground: React.FC<ScrollingBackgroundProps> = ({
  sections,
  parallaxSpeed = 1,
  className = '',
  style = {}
}) => {
  const { scrollY, activeSection } = useScrollContext();
  const [sectionPositions, setSectionPositions] = useState<Array<{ top: number; height: number }>>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate background position based on scroll
  // Parallax disabled - background scrolls with content (no movement)
  const backgroundPositionY = -(scrollY * 1);

  // Measure real section positions and heights
  useLayoutEffect(() => {
    const measureSections = () => {
      const positions = sections.map(section => {
        const element = document.getElementById(section.sectionId);
        if (element) {
          return {
            top: element.offsetTop,
            height: element.offsetHeight
          };
        }
        return { top: 0, height: window.innerHeight };
      });
      setSectionPositions(positions);
    };

    // Measure on mount and after a short delay to ensure DOM is ready
    measureSections();
    const timeoutId = setTimeout(measureSections, 100);

    // Remeasure on window resize
    window.addEventListener('resize', measureSections);

    // Use ResizeObserver to track section size changes
    const observer = new ResizeObserver(measureSections);
    sections.forEach(section => {
      const element = document.getElementById(section.sectionId);
      if (element) observer.observe(element);
    });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', measureSections);
      observer.disconnect();
    };
  }, [sections]);

  // Calculate scroll progress for a specific section
  const getSectionScrollProgress = (sectionId: string): number => {
    // Get the section element
    const sectionElement = document.getElementById(sectionId);
    if (!sectionElement) return 0;

    const rect = sectionElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate how far the section has scrolled into view
    // When section top is at bottom of viewport: progress = 0
    // When section bottom is at top of viewport: progress = 1
    const sectionTop = rect.top;
    const sectionHeight = rect.height;

    // Calculate progress based on viewport position
    // Start counting when section enters viewport (bottom)
    // Finish when section exits viewport (top)
    const totalScrollDistance = viewportHeight + sectionHeight;
    const currentScrollPosition = viewportHeight - sectionTop;
    const progress = currentScrollPosition / totalScrollDistance;

    return Math.max(0, Math.min(1, progress));
  };

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 0,
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Scrolling background container */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${sections.length * 100}vh`,
          transform: `translate3d(0, ${backgroundPositionY}px, 0)`,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
      >
        {sections.map((section, index) => {
          const EffectComponent = section.effectComponent;
          const sectionScrollProgress = getSectionScrollProgress(section.sectionId);
          const position = sectionPositions[index] || { top: index * window.innerHeight, height: window.innerHeight };

          // Calculate scroll-responsive props with easing
          const scrollResponsiveProps: Record<string, number> = {};
          if (section.scrollParams) {
            section.scrollParams.forEach((paramConfig) => {
              const { param, startValue, endValue, easing = 'easeInOut' } = paramConfig;
              const easingFn = easingFunctions[easing];
              const easedProgress = easingFn(sectionScrollProgress);
              const value = startValue + (endValue - startValue) * easedProgress;
              scrollResponsiveProps[param] = value;
            });
          }

          // Calculate transform based on section and mobile state
          const getMobileRotation = () => 135; // Change this value to rotate (in degrees)

          const getTransform = () => {
            if (section.sectionId === 'features' && isMobile) {
              return `rotate(${getMobileRotation()}deg)`;
            }
            if (section.sectionId !== 'features' && section.flipHorizontal) {
              return 'scaleX(-1)';
            }
            return 'none';
          };

          // Calculate dimensions based on section and mobile state
          const getDimensions = () => {
            if (section.sectionId === 'features' && isMobile) {
              // Calculate the size needed for a rotated square to cover the viewport
              const diagonal = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(position.height, 2));
              return {
                width: `${diagonal}px`,
                height: `${diagonal}px`
              };
            }
            return {
              width: '100%',
              height: `${position.height}px`
            };
          };

          const dimensions = getDimensions();

          return (
            <div
              key={section.sectionId}
              style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: section.sectionId === 'features' && isMobile ? '50%' : 0,
                width: dimensions.width,
                height: dimensions.height,
                // Only show CSS background if there's NO effect component
                backgroundImage: !EffectComponent ? `url(${section.imagePath})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transform: section.sectionId === 'features' && isMobile
                  ? `translateX(-50%) rotate(${getMobileRotation()}deg)`
                  : getTransform()
              }}
            >
              {/* Effect component (renders background itself via WebGL) */}
              {EffectComponent && (
                <EffectComponent
                  {...section.effectProps}
                  {...(isMobile && section.mobileEffectProps ? section.mobileEffectProps : {})}
                  {...scrollResponsiveProps}
                  backgroundImage={section.imagePath}
                  scrollProgress={sectionScrollProgress}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollingBackground;
