import type { ModelViewerElement } from '@google/model-viewer';
import type { BenchConfig, BenchHotspot, Vec3 } from '~/lib/bench';

/* The stage: one 3D viewer that can show any product on the page.
   The spec list and the hotspots share one data source, so hovering either lights both. */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');
const DEG = Math.PI / 180;

let libraryReady: Promise<unknown> | undefined;
const loadLibrary = (): Promise<unknown> =>
  (libraryReady ??= import('@google/model-viewer/dist/model-viewer.min.js'));

const add = (a: Vec3, b: Vec3, k = 1): Vec3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const fmt = (v: Vec3): string => `${v[0]}m ${v[1]}m ${v[2]}m`;
const easeOut = (x: number): number => 1 - Math.pow(1 - x, 4);

function rotateAbout(v: Vec3, axis: Vec3, angle: number): Vec3 {
  const len = Math.hypot(...axis) || 1;
  const k: Vec3 = [axis[0] / len, axis[1] / len, axis[2] / len];
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dot = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];
  const cross: Vec3 = [k[1] * v[2] - k[2] * v[1], k[2] * v[0] - k[0] * v[2], k[0] * v[1] - k[1] * v[0]];
  return [
    v[0] * cos + cross[0] * sin + k[0] * dot * (1 - cos),
    v[1] * cos + cross[1] * sin + k[1] * dot * (1 - cos),
    v[2] * cos + cross[2] * sin + k[2] * dot * (1 - cos),
  ];
}

class Stage {
  readonly root: HTMLElement;
  config: BenchConfig | undefined;

  private readonly viewport: HTMLElement;
  private readonly statusText: HTMLElement;
  private readonly note: HTMLElement | null;
  private readonly bar: HTMLElement | null;
  private readonly slider: HTMLInputElement | null;
  private readonly output: HTMLOutputElement | null;
  private readonly label: HTMLElement | null;
  private readonly reset: HTMLButtonElement | null;

  private viewer: ModelViewerElement | undefined;
  private t = 0;
  private fit = 1;
  private center: Vec3 = [0, 0, 0];
  private token = 0;
  private frame = 0;
  private touched = false;

  constructor(root: HTMLElement) {
    this.root = root;
    const find = <T extends HTMLElement>(selector: string): T | null => root.querySelector<T>(selector);
    const viewport = find('.stage__viewport');
    const statusText = find('[data-status]');
    if (!viewport || !statusText) throw new Error('Stage markup is incomplete');
    this.viewport = viewport;
    this.statusText = statusText;
    this.note = find('[data-note]');
    this.bar = find('.stage__bar');
    this.slider = find<HTMLInputElement>('[data-scrub]');
    this.output = find<HTMLOutputElement>('[data-scrub-output]');
    this.label = find('[data-scrub-label]');
    this.reset = find<HTMLButtonElement>('[data-reset]');

    this.slider?.addEventListener('input', () => {
      this.touched = true;
      this.cancelTween();
      this.apply(Number(this.slider?.value ?? 0));
    });
    this.reset?.addEventListener('click', () => this.resetView());

    root.addEventListener('pointerover', (event) => this.pointer(event, true));
    root.addEventListener('pointerout', (event) => this.pointer(event, false));
    root.addEventListener('focusin', (event) => this.pointer(event, true));
    root.addEventListener('focusout', (event) => this.pointer(event, false));
    root.addEventListener('click', (event) => {
      const spot = (event.target as Element).closest<HTMLElement>('.hotspot');
      if (spot?.dataset['at']) this.focusOn(spot.dataset['at']);
    });
  }

  /* ───────── content ───────── */

