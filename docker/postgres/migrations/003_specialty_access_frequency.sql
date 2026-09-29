BEGIN;

ALTER TABLE public.medical_specialties
  ALTER COLUMN access_frequency SET DEFAULT 0;

UPDATE public.medical_specialties
SET access_frequency = 0
WHERE access_frequency IS NULL;

ALTER TABLE public.medical_specialties
  ALTER COLUMN access_frequency SET NOT NULL;

COMMIT;
