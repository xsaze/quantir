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
      { srcSet: '/assets/optimized/hero-400.avif', media: '(max-width: 640px)', type: 'image/avif' },
      { srcSet: '/assets/optimized/hero-800.avif', media: '(max-width: 1024px)', type: 'image/avif' },
      { srcSet: '/assets/optimized/hero-1920.avif', media: '(max-width: 1920px)', type: 'image/avif' },
      { srcSet: '/assets/optimized/hero-3840.avif', media: '(min-width: 1921px)', type: 'image/avif' },
      { srcSet: '/assets/optimized/hero-800.webp', media: '(max-width: 1024px)', type: 'image/webp' },
      { srcSet: '/assets/optimized/hero-1920.webp', media: '(min-width: 1025px)', type: 'image/webp' },
    ],
    fallback: '/assets/optimized/hero-1920.jpg',
  },
  features: {
    sources: [
      { srcSet: '/assets/optimized/features-400.avif', media: '(max-width: 640px)', type: 'image/avif' },
      { srcSet: '/assets/optimized/features-800.avif', media: '(max-width: 1024px)', type: 'image/avif' },
      { srcSet: '/assets/optimized/features-1920.avif', media: '(min-width: 1025px)', type: 'image/avif' },
      { srcSet: '/assets/optimized/features-800.webp', media: '(max-width: 1024px)', type: 'image/webp' },
      { srcSet: '/assets/optimized/features-1920.webp', media: '(min-width: 1025px)', type: 'image/webp' },
    ],
    fallback: '/assets/optimized/features-1920.jpg',
  },
  eye: {
    sources: [
      { srcSet: '/assets/optimized/eye-400.avif', media: '(max-width: 640px)', type: 'image/avif' },
      { srcSet: '/assets/optimized/eye-800.avif', media: '(min-width: 641px)', type: 'image/avif' },
      { srcSet: '/assets/optimized/eye-800.webp', type: 'image/webp' },
    ],
    fallback: '/assets/optimized/eye-800.jpg',
  },
} as const;

// Feature detection cache
let avifSupport: boolean | null = null;
let webpSupport: boolean | null = null;

async function checkFormatSupport(format: 'avif' | 'webp'): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const testImages = {
    avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=',
    webp: 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=',
  };

  try {
    const img = new Image();
    img.src = testImages[format];
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
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  // Check format support (cached)
  if (avifSupport === null) {
    avifSupport = await checkFormatSupport('avif');
  }
  if (webpSupport === null) {
    webpSupport = await checkFormatSupport('webp');
  }

  // Filter sources by format support
  const supportedSources = image.sources.filter(source => {
    if (source.type === 'image/avif') return avifSupport;
    if (source.type === 'image/webp') return webpSupport;
    return true;
  });

  // Find matching source by media query
  for (const source of supportedSources) {
    if (!source.media) continue;

    if (typeof window !== 'undefined' && window.matchMedia(source.media).matches) {
      return source.srcSet;
    }
  }

  // Fallback logic based on width
  if (width <= 640 && supportedSources.find(s => s.media?.includes('640'))) {
    return supportedSources.find(s => s.media?.includes('640'))!.srcSet;
  } else if (width <= 1024 && supportedSources.find(s => s.media?.includes('1024'))) {
    return supportedSources.find(s => s.media?.includes('1024'))!.srcSet;
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
