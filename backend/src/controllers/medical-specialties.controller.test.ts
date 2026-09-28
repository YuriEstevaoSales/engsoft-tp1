import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { IS_PUBLIC_KEY } from "../auth/public.decorator.js";
import { db } from "../prisma/db.js";
import { MedicalSpecialtiesController } from "./medical-specialties.controller.js";

test("returns specialties from the database in alphabetical order", async () => {
  const rows = [
    { medicalSpecialty: "Cardiologia" },
    { medicalSpecialty: "Dermatologia" },
  ];
  const all = mock.fn(async () => rows);
  const orderBy = mock.fn(() => ({ all }));
  mock.method(db.orm.public.MedicalSpecialties, "select", () => ({ orderBy }));

  try {
    const result = await new MedicalSpecialtiesController().list();

    assert.deepEqual(result, { specialties: ["Cardiologia", "Dermatologia"] });
    assert.equal(orderBy.mock.calls.length, 1);
    assert.equal(all.mock.calls.length, 1);
    assert.equal(Reflect.getMetadata(IS_PUBLIC_KEY, MedicalSpecialtiesController.prototype.list), true);
  } finally {
    mock.restoreAll();
  }
});
