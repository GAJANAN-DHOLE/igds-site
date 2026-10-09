import {
  THREE, mat, material, box, disc, post, plate, label, led, pcb, chip, group, place, fonts, buildModel,
} from './lib.mjs';

const BOARD_W = 0.2;
const BOARD_D = 0.1;
const T = 0.0008;

function hdmi() {
  const g = new THREE.Group();
  g.add(place(box(0.0152, 0.0062, 0.0118, mat.steel(), 0.0006), 0, 0.0031 + T, 0));
  g.add(place(box(0.0118, 0.0028, 0.0012, mat.chip()), 0, 0.0033 + T, -0.0058));
  return g;
}

function usb3(stacked = false) {
  const g = new THREE.Group();
  const h = stacked ? 0.0156 : 0.0068;
  g.add(place(box(0.0136, h, 0.017, mat.steel(), 0.0005), 0, h / 2 + T, 0));
  const tongues = stacked ? [0.0045, 0.0115] : [0.0034];
  for (const y of tongues) g.add(place(box(0.011, 0.0018, 0.0012, stacked ? mat.chip() : mat.usbBlue()), 0, y + T, -0.0084));
  return g;
}

function rj45() {
  const g = new THREE.Group();
  g.add(place(box(0.0162, 0.0136, 0.021, mat.steel(), 0.0006), 0, 0.0068 + T, 0));
  g.add(place(box(0.0118, 0.0082, 0.0012, mat.chip()), 0, 0.0064 + T, -0.0104));
  g.add(place(disc(0.0011, 0.0006, material('led-green-lit', {}), 10), -0.0056, 0.0118 + T, -0.0106));
  g.add(place(disc(0.0011, 0.0006, material('led-amber-lit', { color: 0xff9a1a, emissive: 0xff9a1a, emissiveIntensity: 3 }), 10), 0.0056, 0.0118 + T, -0.0106));
  return g;
}

function audioJack(ringColour) {
  const g = new THREE.Group();
  g.add(place(box(0.0062, 0.0052, 0.0122, mat.chip(), 0.0004), 0, 0.0026 + T, 0));
  const collar = post(0.0026, 0.0026, 0.002, material(`jack-${ringColour}`, { color: ringColour, roughness: 0.45 }), 16);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 0.0028 + T, -0.0068);
  g.add(collar);
  return g;
}

function dcJack() {
  const g = new THREE.Group();
  g.add(place(box(0.009, 0.011, 0.0142, mat.chip(), 0.0006), 0, 0.0055 + T, 0));
  const pin = post(0.0016, 0.0016, 0.002, mat.steel(), 12);
  pin.rotation.x = Math.PI / 2;
  pin.position.set(0, 0.0058 + T, -0.0072);
  g.add(pin);
  return g;
}

function fpc() {
  const g = new THREE.Group();
  g.add(place(box(0.0205, 0.003, 0.0052, mat.connectorBeige(), 0.0003), 0, 0.0015 + T, 0));
  g.add(place(box(0.0205, 0.0012, 0.0022, mat.chip()), 0, 0.0034 + T, 0.0012));
  return g;
}

function pinHeader(columns, rows = 2) {
  const g = new THREE.Group();
  const pitch = 0.00254;
  g.add(place(box(columns * pitch, 0.0025, rows * pitch, mat.chip()), 0, 0.00125 + T, 0));
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows; r++) {
      g.add(place(box(0.00064, 0.0062, 0.00064, mat.gold()), (c - (columns - 1) / 2) * pitch, 0.0031 + T, (r - (rows - 1) / 2) * pitch));
    }
  }
  return g;
}

function tactile() {
  const g = new THREE.Group();
  g.add(place(box(0.006, 0.0018, 0.006, mat.steel()), 0, 0.0009 + T, 0));
  g.add(place(post(0.0017, 0.0017, 0.0016, mat.chip(), 14), 0, 0.0026 + T, 0));
  return g;
}

