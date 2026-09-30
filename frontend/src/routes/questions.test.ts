import assert from "node:assert/strict";
import { test } from "node:test";
import { createAnswer, createQuestion, loadQuestions } from "./questions.js";

const question = {
  id: 4,
  question: "Como me preparo para a primeira consulta?",
  createdAt: "2026-09-29T12:00:00.000Z",
  answers: [],
};

test("loads the public questions list", async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = "";
  globalThis.fetch = (async (input: string | URL | Request) => {
    requestedUrl = String(input);
    return new Response(JSON.stringify({ count: 1, questions: [question] }), { status: 200 });
  }) as typeof fetch;

  try {
    assert.deepEqual(await loadQuestions(), [question]);
    assert.equal(requestedUrl, "/api/questions");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("submits an anonymous question without an authorization header", async () => {
  const originalFetch = globalThis.fetch;
  let requestUrl = "";
  let requestInit: RequestInit | undefined;
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    requestUrl = String(input);
    requestInit = init;
    return new Response(JSON.stringify(question), { status: 201 });
  }) as typeof fetch;

  try {
    assert.deepEqual(await createQuestion(question.question), question);
    assert.equal(requestUrl, "/api/questions");
    assert.equal(requestInit?.method, "POST");
    assert.equal(requestInit?.headers && "Authorization" in requestInit.headers, false);
    assert.equal(requestInit?.body, JSON.stringify({ question: question.question }));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejects malformed question list responses", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response(
    JSON.stringify({ count: 1, questions: [{ id: "invalid" }] }),
    { status: 200 },
  )) as typeof fetch;
  try {
    await assert.rejects(loadQuestions(), /perguntas.*inválida/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("submits a doctor answer with the signed bearer token", async () => {
  const originalFetch = globalThis.fetch;
  let requestUrl = "";
  let requestInit: RequestInit | undefined;
  const answer = {
    id: 8,
    questionId: 4,
    doctorId: 9,
    answer: "Esta é uma resposta médica informativa.",
    createdAt: "2026-09-29T13:00:00.000Z",
  };
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    requestUrl = String(input);
    requestInit = init;
    return new Response(JSON.stringify(answer), { status: 201 });
  }) as typeof fetch;

  try {
    assert.deepEqual(await createAnswer(4, answer.answer, "signed-token"), answer);
    assert.equal(requestUrl, "/api/questions/4/answers");
    assert.equal(requestInit?.method, "POST");
    assert.deepEqual(requestInit?.headers, {
      "Content-Type": "application/json",
      Authorization: "Bearer signed-token",
    });
    assert.equal(requestInit?.body, JSON.stringify({ answer: answer.answer }));
  } finally {
    globalThis.fetch = originalFetch;
  }
});