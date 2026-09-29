import assert from "node:assert/strict";
import { test } from "node:test";
import { SignJWT } from "jose";
import { createDoctorToken, verifyDoctorToken } from "./doctor-token.js";

const TEST_SECRET = "a".repeat(64);

test("creates a signed token for an existing doctor identity", async () => {
  const originalSecret = process.env["AUTH_TOKEN_SECRET"];
  process.env["AUTH_TOKEN_SECRET"] = TEST_SECRET;
  try {
    const token = await createDoctorToken(42);
    const claims = await verifyDoctorToken(token);
    assert.equal(claims.sub, "42");
    assert.equal(claims.role, "medico");
  } finally {
    if (originalSecret === undefined) delete process.env["AUTH_TOKEN_SECRET"];
    else process.env["AUTH_TOKEN_SECRET"] = originalSecret;
  }
});

test("rejects a token signed with a different secret", async () => {
  const originalSecret = process.env["AUTH_TOKEN_SECRET"];
  process.env["AUTH_TOKEN_SECRET"] = TEST_SECRET;
  const invalidToken = await new SignJWT({ role: "medico" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setSubject("42")
    .setIssuer("dochub")
    .setAudience("dochub-api")
    .setExpirationTime("8h")
    .sign(new TextEncoder().encode("b".repeat(64)));
  try {
    await assert.rejects(verifyDoctorToken(invalidToken));
  } finally {
    if (originalSecret === undefined) delete process.env["AUTH_TOKEN_SECRET"];
    else process.env["AUTH_TOKEN_SECRET"] = originalSecret;
  }
});

test("requires a configured secret of at least 32 characters", async () => {
  const originalSecret = process.env["AUTH_TOKEN_SECRET"];
  delete process.env["AUTH_TOKEN_SECRET"];
  try {
    await assert.rejects(createDoctorToken(42), /AUTH_TOKEN_SECRET/);
  } finally {
    if (originalSecret !== undefined) process.env["AUTH_TOKEN_SECRET"] = originalSecret;
  }
});