import {
  THREE, mat, material, box, disc, post, plate, label, triangle, sevenSegment, led, rocker,
  terminalBlock, cableGland, electrolytic, pcb, chip, group, place, fonts, ring, buildModel,
} from './lib.mjs';

const LIFT = 0.0002;

function wire(points, radius, colour) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 28, radius, 6, false), material(`wire-${colour}`, {
    color: { red: 0xc0282a, black: 0x1a1a1a, green: 0x2a8f3c, yellow: 0xe0b52a, blue: 0x2457b8, brown: 0x6b4226 }[colour],
    roughness: 0.45,
  }));
}

/** Controller board for the wall starters, built flat (top +Y) and stood upright by the caller. */
function starterBoard(w, d, { gsm = false } = {}) {
  const board = pcb(w, d, {
    holes: [[-w / 2 + 0.006, -d / 2 + 0.006], [w / 2 - 0.006, -d / 2 + 0.006], [-w / 2 + 0.006, d / 2 - 0.006], [w / 2 - 0.006, d / 2 - 0.006]],
    passives: 54,
    seed: gsm ? 23 : 11,
    keepOut: [[-0.066, -0.085, -0.022, -0.035], [0.004, -0.085, 0.066, -0.035], [-0.012, -0.012, 0.012, 0.012], [-0.05, 0.045, 0.05, 0.09]],
    silkLines: [['IG DRIVES AND SYSTEMS', 0.0034, 0.022, 0.03], ['MSS-CTRL', 0.0034, -0.045, 0.03]],
  });
  board.add(place(box(0.038, 0.03, 0.032, mat.transformer(), 0.002), -0.044, 0.0158, -0.06));
  board.add(place(box(0.022, 0.026, 0.028, mat.relay(), 0.0015), 0.02, 0.0138, -0.06));
  board.add(place(box(0.022, 0.026, 0.028, mat.relay(), 0.0015), 0.047, 0.0138, -0.06));
  board.add(place(electrolytic(0.0062, 0.02), -0.055, 0.0008, 0.0));
  board.add(place(electrolytic(0.005, 0.016), -0.04, 0.0008, 0.004));
  board.add(place(electrolytic(0.008, 0.024), 0.052, 0.0008, 0.012));
  board.add(place(chip(0.012, 0.012), 0, 0.0008, 0));
  board.add(place(box(0.046, 0.008, 0.0026, mat.blackPlastic()), 0, 0.0048, -0.026));
  for (const x of [-0.028, 0, 0.028]) {
    const toroid = ring(0.0085, 0.0038, mat.blackPlastic());
    toroid.rotation.x = Math.PI / 2;
    toroid.position.set(x, 0.0048, 0.062);
    board.add(toroid);
  }
  board.add(place(box(0.064, 0.012, 0.01, material('terminal-green', { color: 0x2e8b4a, roughness: 0.5 }), 0.001), 0, 0.0068, 0.082));
  if (gsm) {
    const modem = pcb(0.032, 0.026, { passives: 8, seed: 5, colour: mat.pcbDark() });
    modem.position.set(-0.012, 0.012, 0.03);
    modem.add(place(box(0.016, 0.0024, 0.014, mat.steel(), 0.0004), -0.004, 0.002, 0));
    modem.add(place(box(0.008, 0.0016, 0.012, mat.gold()), 0.011, 0.0016, 0));
    board.add(modem);
    for (const x of [-0.026, 0.002]) board.add(place(post(0.0012, 0.0012, 0.011, mat.steel(), 8), x, 0.0062, 0.02));
  }
  return board;
}

/**
 * Wall-mount three-phase starter family (MSS Starter, GSM Starter, Cyclic Timer, AgriAuto).
 * Origin at the centre of the mounting shelf; the front faces +Z.
 */
