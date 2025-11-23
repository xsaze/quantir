'use client';

import { useEffect, useState } from 'react';
import { ScrollProvider } from './ScrollContext';
import { ScrollingBackground } from './ScrollingBackground';
import { MaskMagicEffect } from './MaskMagicEffect';
import { WaveEffect } from './WaveEffect';

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
      imagePath: '/assets/2b8b3b39-e23c-43e6-be7b-500fa586c81f_3840w.jpg',
      effectComponent: MaskMagicEffect,
      effectProps: {}
    },
    {
      sectionId: 'problem',
      imagePath: '/assets/6db8c45a-2b6b-4fed-9347-da402489f38f_3840w.jpg',
      effectComponent: WaveEffect,
      effectProps: {},
      scrollParams: [
        { param: 'frequencyX', startValue: 19, endValue: 44, easing: 'easeInOutCubic' },
        { param: 'frequencyY', startValue: 7, endValue: 44, easing: 'easeInOutCubic' },
        { param: 'amplitude', startValue: 0.1, endValue: 0.1, easing: 'linear' },
        { param: 'speed', startValue: 0.8, endValue: 3.8, easing: 'easeOutCubic' }
      ]
    },
    {
      sectionId: 'features',
      imagePath: '/assets/6db8c45a-2b6b-4fed-9347-da402489f38f_3840w.jpg',
      effectComponent: WaveEffect,
      effectProps: {},
      scrollParams: [
        { param: 'frequencyX', startValue: 44, endValue: 19, easing: 'easeInOutCubic' },
        { param: 'frequencyY', startValue: 44, endValue: 7, easing: 'easeInOutCubic' },
        { param: 'amplitude', startValue: 0.1, endValue: 0.1, easing: 'linear' },
        { param: 'speed', startValue: 3.8, endValue: 0.8, easing: 'easeInCubic' }
      ],
      flipHorizontal: true
    },
    {
      sectionId: 'how-it-works',
      imagePath: '/assets/2b8b3b39-e23c-43e6-be7b-500fa586c81f_3840w.jpg',
      effectComponent: undefined,
      effectProps: {}
    },
    {
      sectionId: 'pricing',
      imagePath: '/assets/2b8b3b39-e23c-43e6-be7b-500fa586c81f_3840w.jpg',
      effectComponent: undefined,
      effectProps: {}
    },
    {
      sectionId: 'waitlist',
      imagePath: '/assets/2b8b3b39-e23c-43e6-be7b-500fa586c81f_3840w.jpg',
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