/**
 * The in-house Jetson carrier board, as separate parts so the module stack can be exploded.
 * Board in the XZ plane, top face at y = T, I/O along the rear edge (-Z).
 */
function carrierParts({ offsetZ = 0, y = 0 } = {}) {
  const rear = -BOARD_D / 2 + offsetZ;
  const at = (object, x, z, dy = 0) => {
    object.position.set(x, y + dy, z + offsetZ);
    return object;
  };

  const board = group('board');
  board.add(at(pcb(BOARD_W, BOARD_D, {
    holes: [[-0.093, -0.043], [0.093, -0.043], [-0.093, 0.043], [0.093, 0.043], [-0.035, 0.03]],
    passives: 150,
    seed: 77,
    keepOut: [[-0.058, -0.012, 0.018, 0.04], [0.028, 0.022, 0.084, 0.048], [0.052, -0.04, 0.09, 0.006], [-0.1, -0.05, 0.1, -0.036], [-0.078, 0.038, -0.022, 0.05]],
    silkLines: [['IG DRIVES AND SYSTEMS', 0.0031, 0.045, 0.012], ['IG2HD  2-CH HDMI', 0.0027, 0.045, 0.0175], ['PWR  RST  REC', 0.0024, 0.0755, 0.036]],
  }), 0, 0));
  board.add(place(hdmi(), -0.08, y, rear + 0.0049));
  board.add(place(hdmi(), -0.062, y, rear + 0.0049));
  board.add(place(audioJack(0xd88aa8), -0.0455, y, rear + 0.0051));
  board.add(place(audioJack(0x5fae5a), -0.0365, y, rear + 0.0051));
  board.add(place(usb3(), -0.0225, y, rear + 0.0075));
  board.add(place(hdmi(), -0.0035, y, rear + 0.0049));
  board.add(place(rj45(), 0.035, y, rear + 0.0095));
  board.add(place(usb3(true), 0.0575, y, rear + 0.0075));
  board.add(place(dcJack(), 0.0815, y, rear + 0.0061));
  for (const z of [-0.012, 0.012]) {
    const csi = fpc();
    csi.rotation.y = Math.PI / 2;
    board.add(at(csi, -0.0915, z));
  }
  board.add(at(box(0.072, 0.0058, 0.0068, mat.chip(), 0.0004), -0.02, -0.006, 0.0029 + T));
  board.add(at(pinHeader(20), -0.05, 0.0445));
  board.add(at(pinHeader(4, 1), 0.022, 0));
  board.add(at(box(0.0062, 0.0042, 0.0245, mat.chip(), 0.0003), 0.032, 0.035, 0.0021 + T));
  board.add(at(box(0.0062, 0.0042, 0.027, mat.chip(), 0.0003), 0.0565, -0.017, 0.0021 + T));
  for (const x of [0.07, 0.0755, 0.081]) board.add(at(tactile(), x, 0.0425));
  board.add(at(box(0.012, 0.0018, 0.0125, mat.steel()), 0.09, 0.016, 0.0009 + T));
  board.add(at(chip(0.009, 0.009), -0.004, -0.028, T));
  board.add(at(chip(0.009, 0.009), 0.012, -0.028, T));
  board.add(at(chip(0.007, 0.007), 0.03, 0.012, T));

  const module = group('module');
  module.add(at(pcb(0.07, 0.045, { passives: 30, seed: 79, colour: mat.pcbDark(), keepOut: [[-0.03, -0.018, 0.03, 0.018]] }), -0.02, 0.016, 0.0072));
  module.add(at(box(0.034, 0.0018, 0.03, mat.steel(), 0.0004), -0.02, 0.016, 0.0089));

  const heatsink = group('heatsink');
  heatsink.add(at(box(0.06, 0.004, 0.045, mat.anodised(), 0.0006), -0.02, 0.016, 0.0122));
  for (let i = 0; i < 11; i++) heatsink.add(at(box(0.0016, 0.017, 0.045, mat.anodised()), -0.0475 + i * 0.0055, 0.016, 0.0225));

  const fan = group('fan');
  const fanY = 0.0365;
  fan.add(at(box(0.04, 0.0105, 0.04, mat.blackPlastic(), 0.003), -0.02, 0.016, fanY));
  fan.add(at(post(0.0175, 0.0175, 0.0003, material('fan-throat', { color: 0x0b0b0c, roughness: 0.8 }), 32), -0.02, 0.016, fanY + 0.0054));
  fan.add(at(post(0.0072, 0.0072, 0.0016, mat.chip(), 24), -0.02, 0.016, fanY + 0.0061));
  for (let i = 0; i < 7; i++) {
    const blade = box(0.0105, 0.0009, 0.0052, mat.blackPlastic());
    const angle = (i / 7) * Math.PI * 2;
    blade.position.set(-0.02 + Math.cos(angle) * 0.0125, y + fanY + 0.0062, 0.016 + offsetZ + Math.sin(angle) * 0.0125);
    blade.rotation.set(0, -angle, 0.3, 'YXZ');
    fan.add(blade);
  }
  for (const [i, colour] of [0xd9b326, 0x2457b8, 0xc0282a, 0x1a1a1a].entries()) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0005, y + fanY + 0.002, 0.011 + offsetZ + i * 0.0016),
      new THREE.Vector3(0.009, y + fanY - 0.004, 0.008 + offsetZ + i * 0.0012),
      new THREE.Vector3(0.016, y + 0.014, 0.003 + offsetZ + i * 0.0008),
      new THREE.Vector3(0.0182 + i * 0.00254, y + 0.0075, offsetZ),
    ]);
    fan.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.00055, 5, false), material(`fan-wire-${i}`, { color: colour, roughness: 0.5 })));
  }

  const ssd = group('ssd');
  ssd.add(at(pcb(0.042, 0.022, { passives: 6, seed: 83, colour: mat.pcbDark() }), 0.056, 0.035, 0.0035));
  ssd.add(at(box(0.009, 0.0012, 0.009, mat.chip(), 0.0002), 0.043, 0.035, 0.0049));
  ssd.add(at(box(0.016, 0.0012, 0.013, mat.chip(), 0.0002), 0.063, 0.035, 0.0049));
  const ssdLabel = label('1TB NVMe', 0.0026, mat.inkWhite(), { font: fonts.sans });
  ssdLabel.rotation.x = -Math.PI / 2;
  ssd.add(at(ssdLabel, 0.063, 0.035, 0.0056));

  const card = group('card');
  card.add(at(pcb(0.03, 0.027, { passives: 6, seed: 89, colour: mat.pcbDark() }), 0.0745, -0.017, 0.0058));
  card.add(at(box(0.018, 0.0024, 0.016, mat.steel(), 0.0004), 0.0765, -0.017, 0.0078));

  return { board, module, heatsink, fan, ssd, card };
}

