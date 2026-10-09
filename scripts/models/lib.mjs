import fs from 'node:fs';
import { createRequire } from 'node:module';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

export { THREE };

// GLTFExporter reads its binary chunks through FileReader, which Node lacks.
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    result = null;
    onloadend = null;
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = buffer;
        this.onloadend?.();
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = `data:${blob.type || 'application/octet-stream'};base64,${Buffer.from(buffer).toString('base64')}`;
        this.onloadend?.();
      });
    }
  };
}

const require = createRequire(import.meta.url);
const fontLoader = new FontLoader();
const loadFont = (file) =>
  fontLoader.parse(JSON.parse(fs.readFileSync(require.resolve(`three/examples/fonts/${file}`), 'utf8')));

export const fonts = {
  sans: loadFont('helvetiker_bold.typeface.json'),
  sansLight: loadFont('helvetiker_regular.typeface.json'),
  serif: loadFont('gentilis_bold.typeface.json'),
};

/* ------------------------------------------------------------------ */
/* Materials                                                           */
/* ------------------------------------------------------------------ */

const materialCache = new Map();

export function material(name, params) {
  if (!materialCache.has(name)) {
    materialCache.set(name, new THREE.MeshStandardMaterial({ name, ...params }));
  }
  return materialCache.get(name);
}

export function resetMaterials() {
  materialCache.clear();
}

export const mat = {
  whitePlastic: () => material('plastic-white', { color: 0xecebe6, roughness: 0.42 }),
  greyPlastic: () => material('plastic-grey', { color: 0xb9bcba, roughness: 0.5 }),
  blackPlastic: () => material('plastic-black', { color: 0x1c1d1f, roughness: 0.55 }),
  darkPlastic: () => material('plastic-dark', { color: 0x2c2f33, roughness: 0.5 }),
  membrane: () => material('membrane-grey', { color: 0xc9ccca, roughness: 0.36 }),
  membraneWhite: () => material('membrane-white', { color: 0xf3f4f2, roughness: 0.32 }),
  cream: () => material('panel-cream', { color: 0xeee5c4, roughness: 0.4 }),
  ink: () => material('print-ink', { color: 0x15171a, roughness: 0.6 }),
  inkRed: () => material('print-red', { color: 0xb3261e, roughness: 0.6 }),
  inkWhite: () => material('print-white', { color: 0xf6f6f2, roughness: 0.6 }),
  inkGreen: () => material('print-green', { color: 0x2c7a3a, roughness: 0.6 }),
  blueKey: () => material('key-blue', { color: 0x1f5fa8, roughness: 0.38 }),
  blueDeep: () => material('panel-blue-deep', { color: 0x15407a, roughness: 0.4 }),
  blueLight: () => material('panel-blue-light', { color: 0x4e9be0, roughness: 0.4 }),
  tealKey: () => material('key-teal', { color: 0x1f5a55, roughness: 0.4 }),
  red: () => material('switch-red', { color: 0xc8201e, roughness: 0.32 }),
  green: () => material('switch-green', { color: 0x1d8a3f, roughness: 0.32 }),
  greenGlow: () => material('button-green-lit', { color: 0x25a64a, emissive: 0x1bd45a, emissiveIntensity: 0.9, roughness: 0.2, transparent: true, opacity: 0.92 }),
  aluminium: () => material('aluminium', { color: 0xa9adb1, metalness: 1, roughness: 0.34 }),
  anodised: () => material('anodised-black', { color: 0x24272b, metalness: 0.75, roughness: 0.42 }),
  steel: () => material('steel', { color: 0xc4c7ca, metalness: 1, roughness: 0.26 }),
  brushed: () => material('stainless', { color: 0xb8bcc0, metalness: 1, roughness: 0.4 }),
  gold: () => material('enig-gold', { color: 0xd6b25a, metalness: 1, roughness: 0.28 }),
  copper: () => material('copper', { color: 0xc77b4a, metalness: 1, roughness: 0.32 }),
  pcbGreen: () => material('pcb-green', { color: 0x175f36, roughness: 0.42 }),
  pcbDark: () => material('pcb-dark', { color: 0x0f3d25, roughness: 0.45 }),
  silk: () => material('silkscreen', { color: 0xf1efe6, roughness: 0.7 }),
  chip: () => material('ic-black', { color: 0x161719, roughness: 0.48 }),
  passive: () => material('passive-tan', { color: 0x8c6f4e, roughness: 0.5 }),
  capacitor: () => material('cap-blue', { color: 0x1d3f7a, roughness: 0.35 }),
  capTop: () => material('cap-top', { color: 0xbfc3c7, metalness: 0.8, roughness: 0.35 }),
  relay: () => material('relay-blue', { color: 0x2453a3, roughness: 0.45 }),
  transformer: () => material('transformer-yellow', { color: 0xd9b84a, roughness: 0.55 }),
  connectorBeige: () => material('connector-beige', { color: 0xe7dcc0, roughness: 0.5 }),
  usbBlue: () => material('usb3-blue', { color: 0x1d5fd1, roughness: 0.4 }),
  rubber: () => material('rubber', { color: 0x141414, roughness: 0.85 }),
  displayGlass: () => material('display-glass', { color: 0x1a0505, roughness: 0.08, metalness: 0.1 }),
  screenGlass: () => material('screen-glass', { color: 0x07090b, roughness: 0.1, metalness: 0.2 }),
  segOn: () => material('seg-on', { color: 0xff3b22, emissive: 0xff2a12, emissiveIntensity: 3.2, roughness: 0.4 }),
  segOff: () => material('seg-off', { color: 0x3a0d09, roughness: 0.5 }),
  lcd: () => material('lcd-backlight', { color: 0xb8d26a, emissive: 0x9fc24a, emissiveIntensity: 0.85, roughness: 0.3 }),
  lcdInk: () => material('lcd-ink', { color: 0x1e2a12, roughness: 0.5 }),
  acrylic: () => material('acrylic', { color: 0xbfe0ef, roughness: 0.05, transparent: true, opacity: 0.32 }),
  wall: () => material('wall', { color: 0x7f8c86, roughness: 0.9 }),
  floor: () => material('floor', { color: 0x59655f, roughness: 0.85 }),
  safetyYellow: () => material('safety-yellow', { color: 0xf2c230, roughness: 0.6 }),
  medicalWhite: () => material('medical-white', { color: 0xf1f2f0, roughness: 0.35 }),
  medicalGrey: () => material('medical-grey', { color: 0x9ea4a8, roughness: 0.45 }),
  sticker: () => material('sticker-green', { color: 0x3fb04a, roughness: 0.45 }),
};

