/* Copper traces: route from each action to a port on the product stage.
   Decorative only. Redrawn on resize, and absent when the layout stacks. */

const NS = 'http://www.w3.org/2000/svg';
const wide = window.matchMedia('(min-width: 62rem)');
const PITCH = 30; // minimum spacing between ports, px
const APPROACH = 26; // straight run into the port, px

function make<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string>): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
  return node;
}

function route(host: HTMLElement): void {
  const layer = host.querySelector<SVGSVGElement>('[data-traces]');
  const port = host.querySelector<HTMLElement>('[data-trace-port]');
  if (!layer || !port) return;

  const pads = Array.from(host.querySelectorAll<HTMLElement>('[data-trace-pad]'));

  const draw = (): void => {
    layer.replaceChildren();
    if (!wide.matches || pads.length === 0) return;

    const origin = host.getBoundingClientRect();
    const portBox = port.getBoundingClientRect();
    layer.setAttribute('viewBox', `0 0 ${origin.width} ${origin.height}`);

    const portX = portBox.left - origin.left;
    const top = portBox.top - origin.top + portBox.height * 0.34;
    const bottom = portBox.top - origin.top + portBox.height - 40;

    const starts = pads.map((pad) => {
      const box = pad.getBoundingClientRect();
      return { x: box.right - origin.left, y: box.top - origin.top + box.height / 2 };
    });

    // Land each trace as close to its own row as the frame allows, keeping the ports on a pitch.
    const ends: number[] = [];
    starts.forEach((start, index) => {
      const previous = ends[index - 1];
      const wanted = Math.min(bottom, Math.max(top, start.y));
      ends.push(previous === undefined ? wanted : Math.max(wanted, previous + PITCH));
    });
    const overflow = (ends[ends.length - 1] ?? 0) - bottom;
    if (overflow > 0) ends.forEach((_, index) => (ends[index] = (ends[index] ?? 0) - overflow));

    starts.forEach((start, index) => {
      const endY = ends[index] ?? start.y;
      const run = Math.abs(endY - start.y);
      const bend = portX - APPROACH - run;
      const d =
        run < 1.5
          ? `M${start.x} ${start.y} H${portX}`
          : bend > start.x + 8
            ? `M${start.x} ${start.y} H${bend} L${bend + run} ${endY} H${portX}`
            : `M${start.x} ${start.y} L${portX} ${endY}`;
      layer.append(make('path', { d }), make('circle', { cx: String(portX), cy: String(endY), r: '5' }));
    });
  };

  // Hover or focus on an action lights its trace.
  pads.forEach((pad, index) => {
    const set = (on: boolean): void => {
      layer.querySelectorAll('path')[index]?.classList.toggle('is-hot', on);
    };
    pad.addEventListener('pointerenter', () => set(true));
    pad.addEventListener('pointerleave', () => set(false));
    pad.addEventListener('focus', () => set(true));
    pad.addEventListener('blur', () => set(false));
  });

  draw();
  new ResizeObserver(draw).observe(host);
  wide.addEventListener('change', draw);
  void document.fonts?.ready.then(draw);
}

document.querySelectorAll<HTMLElement>('[data-traces-host]').forEach(route);
