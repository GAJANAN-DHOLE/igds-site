import {
  mat, box, disc, post, plate, label, led, sevenSegment, pcb, chip, group, place, buildModel,
} from './lib.mjs';

const LIFT = 0.0004;

function sensorPillar(x, seed) {
  const sensors = group('s');
  sensors.add(place(box(0.02, 1.72, 0.02, mat.darkPlastic(), 0.004), x, 0.9, 0.14));
  for (let i = 0; i < 8; i++) {
    const board = pcb(0.12, 0.17, { passives: 6, seed: seed + i, silkLines: [[`S${i + 1}`, 0.007, -0.03, 0.0]] });
    board.add(place(chip(0.014, 0.014), 0.012, 0.0008, 0.02));
    board.add(place(disc(0.007, 0.004, mat.copper(), 16), -0.012, 0.003, -0.03, Math.PI / 2));
    board.rotation.x = Math.PI / 2;
    board.position.set(x, 0.2 + i * 0.2, 0.158);
    sensors.add(board);
  }
  return sensors.children;
}

function pillarShell(name, x) {
  const shell = group(name);
  const z = 0.15;
  const front = z + 0.06;
  shell.add(place(box(0.16, 1.9, 0.12, mat.medicalWhite(), 0.018), x, 0.97, z));
  shell.add(place(box(0.17, 0.05, 0.13, mat.medicalGrey(), 0.014), x, 0.035, z));
  shell.add(place(plate(0.07, 1.54, 0.004, mat.darkPlastic(), { radius: 0.01 }), x, 0.95, front + 0.002));
  for (let i = 0; i < 18; i++) {
    const colour = i < 8 ? 'green' : i < 14 ? 'yellow' : 'red';
    shell.add(place(led(colour, i < 6, 0.0135), x, 0.27 + i * 0.0785, front + 0.005));
  }
  shell.add(place(post(0.045, 0.05, 0.05, mat.medicalGrey(), 24), x, 1.945, z));
  shell.add(place(post(0.042, 0.042, 0.06, mat.acrylic(), 24), x, 1.998, z));
  shell.add(place(led('amber', false, 0.02), x, 1.865, front + 0.002));
  return shell;
}

/** Two sensor pillars either side of the Zone IV door, with a status display and door interlock. */
export function mriDetector(id) {
  const wallZ = 0.06;
  const opening = 0.62;
  const doorH = 2.12;
  const room = group('room');

  room.add(place(box(3.8, 0.02, 2.4, mat.floor()), 0, -0.01, 0.9));
  for (const side of [-1, 1]) room.add(place(box(1.1, 2.4, 0.12, mat.wall()), side * (opening + 0.55), 1.2, 0));
  room.add(place(box(opening * 2, 2.4 - doorH, 0.12, mat.wall()), 0, (doorH + 2.4) / 2, 0));
  for (const side of [-1, 1]) room.add(place(box(0.04, doorH, 0.14, mat.medicalGrey(), 0.004), side * (opening - 0.02), doorH / 2, 0));
  room.add(place(box(opening * 2, 0.04, 0.14, mat.medicalGrey(), 0.004), 0, doorH - 0.02, 0));
  room.add(place(box(opening * 2 - 0.08, doorH - 0.04, 0.045, mat.medicalWhite(), 0.004), 0, (doorH - 0.04) / 2, 0));
  room.add(place(box(0.14, 0.02, 0.02, mat.steel(), 0.008), 0.4, 1.0, 0.045));
  room.add(place(box(0.04, 0.04, 0.012, mat.steel(), 0.004), 0.47, 1.0, 0.03));

  room.add(place(plate(0.34, 0.22, 0.004, mat.safetyYellow(), { radius: 0.01 }), 0, 1.55, 0.0245));
  room.add(place(label('MRI', 0.085, mat.ink()), 0, 1.6, 0.0267));
  room.add(place(label('ZONE IV', 0.04, mat.ink()), 0, 1.5, 0.0267));

  room.add(place(box(0.38, 0.14, 0.05, mat.medicalGrey(), 0.012), 0, 2.26, wallZ + 0.025));
  room.add(place(plate(0.32, 0.095, 0.004, mat.displayGlass(), { radius: 0.006 }), 0, 2.26, wallZ + 0.052));
  room.add(place(label('CLEAR', 0.052, mat.greenGlow()), 0, 2.26, wallZ + 0.0545));

  room.add(place(box(0.16, 0.22, 0.05, mat.medicalGrey(), 0.01), -1.35, 1.25, wallZ + 0.025));
  room.add(place(label('DOOR INTERLOCK', 0.0125, mat.ink()), -1.35, 1.32, wallZ + 0.0504));
  room.add(place(led('green', true, 0.009), -1.385, 1.265, wallZ + 0.0512));
  room.add(place(led('red', false, 0.009), -1.315, 1.265, wallZ + 0.0512));
  room.add(place(disc(0.021, 0.012, mat.steel(), 24), -1.35, 1.19, wallZ + 0.054));
  room.add(place(box(0.004, 0.026, 0.004, mat.ink()), -1.35, 1.19, wallZ + 0.061));

  room.add(place(box(3.6, 0.004, 0.07, mat.safetyYellow()), 0, 0.002, 1.0));
  const floorText = label('ZONE III  SCREENING POINT', 0.09, mat.inkWhite());
  floorText.rotation.x = -Math.PI / 2;
  floorText.position.set(0, 0.0045, 1.14);
  room.add(floorText);

  const [boardsLeft, boardsRight] = [sensorPillar(-0.76, 100), sensorPillar(0.76, 200)];
  const sensors = group('sensors', ...boardsLeft, ...boardsRight);

  return buildModel({
    id,
    parts: [room, sensors, pillarShell('shellL', -0.76), pillarShell('shellR', 0.76)],
    anchors: {
      pillars: { position: [-0.76, 1.1, 0.22], part: 'shellL' },
      leds: { position: [0.76, 0.95, 0.22], part: 'shellR' },
      beacon: { position: [0.76, 2.03, 0.15], normal: [0, 1, 0.3], part: 'shellR' },
      sensors: { position: [-0.76, 0.9, 0.17], part: 'sensors' },
      status: { position: [0, 2.26, wallZ + 0.058] },
      interlock: { position: [-1.35, 1.25, wallZ + 0.056] },
      zone: { position: [0, 0.01, 1.0], normal: [0, 1, 0.4] },
    },
    motion: { kind: 'translate', name: 'explode', offsets: { shellL: [-0.38, 0, 0], shellR: [0.38, 0, 0] } },
  });
}

