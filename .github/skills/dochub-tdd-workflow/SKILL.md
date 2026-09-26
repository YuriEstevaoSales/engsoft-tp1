---
name: dochub-tdd-workflow
description: Use this skill when implementing a new feature, fixing a bug, or changing business logic in DocHub (NestJS backend or React frontend), to follow the project's test-driven development cycle instead of writing implementation before tests.
---

# DocHub — TDD workflow

DocHub is developed test-driven. For any non-trivial change, write the failing test first, then the minimal implementation to pass it, then refactor.

## Backend (NestJS + Jest + Supertest)

1. **Services first.** Write a unit test for the `Service` method covering the business rule (e.g. "cannot create an appointment overlapping an existing one for the same doctor") before writing the implementation.
2. **Guards and auth.** When adding or changing a guard, role check, or `@Public()` / `@InternalApiKey()` usage, write a unit or e2e test asserting the access behavior (allowed/denied) before wiring the decorator.
3. **Controllers via e2e.** Use Supertest to test the actual HTTP contract (status codes, response shape, auth requirements) once the service-level logic is covered.
4. **Repositories/normalizers.** Cover edge cases (uniqueness constraints, malformed input normalization) with unit tests before implementing.

## Suggested order for a new feature end-to-end

1. Auth/role tests for the new route (if access rules are new)
2. Domain rule tests in the relevant `Service`
3. DTO validation tests
4. Controller e2e test for the full request/response contract
5. Frontend component/hook tests
6. Frontend integration (calls the right endpoint with the right params, handles error states)

## Frontend (React + Testing Library)

- Test **behavior**, not implementation details: e.g. "search form calls the API with the selected specialty and location filters", not internal state names.
- Cover loading, empty, and error states for data-fetching components (doctor search results, agenda view, appointment confirmation).
- Mock API calls at the service layer, not by reaching into component internals.

## Non-negotiables

- Don't mark a business-rule or endpoint change as done without a test that would fail without the change.
- Don't skip tests for guard/role changes — these are security-relevant and must be covered before merging.
- If a bug is fixed, add a regression test that reproduces it first.
