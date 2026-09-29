# Medical specialties catalog

`GET /api/medical-specialties` exposes the medical specialty catalog used by the home-page search and doctor registration form.

- **Authentication:** public; the controller marks the route with `@Public()`.
- **Request:** no query parameters or body.
- **Success:** `200 OK` with `{ "specialties": ["Cardiologia", "Dermatologia"] }`. Names come from `MedicalSpecialties.medicalSpecialty` and are ordered by `access_frequency` descending, then alphabetically for ties.
- **Errors:** database or server failures return the standard NestJS error response.
- **Search behavior:** the home page keeps its initial suggested specialties visible while typing and opens a separate, accent-insensitive list of matching catalog entries. Selecting a result fills the search field. Doctor registration uses this same controlled catalog. The endpoint returns names only, so its response does not expose database IDs. Suggestions use the catalog's popularity order.
- **Search frequency:** each non-empty request to `GET /api/doctors/search` atomically increments `access_frequency` for the matching catalog specialty; unknown specialty names do not create catalog rows. Loading the specialty catalog does not increment counts.
- **Database setup:** Docker initializes the catalog through `docker/postgres/migrations/002_medical_specialties.sql` and ensures existing counters are non-null through `docker/postgres/migrations/003_specialty_access_frequency.sql`. The scripts add standard local-development entries and import existing doctor specialty values before adding the foreign key. For an existing Compose database volume, apply the new migration with `docker compose exec -T db psql -U dochub -d dochub < docker/postgres/migrations/003_specialty_access_frequency.sql`; initialization scripts are not rerun for an existing volume.
- **Connection source:** the API reads from the PostgreSQL database in `DATABASE_URL`. Docker Compose uses the value from `.env` when present and falls back to its local PostgreSQL service otherwise. The local development catalog seeds do not replace or populate an external database.
