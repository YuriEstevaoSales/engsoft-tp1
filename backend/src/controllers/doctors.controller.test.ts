import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { IS_PUBLIC_KEY } from "../auth/public.decorator.js";
import { db } from "../prisma/db.js";
import { DoctorsController } from "./doctors.controller.js";

test("returns only doctors in the requested specialty with average ratings", async () => {
  const doctors = [{
    id: 7,
    specialty: "Ginecologia",
    crmNumber: "123456",
    crmUf: "MG",
    street: "Rua Cacete",
    addressNumber: 123,
    addressComplement: null,
    insurances: [1],
    user: { name: "Dra. Ana Souza", photo: "/ana.jpg", city: "Belo Horizonte", stateAddress: "MG" },
  }];
  const allDoctors = mock.fn(async () => doctors);
  const orderBy = mock.fn(() => ({ all: allDoctors }));
  const include = mock.fn((_relation: string, load: (user: { select: (...fields: string[]) => object }) => object) => {
    load({ select: (...fields: string[]) => ({ fields }) });
    return { orderBy };
  });

  const select = mock.fn(() => ({ include }));
  const whereDoctors = mock.fn((filter: { specialty: string }) => {
    assert.deepEqual(filter, { specialty: "Ginecologia" });
    return { select };
  });
  mock.method(db.orm.public.Doctors, "where", whereDoctors);

  type FrequencyUpdatePlan = {
    ast: {
      kind: string;
      parts: readonly (string | { value: unknown })[];
    };
  };
  const execute = mock.fn(async (plan: FrequencyUpdatePlan) => {
    assert.equal(plan.ast.kind, "raw-query");
    assert.match(plan.ast.parts[0] as string, /access_frequency = access_frequency \+ 1/);
    assert.equal((plan.ast.parts[1] as { value: unknown }).value, "Ginecologia");
    return { affectedRows: 1 };
  });
  mock.method(db, "runtime", () => ({ execute }));

  const averageRatings = [{ doctorId: 7, averageRating: 4.5 }];
  const aggregate = mock.fn(async (project: (fields: { avg: (field: string) => string }) => object) => {
    assert.deepEqual(project({ avg: (field) => `average:${field}` }), {
      averageRating: "average:rate",
    });
    return averageRatings;
  });
  const groupBy = mock.fn(() => ({ aggregate }));
  mock.method(db.orm.public.Appointments, "where", () => ({ groupBy }));
  const allInsurances = mock.fn(async () => [
    { id: 1, name: "Unimed" },
    { id: 2, name: "Amil" },
  ]);
  const selectInsurances = mock.fn(() => ({ all: allInsurances }));
  mock.method(db.orm.public.Insurances, "select", selectInsurances);

  try {
    const result = await new DoctorsController().searchBySpecialty("Ginecologia");

    assert.deepEqual(result, {
      count: 1,
      doctors: [{
        ...doctors[0],
        averageRating: 4.5,
        acceptedInsurances: ["Unimed"],
      }],
    });
    assert.equal(Reflect.getMetadata(
      IS_PUBLIC_KEY,
      DoctorsController.prototype.searchBySpecialty,
    ), true);
    assert.equal(allDoctors.mock.calls.length, 1);
    assert.equal(execute.mock.calls.length, 1);
    assert.equal(aggregate.mock.calls.length, 1);
    assert.equal(allInsurances.mock.calls.length, 1);
    assert.deepEqual(whereDoctors.mock.calls[0]?.arguments[0], {
      specialty: "Ginecologia",
    });
  } finally {
    mock.restoreAll();
  }
});
