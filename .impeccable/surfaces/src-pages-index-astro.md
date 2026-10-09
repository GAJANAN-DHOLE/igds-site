---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/products.astro","src/pages/services.astro","src/pages/insights.astro","src/pages/legal.astro"]
---

## Scope

Whole marketing site, five routes sharing one world: `/` (primary), `/products`, `/services`, `/insights`, `/legal`, plus 404. Visitor mode: Persuade.

## Audience, job, action

- Engineering buyers (OEM, medtech, industrial leads) judging competence and risk; action: start a conversation about a programme.
- Product buyers (plant engineers, distributors, farmers) checking ratings and protections; action: ask which unit fits their motor and supply.
- Both weighted equally; both doors open from the first viewport.

## Proof and content

Real products (14) with specs; representative 3D stand-ins for hardware, labelled as such; real product photos; four anonymised case studies; standards alignment (IEC 62304, IEC 60601-1, ISO 14971, ISO 13485, IEC 62366); partners Intel, NVIDIA, Microchip; team bios (14+ patents). Never invent customers, testimonials, certifications or dimensions.

## Constraints

Fewer routes, precise copy, anchors over pages. Every page must work without WebGL. Old PHP URLs redirect to the consolidated routes.

## Direction contract

THESIS: The site is the board IGDS builds on: silkscreen type on solder-mask fields, gold pads as controls, copper traces that route each claim to its proof. It refuses the split hero over a row of service cards and the stock glowing-circuit look.

OWN-WORLD: Matte deep-green solder mask owns the major surfaces; white-mask boards carry long reading in black silk. White silkscreen legends with reference designators (U1, J4) as labels; ENIG-gold pads are the only buttons; thin copper traces with vias join related blocks; mounting holes and fiducials mark board corners. Two faces: a wide technical grotesque and a mono reserved for designators and specs.

STORY: The visitor sees real IGDS hardware first, grasps board, box and software from one roof, takes the engineering or products door, finds the spec or case that matches, and calls or writes.

FIRST VIEWPORT: Full-bleed green board. Left five columns: designator, display-scale headline, one-line offer, two gold pads (Engineering services, Products) and the phone number. Right seven columns: the I2HD turning live in 3D inside a silkscreen component footprint, with an explode control and hotspots; traces run from its ports to the pads.

FORM: The Board (PCB solder mask and silkscreen), 4 of 7 on the ordered list, seed key a4473013.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Raises carried from the declined challengers

- From Jacquard Brocade: every headline claim is traced to the spec row, product or case it rests on; no orphan claims.
- From Tensegrity Column: one data source drives the 3D model and the HTML spec list; hovering a spec lights its hotspot and the reverse.
- From Expedition Ice Press: a fixed reading measure; wide screens grow the board's rails, never the line length.
- From BLAST Manifesto Page: spec numerals (350 HP, 83 µm, 1080p60) set at display scale carry the first read.
- From Phosphor Terminal: two faces only, hierarchy from size, case and rules; system states print as plain lines, not chrome.
- From Ebru Marbling: one continuous surface; sections are regions of the same board, never floating cards.

## Memorable moment

Dragging the explode control on the I2HD lifts the enclosure to reveal the in-house carrier board, the Jetson module and the SSD: board, box and software in one gesture.

## Unresolved

- Real CAD/GLB exports will replace the stand-in models when available.
- Contact form endpoint is configured per host (env var); `mailto:` fallback until then.
