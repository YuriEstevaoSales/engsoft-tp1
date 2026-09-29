import assert from "node:assert/strict";
import { test } from "node:test";
import { loadRandomDoctorAvatar } from "./doctor-avatar.js";

test("loads a random image from the dog avatar service", async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = "";
  globalThis.fetch = (async (input: string | URL | Request) => {
    requestedUrl = String(input);
    return new Response(JSON.stringify({
      message: "https://images.dog.ceo/breeds/example.jpg",
      status: "success",
    }), { status: 200 });
  }) as typeof fetch;

  try {
    assert.equal(await loadRandomDoctorAvatar(), "https://images.dog.ceo/breeds/example.jpg");
    assert.equal(requestedUrl, "https://dog.ceo/api/breeds/image/random");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejects an invalid random avatar response", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response(JSON.stringify({ status: "success" }), {
    status: 200,
  })) as typeof fetch;

  try {
    await assert.rejects(loadRandomDoctorAvatar(), /imagem.*inválida/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
