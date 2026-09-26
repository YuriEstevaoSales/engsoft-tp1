---
name: dochub-domain-context
description: Use this skill whenever working on any DocHub feature (backend or frontend) that involves patients, doctors, specialties, appointments, agendas/availability, insurance plans (convênios) or user roles, to keep domain vocabulary, entities and business rules consistent across the codebase.
---

# DocHub domain context

DocHub is a platform where patients search for doctors by specialty, check availability, view a doctor's schedule and book appointments. Doctors manage their own schedule, bio and accepted insurance plans (convênios). There are three roles: `paciente`, `medico`, `admin`.

## Key business rules to respect

- A doctor cannot have two appointments at overlapping times.
- A patient cannot have two appointments at overlapping times.
- Only the owning doctor (or an admin) can create, edit or cancel that doctor's availability.
- Only the doctor assigned to an appointment (or an admin) can confirm/cancel it; a patient can request or cancel their own appointment depending on the status rules already implemented — check the existing service logic before changing this.
- CRM and email must be unique.
- Specialty and insurance/convênio values should come from controlled catalogs, not free text, when the codebase already models them that way.

## When to use this skill

Use it as background context before implementing or reviewing any change to patient search, doctor profile, availability/agenda, or appointment booking, so naming, relationships and rules stay consistent with the rest of the system.

If you're unsure whether a rule listed here still matches the code (e.g. it was intentionally changed), trust the current code and existing tests over this document, and flag that this skill file may need updating.
