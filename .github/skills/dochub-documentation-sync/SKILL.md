---
name: dochub-documentation-sync
description: Use this skill whenever a change affects behavior, a contract, an endpoint, a DTO, an entity, cache, a snapshot, security, audit, a scheduler, an external integration, or persistence in DocHub, to update the corresponding documentation under docs/ correctly, without creating loose or duplicated files.
---

# DocHub — documentation policy

## When documentation must be updated

Any of these changes require a matching update to documentation under `docs/`:

- Behavior change (business rule, validation, response shape)
- Contract change (request/response shape, status codes)
- New or changed endpoint
- New or changed DTO
- New or changed entity/table
- Cache behavior change
- Snapshot/versioned-data change
- Security change (auth, roles, rate limiting)
- Audit logging change
- Scheduler/cron job change
- External integration change (e.g. payment, notification, insurance provider APIs)
- Persistence/schema change

If a change falls into one of these categories and you don't know where it's documented, search `docs/` first before assuming there's no existing doc to update.

## Rules

- **All documentation lives under `docs/`.** Never create a `.md` file describing behavior, an API, or an architecture decision outside of `docs/` (e.g. don't drop a stray `NOTES.md` in the repo root or inside `src/`).
- **Never duplicate existing documentation.** Before writing a new doc, search `docs/` for an existing file covering the same endpoint, entity, or feature, and update it instead of creating a near-duplicate.
- **If the documentation structure changes** (a file is split, renamed, or moved), move/update the actual files — don't leave the old one behind as dead content — and fix every internal link that pointed to the old path (in other docs, and in code comments/READMEs if they link there too).

## Suggested structure

Align with what already exists in `docs/`; don't reorganize without reason.

```
docs/
├── architecture/       # high-level system design, module boundaries
├── api/                # endpoint-by-endpoint contracts (request/response, status codes, auth requirements)
├── domain/             # entities, relationships, business rules
├── security/           # auth model, roles, rate limiting, audit policy
├── integrations/       # external services (payment, notifications, etc.)
└── changelog/          # notable behavior/contract changes over time
```

## Minimal doc entry for an endpoint change

When you touch an endpoint, make sure its doc (in `docs/api/`) reflects:

- Method + path
- Auth requirement (`@Public()`, JWT, `@InternalApiKey()`, required roles)
- Request DTO shape
- Response shape + status codes
- Notable business rules/side effects (e.g. "triggers audit log", "invalidates cache X")

## Checklist before finishing

- [ ] Does this change fall into one of the categories above?
- [ ] Did I search `docs/` for an existing file to update, instead of creating a new one?
- [ ] If structure changed, did I move files (not copy) and fix all internal links?
- [ ] Is every new doc file actually under `docs/`?
