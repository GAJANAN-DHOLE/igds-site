import { getImage } from 'astro:assets';
import modelManifest from '~/data/models.json';
import type { Product } from '~/data/products';

export type Vec3 = [number, number, number];

interface ManifestAnchor {
  position: number[];
  normal: number[];
  part?: string;
}

interface ManifestEntry {
  src: string;
  representative: boolean;
  size: number[];
  anchors: Record<string, ManifestAnchor>;
  motion: {
    name: string;
    kind: 'translate' | 'rotate';
    offsets?: Record<string, number[]>;
    part?: string;
    pivot?: number[];
    axis?: number[];
    from?: number;
    to?: number;
  };
}

const manifest = modelManifest as unknown as Record<string, ManifestEntry>;

export interface BenchHotspot {
  key: string;
  label: string;
  position: Vec3;
  normal: Vec3;
  part?: string;
  /** Sits inside the enclosure, so it only shows once the model is opened. */
  concealed: boolean;
}

export interface BenchMotion {
  name: string;
  kind: 'translate' | 'rotate';
  label: string;
  hint: string;
  offsets?: Record<string, Vec3>;
  part?: string;
  pivot?: Vec3;
  axis?: Vec3;
  from?: number;
  to?: number;
  start: number;
}

export interface BenchConfig {
  slug: string;
  name: string;
  designator: string;
  src?: string;
  alt: string;
  note: string;
  size?: Vec3;
  motion?: BenchMotion;
  hotspots: BenchHotspot[];
  view: { theta: number; phi: number };
  photo?: { src: string; alt: string; width: number; height: number };
}

/** Initial camera per model: wide scenes read better square-on, small hardware from three-quarters. */
const VIEWS: Record<string, { theta: number; phi: number }> = {
  mammography: { theta: -14, phi: 80 },
  'mri-detector': { theta: -14, phi: 80 },
  i2hd: { theta: -30, phi: 62 },
  'carrier-board': { theta: -24, phi: 52 },
};

const v3 = (values: number[] | undefined): Vec3 => [values?.[0] ?? 0, values?.[1] ?? 0, values?.[2] ?? 0];

export async function benchConfig(product: Product): Promise<BenchConfig> {
  const base: BenchConfig = {
    slug: product.slug,
    name: product.name,
    designator: product.designator,
    alt: `${product.name}.`,
    note: 'Product interface.',
    hotspots: [],
    view: { theta: -28, phi: 66 },
  };

  if (product.photo) {
    const image = await getImage({ src: product.photo.src, width: 1100, format: 'webp', quality: 80 });
    base.photo = { src: image.src, alt: product.photo.alt, width: image.options.width ?? 1100, height: image.options.height ?? 800 };
  }

  const entry = product.model ? manifest[product.model] : undefined;
  if (!product.model || !entry) return base;

  const motion = entry.motion;
  const offsets = motion.offsets ? Object.fromEntries(Object.entries(motion.offsets).map(([part, o]) => [part, v3(o)])) : undefined;
  // Parts that travel furthest are the outer shell. Anything that moves but travels less sits inside it.
  const reach = (part: string): number => Math.hypot(...(offsets?.[part] ?? [0, 0, 0]));
  const furthest = offsets ? Math.max(...Object.keys(offsets).map(reach)) : 0;
  const isInside = (part: string | undefined): boolean =>
    part !== undefined && reach(part) > 0 && reach(part) < furthest * 0.95;

  const seen = new Set<string>();
  const hotspots: BenchHotspot[] = [];
  for (const spec of product.specs) {
    if (!spec.at || seen.has(spec.at)) continue;
    const anchor = entry.anchors[spec.at];
    if (!anchor) throw new Error(`${product.slug}: spec "${spec.label}" points at missing anchor "${spec.at}"`);
    seen.add(spec.at);
    const hotspot: BenchHotspot = {
      key: spec.at,
      label: spec.label,
      position: v3(anchor.position),
      normal: v3(anchor.normal),
      concealed: motion.kind === 'translate' && isInside(anchor.part),
    };
    if (anchor.part) hotspot.part = anchor.part;
    hotspots.push(hotspot);
  }

  const rotate = motion.kind === 'rotate';
  const benchMotion: BenchMotion = {
    name: motion.name,
    kind: motion.kind,
    label: rotate ? 'C-arm angle' : 'Explode',
    hint: rotate ? 'Swings the C-arm through its range, from −45° to +45°.' : 'Lifts the enclosure to show the boards inside.',
    start: rotate ? 0.5 : 0,
  };
  if (offsets) benchMotion.offsets = offsets;
  if (motion.part) benchMotion.part = motion.part;
  if (motion.pivot) benchMotion.pivot = v3(motion.pivot);
  if (motion.axis) benchMotion.axis = v3(motion.axis);
  if (motion.from !== undefined) benchMotion.from = motion.from;
  if (motion.to !== undefined) benchMotion.to = motion.to;

  const labels = hotspots.map((hotspot) => hotspot.label.toLowerCase());
  const config: BenchConfig = {
    ...base,
    src: entry.src,
    size: v3(entry.size),
    alt: `Interactive 3D model of the ${product.name}. ${benchMotion.hint} Marked points: ${labels.join(', ') || 'none'}.`,
    note: entry.representative ? 'Representative 3D model. Drag to turn, scroll or pinch to zoom.' : 'Drag to turn, scroll or pinch to zoom.',
    motion: benchMotion,
    hotspots,
    view: VIEWS[product.model] ?? base.view,
  };
  return config;
}
