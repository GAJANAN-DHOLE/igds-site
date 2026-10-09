import {
  THREE, mat, material, box, disc, post, plate, label, triangle, sevenSegment, led,
  cableGland, electrolytic, pcb, chip, group, place, fonts, buildModel,
} from './lib.mjs';

const LIFT = 0.0002;

function upright(board, x, y, z) {
  board.rotation.x = Math.PI / 2;
  board.position.set(x, y, z);
  return board;
}

/** MSS Pro: black finned aluminium extrusion with a cream front panel, LCD and five-key pad. */
export function mssPro(id) {
  const W = 0.128;
  const H = 0.15;
  const D = 0.12;
  const y0 = 0.012;
  const cy = y0 + H / 2;
  const zFront = D / 2;

  const body = group('body');
  body.add(place(box(W, H, D, mat.anodised(), 0.004), 0, cy, 0));
  for (const side of [-1, 1]) {
    for (let i = 0; i < 9; i++) {
      body.add(place(box(0.013, 0.0036, D - 0.004, mat.anodised(), 0.0012), side * (W / 2 + 0.0055), y0 + 0.009 + i * 0.0165, 0));
    }
  }
  for (const x of [-0.042, 0.042]) body.add(place(box(0.03, 0.012, 0.024, mat.blackPlastic(), 0.002), x, 0.006, 0));
  body.add(place(box(0.09, 0.004, 0.018, mat.blackPlastic(), 0.001), 0, 0.002, 0));
  const terminalGreen = material('terminal-green', { color: 0x2e8b4a, roughness: 0.5 });
  [[-0.03, ['L', 'N', 'E']], [0.03, ['A', 'B', 'G']]].forEach(([x, pins]) => {
    body.add(place(box(0.034, 0.016, 0.012, terminalGreen, 0.001), x, cy - 0.045, -zFront - 0.006));
    pins.forEach((pin, i) => {
      const px = x + (i - 1) * 0.0105;
      const screw = disc(0.0028, 0.002, mat.steel(), 14);
      screw.position.set(px, cy - 0.04, -zFront - 0.0125);
      body.add(screw);
      const legend = label(pin, 0.0042, mat.inkWhite());
      legend.rotation.y = Math.PI;
      legend.position.set(px, cy - 0.028, -zFront - LIFT);
      body.add(legend);
    });
  });
  const rearLabel = label('RS485 MODBUS', 0.0036, mat.inkWhite());
  rearLabel.rotation.y = Math.PI;
  rearLabel.position.set(0.03, cy - 0.02, -zFront - LIFT);
  body.add(rearLabel);

  const boards = group('boards');
  const main = pcb(0.112, 0.13, { passives: 40, seed: 41, keepOut: [[-0.03, -0.03, 0.05, 0.04]], silkLines: [['MSS PRO', 0.004, -0.03, -0.05]] });
  main.add(place(box(0.026, 0.024, 0.028, mat.relay(), 0.0015), 0.022, 0.0128, -0.02));
  main.add(place(box(0.03, 0.026, 0.026, mat.transformer(), 0.002), -0.02, 0.0138, -0.03));
  main.add(place(electrolytic(0.007, 0.022), 0.03, 0.0008, 0.03));
  main.add(place(chip(0.014, 0.014), -0.015, 0.0008, 0.025));
  boards.add(upright(main, 0, cy, 0.0));
  const display = pcb(0.112, 0.13, { passives: 24, seed: 43, colour: mat.pcbDark(), keepOut: [[-0.045, -0.06, 0.045, -0.02]] });
  display.add(place(box(0.074, 0.006, 0.03, mat.darkPlastic(), 0.001), 0, 0.0038, -0.032));
  boards.add(upright(display, 0, cy, 0.04));

  const front = group('front');
  front.add(place(box(W + 0.024, H + 0.014, 0.008, mat.anodised(), 0.004), 0, cy, zFront + 0.004));
  const panelZ = zFront + 0.008;
  front.add(place(plate(W + 0.014, H + 0.004, 0.0012, mat.cream(), { radius: 0.002 }), 0, cy, panelZ + 0.0006));
  const printZ = panelZ + 0.0012 + LIFT;
  front.add(place(label('Motor Safe Shield', 0.0086, mat.ink(), { font: fonts.serif }), 0, cy + 0.058, printZ));

  front.add(place(plate(0.08, 0.035, 0.0016, mat.darkPlastic(), { radius: 0.0018 }), 0.004, cy + 0.03, printZ + 0.0006));
  front.add(place(plate(0.071, 0.026, 0.0008, mat.lcd(), { radius: 0.001 }), 0.004, cy + 0.03, printZ + 0.0016));
  front.add(place(label('READY', 0.0058, mat.lcdInk(), { font: fonts.sansLight }), 0.004, cy + 0.0355, printZ + 0.0022));
  front.add(place(label('415V   0%   0.0A', 0.0042, mat.lcdInk(), { font: fonts.sansLight }), 0.004, cy + 0.0245, printZ + 0.0022));

  const padX = 0.04;
  const padY = cy - 0.022;
  [[0, 0.016, 0], [0, -0.016, Math.PI], [-0.016, 0, Math.PI / 2], [0.016, 0, -Math.PI / 2], [0, 0, null]].forEach(([dx, dy, rotation]) => {
    front.add(place(box(0.0118, 0.0118, 0.0045, mat.tealKey(), 0.0015), padX + dx, padY + dy, printZ + 0.0022));
    if (rotation === null) front.add(place(box(0.0036, 0.0036, 0.0003, mat.inkWhite()), padX, padY, printZ + 0.0047));
    else front.add(place(triangle(0.0048, mat.inkWhite(), rotation), padX + dx, padY + dy, printZ + 0.0047));
  });

  const tagGreen = material('tag-green', { color: 0x3f8f4f, roughness: 0.5 });
  ['Normal', 'Stator Issue', 'Over Load', 'Phase Fail', 'Cable Fault', 'Under Load', 'Dry Run'].forEach((text, i) => {
    const y = cy + 0.0035 - i * 0.0098;
    front.add(place(plate(0.03, 0.0062, 0.0004, tagGreen, { radius: 0.0008 }), -0.047, y, printZ + 0.0002));
    front.add(place(label(text, 0.0026, mat.inkWhite(), { font: fonts.sansLight }), -0.047, y, printZ + 0.0005));
    front.add(place(led(i === 0 ? 'green' : 'red', i === 0, 0.0019), -0.0275, y, printZ + 0.0008));
  });
  front.add(place(label('MSS PrO', 0.0046, mat.ink()), 0.045, cy - 0.058, printZ));
  front.add(place(label('IG DRIVES & SYSTEMS', 0.0034, mat.inkRed(), { font: fonts.serif }), 0.034, cy - 0.066, printZ));

  return buildModel({
    id,
    parts: [body, boards, front],
    anchors: {
      lcd: { position: [0.004, cy + 0.03, printZ + 0.003], part: 'front' },
      keypad: { position: [padX, padY, printZ + 0.006], part: 'front' },
      faults: { position: [-0.0275, cy - 0.02, printZ + 0.002], part: 'front' },
      modbus: { position: [0.03, cy - 0.045, -zFront - 0.013], normal: [0, 0, -1] },
      fins: { position: [W / 2 + 0.012, cy + 0.02, 0.02], normal: [1, 0, 0] },
      boards: { position: [0, cy + 0.03, 0.06], part: 'boards' },
    },
    motion: { kind: 'translate', name: 'explode', offsets: { front: [0, 0.06, 0.17], boards: [0, 0.02, 0.1] } },
  });
}

