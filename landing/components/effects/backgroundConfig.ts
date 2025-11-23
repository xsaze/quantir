import { ComponentType } from 'react';
import { MaskMagicEffect } from './MaskMagicEffect';
import { WaveEffect } from './WaveEffect';

/**
 * Configuration for scroll-responsive parameters
 * Maps scroll progress (0-1) to effect parameters
 */
export interface ScrollParamConfig {
  /** Parameter name to update */
  param: string;

  /** Starting value at scroll progress 0 */
  startValue: number;

  /** Ending value at scroll progress 1 */
  endValue: number;

  /** Easing function. Default: 'linear' */
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

/**
 * Configuration for a background effect
 */
export interface BackgroundEffectConfig {
  /** The React component to render */
  component: ComponentType<any>;

  /** Scroll-responsive parameter configurations */
  scrollParams?: ScrollParamConfig[];

  /** Static props to pass to the component */
  staticProps?: Record<string, any>;

  /** Background image path (if applicable) */
  backgroundImage?: string;
}

/**
 * Mapping of section IDs to their background effects
 *
 * Add your custom effects here once you import them.
 * Example:
 *
 * import { MyCustomEffect } from './MyCustomEffect';
 *
 * export const backgroundConfig: Record<string, BackgroundEffectConfig> = {
 *   hero: {
 *     component: MaskMagicEffect,
 *     scrollParams: [
 *       { param: 'maskSize', startValue: 0.3, endValue: 0.7, easing: 'easeInOut' }
 *     ]
 *   },
 *   features: {
 *     component: MyCustomEffect,
 *     scrollParams: [
 *       { param: 'intensity', startValue: 0, endValue: 1 }
 *     ],
 *     backgroundImage: '/assets/my-background.jpg'
 *   }
 * };
 */
export const backgroundConfig: Record<string, BackgroundEffectConfig> = {
  // Default: Use MaskMagicEffect for all sections initially
  // You can customize this per section after importing your effect components
  hero: {
    component: MaskMagicEffect,
    backgroundImage: '/assets/2b8b3b39-e23c-43e6-be7b-500fa586c81f_3840w.jpg',
    scrollParams: [
      // Example: Modify these parameters based on scroll
      // { param: 'maskSize', startValue: 0.3, endValue: 0.7, easing: 'easeInOut' },
      // { param: 'pixelSize', startValue: 30, endValue: 70, easing: 'linear' }
    ]
  },

  problem: {
    component: MaskMagicEffect,
    backgroundImage: '/assets/2b8b3b39-e23c-43e6-be7b-500fa586c81f_3840w.jpg'
  },

  features: {
    component: WaveEffect,
    backgroundImage: '/assets/6db8c45a-2b6b-4fed-9347-da402489f38f_3840w.jpg',
    scrollParams: [
      // Wave effect gets more intense as you scroll through features
      { param: 'amplitude', startValue: 0.01, endValue: 0.05, easing: 'easeInOut' },
      { param: 'speed', startValue: 0.5, endValue: 2.0, easing: 'easeIn' }
    ]
  },

  'how-it-works': {
    component: MaskMagicEffect,
    backgroundImage: '/assets/2b8b3b39-e23c-43e6-be7b-500fa586c81f_3840w.jpg'
  },

  pricing: {
    component: MaskMagicEffect,
    backgroundImage: '/assets/2b8b3b39-e23c-43e6-be7b-500fa586c81f_3840w.jpg'
  },

  waitlist: {
    component: MaskMagicEffect,
    backgroundImage: '/assets/2b8b3b39-e23c-43e6-be7b-500fa586c81f_3840w.jpg'
  }
};

/**
 * Default/fallback background effect
 */
export const defaultBackgroundConfig: BackgroundEffectConfig = {
  component: MaskMagicEffect,
  backgroundImage: '/assets/2b8b3b39-e23c-43e6-be7b-500fa586c81f_3840w.jpg'
};

/**
 * Easing functions for scroll parameter interpolation
 */
export const easingFunctions = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
};

/**
 * Calculate interpolated value based on scroll progress and easing
 */
export function interpolateScrollParam(
  scrollProgress: number,
  config: ScrollParamConfig
): number {
  const { startValue, endValue, easing = 'linear' } = config;
  const easingFn = easingFunctions[easing];
  const t = easingFn(scrollProgress);
  return startValue + (endValue - startValue) * t;
}
