export type DivisionId = 'medical' | 'industrial' | 'agricultural';

export interface Division {
  id: DivisionId;
  designator: string;
  name: string;
  line: string;
  /** Display-scale numerals shown on the home page. */
  figures: ReadonlyArray<{ value: string; unit: string; label: string; product?: string }>;
  capabilities: readonly string[];
  protections?: readonly string[];
  note?: string;
}

export const divisions: readonly Division[] = [
  {
    id: 'medical',
    designator: 'DIV-M',
    name: 'Medical and Healthcare',
    line: 'Electronics and software for medical imaging and diagnostic equipment, built with OEMs and healthcare technology companies where reliability is not negotiable.',
    figures: [
      { value: '83', unit: 'µm', label: 'Detector pixel pitch, digital mammography', product: 'digital-mammography' },
      { value: '4', unit: 'DICOM services', label: 'Storage, worklist, commitment, print', product: 'radiology-software' },
      { value: '5', unit: 'standards', label: 'Our processes align to' },
    ],
    capabilities: [
      'Embedded firmware for safety-critical control',
      'Real-time motion and generator control',
      'Image acquisition and processing algorithms',
      'DICOM and PACS integration',
      'Verification and validation, with test protocols and reports',
    ],
    note: '6+ years in medical electronics and imaging systems.',
  },
  {
    id: 'industrial',
    designator: 'DIV-I',
    name: 'Industrial',
    line: 'Embedded control products for industry, designed and built in house from the electronics and firmware through to the panel-ready enclosure.',
    figures: [
      { value: '350', unit: 'HP', label: 'Largest motor rating, MSS Pro', product: 'mss-pro' },
      { value: '1080', unit: 'p60', label: 'HDMI capture, I2HD', product: 'i2hd' },
      { value: '5', unit: 'products', label: 'In the industrial range' },
    ],
    capabilities: [
      'Motor starting and protection electronics',
      'Voltage, current and power factor measurement',
      'Embedded firmware and control switching algorithms',
      'RS485 Modbus communication and gateway integration',
      'Panel-ready enclosure and installation design',
    ],
    protections: [
      'Overload and under load',
      'Under voltage and over voltage',
      'Phase fail and phase sequence change',
      'Voltage unbalance',
      'Motor-side single phasing and winding unbalance',
    ],
    note: '9 years in industrial motor control and protection.',
  },
  {
    id: 'agricultural',
    designator: 'DIV-A',
    name: 'Agricultural',
    line: 'Starters and controllers built for field conditions: wide voltage swings, phase failure and dry running, with protection, measurement and automation in one unit.',
    figures: [
      { value: '15', unit: 'protections', label: 'Per GSM Starter', product: 'gsm-starter' },
      { value: '12.5', unit: 'HP', label: 'Largest motor rating, AgriAuto', product: 'agriauto' },
      { value: '12', unit: 'products', label: 'In the agricultural range, four featured here' },
    ],
    capabilities: [
      'Motor starting and protection electronics',
      'Voltage, current and power factor measurement',
      'Embedded firmware and control switching algorithms',
      'GSM remote operation and timer control',
      'Panel-ready enclosure and installation design',
    ],
    protections: [
      'Dry run and under load',
      'Overload',
      'Under voltage and over voltage',
      'Phase fail and phase sequence change',
      'Voltage unbalance',
      'Motor stator problem and cable faults',
    ],
    note: '9 years in agricultural motor control.',
  },
] as const;

export const engagements = [
  { step: '01', title: 'Feasibility and proof of concept', body: 'De-risk a concept before committing to full development.' },
  { step: '02', title: 'Full product development', body: 'Concept through design transfer to manufacturing.' },
  { step: '03', title: 'Sustaining engineering', body: 'Component obsolescence, redesign and lifecycle support.' },
  { step: '04', title: 'Legacy modernisation', body: 'Bringing analog and ageing platforms to current electronics.' },
] as const;