export function carrierBoard(id) {
  const parts = carrierParts();
  return buildModel({
    id,
    parts: Object.values(parts),
    anchors: {
      csi: { position: [-0.0915, 0.006, 0], normal: [-0.6, 1, 0] },
      gpio: { position: [-0.05, 0.008, 0.0445], normal: [0, 1, 0.6] },
      usb: { position: [-0.0225, 0.01, -0.044], normal: [0, 0.6, -1] },
      ethernet: { position: [0.035, 0.016, -0.04], normal: [0, 0.6, -1] },
      hdmi: { position: [-0.071, 0.009, -0.045], normal: [0, 0.6, -1] },
      buttons: { position: [0.0755, 0.006, 0.0425], normal: [0, 1, 0.6] },
      m2: { position: [0.056, 0.008, 0.035], normal: [0, 1, 0.4], part: 'ssd' },
      minipcie: { position: [0.0765, 0.011, -0.017], normal: [0, 1, 0.3], part: 'card' },
      module: { position: [-0.0475, 0.01, 0.016], normal: [-0.3, 1, 0.6], part: 'module' },
    },
    motion: {
      kind: 'translate',
      name: 'explode',
      offsets: { fan: [0, 0.085, 0], heatsink: [0, 0.058, 0], module: [0, 0.03, 0], ssd: [0, 0.022, 0.012], card: [0, 0.022, -0.006] },
    },
  });
}

