import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { db } from "../prisma/db.js";
import { DoctorsController } from "./doctors.controller.js";

test("does not search or increment frequency if the specialty query is empty", async () => {
  const whereDoctors = mock.method(db.orm.public.Doctors, "where", () => {
    throw new Error("doctors should not be queried");
  });
  const runtime = mock.method(db, "runtime", () => {
    throw new Error("specialty frequency should not be updated");
  });

  try {
    assert.deepEqual(
      await new DoctorsController().searchBySpecialty("  "),
      { count: 0, doctors: [] },
    );
    assert.equal(whereDoctors.mock.calls.length, 0);
    assert.equal(runtime.mock.calls.length, 0);
  } finally {
    mock.restoreAll();
  }
});

test("returns an empty list without querying ratings for a specialty with no doctors", async () => {
  const allDoctors = mock.fn(async () => []);
  const orderBy = mock.fn(() => ({ all: allDoctors }));
  const include = mock.fn(() => ({ orderBy }));
  const select = mock.fn(() => ({ include }));
  mock.method(db.orm.public.Doctors, "where", () => ({ select }));
  const executeFrequency = mock.method(db, "runtime", () => ({
    execute: async () => ({ affectedRows: 0 }),
  }));
  const whereRatings = mock.method(db.orm.public.Appointments, "where", () => {
    throw new Error("ratings should not be queried");
  });

  try {
    assert.deepEqual(
      await new DoctorsController().searchBySpecialty("Especialidade inexistente"),
      { count: 0, doctors: [] },
    );
    assert.equal(whereRatings.mock.calls.length, 0);
    assert.equal(executeFrequency.mock.calls.length, 1);
  } finally {
    mock.restoreAll();
  }
});
