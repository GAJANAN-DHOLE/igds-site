// Every URL on the previous igdrives.com (PHP) mapped to its place on this site.
// Pure data: read by astro.config.mjs (static fallback pages) and scripts/redirects.mjs (host config).

/** @type {ReadonlyArray<readonly [string, string]>} */
export const legacyRedirects = [
  ['/about.php', '/#company'],
  ['/contact.php', '/#contact'],
  ['/case-study.php', '/#work'],

  ['/products.php', '/products'],
  ['/products/medical-healthcare-division.php', '/products#medical'],
  ['/products/industrial.php', '/products#industrial'],
  ['/products/agriculture.php', '/products#agricultural'],
  // This page listed no products of its own.
  ['/products/electrical-and-switch-gear-division.php', '/products'],

  ['/products/neoedge-ot-video.php', '/products#recorder-streamer'],
  ['/products/medical-imaging-software.php', '/products#radiology-software'],
  ['/products/analog-mammography-control.php', '/products#analog-mammography'],
  ['/products/digital-mammography-2d.php', '/products#digital-mammography'],
  ['/products/mri-ferromagnetic-detection.php', '/products#mri-detector'],
  ['/products/industrial-pc.php', '/products#i2hd'],
  ['/products/jetson-carrier-board.php', '/products#carrier-board'],
  ['/products/mss-starter.php', '/products#mss-starter'],
  ['/products/mss-pro.php', '/products#mss-pro'],
  ['/products/industrial-air-cooler-controller.php', '/products#air-cooler-controller'],
  ['/products/gsm-starter.php', '/products#gsm-starter'],
  ['/products/cyclic-timer.php', '/products#cyclic-timer'],
  ['/products/agriauto.php', '/products#agriauto'],
  ['/products/single-phase-starter.php', '/products#single-phase-starter'],

  ['/services.php', '/services'],
  ['/services/product-research-and-ip-services.php', '/services#research-and-ip'],
  ['/services/project-engineering-services.php', '/services#project-engineering'],
  ['/services/medical-and-health-services.php', '/services#medical-device-design'],
  ['/services/manufacturing-and-testing-services.php', '/services#manufacturing-and-testing'],

  ['/blog.php', '/insights'],
  ...[
    'software-reliability-medical-devices',
    'what-is-dicom',
    'dicom-vs-dicomweb',
    'analog-vs-digital-mammography',
    'ferromagnetic-detection-mri-safety',
    'choosing-agricultural-motor-starter',
    'single-phase-vs-three-phase-starters',
    'automatic-pump-control-irrigation',
  ].map((slug) => [`/blog/${slug}.php`, `/insights#${slug}`]),

  ['/privacy-policy.php', '/legal#privacy'],
  ['/terms-of-service.php', '/legal#terms'],
];
