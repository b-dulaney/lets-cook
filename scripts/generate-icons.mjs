import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const iconsDir = join(publicDir, 'icons');

// Ensure icons directory exists
mkdirSync(iconsDir, { recursive: true });

// Read the SVG file
const svgBuffer = readFileSync(join(iconsDir, 'icon.svg'));

// Generate regular icons
const sizes = [192, 512];
for (const size of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(iconsDir, `icon-${size}.png`));
  console.log(`Generated icon-${size}.png`);
}

// Generate maskable icons (with padding for safe zone)
// Maskable icons need ~10% padding on each side for the safe zone
for (const size of sizes) {
  const innerSize = Math.round(size * 0.8); // 80% of size for the icon
  const padding = Math.round(size * 0.1); // 10% padding on each side

  await sharp(svgBuffer)
    .resize(innerSize, innerSize)
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 5, g: 150, b: 105, alpha: 1 } // #059669
    })
    .png()
    .toFile(join(iconsDir, `icon-maskable-${size}.png`));
  console.log(`Generated icon-maskable-${size}.png`);
}

// Generate Apple touch icon (180x180)
await sharp(svgBuffer)
  .resize(180, 180)
  .png()
  .toFile(join(iconsDir, 'apple-touch-icon.png'));
console.log('Generated apple-touch-icon.png');

// Generate favicon (32x32)
await sharp(svgBuffer)
  .resize(32, 32)
  .png()
  .toFile(join(publicDir, 'favicon.png'));
console.log('Generated favicon.png');

// Generate favicon.ico (using 32x32 and 16x16)
await sharp(svgBuffer)
  .resize(32, 32)
  .toFile(join(publicDir, 'favicon.ico'));
console.log('Generated favicon.ico');

console.log('\nAll icons generated successfully!');