export function wallStarter(id, o) {
  const W = 0.19;
  const H = 0.24;
  const D = 0.105;
  const baseY = 0.03;
  const top = baseY + H;
  const zFront = D / 2;
  const housingDepth = 0.062;
  const coverDepth = D - housingDepth;
  const fy = top - 0.068;

  const housing = group('housing');
  housing.add(place(box(W, H, housingDepth, mat.whitePlastic(), 0.008), 0, baseY + H / 2, -D / 2 + housingDepth / 2));
  housing.add(place(box(W - 0.024, H - 0.024, 0.004, mat.greyPlastic(), 0.002), 0, baseY + H / 2, -D / 2 - 0.0015));

  if (o.bottom === 'terminals') {
    const shelf = plate(W + 0.066, D + 0.006, 0.0022, mat.whitePlastic(), {
      radius: 0.003,
      holes: [[-(W / 2 + 0.019), 0, 0.0038], [W / 2 + 0.019, 0, 0.0038]],
    });
    shelf.rotation.x = -Math.PI / 2;
    shelf.position.set(0, 0.0011, 0);
    housing.add(shelf);
    housing.add(place(terminalBlock(6, 0.0128), 0, 0.0022, zFront - 0.017));
  }

  if (o.bottom === 'glands') {
    const colours = [['green', 'yellow'], ['red', 'blue'], ['black', 'red']];
    [-0.052, 0, 0.052].forEach((x, i) => {
      housing.add(place(cableGland(), x, baseY, 0.012));
      colours[i].forEach((colour, j) => {
        const dx = (j - 0.5) * 0.004;
        const sway = (i - 1) * 0.03;
        housing.add(wire([
          [x + dx, baseY - 0.02, 0.012],
          [x + dx * 2 + sway * 0.3, baseY - 0.06, 0.03 + j * 0.006],
          [x + sway + dx * 3, baseY - 0.1, 0.06 - i * 0.008],
          [x + sway * 1.6 - 0.02, baseY - 0.125, 0.09 - j * 0.01],
          [x + sway * 2 - 0.035 + j * 0.01, baseY - 0.105, 0.12],
        ], 0.0019, colour));
      });
    });
    const clampA = ring(0.0155, 0.0068, mat.blackPlastic());
    clampA.position.set(W / 2 + 0.06, baseY - 0.035, 0.05);
    clampA.rotation.y = -0.5;
    const clampB = ring(0.0155, 0.0068, mat.blackPlastic());
    clampB.position.set(W / 2 + 0.105, baseY - 0.012, 0.03);
    clampB.rotation.y = -0.35;
    housing.add(clampA, clampB);
    for (const [cx, cy, cz] of [[W / 2 + 0.06, baseY - 0.035, 0.05], [W / 2 + 0.105, baseY - 0.012, 0.03]]) {
      for (const [colour, dz] of [['red', -0.003], ['black', 0.003]]) {
        housing.add(wire([
          [cx - 0.006, cy - 0.019, cz + dz],
          [cx - 0.02, cy - 0.05, cz + 0.01 + dz],
          [0.07, baseY - 0.075, 0.03 + dz],
          [0.052, baseY - 0.024, 0.012 + dz],
        ], 0.0012, colour));
      }
    }
  }

  if (o.antenna) {
    const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.0056, 0.0056, 0.004, 6), mat.gold());
    nut.rotation.z = Math.PI / 2;
    nut.position.set(-W / 2 - 0.002, top - 0.032, -0.012);
    const barrel = post(0.0032, 0.0032, 0.009, mat.gold(), 16);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(-W / 2 - 0.0085, top - 0.032, -0.012);
    housing.add(nut, barrel);
    if (o.antenna === 'whip') {
      const tilt = 0.2;
      const length = 0.082;
      const whip = post(0.0036, 0.0046, length, mat.blackPlastic(), 18);
      whip.rotation.z = tilt;
      whip.position.set(-W / 2 - 0.013 - Math.sin(tilt) * length / 2, top - 0.032 + Math.cos(tilt) * length / 2, -0.012);
      housing.add(whip);
    }
  }

  if (o.vents) {
    for (let i = 0; i < 7; i++) {
      housing.add(place(box(0.0012, 0.0028, 0.034, mat.darkPlastic(), 0.0005), W / 2 + 0.0002, baseY + 0.1 + i * 0.0075, -0.012));
    }
  }

  const cover = group('cover');
  cover.add(place(box(W, H, coverDepth, mat.whitePlastic(), 0.008), 0, baseY + H / 2, zFront - coverDepth / 2));

  const faceZ = zFront;
  const printZ = faceZ + 0.0007 + LIFT;
  cover.add(place(plate(0.154, 0.106, 0.0007, mat.membrane(), { radius: 0.003 }), 0, fy, faceZ + 0.00035));
  cover.add(place(label(o.title, o.titleFont === 'serif' ? 0.0078 : 0.0066, mat.ink(), { font: o.titleFont === 'serif' ? fonts.serif : fonts.sans }), 0, fy + 0.042, printZ));

  cover.add(place(plate(0.076, 0.026, 0.0012, mat.displayGlass(), { radius: 0.0016 }), 0, fy + 0.019, faceZ + 0.0013));
  const readout = sevenSegment(o.digits, 0.0158);
  readout.position.set(0, fy + 0.019, faceZ + 0.0022);
  cover.add(readout);

  if (o.gsmIcons) {
    [0.0018, 0.0028, 0.0038, 0.0048].forEach((h, i) => {
      cover.add(place(box(0.0013, h, 0.0003, mat.ink()), -0.066 + i * 0.0021, fy + 0.017 + h / 2, printZ));
    });
    cover.add(place(label('Antenna', 0.0024, mat.ink(), { align: 'left' }), -0.0675, fy + 0.012, printZ));
    cover.add(place(box(0.008, 0.0055, 0.0003, mat.ink()), -0.0635, fy + 0.0045, printZ));
    cover.add(place(label('SIM', 0.0024, mat.ink(), { align: 'left' }), -0.0585, fy + 0.0045, printZ));
  }

  const left = ['Network', 'Stator Issue', 'Over Load', 'Phase Fail'];
  const right = ['Normal / Motor ON', 'Voltage Unbalance', 'Dry Run', 'Cable Fault'];
  left.forEach((text, i) => {
    const y = fy - 0.006 - i * 0.0105;
    cover.add(place(label(text, 0.0029, mat.ink(), { align: 'right', font: fonts.sansLight }), -0.044, y, printZ));
    cover.add(place(led('red', false), -0.0395, y, faceZ + 0.0016));
  });
  right.forEach((text, i) => {
    const y = fy - 0.006 - i * 0.0105;
    cover.add(place(led(i === 0 ? 'green' : 'red', i === 0), 0.025, y, faceZ + 0.0016));
    cover.add(place(label(text, 0.0029, mat.ink(), { align: 'left', font: fonts.sansLight }), 0.0295, y, printZ));
  });

  [-0.0165, -0.0025, 0.0115].forEach((x, i) => {
    cover.add(place(disc(0.0033, 0.003, mat.chip(), 20), x, fy - 0.005, faceZ + 0.0022));
    if (i === 1) cover.add(place(label('OK', 0.0026, mat.ink()), x, fy - 0.0135, printZ));
    else cover.add(place(triangle(0.0042, mat.ink(), i === 0 ? 0 : -Math.PI / 2), x, fy - 0.0135, printZ));
  });
  cover.add(place(label('IGDS', 0.0094, mat.ink(), { font: fonts.serif }), -0.006, fy - 0.045, printZ));

  const rockerY = baseY + 0.074;
  [[-0.046, mat.red()], [0, mat.green()], [0.046, mat.red()]].forEach(([x, colour]) => {
    cover.add(place(rocker(colour), x, rockerY, faceZ + 0.002));
  });
  cover.add(place(label('OFF', 0.0046, mat.ink()), -0.046, rockerY + 0.029, faceZ + LIFT));
  cover.add(place(label('ON', 0.0046, mat.ink()), 0, rockerY + 0.029, faceZ + LIFT));
  if (o.manualAuto) {
    cover.add(place(label('MANUAL', 0.0042, mat.ink(), { align: 'left' }), 0.0625, rockerY + 0.009, faceZ + LIFT));
    cover.add(place(label('AUTO', 0.0042, mat.ink(), { align: 'left' }), 0.0625, rockerY - 0.012, faceZ + LIFT));
  }
  if (o.bottom === 'terminals') {
    cover.add(place(label('INPUT', 0.0034, mat.ink()), -0.026, baseY + 0.009, faceZ + LIFT));
    cover.add(place(label('OUTPUT', 0.0034, mat.ink()), 0.026, baseY + 0.009, faceZ + LIFT));
  }
  if (o.sticker) {
    cover.add(place(disc(0.0098, 0.0005, mat.sticker(), 28), W / 2 - 0.019, top - 0.018, faceZ + 0.00025));
    cover.add(place(label('OK', 0.0044, mat.ink()), W / 2 - 0.019, top - 0.0165, faceZ + 0.0006));
    cover.add(place(label('Tested', 0.0026, mat.ink(), { font: fonts.sansLight }), W / 2 - 0.019, top - 0.0215, faceZ + 0.0006));
  }

  const board = group('board');
  const controller = starterBoard(0.16, 0.19, { gsm: Boolean(o.antenna) || o.gsmIcons });
  controller.rotation.x = Math.PI / 2;
  controller.position.set(0, baseY + H / 2, -D / 2 + 0.021);
  board.add(controller);

  const anchors = {
    display: { position: [0, fy + 0.019, faceZ + 0.003], part: 'cover' },
    keys: { position: [-0.0025, fy - 0.005, faceZ + 0.004], part: 'cover' },
    faults: { position: [-0.0395, fy - 0.022, faceZ + 0.002], part: 'cover' },
    switches: { position: [0, rockerY, faceZ + 0.012], part: 'cover' },
    board: { position: [0.02, baseY + H / 2 + 0.03, -D / 2 + 0.05], part: 'board' },
  };
  if (o.bottom === 'terminals') anchors.terminals = { position: [0, 0.019, zFront - 0.004], normal: [0, 0.4, 1] };
  if (o.bottom === 'glands') {
    anchors.glands = { position: [0, baseY - 0.02, 0.02], normal: [0, -0.3, 1] };
    anchors.clamps = { position: [W / 2 + 0.06, baseY - 0.02, 0.06], normal: [0.3, 0, 1] };
  }
  if (o.antenna) anchors.antenna = { position: [-W / 2 - 0.022, top - 0.005, -0.012], normal: [-1, 0, 0.4] };

  return buildModel({
    id,
    parts: [housing, board, cover],
    anchors,
    motion: { kind: 'translate', name: 'explode', offsets: { cover: [0, 0.17, 0.14], board: [0, 0.015, 0.06] } },
  });
}

