import assert from "node:assert/strict";
import { test } from "node:test";
import { loadDoctorsBySpecialty, loadInsurances, loadMunicipalities, loadUserLocation } from "./doctor-search-api.js";

test("loads municipalities for the selected state from the IBGE API", async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = "";
  globalThis.fetch = (async (input: string | URL | Request) => {
    requestedUrl = String(input);
    return new Response(JSON.stringify([
      { id: 1, nome: "Belo Horizonte" },
      { id: 2, nome: "Contagem" },
    ]), { status: 200 });
  }) as typeof fetch;

  try {
    assert.deepEqual(await loadMunicipalities("MG"), ["Belo Horizonte", "Contagem"]);
    assert.equal(
      requestedUrl,
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados/MG/municipios",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("loads the logged-in user's state and city", async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = "";
  globalThis.fetch = (async (input: string | URL | Request) => {
    requestedUrl = String(input);
    return new Response(JSON.stringify({
      profile: { stateAddress: "MG", city: "Belo Horizonte" },
    }), { status: 200 });
  }) as typeof fetch;

  try {
    assert.deepEqual(await loadUserLocation(12), { state: "MG", city: "Belo Horizonte" });
    assert.equal(requestedUrl, "/api/doctors/me?userId=12");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("loads insurance options from the insurance catalog endpoint", async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = "";
  globalThis.fetch = (async (input: string | URL | Request) => {
    requestedUrl = String(input);
    return new Response(JSON.stringify({
      source: "insurances",
      count: 2,
      insurances: [{ id: 1, name: "Unimed" }, { id: 2, name: "Amil" }],
    }), { status: 200 });
  }) as typeof fetch;

  try {
    assert.deepEqual(await loadInsurances(), [
      { id: 1, name: "Unimed" },
      { id: 2, name: "Amil" },
    ]);
    assert.equal(requestedUrl, "/api/insurances");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("loads doctors for only the selected specialty and validates the response", async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = "";
  globalThis.fetch = (async (input: string | URL | Request) => {
    requestedUrl = String(input);
    return new Response(JSON.stringify({
      count: 1,
      doctors: [{
        id: 7,
        specialty: "Ginecologia",
        crmNumber: "123456",
        crmUf: "MG",
        street: "Rua Cacete",
        addressNumber: 123,
        addressComplement: null,
        insurances: [1],
        acceptedInsurances: ["Unimed"],
        user: { name: "Dra. Ana Souza", photo: null, city: "Belo Horizonte", stateAddress: "MG" },
        averageRating: 4.5,
      }],
    }), { status: 200 });
  }) as typeof fetch;

  try {
    const doctors = await loadDoctorsBySpecialty("Ginecologia", {
      minRating: 4,
      insuranceId: 1,
      state: "MG",
      city: "Belo Horizonte",
    });
    assert.equal(
      requestedUrl,
      "/api/doctors/search?specialty=Ginecologia&minRating=4&insuranceId=1&state=MG&city=Belo+Horizonte",
    );
    assert.equal(doctors[0]?.averageRating, 4.5);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("reports an error if loading doctors fails", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response("{}", { status: 500 })) as typeof fetch;
  try {
    await assert.rejects(loadDoctorsBySpecialty("Ginecologia"), /médicos/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejects a malformed doctor search response", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response(
    JSON.stringify({ count: 1, doctors: [{ id: "invalid" }] }),
    { status: 200 },
  )) as typeof fetch;
  try {
    await assert.rejects(loadDoctorsBySpecialty("Ginecologia"), /resposta.*inválida/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
