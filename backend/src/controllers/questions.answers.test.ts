import assert from "node:assert/strict";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { mock, test } from "node:test";
import { db } from "../prisma/db.js";
import { QuestionsService } from "./questions.service.js";

test("rejects invalid doctor answers before querying questions", async () => {
  const first = mock.method(db.orm.public.Questions, "first", () => {
    throw new Error("invalid answers must not reach the database");
  });
  try {
    const service = new QuestionsService();
    await assert.rejects(service.createDoctorAnswer(1, 9, "short"), BadRequestException);
    await assert.rejects(service.createDoctorAnswer(0, 9, "Uma resposta válida para teste."), BadRequestException);
    assert.equal(first.mock.calls.length, 0);
  } finally {
    mock.restoreAll();
  }
});

test("rejects answers for a question that does not exist", async () => {
  const first = mock.method(db.orm.public.Questions, "first", async () => null);
  const create = mock.method(db.orm.public.Answers, "select", () => {
    throw new Error("answers must not be created for a missing question");
  });
  try {
    await assert.rejects(
      new QuestionsService().createDoctorAnswer(88, 9, "Uma resposta válida para teste."),
      NotFoundException,
    );
    assert.equal(first.mock.calls.length, 1);
    assert.equal(create.mock.calls.length, 0);
  } finally {
    mock.restoreAll();
  }
});

test("trims and stores the answer with the verified doctor id", async () => {
  const question = { id: 4, question: "Pergunta pública?", createdAt: Temporal.Instant.from("2026-09-29T12:00:00Z") };
  const first = mock.method(db.orm.public.Questions, "first", async () => question);
  const answer = {
    id: 12,
    questionId: 4,
    doctorId: 9,
    answer: "Esta é uma resposta médica informativa.",
    createdAt: Temporal.Instant.from("2026-09-29T13:00:00Z"),
  };
  const insert = mock.fn(async (input: { questionId: number; doctorId: number; answer: string }) => ({
    ...answer,
    ...input,
  }));
  mock.method(db.orm.public.Answers, "select", () => ({ create: insert }));
  try {
    const result = await new QuestionsService().createDoctorAnswer(
      4,
      9,
      "  Esta é uma resposta médica informativa.  ",
    );
    assert.deepEqual(result, answer);
    assert.equal(first.mock.calls.length, 1);
    assert.deepEqual(insert.mock.calls[0]?.arguments[0], {
      questionId: 4,
      doctorId: 9,
      answer: "Esta é uma resposta médica informativa.",
    });
  } finally {
    mock.restoreAll();
  }
});