export const company = {
  name: 'IG Drives & Systems',
  short: 'IGDS',
  tagline: 'Embedded for Excellence',
  url: 'https://igdrives.com',
  description:
    'IG Drives & Systems designs and manufactures embedded electronics, firmware and software in Pune, India: medical imaging systems, industrial motor control and agricultural starters.',
  phone: '+91-9561618504',
  phoneHref: 'tel:+919561618504',
  email: 'info@igdrives.com',
  address: {
    lines: ['Pune, Maharashtra', 'India 411015'],
    region: 'Maharashtra',
    locality: 'Pune',
    postalCode: '411015',
    country: 'IN',
  },
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ig-drives-and-systems/' },
    { label: 'YouTube', href: 'https://www.youtube.com/@ig-drivessystems4319/' },
    { label: 'X', href: 'https://twitter.com/IgDrives' },
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100086093358650' },
  ],
} as const;

export const nav = [
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/#work' },
  { label: 'Company', href: '/#company' },
  { label: 'Insights', href: '/insights' },
] as const;

export const partners = [
  { name: 'Intel', role: 'Technology partner', href: 'https://www.intel.com/' },
  { name: 'NVIDIA', role: 'Jetson ecosystem', href: 'https://developer.nvidia.com/embedded-computing' },
  { name: 'Microchip', role: 'Silicon partner', href: 'https://www.microchip.com/' },
] as const;

export const team = [
  {
    designator: 'T1',
    name: 'Dr. Gajanan Dhole',
    role: 'Founder and Chairman',
    figure: { value: '35+', unit: 'years' },
    note: 'Algorithms, software and intellectual property. 14+ patents.',
  },
  {
    designator: 'T2',
    name: 'Mr. Gajanan Raut',
    role: 'Co-founder and Director',
    figure: { value: '18+', unit: 'years' },
    note: 'Product design, sourcing, manufacturing and sales.',
  },
  {
    designator: 'T3',
    name: 'Dr. Mohan Tasare',
    role: 'Design and Development, R&D lead',
    figure: { value: '6+', unit: 'years' },
    note: 'Medical software, DICOM and imaging algorithms.',
  },
] as const;

export const mission =
  'AI-based products built with innovation, imagination and originality, for medical, automation, automobile, power and process industries.';

export const vision = 'Products that solve crucial measurement and control problems.';

export const reasons = [
  { title: 'Domain depth', body: 'Medical imaging, motor protection and video systems, each with shipped products behind it.' },
  { title: 'Concept to manufacture', body: 'Schematic, firmware, enclosure, test jig and production, handled by one team.' },
  { title: 'Built for regulated work', body: 'Process aligned to IEC 62304, ISO 14971 and IEC 60601-1 practice, with verification records.' },
  { title: 'Support for a long life', body: 'Obsolescence redesign, field fixes and upgrades for products that stay in service for years.' },
] as const;

export const designRules = [
  { code: 'IEC 62304', label: 'Medical device software lifecycle' },
  { code: 'IEC 60601-1', label: 'Electrical safety for medical equipment' },
  { code: 'ISO 14971', label: 'Risk management' },
  { code: 'ISO 13485', label: 'Quality management system' },
  { code: 'IEC 62366', label: 'Usability engineering' },
] as const;
