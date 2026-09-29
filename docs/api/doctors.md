# Doctor search

`GET /api/doctors/search` lists doctors for one catalog specialty, with public profile details and each doctor's average appointment rating.

- **Authentication:** public; the route is marked with `@Public()`.
- **Request:** query parameter `specialty`, containing the exact specialty name from `GET /api/medical-specialties`. Optional `minRating` values are `3`, `4`, or `5`; `insuranceId` is a row ID from `Insurances`; `state` is a Brazilian state abbreviation. Empty or whitespace-only specialties return an empty result.
- **Success:** `200 OK` with `{ "count": 1, "doctors": [...] }`. Each doctor has `id`, `specialty`, `crmNumber`, `crmUf`, `street`, `addressNumber`, `addressComplement`, `insurances` (accepted insurance IDs), `acceptedInsurances` (accepted insurance names), `user` (`name`, `photo`, `city`, `stateAddress`), and `averageRating`.
- **Rating:** `averageRating` is the average of non-null `Appointments.rate` values grouped by doctor; it is `null` when there are no ratings.
- **Search behavior:** the endpoint filters by exact specialty and then by any provided minimum rating, accepted insurance, and state; results are ordered by doctor ID. Every non-empty search request atomically increments `medical_specialties.access_frequency` for the matching catalog entry; unknown specialties do not create entries. `count` reflects the filtered result set. Database or server failures return the standard NestJS error response.
- **Current schema constraint:** `appointments.doctorId` is unique, so the database currently permits at most one appointment rating per doctor. The endpoint calculates the average correctly over stored rows, but multiple historical ratings require changing that existing constraint.

The home page opens `/encontrar-medico/:slug` after a specialty search. On that page, current and future calendar dates navigate to `/agendar/:doctorId?date=YYYY-MM-DD`; past dates are disabled. The current schema has no availability model, so a clickable date is not a promise that a consultation slot is free. The destination is a placeholder until scheduling is implemented.

When a doctor has no stored profile photo, the frontend requests a random placeholder image from the external Dog CEO API (`https://dog.ceo/api/breeds/image/random`). A failed request keeps the doctor's initials as the local fallback.