const PIVOT = [0, 1.25, 0.22];

/** Digital mammography gantry: column, carriage and a C-arm that rotates from -45 to +45 degrees. */
export function mammography(id) {
  const frame = group('frame');
  frame.add(place(box(0.66, 0.12, 0.7, mat.medicalGrey(), 0.03), 0, 0.06, 0.0));
  for (const x of [-0.26, 0.26]) for (const z of [-0.25, 0.25]) {
    const wheel = post(0.05, 0.05, 0.05, mat.rubber(), 20);
    wheel.rotation.z = Math.PI / 2;
    frame.add(place(wheel, x, 0.05, z, 0, 0, Math.PI / 2));
  }
  frame.add(place(box(0.3, 1.52, 0.24, mat.medicalWhite(), 0.05), 0, 0.88, -0.1));
  frame.add(place(box(0.34, 0.36, 0.2, mat.medicalWhite(), 0.045), 0, PIVOT[1], 0.12));
  frame.add(place(box(0.26, 0.05, 0.02, mat.medicalGrey(), 0.006), 0, 1.5, 0.025));
  frame.add(place(box(0.1, 0.03, 0.08, mat.darkPlastic(), 0.01), -0.12, 0.13, 0.46));
  frame.add(place(box(0.1, 0.03, 0.08, mat.darkPlastic(), 0.01), 0.04, 0.13, 0.46));

  const carm = group('carm');
  carm.position.set(...PIVOT);
  carm.add(place(disc(0.09, 0.03, mat.medicalGrey(), 36), 0, 0, 0.005));
  carm.add(place(box(0.14, 0.95, 0.07, mat.medicalWhite(), 0.03), 0, 0.02, 0.05));
  carm.add(place(box(0.17, 0.17, 0.36, mat.medicalWhite(), 0.05), 0, 0.43, 0.22));
  carm.add(place(box(0.12, 0.04, 0.12, mat.darkPlastic(), 0.01), 0, 0.335, 0.28));
  carm.add(place(plate(0.22, 0.13, 0.004, mat.acrylic(), { radius: 0.012 }), 0, 0.43, 0.405));
  carm.add(place(box(0.35, 0.07, 0.4, mat.medicalWhite(), 0.02), 0, -0.34, 0.22));
  carm.add(place(box(0.31, 0.006, 0.37, mat.darkPlastic(), 0.002), 0, -0.3, 0.235));
  const outline = [[0.232, 0.002, 0, -0.1485 + 0.235], [0.232, 0.002, 0, 0.1485 + 0.235], [0.002, 0.297, -0.116, 0.235], [0.002, 0.297, 0.116, 0.235]];
  for (const [w, d, x, z] of outline) carm.add(place(box(w, 0.0006, d, mat.inkWhite()), x, -0.2965, z));
  carm.add(place(box(0.12, 0.07, 0.2, mat.medicalGrey(), 0.012), 0, -0.17, 0.12));
  carm.add(place(box(0.25, 0.004, 0.31, mat.acrylic(), 0.002), 0, -0.17, 0.255));
  carm.add(place(box(0.25, 0.045, 0.004, mat.acrylic()), 0, -0.1475, 0.1));
  for (const x of [-0.19, 0.19]) {
    carm.add(place(post(0.011, 0.011, 0.17, mat.medicalGrey(), 16), x, -0.2, 0.09));
    carm.add(place(box(0.05, 0.02, 0.02, mat.medicalGrey(), 0.006), x * 0.84, -0.12, 0.09));
  }
  carm.add(place(plate(0.1, 0.06, 0.004, mat.displayGlass(), { radius: 0.006 }), 0, 0.14, 0.087));
  const kv = sevenSegment('28.0', 0.026);
  kv.position.set(0, 0.14, 0.0905);
  carm.add(kv);
  carm.add(place(label('kV', 0.01, mat.inkWhite(), { align: 'left' }), 0.031, 0.118, 0.087 + LIFT));

  const station = group('station');
  station.add(place(box(0.95, 0.04, 0.5, mat.medicalWhite(), 0.01), 1.15, 0.74, 0.25));
  for (const x of [0.72, 1.58]) station.add(place(box(0.03, 0.72, 0.46, mat.medicalGrey(), 0.006), x, 0.36, 0.25));
  station.add(place(box(0.52, 0.32, 0.03, mat.darkPlastic(), 0.01), 1.15, 1.04, 0.12));
  station.add(place(box(0.05, 0.16, 0.05, mat.darkPlastic(), 0.01), 1.15, 0.84, 0.12));
  station.add(place(plate(0.48, 0.28, 0.004, mat.screenGlass(), { radius: 0.006 }), 1.15, 1.04, 0.1365));
  station.add(place(label('REGISTRATION', 0.026, mat.inkWhite(), { align: 'left' }), 0.935, 1.14, 0.139));
  ['RCC', 'LCC', 'RMLO', 'LMLO'].forEach((view, i) => {
    station.add(place(plate(0.09, 0.07, 0.003, mat.blueKey(), { radius: 0.004 }), 0.96 + i * 0.1, 1.04, 0.1395));
    station.add(place(label(view, 0.018, mat.inkWhite()), 0.96 + i * 0.1, 1.04, 0.142));
  });
  station.add(place(box(0.4, 0.012, 0.13, mat.darkPlastic(), 0.004), 1.15, 0.766, 0.33));
  station.add(place(box(0.5, 1.0, 0.45, mat.medicalWhite(), 0.02), -1.05, 0.5, 0.0));
  station.add(place(plate(0.3, 0.12, 0.004, mat.displayGlass(), { radius: 0.006 }), -1.05, 0.78, 0.227));
  const gen = sevenSegment('28.0', 0.05);
  gen.position.set(-1.115, 0.78, 0.2295);
  station.add(gen);
  station.add(place(label('kV', 0.018, mat.inkWhite(), { align: 'left' }), -0.995, 0.78, 0.227 + LIFT * 2));
  station.add(place(label('GENERATOR', 0.032, mat.ink()), -1.05, 0.62, 0.227 + LIFT));

  const floor = group('floor', place(box(3.4, 0.02, 2.0, mat.floor()), 0, -0.01, 0.3));

  const at = (x, y, z) => [x, PIVOT[1] + y, PIVOT[2] + z];
  return buildModel({
    id,
    parts: [floor, frame, carm, station],
    anchors: {
      tube: { position: at(0, 0.43, 0.42), normal: [0, 0.3, 1], part: 'carm' },
      paddle: { position: at(0, -0.17, 0.36), normal: [0, 1, 0.4], part: 'carm' },
      detector: { position: at(0.12, -0.3, 0.36), normal: [0, 1, 0.3], part: 'carm' },
      grips: { position: at(0.19, -0.18, 0.09), normal: [1, 0, 0.4], part: 'carm' },
      panel: { position: at(0, 0.14, 0.095), part: 'carm' },
      workstation: { position: [1.15, 1.04, 0.16], normal: [0, 0.2, 1] },
      generator: { position: [-1.05, 0.78, 0.23] },
    },
    motion: { kind: 'rotate', name: 'rotate', part: 'carm', pivot: PIVOT, axis: [0, 0, 1], from: -45, to: 45 },
  });
}
