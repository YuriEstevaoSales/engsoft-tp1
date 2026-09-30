import assert from "node:assert/strict";
import { BadRequestException } from "@nestjs/common";
import { mock, test } from "node:test";
import { IS_PUBLIC_KEY } from "../auth/public.decorator.js";
import { db } from "../prisma/db.js";
import { QuestionsController } from "./questions.controller.js";
import { QuestionsService } from "./questions.service.js";

test("rejects invalid anonymous questions without writing to the database", async () => {
  const select = mock.method(db.orm.public.Questions, "select", () => {
    throw new Error("invalid questions must not reach the database");
  });

  try {
    const service = new QuestionsService();
    await assert.rejects(service.createAnonymousQuestion("   "), BadRequestException);
    await assert.rejects(service.createAnonymousQuestion("curta"), BadRequestException);
    await assert.rejects(service.createAnonymousQuestion("x".repeat(1001)), BadRequestException);
    assert.equal(select.mock.calls.length, 0);
  } finally {
    mock.restoreAll();
  }
});

test("trims and persists a valid anonymous question", async () => {
  const created = {
    id: 12,
    question: "Tenho dúvidas sobre minha consulta.",
    createdAt: Temporal.Instant.from("2026-09-29T12:00:00Z"),
  };
  const insert = mock.fn(async (input: { question: string }) => ({ ...created, ...input }));
  mock.method(db.orm.public.Questions, "select", () => ({ create: insert }));

  try {
    const result = await new QuestionsService().createAnonymousQuestion(
      "  Tenho dúvidas sobre minha consulta.  ",
    );
    assert.deepEqual(result, created);
    assert.deepEqual(insert.mock.calls[0]?.arguments[0], {
      question: "Tenho dúvidas sobre minha consulta.",
    });
  } finally {
    mock.restoreAll();
  }
});

test("lists recent questions with a bounded page size", async () => {
  const questions = [{
    id: 12,
    question: "Tenho dúvidas sobre minha consulta.",
    createdAt: Temporal.Instant.from("2026-09-29T12:00:00Z"),
  }];
  const all = mock.fn(async () => questions);
  const limit = mock.fn((requestedLimit: number) => ({ all, requestedLimit }));
  const orderBy = mock.fn(() => ({ limit }));
  const include = mock.fn(() => ({ orderBy }));
  mock.method(db.orm.public.Questions, "select", () => ({ include }));

  try {
    const result = await new QuestionsService().listPublicQuestions();
    assert.deepEqual(result, { count: 1, questions });
    assert.equal(limit.mock.calls[0]?.arguments[0], 20);
  } finally {
    mock.restoreAll();
  }
});

test("marks both question endpoints as intentionally public", () => {
  assert.equal(Reflect.getMetadata(IS_PUBLIC_KEY, QuestionsController.prototype.list), true);
  assert.equal(Reflect.getMetadata(IS_PUBLIC_KEY, QuestionsController.prototype.create), true);
});

test("serves the question list without constructor injection metadata", async () => {
  const expected = { count: 0, questions: [] };
  const list = mock.method(QuestionsService.prototype, "listPublicQuestions", async () => expected);

  try {
    const controller = Reflect.construct(QuestionsController, []) as QuestionsController;
    assert.deepEqual(await controller.list(), expected);
    assert.equal(list.mock.calls.length, 1);
  } finally {
    mock.restoreAll();
  }
});