  async show(config: BenchConfig): Promise<void> {
    const token = ++this.token;
    this.config = config;
    this.touched = false;
    this.cancelTween();
    this.teardown();
    if (this.note) this.note.textContent = config.note;

    if (!config.src) {
      this.showPhoto(config);
      return;
    }

    this.state('loading', `Loading ${config.designator}`);
    if (this.bar) this.bar.hidden = true;

    try {
      await loadLibrary();
    } catch {
      if (token === this.token) this.state('error', 'The 3D viewer could not load. The photograph and specifications are below.');
      return;
    }
    if (token !== this.token) return;

    const size = config.size ?? [0.3, 0.3, 0.3];
    const radius = Math.hypot(...size) * 1.55;
    this.fit = radius;

    const viewer = document.createElement('model-viewer') as ModelViewerElement;
    const attributes: Record<string, string> = {
      src: config.src,
      alt: config.alt,
      'camera-controls': '',
      'touch-action': 'pan-y',
      'interaction-prompt': 'none',
      'shadow-intensity': '1.1',
      'shadow-softness': '1',
      exposure: '1.15',
      'field-of-view': '30deg',
      'min-field-of-view': '12deg',
      'max-field-of-view': '45deg',
      'camera-orbit': `${config.view.theta}deg ${config.view.phi}deg ${radius}m`,
      'min-camera-orbit': `auto 8deg ${radius * 0.3}m`,
      'max-camera-orbit': `auto 125deg ${radius * 2.4}m`,
      'interpolation-decay': '60',
    };
    if (config.motion) attributes['animation-name'] = config.motion.name;
    for (const [name, value] of Object.entries(attributes)) viewer.setAttribute(name, value);

    for (const hotspot of config.hotspots) viewer.append(this.hotspotButton(hotspot));

    viewer.addEventListener('load', () => {
      if (token !== this.token) return;
      viewer.pause();
      const center = viewer.getBoundingBoxCenter();
      this.center = [center.x, center.y, center.z];
      this.configureBar(config);
      this.apply(config.motion?.start ?? 0, true);
      this.state('ready');
      this.tease(token);
    });
    viewer.addEventListener('error', () => {
      if (token === this.token) this.state('error', 'This model could not be loaded. The specifications are unaffected.');
    });

    this.viewer = viewer;
    this.viewport.append(viewer);
  }

  private showPhoto(config: BenchConfig): void {
    if (this.bar) this.bar.hidden = true;
    if (!config.photo) {
      this.state('error', 'No image for this product yet.');
      return;
    }
    const img = document.createElement('img');
    img.src = config.photo.src;
    img.alt = config.photo.alt;
    img.width = config.photo.width;
    img.height = config.photo.height;
    img.className = 'stage__photo';
    img.decoding = 'async';
    this.viewport.append(img);
    this.state('ready');
  }

