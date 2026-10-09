---
title: Why software reliability matters in medical devices
sector: Medical
summary: In a medical device a software fault is a clinical event. Reliability has to be designed in from the first hazard analysis.
order: 1
readMinutes: 2
---

A crash in a phone app costs a minute. A fault in imaging or control software can delay a diagnosis, repeat an exposure or hold up a procedure. Testing at the end cannot fix that; it only finds what the design already allowed.

### Start from hazards, not features

Risk analysis under ISO 14971 names what can go wrong and what it would cost the patient or operator. Software requirements then follow from those hazards: what must never happen, what must be detected, and what the device does when it cannot continue.

### Let the architecture carry the load

Keep safety-relevant functions small and separate from the rest, such as generator limits, interlocks and exposure termination. A fault in the user interface should never be able to reach them.

### Use the process the standard describes

IEC 62304 classes software by the harm a failure could cause, and asks for more evidence as that class rises: requirements, design, unit, integration and system verification, all traceable to one another. Third-party and legacy components get the same scrutiny as new code.

### Keep it reliable after release

Field reports, problem resolution and controlled upgrades are part of reliability. A device that stays in service for ten years needs a plan for the operating system, libraries and components under it.