export function ledMaterial(color, lit) {
  const hex = { green: 0x22e05a, red: 0xff2a1a, yellow: 0xffc21a, amber: 0xff9a1a, blue: 0x3a8bff }[color];
  if (lit) {
    return material(`led-${color}-lit`, { color: hex, emissive: hex, emissiveIntensity: 3, roughness: 0.25 });
  }
  const dim = new THREE.Color(hex).multiplyScalar(0.28);
  return material(`led-${color}-dim`, { color: dim, roughness: 0.3 });
}

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

export function place(object, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  object.position.set(x, y, z);
  object.rotation.set(rx, ry, rz);
  return object;
}

export function box(w, h, d, material, radius = 0) {
  const r = Math.min(radius, w / 2 - 1e-5, h / 2 - 1e-5, d / 2 - 1e-5);
  const large = Math.min(w, h, d) > 0.02;
  const geometry = r > 0.0006 ? new RoundedBoxGeometry(w, h, d, large ? 3 : 2, r) : new THREE.BoxGeometry(w, h, d);
  return new THREE.Mesh(geometry, material);
}

/** Cylinder whose axis points along +Z (out of a front face). */
export function disc(radius, depth, material, segments = 28) {
  const geometry = new THREE.CylinderGeometry(radius, radius, depth, segments);
  geometry.rotateX(Math.PI / 2);
  return new THREE.Mesh(geometry, material);
}

/** Cylinder whose axis points along +Y. */
export function post(radiusTop, radiusBottom, height, material, segments = 28) {
  return new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
}

export function ring(radius, tube, material, radial = 8, tubular = 28) {
  return new THREE.Mesh(new THREE.TorusGeometry(radius, tube, radial, tubular), material);
}

export function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** Flat plate in the XY plane (front faces +Z), optional round holes. */
export function plate(w, h, thickness, material, { radius = 0.002, holes = [] } = {}) {
  const shape = roundedRectShape(w, h, radius);
  for (const [hx, hy, hr] of holes) {
    const hole = new THREE.Path();
    hole.absarc(hx, hy, hr, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: 10 });
  geometry.translate(0, 0, -thickness / 2);
  return new THREE.Mesh(geometry, material);
}