  private hotspotButton(hotspot: BenchHotspot): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.slot = `hotspot-${hotspot.key}`;
    button.className = 'hotspot';
    button.dataset['at'] = hotspot.key;
    button.dataset['position'] = fmt(hotspot.position);
    button.dataset['normal'] = fmt(hotspot.normal);
    // model-viewer prefixes this with "data-", so the CSS hook is [data-visible].
    button.dataset['visibilityAttribute'] = 'visible';
    button.setAttribute('aria-label', hotspot.label);
    if (hotspot.concealed) button.dataset['concealed'] = '';
    const text = document.createElement('span');
    text.className = 'hotspot__label';
    text.textContent = hotspot.label;
    button.append(text);
    return button;
  }

  private configureBar(config: BenchConfig): void {
    const motion = config.motion;
    if (!this.bar || !this.slider) return;
    this.bar.hidden = !motion;
    if (!motion) return;
    if (this.label) this.label.textContent = motion.label;
    this.slider.value = String(motion.start);
    this.slider.setAttribute('aria-label', `${motion.label}. ${motion.hint}`);
  }

  private teardown(): void {
    this.viewer?.remove();
    this.viewer = undefined;
    this.viewport.querySelectorAll('.stage__photo').forEach((node) => node.remove());
  }

  private state(state: 'loading' | 'ready' | 'error', message = ''): void {
    this.root.dataset['state'] = state;
    this.statusText.textContent = message;
  }

  /* ───────── motion ───────── */

  /** Set the scrub position (0..1): the clip, the hotspots, the framing, the readout. */
  apply(t: number, immediate = false): void {
    const viewer = this.viewer;
    const config = this.config;
    if (!viewer || !config) return;
    this.t = Math.min(1, Math.max(0, t));
    const motion = config.motion;

    // The clip loops, so t = 1 would wrap to the first frame.
    if (motion) viewer.currentTime = Math.min(this.t, 0.9999);

    for (const hotspot of config.hotspots) {
      const position = this.positionOf(hotspot, this.t);
      const normal = this.normalOf(hotspot, this.t);
      viewer.updateHotspot({ name: `hotspot-${hotspot.key}`, position: fmt(position), normal: fmt(normal) });
      const button = viewer.querySelector<HTMLElement>(`.hotspot[data-at="${hotspot.key}"]`);
      if (button && hotspot.concealed) button.toggleAttribute('data-concealed', this.t < 0.6);
    }

    if (motion?.kind === 'translate') this.reframe(immediate);

    if (this.slider) {
      this.slider.value = String(this.t);
      this.slider.style.setProperty('--fill', `${this.t * 100}%`);
      if (motion?.kind === 'rotate') {
        const angle = Math.round((motion.from ?? 0) + ((motion.to ?? 0) - (motion.from ?? 0)) * this.t);
        const text = `${angle > 0 ? '+' : angle < 0 ? '−' : ''}${Math.abs(angle)}°`;
        if (this.output) this.output.textContent = text;
        this.slider.setAttribute('aria-valuetext', `${angle} degrees`);
      } else {
        const percent = Math.round(this.t * 100);
        if (this.output) this.output.textContent = `${percent}%`;
        this.slider.setAttribute('aria-valuetext', `${percent} percent open`);
      }
    }
  }

  private positionOf(hotspot: BenchHotspot, t: number): Vec3 {
    const motion = this.config?.motion;
    if (!motion || !hotspot.part) return hotspot.position;
    if (motion.kind === 'translate') {
      const offset = motion.offsets?.[hotspot.part];
      return offset ? add(hotspot.position, offset, t) : hotspot.position;
    }
    if (motion.part === hotspot.part && motion.pivot && motion.axis) {
      const angle = ((motion.from ?? 0) + ((motion.to ?? 0) - (motion.from ?? 0)) * t) * DEG;
      const relative = add(hotspot.position, motion.pivot, -1);
      return add(rotateAbout(relative, motion.axis, angle), motion.pivot);
    }
    return hotspot.position;
  }

  private normalOf(hotspot: BenchHotspot, t: number): Vec3 {
    const motion = this.config?.motion;
    if (motion?.kind === 'rotate' && motion.part === hotspot.part && motion.axis) {
      const angle = ((motion.from ?? 0) + ((motion.to ?? 0) - (motion.from ?? 0)) * t) * DEG;
      return rotateAbout(hotspot.normal, motion.axis, angle);
    }
    return hotspot.normal;
  }

  /** Keep the opening model in frame: re-centre and back off in proportion to how far the parts travel. */
  private reframe(immediate: boolean): void {
    const viewer = this.viewer;
    const config = this.config;
    const offsets = config?.motion?.offsets;
    if (!viewer || !config || !offsets) return;

    let high: Vec3 = [0, 0, 0];
    let low: Vec3 = [0, 0, 0];
    for (const offset of Object.values(offsets)) {
      high = [Math.max(high[0], offset[0]), Math.max(high[1], offset[1]), Math.max(high[2], offset[2])];
      low = [Math.min(low[0], offset[0]), Math.min(low[1], offset[1]), Math.min(low[2], offset[2])];
    }
    const size = config.size ?? [0.3, 0.3, 0.3];
    const closed = Math.hypot(...size);
    const grown = Math.hypot(size[0] + high[0] - low[0], size[1] + high[1] - low[1], size[2] + high[2] - low[2]);
    const reach = grown / closed;
    const nextFit = (closed * 1.55) * (1 + (reach - 1) * this.t);

    const target = add(this.center, [(high[0] + low[0]) / 2, (high[1] + low[1]) / 2, (high[2] + low[2]) / 2], this.t);
    const orbit = viewer.getCameraOrbit();
    const radius = orbit.radius * (nextFit / this.fit);
    this.fit = nextFit;

    viewer.cameraTarget = fmt(target);
    viewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${radius}m`;
    if (immediate) viewer.jumpCameraToGoal();
  }

  private tween(to: number, ms: number, done?: () => void): void {
    this.cancelTween();
    if (REDUCED.matches) {
      this.apply(to);
      done?.();
      return;
    }
    const from = this.t;
    const start = performance.now();
    const step = (now: number): void => {
      const k = Math.min(1, (now - start) / ms);
      this.apply(from + (to - from) * easeOut(k));
      if (k < 1) this.frame = requestAnimationFrame(step);
      else done?.();
    };
    this.frame = requestAnimationFrame(step);
  }

  private cancelTween(): void {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  /** Once, when the model first appears: open it a little and close it again, so the control is discovered. */
  private tease(token: number): void {
    const config = this.config;
    if (!config?.motion || config.motion.kind !== 'translate' || !this.root.hasAttribute('data-tease')) return;
    if (REDUCED.matches) return;
    window.setTimeout(() => {
      if (token !== this.token || this.touched) return;
      this.tween(0.45, 900, () => {
        if (token !== this.token || this.touched) return;
        window.setTimeout(() => {
          if (token === this.token && !this.touched) this.tween(0, 900);
        }, 500);
      });
    }, 700);
  }

  /* ───────── interaction ───────── */

  private resetView(): void {
    const viewer = this.viewer;
    const config = this.config;
    if (!viewer || !config) return;
    this.touched = true;
    const size = config.size ?? [0.3, 0.3, 0.3];
    const radius = Math.hypot(...size) * 1.55;
    this.fit = radius;
    viewer.cameraTarget = 'auto auto auto';
    viewer.cameraOrbit = `${config.view.theta}deg ${config.view.phi}deg ${radius}m`;
    this.tween(config.motion?.start ?? 0, 500);
  }

  /** Bring one marked part into view, opening the model first when it sits inside. */
  focusOn(key: string): void {
    const viewer = this.viewer;
    const hotspot = this.config?.hotspots.find((item) => item.key === key);
    if (!viewer || !hotspot) return;
    this.touched = true;
    const reveal = (): void => {
      const position = this.positionOf(hotspot, this.t);
      const orbit = viewer.getCameraOrbit();
      viewer.cameraTarget = fmt(position);
      viewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${this.fit * 0.55}m`;
    };
    if (hotspot.concealed && this.t < 0.9) this.tween(1, 700, reveal);
    else reveal();
  }

  private pointer(event: Event, on: boolean): void {
    const spot = (event.target as Element).closest<HTMLElement>('.hotspot');
    const key = spot?.dataset['at'];
    if (key) this.light(key, on);
  }

  /** Light a hotspot and every matching spec row, for the product on stage. */
  light(key: string, on: boolean): void {
    const slug = this.config?.slug;
    this.viewer?.querySelector(`.hotspot[data-at="${key}"]`)?.classList.toggle('is-hot', on);
    if (!slug) return;
    document
      .querySelectorAll(`[data-scope="${slug}"] .spec__row[data-at="${key}"]`)
      .forEach((row) => row.classList.toggle('is-hot', on));
  }
}