/** Single-phase digital starter with water-level control: a flat unit with controls on its lid. */
export function singlePhaseStarter(id) {
  const W = 0.28;
  const D = 0.205;
  const baseH = 0.07;
  const lidH = 0.046;
  const feet = 0.006;
  const lidTop = feet + baseH + lidH;
  const zFront = D / 2;

  const base = group('base');
  base.add(place(box(W, baseH, D, mat.whitePlastic(), 0.006), 0, feet + baseH / 2, 0));
  for (const x of [-W / 2 + 0.02, W / 2 - 0.02]) {
    for (const z of [-D / 2 + 0.02, D / 2 - 0.02]) base.add(place(post(0.008, 0.009, feet, mat.rubber(), 16), x, feet / 2, z));
  }
  for (const side of [-1, 1]) {
    const flange = plate(0.036, 0.07, 0.002, mat.whitePlastic(), { radius: 0.004, holes: [[side * 0.004, 0, 0.0042]] });
    flange.rotation.x = -Math.PI / 2;
    flange.position.set(side * (W / 2 + 0.017), 0.008, D / 2 - 0.06);
    base.add(flange);
    for (let i = 0; i < 7; i++) {
      base.add(place(box(0.0016, 0.022, 0.034, mat.aluminium()), side * (W / 2 - 0.022 - i * 0.006), feet + 0.012, zFront - 0.002));
    }
  }
  base.add(place(terminalBlock(3, 0.0115), -0.088, feet + 0.016, zFront + 0.009));
  base.add(place(terminalBlock(5, 0.0135), 0.03, feet + 0.016, zFront + 0.009));
  const faceZ = zFront + LIFT;
  base.add(place(label('UPPER', 0.0036, mat.ink()), -0.1, feet + 0.052, faceZ));
  base.add(place(label('LOWER', 0.0036, mat.ink()), -0.076, feet + 0.052, faceZ));
  base.add(place(label('INPUT', 0.0036, mat.ink()), 0.006, feet + 0.058, faceZ));
  base.add(place(label('L   N', 0.0052, mat.ink()), 0.006, feet + 0.047, faceZ));
  base.add(place(label('MOTOR', 0.0036, mat.ink()), 0.054, feet + 0.058, faceZ));
  base.add(place(label('R   B', 0.0052, mat.inkRed()), 0.054, feet + 0.047, faceZ));

  const lid = group('lid');
  lid.add(place(box(W, lidH, D, mat.whitePlastic(), 0.008), 0, feet + baseH + lidH / 2, 0));
  const onTop = (object, x, z, lift = LIFT) => {
    object.rotation.x = -Math.PI / 2;
    object.position.set(x, lidTop + lift, z);
    lid.add(object);
    return object;
  };
  onTop(label('SINGLE PHASE DIGITAL STARTER', 0.0058, mat.ink()), 0.03, -0.077);
  onTop(disc(0.0125, 0.0006, mat.membraneWhite(), 28), -0.106, -0.07, 0.0003);
  onTop(ring(0.0125, 0.0007, mat.ink(), 6, 40), -0.106, -0.07, 0.0006);
  onTop(label('With', 0.0034, mat.ink(), { font: fonts.serif }), -0.106, -0.073, 0.0008);
  onTop(label('WLC', 0.0044, mat.ink(), { font: fonts.serif }), -0.106, -0.066, 0.0008);

  onTop(plate(0.072, 0.024, 0.0012, mat.displayGlass(), { radius: 0.0015 }), 0.03, -0.054, 0.0006);
  const readout = sevenSegment(' 230', 0.0145);
  onTop(readout, 0.03, -0.054, 0.0015);
  onTop(label('Set Current', 0.0032, mat.ink(), { font: fonts.sansLight }), 0.03, -0.035);
  onTop(disc(0.0034, 0.003, mat.chip(), 20), 0.03, -0.028, 0.0015);

  [['Upper Tank Full', 'yellow', false], ['Lower Tank Full', 'yellow', true]].forEach(([text, colour, lit], i) => {
    const z = -0.046 + i * 0.012;
    onTop(label(text, 0.0034, mat.ink(), { align: 'right', font: fonts.sansLight }), -0.056, z);
    onTop(led(colour, lit, 0.0026), -0.05, z, 0.0009);
  });
  [['Normal / Motor On', 'green', true], ['Over / Under Voltage', 'red', false], ['Dry Run', 'red', false], ['Over Load', 'red', false]].forEach(([text, colour, lit], i) => {
    const z = -0.046 + i * 0.011;
    onTop(led(colour, lit, 0.0026), 0.077, z, 0.0009);
    onTop(label(text, 0.0034, mat.ink(), { align: 'left', font: fonts.sansLight }), 0.083, z);
  });
  onTop(label('IGDS', 0.0115, mat.ink(), { font: fonts.serif }), -0.012, -0.004);

  const rockOn = rocker(mat.red(), { w: 0.026, h: 0.02, tilt: 0.12 });
  onTop(rockOn, -0.098, 0.04, 0.002);
  onTop(label('ON', 0.0052, mat.ink()), -0.098, 0.019);
  const bezel = post(0.0225, 0.0235, 0.004, mat.greenGlow(), 40);
  bezel.position.set(-0.03, lidTop + 0.002, 0.042);
  lid.add(bezel);
  const cap = post(0.0185, 0.0195, 0.011, mat.greenGlow(), 40);
  cap.position.set(-0.03, lidTop + 0.0095, 0.042);
  lid.add(cap);
  const rockMode = rocker(mat.red(), { w: 0.026, h: 0.02, tilt: -0.12 });
  onTop(rockMode, 0.046, 0.05, 0.002);
  onTop(label('MANUAL', 0.0052, mat.ink(), { align: 'left' }), 0.066, 0.043);
  onTop(label('AUTO', 0.0052, mat.ink(), { align: 'left' }), 0.066, 0.064);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.0085, 0.0095, 0.012, 14), mat.blackPlastic());
  knob.position.set(0.114, lidTop + 0.006, -0.02);
  lid.add(knob);
  lid.add(place(box(0.0016, 0.0008, 0.008, mat.inkWhite()), 0.114, lidTop + 0.0122, -0.0225));

  const internals = group('internals');
  const board = pcb(0.24, 0.17, { passives: 60, seed: 31, keepOut: [[-0.12, -0.085, -0.02, 0.0], [0.02, -0.085, 0.12, 0.085]], silkLines: [['IG DRIVES AND SYSTEMS', 0.004, -0.04, 0.07]] });
  board.position.set(0, feet + 0.03, 0);
  internals.add(board);
  const startCap = post(0.017, 0.017, 0.056, material('cap-black', { color: 0x1b1b1d, roughness: 0.4 }), 28);
  startCap.rotation.z = Math.PI / 2;
  startCap.position.set(-0.07, feet + 0.03 + 0.018, -0.04);
  internals.add(startCap);
  internals.add(place(post(0.019, 0.019, 0.05, mat.greyPlastic(), 28), 0.06, feet + 0.03 + 0.026, -0.03));
  internals.add(place(post(0.0186, 0.0186, 0.0008, mat.capTop(), 28), 0.06, feet + 0.03 + 0.0515, -0.03));
  internals.add(place(box(0.034, 0.03, 0.04, mat.relay(), 0.002), 0.07, feet + 0.03 + 0.016, 0.045));
  internals.add(place(box(0.03, 0.026, 0.026, mat.transformer(), 0.002), -0.02, feet + 0.03 + 0.014, 0.04));
  const ct = ring(0.011, 0.005, mat.blackPlastic());
  ct.rotation.x = Math.PI / 2;
  ct.position.set(0.012, feet + 0.035, -0.035);
  internals.add(ct);
  internals.add(place(chip(0.012, 0.012), -0.075, feet + 0.031, 0.045));

  return buildModel({
    id,
    parts: [base, internals, lid],
    anchors: {
      display: { position: [0.03, lidTop + 0.003, -0.054], normal: [0, 1, 0.3], part: 'lid' },
      button: { position: [-0.03, lidTop + 0.016, 0.042], normal: [0, 1, 0.4], part: 'lid' },
      knob: { position: [0.114, lidTop + 0.013, -0.02], normal: [0, 1, 0.3], part: 'lid' },
      level: { position: [-0.05, lidTop + 0.002, -0.04], normal: [0, 1, 0.3], part: 'lid' },
      mode: { position: [0.046, lidTop + 0.006, 0.05], normal: [0, 1, 0.4], part: 'lid' },
      capacitors: { position: [-0.07, feet + 0.07, -0.04], normal: [0, 1, 0.5], part: 'internals' },
      terminals: { position: [0.03, feet + 0.03, zFront + 0.02], normal: [0, 0.2, 1] },
    },
    motion: { kind: 'translate', name: 'explode', offsets: { lid: [0, 0.13, 0], internals: [0, 0.06, 0] } },
  });
}
