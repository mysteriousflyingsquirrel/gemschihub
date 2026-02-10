/**
 * Generate all icon sizes from the transparent logo source.
 *
 * Usage:  node scripts/generate-icons.mjs
 *
 * Input:  src/assets/chnebel-logo_transparent.png
 * Output: public/favicon-16.png
 *         public/favicon-32.png
 *         public/apple-touch-icon-180.png   (with solid bg — iOS fills transparency with black)
 *         public/icon-192.png
 *         public/icon-512.png
 *         public/icon-maskable-512.png      (padded for Android safe-zone)
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'assets', 'chnebel-logo-transparent.png');
const OUT = path.join(ROOT, 'public');

// Brand background color for non-transparent contexts
const BG_COLOR = '#FBF7F3';

async function resize(outName, size) {
  await sharp(SRC)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(OUT, outName));
  console.log(`  ✔ ${outName}  (${size}x${size})`);
}

async function resizeWithBackground(outName, size, bgHex) {
  // Parse hex to rgb
  const r = parseInt(bgHex.slice(1, 3), 16);
  const g = parseInt(bgHex.slice(3, 5), 16);
  const b = parseInt(bgHex.slice(5, 7), 16);

  await sharp(SRC)
    .resize(size, size, { fit: 'contain', background: { r, g, b, alpha: 1 } })
    .flatten({ background: { r, g, b } })
    .png()
    .toFile(path.join(OUT, outName));
  console.log(`  ✔ ${outName}  (${size}x${size}, bg: ${bgHex})`);
}

async function resizeMaskable(outName, totalSize, bgHex) {
  // Android maskable icons: logo within center 80% (safe zone)
  const logoSize = Math.round(totalSize * 0.7);

  const r = parseInt(bgHex.slice(1, 3), 16);
  const g = parseInt(bgHex.slice(3, 5), 16);
  const b = parseInt(bgHex.slice(5, 7), 16);

  const resized = await sharp(SRC)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: totalSize,
      height: totalSize,
      channels: 4,
      background: { r, g, b, alpha: 255 },
    },
  })
    .composite([{ input: resized, gravity: 'centre' }])
    .png()
    .toFile(path.join(OUT, outName));

  console.log(`  ✔ ${outName}  (${totalSize}x${totalSize}, maskable, bg: ${bgHex})`);
}

async function main() {
  console.log('Generating icons from:', SRC);
  console.log('Output directory:', OUT);
  console.log('');

  // Transparent PNGs (favicon, PWA)
  await resize('favicon-16.png', 16);
  await resize('favicon-32.png', 32);
  await resize('icon-192.png', 192);
  await resize('icon-512.png', 512);

  // Apple touch icon — must have solid background (iOS renders transparency as black)
  await resizeWithBackground('apple-touch-icon-180.png', 180, BG_COLOR);

  // Maskable icon — padded for Android adaptive icons
  await resizeMaskable('icon-maskable-512.png', 512, BG_COLOR);

  console.log('\nDone! All icons generated.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
