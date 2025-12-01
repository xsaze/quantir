'use client';

import { useEffect, useState } from 'react';
import { ScrollProvider } from './ScrollContext';
import { ScrollingBackground } from './ScrollingBackground';
import { MaskMagicEffect } from './MaskMagicEffect';
import { WaveEffect } from './WaveEffect';
import type { EasingFunction } from './ScrollingBackground';

/**
 * Client-only wrapper for scrolling background with ScrollProvider
 * Handles SSR safety and ensures proper hydration
 */
export function ClientOnlyBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Define background sections that match your page sections
  const backgroundSections = [
    {
      sectionId: 'hero',
      imagePath: '/assets/optimized/hero-1920.webp',
      effectComponent: MaskMagicEffect,
      effectProps: {}
    },
    {
      sectionId: 'problem',
      imagePath: '',
      effectComponent: undefined,
      effectProps: {
      }
    },
    {
      sectionId: 'features',
      imagePath: '/assets/optimized/features-1920.webp',
      effectComponent: WaveEffect,
      effectProps: {
        frequencyX: 46,
        frequencyY: 50,
        amplitude: 0.1,
        speed: 0.4
      },
      flipHorizontal: true
    },
    {
      sectionId: 'how-it-works',
      imagePath: '/assets/optimized/hero-1920.webp',
      effectComponent: undefined,
      effectProps: {}
    },
    {
      sectionId: 'pricing',
      imagePath: '/assets/optimized/hero-1920.webp',
      effectComponent: undefined,
      effectProps: {}
    }
  ];

  return (
    <ScrollProvider threshold={0.4} rootMargin="0px">
      <ScrollingBackground
        sections={backgroundSections}
        parallaxSpeed={1}
      />
    </ScrollProvider>
  );
}