function waveShape(width, bottom, crest, amplitude, phase) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, bottom);
  shape.lineTo(width / 2, bottom);
  const steps = 36;
  for (let i = steps; i >= 0; i--) {
    const x = -width / 2 + (width * i) / steps;
    shape.lineTo(x, crest + amplitude * Math.sin((i / steps) * Math.PI * 1.6 + phase));
  }
  shape.closePath();
  return new THREE.Mesh(new THREE.ShapeGeometry(shape), null);
}

/** Industrial air cooler controller: black ABS enclosure, blue-and-white membrane, glands below. */
export function airCoolerController(id) {
  const W = 0.17;
  const H = 0.23;
  const cy = H / 2;
  const baseDepth = 0.058;
  const lidDepth = 0.03;
  const zLid = 0.016;
  const zFront = zLid + lidDepth;

  const base = group('base');
  base.add(place(box(W, H, baseDepth, mat.blackPlastic(), 0.006), 0, cy, zLid - baseDepth / 2));
  [-0.05, 0, 0.05].forEach((x) => base.add(place(cableGland(0.009), x, 0, -0.012)));
  base.add(place(box(0.0025, 0.2, 0.034, mat.darkPlastic(), 0.0008), -W / 2 - 0.0013, cy, -0.024));
  base.add(place(plate(0.036, 0.2, 0.0025, mat.darkPlastic(), { radius: 0.002, holes: [[-0.006, 0.07, 0.004], [-0.006, -0.07, 0.004]] }), -W / 2 - 0.018, cy, -0.0415));

  const internals = group('internals');
  const board = pcb(0.14, 0.19, { passives: 46, seed: 53, keepOut: [[-0.06, -0.08, 0.06, -0.01]], silkLines: [['IG DRIVES AND SYSTEMS', 0.0034, 0.02, 0.07]] });
  board.add(place(box(0.044, 0.04, 0.05, mat.greyPlastic(), 0.002), -0.025, 0.0208, -0.045));
  for (const x of [-0.04, -0.025, -0.01]) board.add(place(post(0.0035, 0.0035, 0.004, mat.steel(), 12), x, 0.0425, -0.065));
  board.add(place(box(0.024, 0.026, 0.028, mat.relay(), 0.0015), 0.035, 0.0138, -0.05));
  board.add(place(electrolytic(0.007, 0.022), 0.04, 0.0008, 0.0));
  board.add(place(chip(0.013, 0.013), 0.0, 0.0008, 0.02));
  internals.add(upright(board, 0, cy, -0.02));

  const lid = group('lid');
  lid.add(place(box(W + 0.002, H + 0.002, lidDepth, mat.blackPlastic(), 0.007), 0, cy, zLid + lidDepth / 2));
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      const x = sx * (W / 2 - 0.011);
      const y = cy + sy * (H / 2 - 0.011);
      lid.add(place(disc(0.0046, 0.0016, mat.steel(), 18), x, y, zFront + 0.0008));
      lid.add(place(box(0.0052, 0.0009, 0.0006, mat.darkPlastic()), x, y, zFront + 0.0017));
      lid.add(place(box(0.0009, 0.0052, 0.0006, mat.darkPlastic()), x, y, zFront + 0.0017));
    }
  }
  const panelW = 0.142;
  const panelH = 0.2;
  lid.add(place(plate(panelW, panelH, 0.0006, mat.membraneWhite(), { radius: 0.004 }), 0, cy, zFront + 0.0003));
  const printZ = zFront + 0.0006 + LIFT;
  const light = waveShape(panelW - 0.004, -panelH / 2 + 0.003, -0.066, 0.008, 0.4);
  light.material = mat.blueLight();
  lid.add(place(light, 0, cy, printZ));
  const deep = waveShape(panelW - 0.004, -panelH / 2 + 0.003, -0.08, 0.007, 2.2);
  deep.material = mat.blueDeep();
  lid.add(place(deep, 0, cy, printZ + 0.0001));

  const dy = cy + 0.062;
  lid.add(place(plate(0.07, 0.032, 0.0012, mat.displayGlass(), { radius: 0.0016 }), -0.01, dy, zFront + 0.0012));
  const readout = sevenSegment('415', 0.0225, { slant: 0.08 });
  readout.position.set(-0.01, dy, zFront + 0.0021);
  lid.add(readout);
  ['V', 'A', 'Hz', 'PF'].forEach((text, i) => {
    const y = dy + 0.012 - i * 0.008;
    lid.add(place(led('red', i === 0, 0.0018), 0.04, y, printZ + 0.0006));
    lid.add(place(label(text, 0.0036, mat.ink(), { align: 'left' }), 0.0445, y, printZ));
  });
  [['RUN', 'green', true], ['ALARM', 'red', false], ['REMOTE', 'yellow', false]].forEach(([text, colour, lit], i) => {
    const x = (i - 1) * 0.045;
    lid.add(place(led(colour, lit, 0.0026), x, cy + 0.03, printZ + 0.0008));
    lid.add(place(label(text, 0.0036, mat.blueDeep()), x, cy + 0.021, printZ));
  });
  [['MENU', null], ['', 0], ['', Math.PI], ['ENT', null]].forEach(([text, rotation], i) => {
    const x = (i - 1.5) * 0.034;
    lid.add(place(box(0.027, 0.019, 0.0042, mat.blueKey(), 0.002), x, cy + 0.0, printZ + 0.0021));
    const glyph = rotation === null ? label(text, 0.0042, mat.inkWhite()) : triangle(0.0072, mat.inkWhite(), rotation);
    lid.add(place(glyph, x, cy, printZ + 0.0044));
  });

  const by = cy - 0.042;
  [[-0.045, mat.green(), 'ON'], [0, mat.red(), 'OFF']].forEach(([x, colour, text]) => {
    lid.add(place(disc(0.0195, 0.006, mat.blackPlastic(), 32), x, by, printZ + 0.003));
    lid.add(place(disc(0.0158, 0.012, colour, 32), x, by, printZ + 0.009));
    lid.add(place(label(text, 0.005, mat.inkWhite()), x, by - 0.03, printZ + 0.0002));
  });
  lid.add(place(disc(0.0145, 0.013, mat.blackPlastic(), 16), 0.05, by, printZ + 0.0065));
  lid.add(place(box(0.0018, 0.011, 0.0008, mat.inkWhite()), 0.05, by + 0.0055, printZ + 0.0134));
  [['DRAIN', -0.022, 0.017], ['WATER', 0, 0.022], ['PUMP', 0.022, 0.017]].forEach(([text, dx, dy2]) => {
    lid.add(place(label(text, 0.0032, mat.ink()), 0.05 + dx, by + dy2, printZ));
  });
  lid.add(place(label('MODE', 0.005, mat.inkWhite()), 0.05, by - 0.03, printZ + 0.0002));

  return buildModel({
    id,
    parts: [base, internals, lid],
    anchors: {
      display: { position: [-0.01, dy, zFront + 0.003], part: 'lid' },
      keys: { position: [0.0, cy, printZ + 0.005], part: 'lid' },
      power: { position: [-0.0225, by, printZ + 0.016], part: 'lid' },
      mode: { position: [0.05, by, printZ + 0.014], part: 'lid' },
      status: { position: [0, cy + 0.03, printZ + 0.002], part: 'lid' },
      glands: { position: [0, -0.015, -0.005], normal: [0, -0.4, 1] },
      internals: { position: [-0.02, cy + 0.03, 0.02], part: 'internals' },
    },
    motion: { kind: 'translate', name: 'explode', offsets: { lid: [0, 0.13, 0.12], internals: [0, 0.015, 0.05] } },
  });
}
