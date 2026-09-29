import assert from "node:assert/strict";
import { test } from "node:test";
import { matchesDoctorSearchFilters } from "./doctor-search-filters.js";

test("applies rating, accepted insurance, and state filters together", () => {
  const doctor = {
    averageRating: 4.5,
    insurances: [2, 5],
    user: { stateAddress: "MG" },
  };
  const filters = { minimumRating: 4, insuranceId: 5, state: "MG" };
  assert.equal(matchesDoctorSearchFilters(doctor, filters), true);
  assert.equal(matchesDoctorSearchFilters(doctor, { ...filters, minimumRating: 5 }), false);
  assert.equal(matchesDoctorSearchFilters(doctor, { ...filters, insuranceId: 1 }), false);
  assert.equal(matchesDoctorSearchFilters(doctor, { ...filters, state: "SP" }), false);
  assert.equal(matchesDoctorSearchFilters(
    { ...doctor, user: { stateAddress: "Minas Gerais" } },
    filters,
  ), true);
  assert.equal(matchesDoctorSearchFilters(
    { ...doctor, averageRating: null },
    { ...filters, minimumRating: 3 },
  ), false);
});
