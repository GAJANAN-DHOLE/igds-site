---
title: "DICOM and DICOMweb: what is the difference?"
sector: Medical
summary: Classic DICOM moves images over a persistent TCP association. DICOMweb carries the same data over ordinary HTTP.
order: 3
readMinutes: 2
---

Both move the same objects. They differ in how.

### Classic DICOM

Services such as C-STORE, C-FIND, C-MOVE and C-GET run over a persistent TCP association, with the two ends agreeing what they support when it opens. It is mature, fast inside a hospital and built into nearly every modality and archive.

### DICOMweb

DICOMweb exposes the same functions as web services: STOW-RS to store, QIDO-RS to query and WADO-RS to retrieve. Roughly, C-STORE becomes STOW-RS, C-FIND becomes QIDO-RS, and C-MOVE and C-GET become WADO-RS.

### What actually changes

- **Networks.** HTTP passes through firewalls and load balancers that treat arbitrary TCP ports with suspicion.
- **Clients.** A browser can talk to the archive directly.
- **Security.** TLS and token-based authorisation replace network-level trust.
- **Retrieval.** Pull by address, and fetch a single frame or only the metadata.

### When to use which

Keep classic DICOM for modalities and in-hospital links that already rely on it. Choose DICOMweb for viewers, cloud and mobile clients, and new integrations. Many products offer both, and the details worth checking are what the conformance statement says each supports.
