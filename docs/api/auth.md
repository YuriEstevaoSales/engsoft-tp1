# Doctor authentication

`POST /api/auth/login` and `POST /api/auth/register-doctor` return `{ "user": { "id": 1, "name": "...", "email": "...", "role": "medico" }, "accessToken": "..." }` on success. The access token is signed with HS256, expires after eight hours, and is used as `Authorization: Bearer <accessToken>` when submitting a doctor answer.

The API requires `AUTH_TOKEN_SECRET` with at least 32 bytes. Keep it in the ignored local `.env` and in the deployment's secret store; never expose it to frontend variables. Answer authorization verifies the signature and then confirms the token subject still belongs to a doctor record. A role value kept in browser storage is not trusted by the API.