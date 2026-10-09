// Derives the header mark and the tight lockup from the supplied logo (src/assets/brand/igds-logo.jpeg, 1254 px square).
// Run: node scripts/assets/brand.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const source = path.join(root, 'src/assets/brand/igds-logo.jpeg');

const crops = {
  // The IG monogram with its circuit traces and swoosh.
  'igds-mark.png': { left: 110, top: 200, width: 1060, height: 590 },
  // Monogram, name and tagline, with the white margin trimmed.
  'igds-lockup.png': { left: 14, top: 200, width: 1226, height: 840 },
};

for (const [name, region] of Object.entries(crops)) {
  const info = await sharp(source).extract(region).png({ compressionLevel: 9 }).toFile(path.join(root, 'src/assets/brand', name));
  console.log(name, `${info.width}x${info.height}`, `${(info.size / 1024).toFixed(0)} KB`);
}
