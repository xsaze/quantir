'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface ScrollContextValue {
  /** Currently active section ID (e.g., 'hero', 'features') */
  activeSection: string | null;

  /** Scroll progress within the active section (0-1) */
  scrollProgress: number;

  /** Current scroll Y position */
  scrollY: number;

  /** Whether the page has been scrolled past initial position */
  hasScrolled: boolean;
}

const ScrollContext = createContext<ScrollContextValue | undefined>(undefined);

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollContext must be used within ScrollProvider');
  }
  return context;
};

interface ScrollProviderProps {
  children: React.ReactNode;
  /** Intersection Observer threshold (0-1). Default: 0.4 */
  threshold?: number;
  /** Root margin for Intersection Observer. Default: '0px' */
  rootMargin?: string;
}

export const ScrollProvider: React.FC<ScrollProviderProps> = ({
  children,
  threshold = 0.4,
  rootMargin = '0px'
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const activeSectionRef = useRef<HTMLElement | null>(null);
  const sectionMeasurementsRef = useRef<{ top: number; height: number } | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Cache section measurements when active section changes
    if (activeSectionRef.current) {
      sectionMeasurementsRef.current = {
        top: activeSectionRef.current.offsetTop,
        height: activeSectionRef.current.offsetHeight
      };
    }
  }, [activeSection]);

  useEffect(() => {
    // Track scroll position with requestAnimationFrame throttling
    const handleScroll = () => {
      lastScrollY.current = window.scrollY;

      // Cancel any pending frame
      if (rafIdRef.current !== null) {
        return;
      }

      // Schedule update for next frame
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const currentScrollY = lastScrollY.current;

        setScrollY(currentScrollY);
        setHasScrolled(currentScrollY > 50);

        // Calculate scroll progress within active section using cached measurements
        if (sectionMeasurementsRef.current) {
          const { top: sectionTop, height: sectionHeight } = sectionMeasurementsRef.current;
          const sectionBottom = sectionTop + sectionHeight;

          if (currentScrollY >= sectionTop && currentScrollY <= sectionBottom) {
            const progress = (currentScrollY - sectionTop) / sectionHeight;
            setScrollProgress(Math.max(0, Math.min(1, progress)));
          }
        }
      });
    };

    // Set up Intersection Observer for section detection
    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Find the most visible section
      let maxRatio = 0;
      let mostVisibleEntry: IntersectionObserverEntry | undefined;

      entries.forEach((entry) => {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisibleEntry = entry;
        }
      });

      if (mostVisibleEntry?.isIntersecting) {
        const sectionId = mostVisibleEntry.target.id;
        setActiveSection(sectionId);
        activeSectionRef.current = mostVisibleEntry.target as HTMLElement;
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin
    });

    // Observe all sections with IDs
    const sections = document.querySelectorAll('section[id], div[id^="hero"], div[id^="problem"], div[id^="features"], div[id^="how-it-works"], div[id^="pricing"], div[id^="waitlist"]');
    sections.forEach((section) => {
      if (section.id) {
        observer.observe(section);
      }
    });

    // Initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const value: ScrollContextValue = {
    activeSection,
    scrollProgress,
    scrollY,
    hasScrolled
  };

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
};
