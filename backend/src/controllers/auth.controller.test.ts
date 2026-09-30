import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { AuthService } from "../auth/auth.service.js";
import { encryptPassword } from "../auth/password.js";
import { db } from "../prisma/db.js";

test("registers a patient and returns a patient session", async () => {
  const createdUser = { id: 12, name: "Maria Silva", email: "maria@example.com" };
  const createUser = mock.fn(async () => createdUser);
  const createPatient = mock.fn(async (_input: unknown) => ({ id: 4 }));
  const transaction = mock.fn(async (callback: (tx: unknown) => Promise<unknown>) =>
    callback({
      orm: {
        public: {
          Users: { select: () => ({ create: createUser }) },
          Patients: { create: createPatient },
        },
      },
    }),
  );

  mock.method(db, "transaction", transaction);

  try {
    const result = await new AuthService().registerPatient({
      email: "Maria@Example.com",
      name: "Maria Silva",
      cpf: "123.456.789-00",
      birthday: "1990-01-02",
      phoneNumber: "31999999999",
      stateAddress: "MG",
      city: "Belo Horizonte",
      insuranceId: "3",
      password: "segredo",
    });

    assert.deepEqual(result, {
      id: 12,
      name: "Maria Silva",
      email: "maria@example.com",
      role: "paciente",
    });
    assert.equal(createUser.mock.calls.length, 1);
    assert.deepEqual(createPatient.mock.calls[0]?.arguments[0], {
      userId: 12,
      insurance: 3,
    });
  } finally {
    mock.restoreAll();
  }
});

test("allows a registered patient to log in", async () => {
  const user = {
    id: 12,
    name: "Maria Silva",
    email: "maria@example.com",
    passwordEncrypted: "salt:key",
  };
  const first = mock.fn(async () => user);
  mock.method(db.orm.public.Users, "select", () => ({ where: () => ({ first }) }));
  mock.method(db.orm.public.Doctors, "select", () => ({ where: () => ({ first: async () => null }) }));
  mock.method(db.orm.public.Patients, "select", () => ({ where: () => ({ first: async () => ({ id: 4 }) }) }));
  user.passwordEncrypted = await encryptPassword("segredo");

  try {
    const result = await new AuthService().login("MARIA@EXAMPLE.COM", "segredo");
    assert.deepEqual(result, {
      id: 12,
      name: "Maria Silva",
      email: "maria@example.com",
      role: "paciente",
    });
  } finally {
    mock.restoreAll();
  }
});
