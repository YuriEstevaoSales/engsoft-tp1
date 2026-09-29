import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mock, test } from "node:test";
import { IS_PUBLIC_KEY } from "../auth/public.decorator.js";
import { db } from "../prisma/db.js";
import { MedicalSpecialtiesController } from "./medical-specialties.controller.js";

test("returns specialties ordered by search frequency and then alphabetically", async () => {
  const rows = [
    { medicalSpecialty: "Cardiologia" },
    { medicalSpecialty: "Dermatologia" },
  ];
  const all = mock.fn(async () => rows);
  let ordering: unknown;
  const orderBy = mock.fn((value: unknown) => {
    ordering = value;
    return { all };
  });
  mock.method(db.orm.public.MedicalSpecialties, "select", () => ({ orderBy }));

  try {
    const result = await new MedicalSpecialtiesController().list();

    assert.deepEqual(result, { specialties: ["Cardiologia", "Dermatologia"] });
    assert.equal(Array.isArray(ordering), true);
    const sortRules = ordering as Array<
      (specialty: {
        accessFrequency: { desc: () => string };
        medicalSpecialty: { asc: () => string };
      }) => string
    >;
    assert.deepEqual(
      sortRules.map((sort) => sort({
        accessFrequency: { desc: () => "frequency desc" },
        medicalSpecialty: { asc: () => "name asc" },
      })),
      ["frequency desc", "name asc"],
    );
    assert.equal(orderBy.mock.calls.length, 1);
    assert.equal(all.mock.calls.length, 1);
    assert.equal(Reflect.getMetadata(IS_PUBLIC_KEY, MedicalSpecialtiesController.prototype.list), true);
  } finally {
    mock.restoreAll();
  }
});

test("database bootstrap creates and seeds the catalog queried by the homepage", () => {
  const migration = readFileSync(
    resolve("docker/postgres/migrations/002_medical_specialties.sql"),
    "utf8",
  );

  assert.match(migration, /CREATE TABLE IF NOT EXISTS public\.medical_specialties/i);
  assert.match(migration, /medical_specialty VARCHAR NOT NULL/i);
  assert.match(migration, /access_frequency BIGINT NOT NULL DEFAULT 0/i);
  assert.match(migration, /INSERT INTO public\.medical_specialties/i);
  assert.match(migration, /FROM public\.doctors/i);
  assert.match(migration, /doctors_specialty_fkey/i);

  const counterMigration = readFileSync(
    resolve("docker/postgres/migrations/003_specialty_access_frequency.sql"),
    "utf8",
  );
  assert.match(counterMigration, /SET access_frequency = 0\s+WHERE access_frequency IS NULL/i);
  assert.match(counterMigration, /ALTER COLUMN access_frequency SET NOT NULL/i);
});
