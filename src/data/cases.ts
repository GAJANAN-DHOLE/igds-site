/**
 * Client names are under NDA, so every case is described by what was built, not for whom.
 * Do not add logos, testimonials or figures that the owner has not supplied.
 */
export interface CaseStudy {
  slug: string;
  designator: string;
  title: string;
  domain: string;
  brief: string;
  built: readonly string[];
  result?: string;
  /** Product slugs this work relates to. */
  products: readonly string[];
}

export const cases: readonly CaseStudy[] = [
  {
    slug: 'dr-acquisition',
    designator: 'C1',
    title: 'Digital radiography acquisition software',
    domain: 'Medical imaging',
    brief: 'Console software to acquire, process and send digital radiographs.',
    built: ['Detector acquisition and control', 'Image processing tools', 'DICOM storage and worklist', 'Verification and validation records'],
    products: ['radiology-software'],
  },
  {
    slug: 'analog-mammography-retrofit',
    designator: 'C2',
    title: 'Analog mammography control',
    domain: 'Medical imaging',
    brief: 'Control and interface software that brings an analog mammography platform to digital capture, keeping the gantry.',
    built: ['PC-based control software and GUI', 'Digital detector interface', 'Three-step calibration', 'DICOM 3.0 push'],
    result: 'Improved image quality and reduced dose.',
    products: ['analog-mammography'],
  },
  {
    slug: 'digital-mammography-generator',
    designator: 'C3',
    title: 'Digital mammography with generator control',
    domain: 'Medical imaging',
    brief: 'Digital mammography control with generator control and PACS workflow on one platform.',
    built: ['Ethernet interface to a Spellman generator', 'Exposure, detector and compression control', 'PACS integration on the same platform'],
    products: ['digital-mammography'],
  },
  {
    slug: 'ot-video-recorder',
    designator: 'C4',
    title: 'Operating-theatre video recorder and streamer',
    domain: 'Medical video',
    brief: 'A video recorder and streamer for the operating theatre, capturing from several devices at once.',
    built: ['Jetson-based platform on an in-house carrier board', 'Dual-channel capture with per-channel audio', 'Recording, streaming and PACS export'],
    products: ['recorder-streamer', 'i2hd', 'carrier-board'],
  },
] as const;
