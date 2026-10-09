# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (user's explicit choice: "create an astro site"). Static output. Hosting is undecided, so nothing may depend on a specific host: the contact form posts to a configurable endpoint with a `mailto:` fallback, and legacy-URL redirects ship for Apache, Netlify/Cloudflare and Vercel alike.

## Users

Two audiences, weighted equally (confirmed):

1. **Engineering buyers.** Engineering and product leads at OEMs, medtech companies and industrial firms, worldwide, looking for a partner to design, develop, validate or modernise an embedded product, often in a regulated domain (medical imaging, motor control, edge AI video). They are evaluating competence and risk: domain history, process discipline, standards, and whether the team can carry a product from concept to manufacture.
2. **Product buyers.** Plant engineers, contractors, distributors and farmers choosing a specific IGDS product: motor starters and protection units (agricultural and industrial), the I2HD industrial PC, Jetson carrier boards, OT video recorder/streamer, MRI ferromagnetic detection. They need ratings, protections, interfaces and a fast way to ask which unit fits their motor and supply.

Both arrive mostly from search, LinkedIn and referrals, and decide whether to call or email.

## Product Purpose

A 100% marketing site for IG Drives & Systems (IGDS), Pune, India. It exists to turn qualified visitors into conversations (call, email, enquiry form). Success: a visitor understands within seconds what IGDS builds and for whom, finds proof that fits their need, and contacts the team.

## Positioning

An Indian embedded-engineering firm that designs **and** manufactures: the same team that writes DICOM imaging software and IEC 62304-aligned medical device code also designs Jetson carrier boards, builds industrial PCs and ships field-hardened motor starters. Board, box and software come from one roof, which neighbouring service shops or product-only vendors cannot truthfully claim.

## Operating Context

- Divisions: Medical & Health Care, Industrial, Agricultural.
- Services: Project Engineering (product, firmware, FPGA design), Medical & Health Care device design, Manufacturing & Testing, Product Research & IP.
- Engagement models: feasibility/proof of concept, full product development, sustaining engineering, legacy modernisation.
- Standards their processes align to: IEC 62304, IEC 60601-1, ISO 14971, ISO 13485, IEC 62366 ("aligned to", not certified; never claim certification).
- Client names are confidential; case studies are anonymised, names available under NDA.

## Capabilities and Constraints

- 14 products: Medical (Recorder & Streamer, Medical Imaging Software for Radiology, Analog Mammography Control & Interface, 2D Digital Mammography Control & GUI, MRI ferromagnetic detection); Industrial (I2HD Industrial PC, Custom Jetson Carrier Board, MSS Starter, MSS Pro, Industrial Air Cooler Controller); Agricultural (GSM Starter, Cyclic Timer with Starter, AgriAuto, Single Phase Starter). Specs are recorded in `src/data/products.ts`.
- 3D: no CAD or GLB files exist yet (confirmed). The site ships representative, procedurally generated stand-in models that must be labelled as representative and be replaceable by real GLB exports without code changes.
- Route consolidation is a hard requirement from the user: fewer pages, fewer separate routes, precise copy.
- Existing site to be replaced: igdrives.com (PHP). Its old URLs must redirect to the new consolidated routes.

## Brand Commitments

- Name: IG Drives & Systems; short form IGDS. Tagline on the logo: "Embedded for Excellence".
- Logo: navy and green "IG" monogram with circuit traces (`src/assets/brand/igds-logo.jpeg`, raster only; no vector supplied).
- Voice: plain, engineering-precise, British-leaning spelling as used today (programme, modernisation). No hype.

## Evidence on Hand

- Partners/ecosystem: Intel (listed in Intel Partner Showcase), NVIDIA (Jetson platform), Microchip.
- Four anonymised case studies: DR acquisition software; analog mammography control and interface; digital mammography control with Spellman generator Ethernet interface; OT video recorder/streamer on NVIDIA Jetson with in-house carrier board.
- Team: Dr. Gajanan Dhole (founder & chairman, 35+ years R&D, 14+ patents); Mr. Gajanan Raut (co-founder & director, 18+ years embedded medical/industrial/measurement products); Dr. Mohan Tasare (design & development, 6+ years medical software, DICOM, imaging algorithms).
- Figures used today: 6+ years in medical electronics; 9 years in industrial and agricultural motor control; 3 divisions; 5 standards; OEM clients worldwide; agri range up to 12.5 HP; MSS Pro up to 350 HP.
- Real product photography for most products (`src/assets/products/`), and software UI renders.
- Eight engineering articles exist on the old site (DICOM, DICOMweb, software reliability, mammography, MRI ferromagnetic detection, starter selection, single vs three phase, automatic pump control).
- Absent, never fabricate: testimonials, client logos, named customers, unit volumes, pricing, certifications, awards.

## Product Principles

1. Show the hardware. Let people turn the product over before they read about it.
2. Specs over adjectives. Every claim should be a number, a standard, an interface or a case.
3. Two doors, one roof. Engineering buyers and product buyers each get a direct path, and both see that the same team builds board, box and software.
4. Fewer, denser pages. One place per subject; anchors over new routes.
5. Make contact effortless: phone, email and form are never more than one step away.

## Accessibility & Inclusion

WCAG 2.2 AA. Every 3D viewer needs a text equivalent (specs and feature list in HTML), keyboard-operable controls and a reduced-motion path. Audience includes rural buyers on mid-range Android phones and slow networks: 3D must load on demand and the page must work fully without it.