/** Printed legend, flat in the XY plane facing +Z. */
export function label(str, size, material, { font = fonts.sans, align = 'center', valign = 'middle', curve = size < 0.0045 ? 2 : 3 } = {}) {
  const geometry = new THREE.ShapeGeometry(font.generateShapes(str, size), curve);
  geometry.computeBoundingBox();
  const bb = geometry.boundingBox;
  const dx = align === 'center' ? -(bb.min.x + bb.max.x) / 2 : align === 'left' ? -bb.min.x : -bb.max.x;
  const dy = valign === 'middle' ? -(bb.min.y + bb.max.y) / 2 : valign === 'top' ? -bb.max.y : -bb.min.y;
  geometry.translate(dx, dy, 0);
  return new THREE.Mesh(geometry, material);
}

/** Small triangle glyph (arrow keys), flat in XY facing +Z, pointing up by default. */
export function triangle(size, material, rotation = 0) {
  const s = new THREE.Shape();
  s.moveTo(0, size * 0.55);
  s.lineTo(size * 0.5, -size * 0.35);
  s.lineTo(-size * 0.5, -size * 0.35);
  s.closePath();
  const geometry = new THREE.ShapeGeometry(s);
  geometry.rotateZ(rotation);
  return new THREE.Mesh(geometry, material);
}

const SEGMENTS = {
  0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg',
  '-': 'g', ' ': '', A: 'abcefg', E: 'adefg', F: 'aefg', H: 'bcefg', L: 'def', P: 'abefg', U: 'bcdef', r: 'eg', o: 'cdeg', n: 'ceg', d: 'bcdeg', t: 'defg',
};

/** Slanted seven-segment readout, centred on the origin, facing +Z. Use "." after a digit for its point. */
export function sevenSegment(text, height, { slant = 0.1, depth = 0.0005 } = {}) {
  const group = new THREE.Group();
  const on = mat.segOn();
  const off = mat.segOff();
  const t = height * 0.13;
  const w = height * 0.54;
  const half = height / 2;
  const gap = height * 0.025;
  const shapes = {
    a: [0, half - t / 2, w - t, t],
    g: [0, 0, w - t, t],
    d: [0, -half + t / 2, w - t, t],
    f: [-w / 2 + t / 2, height / 4, t, half - t],
    b: [w / 2 - t / 2, height / 4, t, half - t],
    e: [-w / 2 + t / 2, -height / 4, t, half - t],
    c: [w / 2 - t / 2, -height / 4, t, half - t],
  };
  const chars = [];
  for (const ch of text) {
    if (ch === '.' && chars.length) chars[chars.length - 1].dot = true;
    else chars.push({ ch, dot: false });
  }
  const pitch = w * 1.42;
  chars.forEach(({ ch, dot }, index) => {
    const cx = (index - (chars.length - 1) / 2) * pitch;
    const lit = SEGMENTS[ch] ?? '';
    for (const [key, [sx, sy, sw, sh]] of Object.entries(shapes)) {
      const seg = new THREE.Mesh(new THREE.BoxGeometry(Math.max(sw - gap, 1e-4), Math.max(sh - gap, 1e-4), depth), lit.includes(key) ? on : off);
      seg.position.set(cx + sx + sy * slant, sy, 0);
      if (sh > sw) seg.rotation.z = -Math.atan(slant);
      group.add(seg);
    }
    const point = new THREE.Mesh(new THREE.BoxGeometry(t, t, depth), dot ? on : off);
    point.position.set(cx + w / 2 + t * 1.1 - half * slant, -half + t / 2, 0);
    group.add(point);
  });
  return group;
}

/** Panel LED, lens facing +Z. */
export function led(color, lit = false, radius = 0.0022) {
  const lens = disc(radius, 0.0018, ledMaterial(color, lit), 18);
  return lens;
}

/** Rocker switch facing +Z. */
export function rocker(colorMaterial, { w = 0.022, h = 0.03, tilt = 0.14 } = {}) {
  const group = new THREE.Group();
  group.add(box(w + 0.006, h + 0.006, 0.004, mat.blackPlastic(), 0.0012));
  const paddle = box(w, h, 0.007, colorMaterial, 0.0018);
  paddle.position.z = 0.004;
  paddle.rotation.x = tilt;
  group.add(paddle);
  return group;
}

/** Screw terminal block along X, front faces +Z, sitting on y = 0. */
export function terminalBlock(count, pitch = 0.0105, { colour = mat.blackPlastic() } = {}) {
  const group = new THREE.Group();
  const width = count * pitch + 0.006;
  const body = box(width, 0.016, 0.022, colour, 0.0012);
  body.position.y = 0.008;
  group.add(body);
  for (let i = 0; i < count; i++) {
    const x = (i - (count - 1) / 2) * pitch;
    const screw = post(0.0034, 0.0034, 0.003, mat.steel(), 16);
    screw.position.set(x, 0.0175, 0.002);
    group.add(screw);
    const slot = box(0.0046, 0.0008, 0.0008, mat.darkPlastic());
    slot.position.set(x, 0.0192, 0.002);
    group.add(slot);
    const entry = box(0.006, 0.0055, 0.002, mat.chip());
    entry.position.set(x, 0.0068, 0.0111);
    group.add(entry);
  }
  return group;
}

