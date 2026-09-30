# Authentication

`POST /api/auth/login`, `POST /api/auth/register-doctor`, and
`POST /api/auth/register-patient` return a session with this shape:

```json
{
  "user": {
    "id": 1,
    "name": "Maria Silva",
    "email": "maria@example.com",
    "role": "medico"
  },
  "accessToken": "..."
}
```

The role is `medico` or `paciente`. Passwords are encrypted before they are
stored. Each access token is signed with HS256, expires after eight hours, and
its SHA-256 hash is stored in the `auth_tokens` table. Protected requests
require a valid signature and a non-expired token record from the database.

The API requires `AUTH_TOKEN_SECRET` with at least 32 bytes. Keep it in the
ignored local `.env` and in the deployment secret store; never expose it to
frontend variables.

Existing databases should apply these migrations:

```bash
docker compose exec -T db psql -U dochub -d dochub < docker/postgres/migrations/006_user_role.sql
docker compose exec -T db psql -U dochub -d dochub < docker/postgres/migrations/007_auth_tokens.sql
```

The database stores roles as `doctor`, `patient`, or `admin`; the public API
maps them to `medico`, `paciente`, or the corresponding administrative role.
A role value kept in browser storage is not trusted by the API.
