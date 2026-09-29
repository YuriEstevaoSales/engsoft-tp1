import assert from "node:assert/strict";
import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import type { ExecutionContext } from "@nestjs/common";
import { mock, test } from "node:test";
import { db } from "../prisma/db.js";
import { DoctorAnswersGuard } from "./doctor-answers.guard.js";
import { createDoctorToken } from "./doctor-token.js";

const TEST_SECRET = "c".repeat(64);

function createContext(authorization?: string) {
  const request: { headers: { authorization?: string }; doctorId?: number } = {
    headers: authorization ? { authorization } : {},
  };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as ExecutionContext;
  return { context, request };
}

test("rejects requests without a bearer token before querying Doctors", async () => {
  const select = mock.method(db.orm.public.Doctors, "select", () => {
    throw new Error("anonymous requests must not query Doctors");
  });
  try {
    const { context } = createContext();
    await assert.rejects(new DoctorAnswersGuard().canActivate(context), UnauthorizedException);
    assert.equal(select.mock.calls.length, 0);
  } finally {
    mock.restoreAll();
  }
});

test("rejects a valid signed identity that is not a doctor", async () => {
  const originalSecret = process.env["AUTH_TOKEN_SECRET"];
  process.env["AUTH_TOKEN_SECRET"] = TEST_SECRET;
  const first = mock.fn(async () => null);
  const where = mock.fn((filter: { userId: number }) => ({ first, filter }));
  mock.method(db.orm.public.Doctors, "select", () => ({ where }));
  try {
    const token = await createDoctorToken(42);
    const { context } = createContext(`Bearer ${token}`);
    await assert.rejects(new DoctorAnswersGuard().canActivate(context), ForbiddenException);
  } finally {
    mock.restoreAll();
    if (originalSecret === undefined) delete process.env["AUTH_TOKEN_SECRET"];
    else process.env["AUTH_TOKEN_SECRET"] = originalSecret;
  }
});

test("attaches the verified doctor id to an authorized request", async () => {
  const originalSecret = process.env["AUTH_TOKEN_SECRET"];
  process.env["AUTH_TOKEN_SECRET"] = TEST_SECRET;
  const first = mock.fn(async () => ({ id: 9 }));
  const where = mock.fn((filter: { userId: number }) => ({ first, filter }));
  mock.method(db.orm.public.Doctors, "select", () => ({ where }));
  try {
    const token = await createDoctorToken(42);
    const { context, request } = createContext(`Bearer ${token}`);
    assert.equal(await new DoctorAnswersGuard().canActivate(context), true);
    assert.equal(request.doctorId, 9);
    assert.deepEqual(where.mock.calls[0]?.arguments[0], { userId: 42 });
  } finally {
    mock.restoreAll();
    if (originalSecret === undefined) delete process.env["AUTH_TOKEN_SECRET"];
    else process.env["AUTH_TOKEN_SECRET"] = originalSecret;
  }
});