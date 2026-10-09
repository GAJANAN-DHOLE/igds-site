import type { ImageMetadata } from 'astro';
import type { DivisionId } from './divisions';

import mssStarterPhoto from '~/assets/products/mss-starter.png';
import mssProPhoto from '~/assets/products/mss-pro.png';
import airCoolerPhoto from '~/assets/products/air-cooler-controller.jpeg';
import i2hdPhoto from '~/assets/products/i2hd-ui.jpg';
import carrierPhoto from '~/assets/products/carrier-board.jpeg';
import gsmPhoto from '~/assets/products/gsm-starter.jpg';
import cyclicPhoto from '~/assets/products/cyclic-timer.png';
import agriAutoPhoto from '~/assets/products/agriauto.jpeg';
import singlePhasePhoto from '~/assets/products/single-phase-starter.png';
import recorderPhoto from '~/assets/products/recorder-streamer.png';
import radiologyPhoto from '~/assets/products/radiology-software.png';
import analogMammoPhoto from '~/assets/products/analog-mammography.png';
import mriPhoto from '~/assets/products/mri-ferromagnetic.png';

/**
 * One data source for the spec list and the 3D hotspots. A spec with `at` names an anchor in
 * src/data/models.json; hovering the row lights the hotspot and the other way round.
 */
export interface Spec {
  label: string;
  value: string;
  at?: string;
}

export interface Product {
  slug: string;
  designator: string;
  name: string;
  division: DivisionId;
  kind: 'Software' | 'System' | 'Hardware' | 'Board';
  summary: string;
  figure: { value: string; unit: string; caption: string };
  specs: readonly Spec[];
  features?: readonly string[];
  protections?: readonly string[];
  applications?: readonly string[];
  /** Key into src/data/models.json. */
  model?: string;
  /** Shown beside the viewer when the model depicts a related platform rather than the product. */
  photo?: { src: ImageMetadata; alt: string };
}

const GSM_PROTECTIONS = [
  'Stator problem',
  'Cable faults',
  'Motor-side single phasing',
  'Line to line',
  'Triple line',
  'Line to earth',
  'Triple line to earth',
  'Winding unbalance',
  'Dry run and under load',
  'Overload',
  'Under voltage',
  'Over voltage',
  'Phase fail',
  'Phase sequence',
  'Voltage unbalance',
] as const;

