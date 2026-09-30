BEGIN;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS role TEXT;

UPDATE public.users AS users
SET role = CASE
  WHEN EXISTS (
    SELECT 1 FROM public.doctors AS doctors WHERE doctors.user_id = users.id
  ) THEN 'doctor'
  ELSE 'patient'
END
WHERE role IS NULL;

ALTER TABLE public.users
  ALTER COLUMN role SET DEFAULT 'patient',
  ALTER COLUMN role SET NOT NULL;

COMMIT;