# Authentication

## `POST /api/auth/register-patient`

Creates a patient account in a transaction: one row is created in `users` and
one related row in `patients`. Passwords are stored encrypted, and email, CPF,
and phone number keep the database uniqueness rules.

- **Authentication:** public.
- **Request:** `{ email, name, cpf, birthday, phoneNumber, stateAddress,
  city?, insuranceId?, password }`.
- **Success:** `200 OK` with `{ user: { id, name, email, role: "paciente" } }`.
- **Errors:** `400` for missing data or passwords shorter than six characters;
  `409` when a unique user field is already registered.

## `POST /api/auth/register-doctor`

Creates a doctor account in the same transaction pattern and requires the
doctor-specific fields already used by the second registration page (`crm`,
`specialty`, `street`, and `addressNumber`, in addition to the common fields).

- **Authentication:** public.
- **Success:** `200 OK` with `{ user: { id, name, email, role: "medico" } }`.
- **Errors:** `400` for invalid or incomplete data; `409` for duplicate email,
  CPF, phone number, or CRM.

## `POST /api/auth/login`

Authenticates either a doctor or a patient using the same email and password
form. The role is resolved from the related `doctors` or `patients` row.

- **Authentication:** public.
- **Request:** `{ email, password }`.
- **Success:** `200 OK` with `{ user: { id, name, email, role:
  "medico" | "paciente" } }`.
- **Errors:** `401` for an unknown account, an account without a supported
  profile, or an invalid password.

The frontend stores the returned user session locally and opens `/perfil` for
both roles. Doctor and patient profile responses are served by the existing
`GET /api/doctors/me?userId=<id>` endpoint; the endpoint returns the patient
identity and insurance reference when the account is a patient.