/** I2HD industrial PC: anodised enclosure around the carrier board. */
export function industrialPc(id) {
  const W = 0.214;
  const H = 0.058;
  const D = 0.126;
  const floor = 0.003;
  const boardY = floor + 0.006;
  const boardOffsetZ = -D / 2 + 0.001 + BOARD_D / 2;
  const parts = carrierParts({ offsetZ: boardOffsetZ, y: boardY });

  const chassis = group('chassis');
  chassis.add(place(box(W, floor, D, mat.anodised(), 0.001), 0, floor / 2, 0));
  for (const x of [-0.093, 0.093]) for (const z of [-0.043, 0.043]) chassis.add(place(post(0.0025, 0.0025, 0.006, mat.steel(), 10), x, floor + 0.003, z + boardOffsetZ));
  for (const x of [-W / 2 + 0.02, W / 2 - 0.02]) for (const z of [-D / 2 + 0.016, D / 2 - 0.016]) chassis.add(place(post(0.006, 0.0065, 0.004, mat.rubber(), 16), x, -0.002, z));

  const front = plate(W, H, 0.004, mat.anodised(), { radius: 0.003 });
  chassis.add(place(front, 0, H / 2, D / 2 - 0.002));
  const fz = D / 2 + 0.0002;
  chassis.add(place(label('I2HD', 0.0075, mat.inkWhite()), -0.083, H / 2 + 0.008, fz));
  chassis.add(place(led('blue', true, 0.0016), -0.096, H / 2 - 0.006, fz + 0.0006));
  chassis.add(place(led('green', true, 0.0016), -0.089, H / 2 - 0.006, fz + 0.0006));
  for (let i = 0; i < 4; i++) {
    chassis.add(place(disc(0.0058, 0.002, mat.steel(), 24), -0.064 + i * 0.016, H / 2 - 0.004, fz + 0.0008));
    chassis.add(place(disc(0.0046, 0.0024, mat.darkPlastic(), 24), -0.064 + i * 0.016, H / 2 - 0.004, fz + 0.0016));
  }
  const jacks = [
    [0.012, 0.0062, 'FOOT SW', mat.steel()],
    [0.036, 0.0042, 'MIC', material('jack-0xd88aa8', { color: 0xd88aa8, roughness: 0.45 })],
    [0.054, 0.0042, 'SPK', material('jack-0x5fae5a', { color: 0x5fae5a, roughness: 0.45 })],
  ];
  for (const [x, r, text, collar] of jacks) {
    chassis.add(place(disc(r, 0.002, collar, 24), x, H / 2 - 0.004, fz + 0.0008));
    chassis.add(place(disc(r * 0.55, 0.0024, mat.chip(), 18), x, H / 2 - 0.004, fz + 0.0011));
    chassis.add(place(label(text, 0.0026, mat.inkWhite()), x, H / 2 + 0.008, fz));
  }
  chassis.add(place(box(0.0136, 0.0068, 0.003, mat.steel(), 0.0005), 0.08, H / 2 - 0.004, fz + 0.0012));
  chassis.add(place(box(0.011, 0.0018, 0.0012, mat.usbBlue()), 0.08, H / 2 - 0.0034, fz + 0.0024));
  chassis.add(place(label('USB', 0.0026, mat.inkWhite()), 0.08, H / 2 + 0.008, fz));

  const rearZ = -D / 2 + 0.002;
  const openTop = boardY + 0.017;
  const openBottom = boardY + T;
  chassis.add(place(box(W, H - openTop, 0.004, mat.anodised(), 0.0012), 0, (H + openTop) / 2, rearZ));
  chassis.add(place(box(W, openBottom, 0.004, mat.anodised()), 0, openBottom / 2, rearZ));
  for (const x of [-W / 2 + 0.006, W / 2 - 0.006]) chassis.add(place(box(0.012, openTop - openBottom, 0.004, mat.anodised()), x, (openTop + openBottom) / 2, rearZ));
  chassis.add(place(box(W - 0.012, openTop - openBottom, 0.001, mat.chip()), 0, (openTop + openBottom) / 2, -D / 2 + 0.011));
  const rz = -D / 2 - 0.0002;
  [[-0.071, 'HDMI IN 1   2'], [-0.0035, 'HDMI OUT'], [-0.041, 'AUDIO'], [-0.0225, 'USB 3.0'], [0.035, 'LAN'], [0.0575, 'USB'], [0.0815, 'DC IN']].forEach(([x, text]) => {
    const legend = label(text, 0.0026, mat.inkWhite());
    legend.rotation.y = Math.PI;
    legend.position.set(x, openTop + 0.005, rz);
    chassis.add(legend);
  });

  const cover = group('cover');
  cover.add(place(box(W, 0.003, D - 0.008, mat.anodised(), 0.001), 0, H - 0.0015, 0));
  for (let i = 0; i < 15; i++) cover.add(place(box(0.0024, 0.0042, D - 0.03, mat.anodised(), 0.0008), -0.091 + i * 0.013, H + 0.0021, 0));
  for (const side of [-1, 1]) {
    cover.add(place(box(0.003, H - 0.004, D - 0.008, mat.anodised(), 0.001), side * (W / 2 - 0.0015), H / 2 + 0.001, 0));
    for (let i = 0; i < 9; i++) cover.add(place(box(0.0008, 0.024, 0.0034, mat.chip()), side * (W / 2 + 0.0002), H / 2 + 0.004, -0.04 + i * 0.01));
  }

  const { board, module, heatsink, fan, ssd, card } = parts;
  return buildModel({
    id,
    parts: [chassis, board, module, heatsink, fan, ssd, card, cover],
    anchors: {
      keys: { position: [-0.04, H / 2 - 0.004, D / 2 + 0.004] },
      footswitch: { position: [0.012, H / 2 - 0.004, D / 2 + 0.004] },
      audio: { position: [0.045, H / 2 - 0.004, D / 2 + 0.004] },
      hdmiIn: { position: [-0.071, boardY + 0.006, -D / 2 - 0.003], normal: [0, 0, -1] },
      hdmiOut: { position: [-0.0035, boardY + 0.006, -D / 2 - 0.003], normal: [0, 0, -1] },
      lan: { position: [0.035, boardY + 0.008, -D / 2 - 0.003], normal: [0, 0, -1] },
      module: { position: [-0.0475, boardY + 0.01, 0.016 + boardOffsetZ], normal: [-0.3, 1, 0.6], part: 'module' },
      ssd: { position: [0.056, boardY + 0.008, 0.035 + boardOffsetZ], normal: [0, 1, 0.4], part: 'ssd' },
      board: { position: [0.03, boardY + 0.002, 0.012 + boardOffsetZ], normal: [0, 1, 0.5], part: 'board' },
    },
    motion: {
      kind: 'translate',
      name: 'explode',
      offsets: { cover: [0, 0.13, 0], fan: [0, 0.1, 0], heatsink: [0, 0.072, 0], module: [0, 0.042, 0], ssd: [0, 0.03, 0.012], card: [0, 0.03, -0.006], board: [0, 0.012, 0] },
    },
  });
}