/* ───────── page wiring ───────── */

const stages = new Map<HTMLElement, Stage>();

function configsFor(root: HTMLElement): BenchConfig[] {
  const id = root.dataset['bench'];
  const script = id ? document.querySelector<HTMLScriptElement>(`script[data-bench-data="${id}"]`) : null;
  if (!script?.textContent) return [];
  return JSON.parse(script.textContent) as BenchConfig[];
}

function whenNear(root: HTMLElement, run: () => void): void {
  if (root.hasAttribute('data-eager') || !('IntersectionObserver' in window)) {
    // Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 1200 });
    else window.setTimeout(run, 200);
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        run();
      }
    },
    { rootMargin: '300px 0px' },
  );
  observer.observe(root);
}

function wireBench(root: HTMLElement, stage: Stage, configs: BenchConfig[]): void {
  const tabs = Array.from(document.querySelectorAll<HTMLElement>(`[data-bench-tab="${root.dataset['bench']}"]`));
  if (tabs.length === 0) return;
  const panels = Array.from(document.querySelectorAll<HTMLElement>(`[data-bench-panel="${root.dataset['bench']}"]`));

  const select = (slug: string, focus = false): void => {
    for (const tab of tabs) {
      const on = tab.dataset['slug'] === slug;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
    }
    for (const panel of panels) panel.hidden = panel.dataset['slug'] !== slug;
    const config = configs.find((item) => item.slug === slug);
    if (config) void stage.show(config);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset['slug'] ?? ''));
    tab.addEventListener('keydown', (event) => {
      const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      const step = keys[event.key];
      if (step === undefined) return;
      event.preventDefault();
      const next = tabs[(index + step + tabs.length) % tabs.length];
      if (next) select(next.dataset['slug'] ?? '', true);
    });
  });

  const first = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') ?? tabs[0];
  if (first) select(first.dataset['slug'] ?? '');
}

