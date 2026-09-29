import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { DoctorAnswersGuard, type DoctorRequest } from "../auth/doctor-answers.guard.js";
import { QuestionsController } from "./questions.controller.js";
import { QuestionsService } from "./questions.service.js";

test("protects answer creation with the doctor authentication guard", () => {
  assert.deepEqual(
    Reflect.getMetadata("__guards__", QuestionsController.prototype.answer),
    [DoctorAnswersGuard],
  );
});

test("passes only the verified doctor id to answer persistence", async () => {
  const create = mock.method(
    QuestionsService.prototype,
    "createDoctorAnswer",
    async (questionId: number, doctorId: number, answer: unknown) => ({ questionId, doctorId, answer }),
  );
  try {
    const controller = new QuestionsController();
    const request = { doctorId: 9 } as DoctorRequest;
    assert.deepEqual(await controller.answer(4, { answer: "Resposta médica informativa." }, request), {
      questionId: 4,
      doctorId: 9,
      answer: "Resposta médica informativa.",
    });
    assert.deepEqual(create.mock.calls[0]?.arguments, [4, 9, "Resposta médica informativa."]);
  } finally {
    mock.restoreAll();
  }
});