const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  {
    input: 'public/assets/2b8b3b39-e23c-43e6-be7b-500fa586c81f_3840w.jpg',
    basename: 'hero',
    sizes: [400, 600, 800, 1200, 1920, 3840]
  },
  {
    input: 'public/assets/6db8c45a-2b6b-4fed-9347-da402489f38f_3840w.jpg',
    basename: 'features',
    sizes: [400, 600, 800, 1200, 1920]
  },
  {
    input: 'public/assets/eyesmall.jpg',
    basename: 'eye',
    sizes: [400, 600, 800]
  }
];

const outputDir = 'public/assets/optimized';

async function optimizeImages() {
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🖼️  Optimizing images for web performance...\n');

  for (const img of images) {
    console.log(`Processing ${img.basename}...`);

    for (const size of img.sizes) {
      const outputBase = path.join(outputDir, `${img.basename}-${size}`);

      try {
        // Generate WebP (excellent compression, 96%+ browser support)
        await sharp(img.input)
          .resize(size, null, { withoutEnlargement: true })
          .webp({ quality: 75, effort: 6 })
          .toFile(`${outputBase}.webp`);

        // Generate optimized JPEG (fallback for older browsers)
        // Create JPG for 1920px images and the largest size of each image set
        const isLargestSize = size === Math.max(...img.sizes);
        if (size === 1920 || isLargestSize) {
          await sharp(img.input)
            .resize(size, null, { withoutEnlargement: true })
            .jpeg({ quality: 70, progressive: true })
            .toFile(`${outputBase}.jpg`);
        }

        console.log(`  ✓ Generated ${img.basename}-${size} (WebP${(size === 1920 || isLargestSize) ? ', JPG' : ''})`);
      } catch (error) {
        console.error(`  ✗ Failed to process ${img.basename}-${size}:`, error.message);
      }
    }
  }

  console.log('\n✅ Image optimization complete!');
  console.log('📊 Summary:');
  console.log('   - WebP format for modern browsers (75% quality)');
  console.log('   - JPG fallback for older browsers (70% quality)');
  console.log('   - Responsive sizes: 400px, 600px, 800px, 1200px, 1920px, 3840px');
}

optimizeImages().catch(console.error);
