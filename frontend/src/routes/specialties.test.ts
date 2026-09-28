import assert from "node:assert/strict";
import { test } from "node:test";
import {
  filterMedicalSpecialties,
  findMedicalSpecialty,
  getSuggestedMedicalSpecialties,
  loadMedicalSpecialties,
} from "./specialties.js";

test("keeps the initial specialty suggestions unchanged while search results are filtered", () => {
  const specialties = [
    "Cardiologia",
    "Clínica Geral",
    "Dermatologia",
    "Pediatria",
  ];
  const suggestions = getSuggestedMedicalSpecialties(specialties);

  assert.deepEqual(suggestions, specialties);
  assert.deepEqual(filterMedicalSpecialties(specialties, "dermato"), ["Dermatologia"]);
  assert.deepEqual(getSuggestedMedicalSpecialties(specialties), suggestions);
});

test("filters specialties without requiring Portuguese accents", () => {
  assert.deepEqual(
    filterMedicalSpecialties(["Clínica Geral", "Cardiologia", "Dermatologia"], "clinica"),
    ["Clínica Geral"],
  );
  assert.equal(
    findMedicalSpecialty(["Clínica Geral", "Cardiologia"], "CLINICA GERAL"),
    "Clínica Geral",
  );
});

test("loads specialty names from the public catalog endpoint", async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = "";
  globalThis.fetch = async (input) => {
    requestedUrl = String(input);
    return new Response(JSON.stringify({ specialties: ["Cardiologia"] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  try {
    assert.deepEqual(await loadMedicalSpecialties(), ["Cardiologia"]);
    assert.equal(requestedUrl, "/api/medical-specialties");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("reports an error when the specialty catalog request fails", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(null, { status: 503 });

  try {
    await assert.rejects(loadMedicalSpecialties(), /especialidades/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
