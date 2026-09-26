---
name: dochub-nestjs-security
description: Use this skill whenever creating or changing a NestJS controller, route, guard or endpoint in the DocHub backend, to correctly apply authentication, authorization, rate limiting, audit logging and safe logging conventions.
---

# DocHub — NestJS security & access conventions

These rules are mandatory for every route added or modified in the DocHub backend.

## Authentication

- All routes are private by default via a **global JWT Bearer guard**. Do not add per-route auth guards that re-implement this.
- If a route must be public (no token required), mark it explicitly with `@Public()`. Never leave a route unauthenticated by omission — it must be an explicit, reviewable decision.

## Internal routes

- Routes meant only for service-to-service calls must use `@InternalApiKey()` and expect an `x-api-key` header, instead of (or alongside) JWT, following the existing pattern in the codebase.

## Authorization

- Any operation restricted to specific roles (`paciente`, `medico`, `admin`) must use `@Roles(...)`. Check the role(s) against the actual business rule (e.g. only `medico` can create availability for themselves; only `admin` can manage specialty/insurance catalogs).
- Never rely on frontend checks alone — role checks must exist server-side via `@Roles(...)` and the roles guard.

## Rate limiting

- Preserve the global rate limiting configuration. Do not disable, bypass, or locally override it for a route unless there is an explicit, documented reason — and if you do, document it in `docs/` per the `dochub-documentation-sync` skill.

## Audit logging

- Preserve audit logging for sensitive, administrative, and authentication-related actions (login, password reset, role changes, appointment cancellation by an admin, changes to a doctor's public profile, etc.). If you add a new sensitive action, add audit logging for it too, following the existing audit pattern in the codebase.

## Logging safety

- Never log secrets, tokens, passwords, API keys, or full sensitive payloads (e.g. don't log an entire request body containing patient personal data or a JWT). Prefer logging IDs and event types, not raw payloads.

## Checklist before finishing a route change

- [ ] Is this route intentionally public? If yes, is `@Public()` present?
- [ ] Is this an internal-only route? If yes, is `@InternalApiKey()` present and does it expect `x-api-key`?
- [ ] Does this route need role restriction? If yes, is `@Roles(...)` present and correct?
- [ ] Is rate limiting still applied (not accidentally bypassed)?
- [ ] Is this a sensitive/admin/auth action? If yes, is it audited?
- [ ] Do any logs added in this change avoid secrets, tokens, passwords or sensitive payloads?