/** Cable gland pointing down (-Y), mounted on a face at y = 0. */
export function cableGland(radius = 0.0085) {
  const group = new THREE.Group();
  const nut = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.25, radius * 1.25, radius * 0.6, 6), mat.blackPlastic());
  nut.position.y = -radius * 0.3;
  group.add(nut);
  const body = post(radius, radius * 0.92, radius * 1.3, mat.blackPlastic(), 24);
  body.position.y = -radius * 1.25;
  group.add(body);
  const dome = post(radius * 0.7, radius * 0.95, radius * 0.6, mat.blackPlastic(), 24);
  dome.position.y = -radius * 2.2;
  group.add(dome);
  return group;
}

/** Electrolytic capacitor standing on +Y. */
export function electrolytic(radius, height) {
  const group = new THREE.Group();
  const can = post(radius, radius, height, mat.capacitor(), 24);
  can.position.y = height / 2;
  group.add(can);
  const top = post(radius * 0.96, radius * 0.96, 0.0006, mat.capTop(), 24);
  top.position.y = height + 0.0003;
  group.add(top);
  return group;
}

/** Deterministic pseudo-random generator so regenerated models are identical. */
export function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Printed circuit board lying in the XZ plane (top face +Y, thickness centred at y = 0),
 * with plated mounting holes and scattered passives inside `keepIn` minus `keepOut` rects.
 */
export function pcb(w, d, { holes = [], passives = 0, seed = 7, keepOut = [], silkLines = [], colour = mat.pcbGreen() } = {}) {
  const group = new THREE.Group();
  const board = plate(w, d, 0.0016, colour, { radius: 0.003, holes: holes.map(([x, z]) => [x, -z, 0.0016]) });
  board.rotation.x = -Math.PI / 2;
  group.add(board);
  for (const [x, z] of holes) {
    const pad = new THREE.Mesh(new THREE.RingGeometry(0.0016, 0.0032, 24), mat.gold());
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(x, 0.00085, z);
    group.add(pad);
  }
  const rand = seeded(seed);
  let placed = 0;
  let attempts = 0;
  while (placed < passives && attempts < passives * 30) {
    attempts++;
    const x = (rand() - 0.5) * (w - 0.012);
    const z = (rand() - 0.5) * (d - 0.012);
    if (keepOut.some(([x0, z0, x1, z1]) => x > x0 && x < x1 && z > z0 && z < z1)) continue;
    const big = rand() > 0.82;
    const sw = big ? 0.0035 : 0.0016;
    const sd = big ? 0.0035 : 0.0008;
    const part = box(sw, big ? 0.0012 : 0.0006, sd, big ? mat.chip() : mat.passive());
    part.position.set(x, 0.0008 + (big ? 0.0006 : 0.0003), z);
    part.rotation.y = rand() > 0.5 ? Math.PI / 2 : 0;
    group.add(part);
    placed++;
  }
  for (const [text, size, x, z, rotation = 0] of silkLines) {
    const legend = label(text, size, mat.silk(), { font: fonts.sansLight, curve: 2 });
    legend.rotation.set(-Math.PI / 2, 0, rotation);
    legend.position.set(x, 0.00082, z);
    group.add(legend);
  }
  return group;
}

/** IC package with pins on two sides, lying on a board (top +Y), base at y = 0. */
export function chip(w, d, h = 0.0012) {
  const group = new THREE.Group();
  const body = box(w, h, d, mat.chip(), 0.0002);
  body.position.y = h / 2 + 0.0002;
  group.add(body);
  const pins = Math.max(2, Math.round(d / 0.0013));
  for (let i = 0; i < pins; i++) {
    const z = (i - (pins - 1) / 2) * (d / pins);
    for (const side of [-1, 1]) {
      const pin = box(0.0011, 0.0003, 0.0004, mat.steel());
      pin.position.set(side * (w / 2 + 0.0004), 0.00025, z);
      group.add(pin);
    }
  }
  return group;
}

/* ------------------------------------------------------------------ */
/* Assembly, animation and export                                      */
/* ------------------------------------------------------------------ */

export function group(name, ...children) {
  const g = new THREE.Group();
  g.name = name;
  for (const child of children) if (child) g.add(child);
  return g;
}

