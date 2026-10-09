import type { ImageMetadata } from 'astro';
import endoscopy from '~/assets/services/endoscopy.png';
import mammographyMlo from '~/assets/services/mammography-mlo.png';

export interface ServiceGroup {
  title: string;
  items: readonly string[];
}

export interface Service {
  slug: string;
  designator: string;
  step: string;
  name: string;
  /** What the engagement produces. */
  output: string;
  summary: string;
  groups: readonly ServiceGroup[];
  figure?: { src: ImageMetadata; alt: string; caption: string };
}

/** Ordered as the product lifecycle runs: concept, design, regulated development, build. */
export const services: readonly Service[] = [
  {
    slug: 'research-and-ip',
    designator: 'S1',
    step: 'Concept',
    name: 'Research and IP',
    output: 'A proven concept, with its IP position understood',
    summary:
      'Applied research that ends in a working prototype: AI and image processing, diagnostic tools, specialised industrial products, power systems and custom sensors.',
    groups: [
      {
        title: 'Research areas',
        items: [
          'AI and image processing',
          'Medical diagnostic tools, including endoscopy and radiology',
          'Specialised industrial products',
          'Power systems',
          'Custom sensors',
        ],
      },
      {
        title: 'How it runs',
        items: ['Feasibility and proof of concept first', 'Patenting, duplication risk and cost considered together'],
      },
    ],
    figure: { src: endoscopy, alt: 'Laparoscopic video frame with instruments', caption: 'The kind of video the Recorder & Streamer captures in theatre.' },
  },
  {
    slug: 'project-engineering',
    designator: 'S2',
    step: 'Design',
    name: 'Project Engineering',
    output: 'Hardware, firmware and FPGA from architecture to pilot production',
    summary:
      'Embedded design across medical, high-voltage, power and energy, instruments, defence, industrial, consumer, automation and wearables.',
    groups: [
      {
        title: 'Product design',
        items: [
          'Single-board computers; system-on-module and carrier boards (Jetson, Pi Zero)',
          'Multi-board and mixed-signal designs',
          'IoT gateways, healthcare, industrial control, protocol analysers, data acquisition',
          'SATA, DDR4, PCI; RS485 Modbus, TCP/IP, RS232, CAN; H.264 and H.265',
        ],
      },
      {
        title: 'Firmware and software',
        items: [
          'Embedded Linux, FreeRTOS and Android',
          'Bootloader and BIOS, drivers, board support packages, protocol stacks',
          'Applications, IoT edge, UX and UI, mobile',
        ],
      },
      {
        title: 'FPGA',
        items: [
          'CPLD through multi-million-gate and SoC devices on Gowin, Lattice and Xilinx',
          'RTL and testbenches in VHDL, Verilog and SystemVerilog; simulation; ASIC prototyping; migration and optimisation',
          'PCIe Gen1 to Gen5, NVMe 1.3, Gen-Z, CXL, DisplayPort 2.0, HDMI, LVDS, SRIO, GbE and 10GbE',
          'SPI, I²C, LPC, ISA, PCI, CAN, GPMC, ADC and DAC; NAND, NOR, DDR3, DDR4, HMC and HBM',
          'NIOS II and MicroBlaze soft cores; IP cores',
        ],
      },
    ],
  },
  {
    slug: 'medical-device-design',
    designator: 'S3',
    step: 'Regulated development',
    name: 'Medical Device Design',
    output: 'Imaging and OT equipment taken through a gated development process',
    summary: 'Five phases from initiation to launch, applied to radiology imaging, X-ray and operating-theatre equipment.',
    groups: [
      {
        title: 'Phases',
        items: [
          'Initiation',
          'Formulation',
          'Design and development, including verification and validation',
          'Final validation',
          'Launch and assessment',
        ],
      },
      {
        title: 'Work areas',
        items: [
          'Radiology imaging software',
          'X-ray user interfaces',
          'Digital radiography detector interface',
          'Generator interface and GUI',
          'Operating-theatre equipment',
        ],
      },
    ],
    figure: { src: mammographyMlo, alt: 'Mammogram, mediolateral oblique view', caption: 'Mammogram, MLO view.' },
  },
  {
    slug: 'manufacturing-and-testing',
    designator: 'S4',
    step: 'Build',
    name: 'Manufacturing and Testing',
    output: 'Prototypes to production units, tested to a written procedure',
    summary: 'Prototype builds, test jigs, assembly and third-party manufacturing, made in India and verified before they ship.',
    groups: [
      {
        title: 'What we run',
        items: [
          'Prototype manufacturing and testing',
          'Test jig design',
          'Assembly and test',
          'Verification and validation',
          'PCB testing to procedure',
          'Third-party manufacturing management',
        ],
      },
    ],
  },
] as const;
