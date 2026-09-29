import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { db } from "../prisma/db.js";
import { AuthService } from "./auth.service.js";
import { encryptPassword } from "./password.js";
import { verifyDoctorToken } from "./doctor-token.js";

test("issues a verifiable doctor token after successful login", async () => {
  const originalSecret = process.env["AUTH_TOKEN_SECRET"];
  process.env["AUTH_TOKEN_SECRET"] = "d".repeat(64);
  const user = {
    id: 42,
    name: "Dra. Teste",
    email: "doctor@example.com",
    passwordEncrypted: await encryptPassword("strong-password"),
  };
  const userFirst = mock.fn(async () => user);
  const userWhere = mock.fn(() => ({ first: userFirst }));
  mock.method(db.orm.public.Users, "select", () => ({ where: userWhere }));
  const doctorFirst = mock.fn(async () => ({ id: 9 }));
  const doctorWhere = mock.fn(() => ({ first: doctorFirst }));
  mock.method(db.orm.public.Doctors, "select", () => ({ where: doctorWhere }));

  try {
    const session = await new AuthService().login(user.email, "strong-password");
    assert.deepEqual(session.user, {
      id: 42,
      name: "Dra. Teste",
      email: "doctor@example.com",
      role: "medico",
    });
    const claims = await verifyDoctorToken(session.accessToken);
    assert.equal(claims.sub, "42");
  } finally {
    mock.restoreAll();
    if (originalSecret === undefined) delete process.env["AUTH_TOKEN_SECRET"];
    else process.env["AUTH_TOKEN_SECRET"] = originalSecret;
  }
});