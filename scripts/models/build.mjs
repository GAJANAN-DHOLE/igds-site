// Generates the representative 3D stand-in models into public/models and their
// hotspot anchors into src/data/models.json. Real CAD exports replace the GLBs;
// see the "3D models" section of README.md.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportModel, resetMaterials } from './lib.mjs';
import { wallStarter, singlePhaseStarter } from './starters.mjs';
import { mssPro, airCoolerController } from './industrial.mjs';
import { industrialPc, carrierBoard } from './compute.mjs';
import { mriDetector, mammography } from './medical.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = path.join(root, 'public/models');
const dataFile = path.join(root, 'src/data/models.json');

const builders = {
  'mss-starter': () => wallStarter('mss-starter', { title: 'DIGITAL STARTER', titleFont: 'serif', digits: '4.1.5.0', bottom: 'terminals', sticker: true }),
  'gsm-starter': () => wallStarter('gsm-starter', { title: 'MOTOR SAFE SHIELD', titleFont: 'sans', digits: ' 415', bottom: 'terminals', antenna: 'whip', gsmIcons: true, vents: true, manualAuto: true }),
  'cyclic-timer': () => wallStarter('cyclic-timer', { title: 'MOTOR SAFE SHIELD', titleFont: 'sans', digits: '01.30', bottom: 'terminals', gsmIcons: true, manualAuto: true }),
  agriauto: () => wallStarter('agriauto', { title: 'DIGITAL STARTER', titleFont: 'serif', digits: '12.5', bottom: 'glands', antenna: 'stub' }),
  'single-phase-starter': () => singlePhaseStarter('single-phase-starter'),
  'mss-pro': () => mssPro('mss-pro'),
  'air-cooler-controller': () => airCoolerController('air-cooler-controller'),
  i2hd: () => industrialPc('i2hd'),
  'carrier-board': () => carrierBoard('carrier-board'),
  'mri-detector': () => mriDetector('mri-detector'),
  mammography: () => mammography('mammography'),
};

const only = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const manifest = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, 'utf8')) : {};

for (const [id, build] of Object.entries(builders)) {
  if (only.length && !only.includes(id)) continue;
  resetMaterials();
  const model = build();
  const bytes = await exportModel(model, path.join(outDir, `${id}.glb`));
  manifest[id] = { src: `/models/${id}.glb`, representative: true, ...model.info };
  console.log(`${id.padEnd(24)} ${(bytes / 1024).toFixed(0).padStart(5)} KB  size ${model.info.size.join(' x ')} m`);
}

fs.writeFileSync(dataFile, `${JSON.stringify(manifest, null, 2)}\n`);
