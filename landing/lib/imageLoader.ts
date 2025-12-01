interface ImageSource {
  srcSet: string;
  media?: string;
  type?: string;
}

interface OptimizedImage {
  sources: ImageSource[];
  fallback: string;
}

export const OPTIMIZED_IMAGES = {
  hero: {
    sources: [
      { srcSet: '/assets/optimized/hero-400.webp', media: '(max-width: 640px)', type: 'image/webp' },
      { srcSet: '/assets/optimized/hero-600.webp', media: '(max-width: 768px)', type: 'image/webp' },
      { srcSet: '/assets/optimized/hero-800.webp', media: '(max-width: 1024px)', type: 'image/webp' },
      { srcSet: '/assets/optimized/hero-1200.webp', media: '(max-width: 1536px)', type: 'image/webp' },
      { srcSet: '/assets/optimized/hero-1920.webp', media: '(max-width: 1920px)', type: 'image/webp' },
      { srcSet: '/assets/optimized/hero-3840.webp', media: '(min-width: 1921px)', type: 'image/webp' },
    ],
    fallback: '/assets/optimized/hero-1920.jpg',
  },
  features: {
    sources: [
      { srcSet: '/assets/optimized/features-400.webp', media: '(max-width: 640px)', type: 'image/webp' },
      { srcSet: '/assets/optimized/features-600.webp', media: '(max-width: 768px)', type: 'image/webp' },
      { srcSet: '/assets/optimized/features-800.webp', media: '(max-width: 1024px)', type: 'image/webp' },
      { srcSet: '/assets/optimized/features-1200.webp', media: '(max-width: 1536px)', type: 'image/webp' },
      { srcSet: '/assets/optimized/features-1920.webp', media: '(min-width: 1025px)', type: 'image/webp' },
    ],
    fallback: '/assets/optimized/features-1920.jpg',
  },
  eye: {
    sources: [
      { srcSet: '/assets/optimized/eye-400.webp', media: '(max-width: 640px)', type: 'image/webp' },
      { srcSet: '/assets/optimized/eye-600.webp', media: '(max-width: 768px)', type: 'image/webp' },
      { srcSet: '/assets/optimized/eye-800.webp', media: '(min-width: 769px)', type: 'image/webp' },
    ],
    fallback: '/assets/optimized/eye-800.jpg',
  },
} as const;

// Feature detection cache
let webpSupport: boolean | null = null;

async function checkWebPSupport(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const testImage = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';

  try {
    const img = new Image();
    img.src = testImage;
    await img.decode();
    return true;
  } catch {
    return false;
  }
}

export async function getOptimalImageSrc(imageKey: keyof typeof OPTIMIZED_IMAGES): Promise<string> {
  const image = OPTIMIZED_IMAGES[imageKey];

  // Defensive check
  if (!image) {
    console.error(`Image key "${imageKey}" not found in OPTIMIZED_IMAGES`);
    return '/assets/placeholder.jpg';
  }

  const width = typeof window !== 'undefined' ? window.innerWidth : 1920;

  // Check WebP support (cached)
  if (webpSupport === null) {
    webpSupport = await checkWebPSupport();
  }

  // If browser doesn't support WebP, use fallback immediately
  if (!webpSupport) {
    return image.fallback;
  }

  // Find matching source by media query
  for (const source of image.sources) {
    if (!source.media) continue;

    if (typeof window !== 'undefined' && window.matchMedia(source.media).matches) {
      return source.srcSet;
    }
  }

  // Fallback logic based on width (shouldn't normally reach here)
  if (width <= 640) {
    return image.sources.find(s => s.media?.includes('640'))?.srcSet || image.fallback;
  } else if (width <= 768) {
    return image.sources.find(s => s.media?.includes('768'))?.srcSet || image.fallback;
  } else if (width <= 1024) {
    return image.sources.find(s => s.media?.includes('1024'))?.srcSet || image.fallback;
  } else if (width <= 1536) {
    return image.sources.find(s => s.media?.includes('1536'))?.srcSet || image.fallback;
  }

  // Ultimate fallback
  return image.fallback;
}

export async function loadImageForWebGL(imageKey: keyof typeof OPTIMIZED_IMAGES): Promise<HTMLImageElement> {
  const src = await getOptimalImageSrc(imageKey);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
