// Builds favicons and the social card from the supplied logo.
// Run: node scripts/assets/icons.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const pub = path.join(root, 'public');
const mark = path.join(root, 'src/assets/brand/igds-mark.png');
const lockup = path.join(root, 'src/assets/brand/igds-lockup.png');
fs.mkdirSync(pub, { recursive: true });

async function icon(size, file, inset = 0.14) {
  const inner = Math.round(size * (1 - inset * 2));
  const markPng = await sharp(mark).resize({ width: inner, height: inner, fit: 'inside' }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
    .composite([{ input: markPng, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(pub, file));
}

await icon(32, 'favicon-32.png', 0.04);
await icon(180, 'apple-touch-icon.png', 0.1);
await icon(512, 'favicon-512.png', 0.1);

// Social card: a board with the lockup on its white label, traces running to a gold pad. No text, so it never goes stale.
const W = 1200;
const H = 630;
const label = await sharp(lockup).resize({ width: 470 }).png().toBuffer();
const labelMeta = await sharp(label).metadata();
const lx = 96;
const ly = Math.round((H - (labelMeta.height ?? 320)) / 2);

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0f3b2a"/>
  <g fill="none" stroke="#4aa883" stroke-width="5" stroke-linejoin="miter">
    <path d="M${lx + 470 + 40} ${H / 2 - 70} H760 L820 ${H / 2 - 130} H1120"/>
    <path d="M${lx + 470 + 40} ${H / 2} H1010"/>
    <path d="M${lx + 470 + 40} ${H / 2 + 70} H760 L820 ${H / 2 + 130} H1120"/>
  </g>
  <g fill="#0f3b2a" stroke="#d4aa4f" stroke-width="5">
    <circle cx="1120" cy="${H / 2 - 130}" r="11"/>
    <circle cx="1120" cy="${H / 2 + 130}" r="11"/>
  </g>
  <polygon points="1010,${H / 2 - 30} 1120,${H / 2 - 30} 1136,${H / 2 - 14} 1136,${H / 2 + 14} 1120,${H / 2 + 30} 1010,${H / 2 + 30} 994,${H / 2 + 14} 994,${H / 2 - 14}" fill="#d4aa4f"/>
  <g fill="#071d14" stroke="#a9832f" stroke-width="5">
    <circle cx="44" cy="44" r="14"/><circle cx="${W - 44}" cy="44" r="14"/>
    <circle cx="44" cy="${H - 44}" r="14"/><circle cx="${W - 44}" cy="${H - 44}" r="14"/>
  </g>
  <rect x="${lx - 28}" y="${ly - 28}" width="526" height="${(labelMeta.height ?? 320) + 56}" fill="#ffffff"/>
</svg>`;

await sharp(Buffer.from(svg))
  .composite([{ input: label, left: lx, top: ly }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(pub, 'og.png'));

for (const f of ['favicon-32.png', 'apple-touch-icon.png', 'favicon-512.png', 'og.png']) {
  console.log(f.padEnd(22), `${(fs.statSync(path.join(pub, f)).size / 1024).toFixed(0)} KB`);
}