export const products: readonly Product[] = [
  // ───────────────────────── Medical ─────────────────────────
  {
    slug: 'recorder-streamer',
    designator: 'U1',
    name: 'Recorder & Streamer',
    division: 'medical',
    kind: 'System',
    summary:
      'Captures, records and streams video from endoscopes, microscopes, C-arms and OT lights, then stores and exports it over the hospital network.',
    figure: { value: '2', unit: 'channels', caption: 'Dual-channel capture, audio per channel' },
    specs: [
      { label: 'Sources', value: 'Endoscopic cameras, surgical microscopes, C-arms, OT lights' },
      { label: 'Capture', value: 'HD and 2K with minimal latency' },
      { label: 'Layouts', value: 'Full screen, split screen, picture-in-picture' },
      { label: 'Recording', value: 'MP4 and MKV per channel, optional timestamp overlay' },
      { label: 'Triggers', value: 'Manual or event-triggered, with record-pause and snapshots' },
      { label: 'Streaming', value: 'RTMP and RTSP' },
      { label: 'Storage', value: 'CIFS, FTP, NFS; USB export; PACS integration' },
      { label: 'Network', value: 'Static or DHCP' },
      { label: 'Access', value: 'Role-based login, device registration, controlled in-place upgrade' },
    ],
    features: [
      'Web UI from a PC, tablet or phone',
      'Patient demographics, examination type, referring physician and case notes against each procedure',
      'Live status panel for channel, recording and streaming state',
    ],
    photo: { src: recorderPhoto, alt: 'Recorder and Streamer web interface showing two live channels' },
  },
  {
    slug: 'radiology-software',
    designator: 'U2',
    name: 'Medical Imaging Software for Radiology',
    division: 'medical',
    kind: 'Software',
    summary: 'Console software for digital radiography: detector and generator control, image processing, DICOM and local storage.',
    figure: { value: '4', unit: 'DICOM services', caption: 'Storage, worklist, commitment, print' },
    specs: [
      { label: 'Acquisition', value: 'Flat-panel detector control, generator interfacing, AEC' },
      { label: 'Image tools', value: 'Window and level, enhancement, noise reduction' },
      { label: 'Geometry', value: 'Rotate, flip, crop, zoom' },
      { label: 'Review', value: 'Annotations and presets' },
      { label: 'DICOM', value: 'Storage, Modality Worklist, Storage Commitment, Print' },
      { label: 'Conformance', value: 'DICOM conformance statement supplied' },
      { label: 'Console', value: 'Console GUI, patient registration, local storage, export' },
      { label: 'Process', value: 'Aligned to IEC 62304 and ISO 14971, with verification and validation' },
      { label: 'Delivery', value: 'OEM customisation and sustaining engineering' },
    ],
    photo: { src: radiologyPhoto, alt: 'Radiology console software with an X-ray image and processing tools' },
  },
  {
    slug: 'analog-mammography',
    designator: 'U3',
    name: 'Analog Mammography Control & Interface',
    division: 'medical',
    kind: 'System',
    summary: 'PC-based retrofit control and detector interface that brings digital capture to an existing analog mammography gantry.',
    figure: { value: '4', unit: 'views', caption: 'RCC, LCC, RMLO, LMLO' },
    specs: [
      { label: 'Approach', value: 'Retrofit: the existing gantry stays' },
      { label: 'Registration', value: 'Patient entry including accession number and pregnancy status' },
      { label: 'Views', value: 'RCC, LCC, RMLO, LMLO' },
      { label: 'Exposure', value: 'kV, mA, s and mAs shown alongside detector status' },
      { label: 'Network', value: 'Host IP and sensor IP configuration' },
      { label: 'Calibration', value: 'Three steps (bright, dark, reference) behind separate credentials' },
      { label: 'DICOM', value: 'DICOM 3.0 push with AET, IP and port test' },
      { label: 'Access', value: 'Role-based' },
    ],
    photo: { src: analogMammoPhoto, alt: 'Analog mammography retrofit control interface' },
  },
  {
    slug: 'digital-mammography',
    designator: 'U4',
    name: '2D Digital Mammography',
    division: 'medical',
    kind: 'System',
    summary: 'Digital mammography control for exposure, detector, compression and C-arm on one console, with a full DICOM workflow.',
    figure: { value: '83', unit: 'µm', caption: 'Detector pixel pitch' },
    specs: [
      { label: 'Exposure', value: 'Manual or AEC; 23 to 35 kV, 5 to 600 mAs, 0.1 to 5 s', at: 'generator' },
      { label: 'Detector', value: 'a-Si TFT with CsI, 83 µm pixels', at: 'detector' },
      { label: 'Matrix', value: '2816 × 3584 over 232 × 297 mm', at: 'detector' },
      { label: 'Detector care', value: 'Temperature inhibit and warm-up' },
      { label: 'Compression', value: 'Motorised, three speeds, 5 to 15 kg limit, 20 kg maximum; auto, manual and quick release', at: 'paddle' },
      { label: 'Thickness', value: 'Readout during compression', at: 'paddle' },
      { label: 'C-arm', value: '−45° to +45°', at: 'tube' },
      { label: 'Calibration', value: 'Flat-field gain, offset and defect map with a pass/fail block' },
      { label: 'Quality', value: 'Repeat and reject analysis' },
      { label: 'DICOM', value: 'Worklist, Storage, MPPS, Storage Commitment; PACS, RIS and printers', at: 'workstation' },
      { label: 'Access', value: 'Role-based' },
    ],
    model: 'mammography',
  },
  {
    slug: 'mri-detector',
    designator: 'U5',
    name: 'MRI Ferromagnetic Detection',
    division: 'medical',
    kind: 'System',
    summary: 'Passive sensor pillars at the scanner-room door that flag ferromagnetic objects before they enter, with alarm, interlock and event log.',
    figure: { value: '0', unit: 'field emitted', caption: 'Passive magnetometry' },
    specs: [
      { label: 'Principle', value: 'Passive magnetometry; emits no field of its own', at: 'sensors' },
      { label: 'Detects', value: 'Ferromagnetic objects in motion' },
      { label: 'Coverage', value: 'Vertical sensor array from floor to head height', at: 'pillars' },
      { label: 'Position', value: 'Approximate height of the object', at: 'leds' },
      { label: 'Rejection', value: 'Noise rejection with adjustable threshold' },
      { label: 'Alarm', value: 'Visual and audible', at: 'beacon' },
      { label: 'Status', value: 'Self-test', at: 'status' },
      { label: 'Siting', value: 'Zone III to Zone IV boundary; fringe-field electronics', at: 'zone' },
      { label: 'Integration', value: 'Door interlock, access control and event logging', at: 'interlock' },
    ],
    features: ['Detects ferromagnetic items only, not other metals. It supports, and does not replace, a site’s MRI safety screening.'],
    model: 'mri-detector',
    photo: { src: mriPhoto, alt: 'MRI ferromagnetic detection sensor pillar and alarm display' },
  },

  // ──────────────────────── Industrial ───────────────────────
  {
    slug: 'i2hd',
    designator: 'U6',
    name: 'I2HD Industrial PC',
    division: 'industrial',
    kind: 'Hardware',
    summary: 'Jetson-based industrial PC with two HDMI inputs, 1080p60 capture and NVMe storage, built for video recording.',
    figure: { value: '1080', unit: 'p60', caption: 'HDMI capture' },
    specs: [
      { label: 'Compute', value: 'NVIDIA Jetson', at: 'module' },
      { label: 'Video in', value: '2 × HDMI', at: 'hdmiIn' },
      { label: 'Video out', value: '1 × HDMI', at: 'hdmiOut' },
      { label: 'Capture', value: '1080p at 60 fps' },
      // TODO(owner): the legacy site reads "MP4 & MPV". The Recorder & Streamer lists MP4 and MKV. Confirm.
      { label: 'Recording', value: 'MP4 and MPV' },
      { label: 'Storage', value: '1 TB NVMe (PCIe Gen3); M.2 NVMe up to 2 TB', at: 'ssd' },
      { label: 'Expansion', value: 'M.2 E-key' },
      { label: 'Network storage', value: 'CIFS', at: 'lan' },
      { label: 'Audio', value: 'Embedded audio; microphone and speaker', at: 'audio' },
      { label: 'Foot switch', value: 'Input for hands-free control', at: 'footswitch' },
      { label: 'Controls', value: 'On-device keys', at: 'keys' },
    ],
    model: 'i2hd',
    photo: { src: i2hdPhoto, alt: 'I2HD on-screen user interface' },
  },
  {
    slug: 'carrier-board',
    designator: 'U7',
    name: 'Jetson Carrier Board',
    division: 'industrial',
    kind: 'Board',
    summary: 'In-house carrier board for Jetson Nano, TX2 and Xavier modules, with camera, storage, wireless and I/O on one board.',
    figure: { value: '2', unit: 'CSI-2', caption: 'MIPI camera ports' },
    specs: [
      { label: 'Modules', value: 'Jetson Nano, TX2, Xavier', at: 'module' },
      { label: 'Camera', value: '2 × MIPI CSI-2', at: 'csi' },
      { label: 'Storage', value: 'M.2 SSD', at: 'm2' },
      { label: 'Wireless', value: 'Mini PCIe for Wi-Fi, Bluetooth, GSM or 4G', at: 'minipcie' },
      { label: 'USB', value: '2 × USB 2.0, 1 × USB 3.0', at: 'usb' },
      { label: 'Network', value: 'Gigabit Ethernet', at: 'ethernet' },
      { label: 'Display', value: 'HDMI', at: 'hdmi' },
      { label: 'Headers', value: 'GPIO, I²C, SPI, UART', at: 'gpio' },
      { label: 'Controls', value: 'Power, reset and recovery', at: 'buttons' },
      { label: 'Software', value: 'API and SDK; customisable to your product' },
    ],
    applications: ['AI vision', 'Video', 'Medical', 'Automation', 'Edge computing'],
    model: 'carrier-board',
    photo: { src: carrierPhoto, alt: 'Jetson carrier board photographed from above' },
  },
  {
    slug: 'mss-starter',
    designator: 'U8',
    name: 'MSS Starter',
    division: 'industrial',
    kind: 'Hardware',
    summary: 'All-in-one starter, protection relay and timer for 2 to 7.5 HP motors on 415 VAC.',
    figure: { value: '7.5', unit: 'HP', caption: 'Largest rating, 415 VAC' },
    specs: [
      { label: 'Rating', value: '2 to 7.5 HP at 415 VAC' },
      { label: 'Current sensing', value: 'CT, 20 A' },
      { label: 'Display', value: 'Four-digit seven-segment', at: 'display' },
      { label: 'Readouts', value: 'Voltage, current and power factor' },
      { label: 'Operation', value: 'Manual, timer, or automatic start when power returns' },
      { label: 'Limits', value: 'Adjustable low and high voltage' },
      { label: 'Keys', value: 'Three tactile keys', at: 'keys' },
      { label: 'Switches', value: 'On and off', at: 'switches' },
    ],
    model: 'mss-starter',
    photo: { src: mssStarterPhoto, alt: 'MSS Starter wall-mount enclosure' },
  },
  {
    slug: 'mss-pro',
    designator: 'U9',
    name: 'MSS Pro',
    division: 'industrial',
    kind: 'Hardware',
    summary: 'Motor Safe Shield for large motors: LCD, five-key keypad, timer and RS485 Modbus gateway, up to 350 HP.',
    figure: { value: '350', unit: 'HP', caption: 'Largest rating' },
    specs: [
      { label: 'Rating', value: 'Up to 350 HP' },
      { label: 'Supply', value: '24 VDC, 110, 230 or 415 VAC' },
      { label: 'Current sensing', value: '25 A CT internal; external CT per motor' },
      { label: 'Display', value: 'LCD', at: 'lcd' },
      { label: 'Keys', value: 'Five-key keypad', at: 'keypad' },
      { label: 'Remote', value: 'Manual and remote operation over an RS485 Modbus gateway', at: 'modbus' },
      { label: 'Readouts', value: 'Voltage, current and power factor' },
      { label: 'Operation', value: 'Timer and automatic start' },
      { label: 'Limits', value: 'Adjustable voltage thresholds' },
      { label: 'Indicators', value: 'Normal, stator issue, overload, phase fail, cable fault, under load, dry run', at: 'faults' },
    ],
    model: 'mss-pro',
    photo: { src: mssProPhoto, alt: 'MSS Pro Motor Safe Shield front panel' },
  },
  {
    slug: 'air-cooler-controller',
    designator: 'U10',
    name: 'Industrial Air Cooler Controller',
    division: 'industrial',
    kind: 'Hardware',
    summary: 'Digital starter for air-cooler fan motors, with dual-mode control of the water pump and drain pump.',
    figure: { value: '2', unit: 'pump modes', caption: 'Water and drain' },
    specs: [
      { label: 'Starts', value: 'Fan motors of industrial air coolers' },
      { label: 'Pump control', value: 'Dual mode for water pump and drain pump', at: 'mode' },
      { label: 'Operation', value: 'Auto and manual, with timer' },
      { label: 'Controls', value: 'Green ON, red OFF', at: 'power' },
      { label: 'Protection', value: 'Overload and electrical faults' },
      { label: 'Display', value: 'Digital', at: 'display' },
      { label: 'Status', value: 'Run, alarm and status indication', at: 'status' },
      { label: 'Enclosure', value: 'Rugged, with cable glands', at: 'glands' },
    ],
    applications: ['Factories', 'Warehouses and godowns', 'Workshops', 'Process industries', 'Commercial buildings', 'Schools', 'Large cooling installations'],
    model: 'air-cooler-controller',
    photo: { src: airCoolerPhoto, alt: 'Industrial Air Cooler Controller front panel' },
  },

  // ─────────────────────── Agricultural ──────────────────────
  {
    slug: 'gsm-starter',
    designator: 'U11',
    name: 'GSM Starter',
    division: 'agricultural',
    kind: 'Hardware',
    summary: 'Mobile-operated motor starter with timer and a full protection set, for 2 to 7.5 HP motors on 415 VAC.',
    figure: { value: '15', unit: 'protections', caption: 'Including dry run and phase fail' },
    specs: [
      { label: 'Rating', value: '2 to 7.5 HP at 415 VAC' },
      { label: 'Current sensing', value: 'CT, 20 A' },
      { label: 'Remote', value: 'Manual and remote operation over GSM', at: 'antenna' },
      { label: 'Timer', value: 'Included' },
      { label: 'Display', value: 'Four-digit seven-segment', at: 'display' },
      { label: 'Indicators', value: 'Network, stator issue, overload, phase fail, voltage unbalance, dry run, cable fault', at: 'faults' },
      { label: 'Switches', value: 'Manual and auto selection with on and off', at: 'switches' },
    ],
    protections: GSM_PROTECTIONS,
    model: 'gsm-starter',
    photo: { src: gsmPhoto, alt: 'GSM Starter enclosure with antenna' },
  },
  {
    slug: 'cyclic-timer',
    designator: 'U12',
    name: 'Cyclic Timer with Starter',
    division: 'agricultural',
    kind: 'Hardware',
    summary: 'Runs and rests a motor on a cycle, with the same protection set and ratings as the GSM Starter.',
    figure: { value: '1', unit: 'minute', caption: 'Shortest timer setting' },
    specs: [
      { label: 'Rating', value: '2 to 7.5 HP at 415 VAC' },
      { label: 'Cycling', value: 'Automatic run and rest', at: 'display' },
      { label: 'Timer', value: 'Lowest setting 1 minute' },
      { label: 'Operation', value: 'Manual or auto', at: 'switches' },
      { label: 'Indicators', value: 'Network, stator issue, overload, phase fail, voltage unbalance, dry run, cable fault', at: 'faults' },
    ],
    protections: GSM_PROTECTIONS,
    model: 'cyclic-timer',
    photo: { src: cyclicPhoto, alt: 'Cyclic Timer with Starter enclosure' },
  },
  {
    slug: 'agriauto',
    designator: 'U13',
    name: 'AgriAuto',
    division: 'agricultural',
    kind: 'Hardware',
    summary: 'GSM-operated starter for motors up to 12.5 HP, with an internal 25 A current transformer and a wide supply range.',
    figure: { value: '12.5', unit: 'HP', caption: 'Largest rating' },
    specs: [
      { label: 'Rating', value: '12.5 HP' },
      { label: 'Supply', value: '24 VDC, 110, 230 or 415 VAC' },
      { label: 'Current sensing', value: '25 A internal CT' },
      { label: 'Remote', value: 'Manual and remote operation over GSM', at: 'antenna' },
      { label: 'Display', value: 'Digital', at: 'display' },
      { label: 'Wiring', value: 'Cable glands for field entry', at: 'glands' },
    ],
    model: 'agriauto',
    photo: { src: agriAutoPhoto, alt: 'AgriAuto starter enclosure' },
  },
  {
    slug: 'single-phase-starter',
    designator: 'U14',
    name: 'Single Phase Starter',
    division: 'agricultural',
    kind: 'Hardware',
    summary: 'Controls the starting and running capacitors of single-phase pump motors from 1 to 5 HP, with tank-level indication.',
    figure: { value: '5', unit: 'HP', caption: 'Largest rating, 230 VAC' },
    specs: [
      { label: 'Rating', value: '1, 1.5, 2, 3 or 5 HP at 230 VAC' },
      { label: 'Capacitors', value: 'Start and run capacitor control', at: 'capacitors' },
      { label: 'Current sensing', value: '60 A external CT' },
      { label: 'Display', value: 'Seven-segment voltage and current', at: 'display' },
      { label: 'Set current', value: 'Per-motor current setting', at: 'knob' },
      { label: 'Operation', value: 'Manual start', at: 'button' },
      { label: 'Level', value: 'Water-level controller tank indicators', at: 'level' },
      { label: 'Limits', value: 'Adjustable voltage thresholds' },
      { label: 'Mode', value: 'Manual and auto', at: 'mode' },
    ],
    model: 'single-phase-starter',
    photo: { src: singlePhasePhoto, alt: 'Single Phase Starter enclosure' },
  },
] as const;

const bySlug = new Map(products.map((product) => [product.slug, product] as const));

/** Throws on an unknown slug, so a typo in a page or case study fails the build instead of rendering a hole. */
export function productBySlug(slug: string): Product {
  const product = bySlug.get(slug);
  if (!product) throw new Error(`Unknown product slug: ${slug}`);
  return product;
}

export function productsIn(division: DivisionId): Product[] {
  return products.filter((product) => product.division === division);
}
