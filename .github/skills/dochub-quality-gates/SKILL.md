---
name: dochub-quality-gates
description: Use this skill before concluding any relevant DocHub change, to decide the minimal sufficient set of validation commands (lint, test, build, prisma:validate) to run given the type of change made.
---

# DocHub — quality gates

Run the **smallest sufficient set** of these commands before considering a change complete — not all of them by default, but never skip one that applies.

| Change type | Command |
|---|---|
| Broad or structural TypeScript changes | `pnpm lint` |
| Business rules, use cases, guards, normalizers, or repositories | `pnpm test` |
| NestJS wiring, providers, modules, or shared types | `pnpm build` |
| Prisma schema changes | `pnpm prisma:validate` |

## Guidance

- A single small, isolated fix (e.g. a typo in a DTO label) may only need `pnpm lint`.
- Any change touching a `Service`, guard, decorator behavior, or repository logic needs `pnpm test` at minimum — this is where DocHub's business rules and security rules (auth, roles, rate limiting, audit) are actually verified.
- Any change to module wiring, providers, or types shared across modules needs `pnpm build` to catch wiring/type errors that tests might not.
- Any Prisma schema/migration change needs `pnpm prisma:validate` before it's considered done.
- When in doubt about which layer a change touches, run more rather than fewer — but don't run `pnpm build` for a pure frontend copy change, for example.

## Checklist before finishing

- [ ] Identify which categories above this change touches.
- [ ] Run the corresponding command(s).
- [ ] Don't report the change as complete if a required command wasn't run or is failing.
