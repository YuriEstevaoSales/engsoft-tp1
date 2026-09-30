# Public questions

The questions page is available at `/perguntas-respostas`. Questions are anonymous,
published immediately, and do not require an account. Only the question text and
creation timestamp are stored; the page warns users not to include personal data.

## `GET /api/questions`

- **Authentication:** public (`@Public()`).
- **Request:** no parameters or body.
- **Success:** `200 OK` with `{ "count": 1, "questions": [{ "id": 1, "question": "...", "createdAt": "...", "answers": [] }] }`. Each answer includes its author name and specialty.
- **Ordering:** newest first, with ID as a tie-breaker; at most 20 entries are returned.

## `POST /api/questions`

- **Authentication:** public (`@Public()`); no account or authorization header is required.
- **Request:** JSON body `{ "question": "..." }`.
- **Validation:** the trimmed question must contain 10–1000 characters. Invalid input returns `400 Bad Request`.
- **Success:** `201 Created` with the persisted question object. The new entry appears in the public list.
- **Persistence:** records are stored in `public.questions`; existing Compose volumes need `docker/postgres/migrations/004_questions.sql` applied once.

## `POST /api/questions/:questionId/answers`

- **Authentication:** bearer token issued by doctor login or registration; the server verifies its signature and confirms the user still has a row in `public.doctors`.
- **Request:** JSON body `{ "answer": "..." }`. The doctor ID is taken from the verified session, never from the request body.
- **Validation:** the trimmed answer must contain 10–2000 characters. Invalid input returns `400 Bad Request`; an unknown question returns `404 Not Found`; a second answer by the same doctor returns `409 Conflict`.
- **Success:** `201 Created` with the saved answer. The public question feed then displays it with the doctor's name and specialty.
- **Persistence and access:** answers are stored in `public.answers`. Existing databases need `docker/postgres/migrations/005_answers.sql`; it enables RLS and revokes direct `anon`/`authenticated` table grants. Requests go through the Nest API.

The content is user-submitted and rendered as text. Questions are not medical advice and do not replace a clinical consultation or emergency care.