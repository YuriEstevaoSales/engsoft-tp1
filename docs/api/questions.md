# Public questions

The questions page is available at `/perguntas-respostas`. Questions are anonymous,
published immediately, and do not require an account. Only the question text and
creation timestamp are stored; the page warns users not to include personal data.

## `GET /api/questions`

- **Authentication:** public (`@Public()`).
- **Request:** no parameters or body.
- **Success:** `200 OK` with `{ "count": 1, "questions": [{ "id": 1, "question": "...", "createdAt": "..." }] }`.
- **Ordering:** newest first, with ID as a tie-breaker; at most 20 entries are returned.

## `POST /api/questions`

- **Authentication:** public (`@Public()`); no account or authorization header is required.
- **Request:** JSON body `{ "question": "..." }`.
- **Validation:** the trimmed question must contain 10–1000 characters. Invalid input returns `400 Bad Request`.
- **Success:** `201 Created` with the persisted question object. The new entry appears in the public list.
- **Persistence:** records are stored in `public.questions`; existing Compose volumes need `docker/postgres/migrations/004_questions.sql` applied once.

The content is user-submitted and rendered as text. Questions are not medical advice and do not replace a clinical consultation or emergency care.