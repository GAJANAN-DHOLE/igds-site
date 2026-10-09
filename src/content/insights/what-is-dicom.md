---
title: What is DICOM, and why does it matter?
sector: Medical
summary: DICOM is both a file format and a network protocol. It is why a scanner from one maker can talk to a workstation from another.
order: 2
readMinutes: 2
---

DICOM, Digital Imaging and Communications in Medicine, covers two things under one name.

### A data model and file format

An image is stored with the patient, study and acquisition details that describe it. These are organised as patient, study, series and image. Every piece of information is an attribute with a numbered tag, defined in a shared data dictionary, so any system can find the patient name or the pixel spacing in the same place.

Each type of equipment, or modality, has its own definition of what a valid object contains. A mammography image carries different required details from a CT slice.

### A network protocol

DICOM also defines how devices find each other and exchange objects: storing an image on an archive, querying for a study, fetching it back, receiving a worklist and printing. Each device lists what it supports in a **conformance statement**, which is the first document a buyer or integrator reads.

### Why it matters

- **Interoperability.** Equipment from different makers works together because they agree on the same structures.
- **Clinical safety.** Patient identity and acquisition details travel with the image.
- **Longevity.** Images stay readable for as long as they are retained.
- **Regulatory expectation.** Customers and regulators expect a conformance statement for imaging devices.