function wireFollow(stage: Stage, configs: BenchConfig[]): void {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-product-section]'));
  if (sections.length === 0 || !('IntersectionObserver' in window)) return;
  let current = '';
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const slug = (entry.target as HTMLElement).dataset['slug'];
        if (!entry.isIntersecting || !slug || slug === current) continue;
        const config = configs.find((item) => item.slug === slug);
        if (!config) continue;
        current = slug;
        void stage.show(config);
      }
    },
    { rootMargin: '-30% 0px -60% 0px' },
  );
  sections.forEach((section) => observer.observe(section));
}

document.querySelectorAll<HTMLElement>('[data-stage]').forEach((root) => {
  const configs = configsFor(root);
  const first = configs[0];
  if (!first) return;
  const stage = new Stage(root);
  stages.set(root, stage);

  whenNear(root, () => {
    if (root.dataset['follow'] !== undefined) {
      void stage.show(first);
      wireFollow(stage, configs);
    } else if (document.querySelector(`[data-bench-tab="${root.dataset['bench']}"]`)) {
      wireBench(root, stage, configs);
    } else {
      void stage.show(first);
    }
  });
});

/* Spec rows light the hotspot of the product on stage; clicking a row brings its part into view. */
function rowFrom(event: Event): { row: HTMLElement; scope: string; key: string } | undefined {
  const row = (event.target as Element).closest<HTMLElement>('.spec__row[data-at]');
  const scope = row?.closest<HTMLElement>('[data-scope]')?.dataset['scope'];
  const key = row?.dataset['at'];
  return row && scope && key ? { row, scope, key } : undefined;
}

function stageFor(scope: string): Stage | undefined {
  return Array.from(stages.values()).find((stage) => stage.config?.slug === scope);
}

for (const [type, on] of [['pointerover', true], ['pointerout', false], ['focusin', true], ['focusout', false]] as const) {
  document.addEventListener(type, (event) => {
    const hit = rowFrom(event);
    if (!hit) return;
    stageFor(hit.scope)?.light(hit.key, on);
    hit.row.classList.toggle('is-hot', on);
  });
}

const activate = (event: Event): void => {
  const hit = rowFrom(event);
  if (hit) stageFor(hit.scope)?.focusOn(hit.key);
};

document.addEventListener('click', activate);
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  if (!(event.target as Element).closest('.spec__row[data-at]')) return;
  event.preventDefault();
  activate(event);
});