// Untextured models need no UVs; welding then collapses the non-indexed primitives
// (RoundedBox, Extrude) to a fraction of their vertices.
function normaliseAttributes(source) {
  let geometry = source;
  for (const name of Object.keys(geometry.attributes)) {
    if (!['position', 'normal'].includes(name)) geometry.deleteAttribute(name);
  }
  if (!geometry.attributes.normal) geometry.computeVertexNormals();
  geometry.morphAttributes = {};
  geometry.clearGroups();
  if (!geometry.index) geometry = mergeVertices(geometry, 1e-6);
  return geometry;
}

/** Bake every mesh under a part into one mesh per material, keeping the part's own transform. */
export function consolidate(part) {
  part.updateMatrixWorld(true);
  const inverse = new THREE.Matrix4().copy(part.matrixWorld).invert();
  const buckets = new Map();
  part.traverse((object) => {
    if (!object.isMesh) return;
    const geometry = normaliseAttributes(object.geometry.clone());
    geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, object.matrixWorld));
    const key = object.material.name;
    if (!buckets.has(key)) buckets.set(key, { material: object.material, geometries: [] });
    buckets.get(key).geometries.push(geometry);
  });
  part.clear();
  for (const { material: m, geometries } of buckets.values()) {
    const mesh = new THREE.Mesh(mergeGeometries(geometries, false), m);
    mesh.name = `${part.name}__${m.name}`;
    part.add(mesh);
  }
  return part;
}

const v3 = (v) => [round(v[0]), round(v[1]), round(v[2])];
const round = (n) => Math.round(n * 10000) / 10000;

/**
 * A model is a root group of named parts. `motion` describes the one scrubbable animation:
 * - { kind: 'translate', name, offsets: { partName: [x, y, z] } }
 * - { kind: 'rotate', name, part, pivot: [x, y, z], axis: [x, y, z], from, to } (degrees)
 */
export function buildModel({ id, parts, anchors = {}, motion = null }) {
  const root = new THREE.Group();
  root.name = id;
  for (const part of parts) root.add(consolidate(part));

  const clips = [];
  let motionInfo = null;
  if (motion?.kind === 'translate') {
    const tracks = [];
    for (const [name, offset] of Object.entries(motion.offsets)) {
      const node = root.getObjectByName(name);
      if (!node) throw new Error(`${id}: no part named ${name}`);
      const p = node.position;
      tracks.push(new THREE.VectorKeyframeTrack(`${name}.position`, [0, 1], [p.x, p.y, p.z, p.x + offset[0], p.y + offset[1], p.z + offset[2]]));
    }
    clips.push(new THREE.AnimationClip(motion.name, 1, tracks));
    motionInfo = { name: motion.name, kind: 'translate', offsets: Object.fromEntries(Object.entries(motion.offsets).map(([k, v]) => [k, v3(v)])) };
  } else if (motion?.kind === 'rotate') {
    const node = root.getObjectByName(motion.part);
    if (!node) throw new Error(`${id}: no part named ${motion.part}`);
    const axis = new THREE.Vector3(...motion.axis).normalize();
    const base = node.quaternion.clone();
    const q = (deg) => new THREE.Quaternion().setFromAxisAngle(axis, THREE.MathUtils.degToRad(deg)).multiply(base);
    const mid = (motion.from + motion.to) / 2;
    const values = [...q(motion.from).toArray(), ...q(mid).toArray(), ...q(motion.to).toArray()];
    clips.push(new THREE.AnimationClip(motion.name, 1, [new THREE.QuaternionKeyframeTrack(`${motion.part}.quaternion`, [0, 0.5, 1], values)]));
    motionInfo = { name: motion.name, kind: 'rotate', part: motion.part, pivot: v3(motion.pivot), axis: v3(motion.axis), from: motion.from, to: motion.to };
  }

  const box3 = new THREE.Box3().setFromObject(root);
  const size = box3.getSize(new THREE.Vector3());
  const anchorInfo = {};
  for (const [key, a] of Object.entries(anchors)) {
    anchorInfo[key] = { position: v3(a.position), normal: v3(a.normal ?? [0, 0, 1]), ...(a.part ? { part: a.part } : {}) };
  }
  return { id, root, clips, info: { motion: motionInfo, anchors: anchorInfo, size: v3(size.toArray()) } };
}

export async function exportModel(model, file) {
  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(model.root, { binary: true, animations: model.clips, onlyVisible: true });
  fs.writeFileSync(file, Buffer.from(result));
  return fs.statSync(file).size;
}
