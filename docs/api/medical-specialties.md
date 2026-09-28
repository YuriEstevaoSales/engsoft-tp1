# Medical specialties catalog

`GET /api/medical-specialties` exposes the medical specialty catalog used by the home-page search and doctor registration form.

- **Authentication:** public; the controller marks the route with `@Public()`.
- **Request:** no query parameters or body.
- **Success:** `200 OK` with `{ "specialties": ["Cardiologia", "Dermatologia"] }`. Names come from `MedicalSpecialties.medicalSpecialty` and are ordered alphabetically.
- **Errors:** database or server failures return the standard NestJS error response.
- **Search behavior:** the home page keeps its initial suggested specialties visible while typing and opens a separate, accent-insensitive list of matching catalog entries. Selecting a result fills the search field. Doctor registration uses this same controlled catalog. The endpoint returns names only, so its response does not expose database IDs.
