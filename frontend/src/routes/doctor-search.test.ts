import assert from "node:assert/strict";
import { test } from "node:test";
import { matchRoutes } from "react-router";
import {
  buildAppointmentPath,
  formatCalendarMonth,
  isWeekendDate,
} from "./doctor-search-calendar.js";
import { getVisiblePageNumbers } from "./doctor-search-pagination.js";
import {
  createMedicalSpecialtySlug,
  DOCTOR_SEARCH_ROUTE_PATH,
  extractMedicalSpecialtySlug,
  resolveMedicalSpecialtySlug,
} from "./doctor-search-slugs.js";

test("creates accent-insensitive specialty slugs and resolves them from the catalog", () => {
  assert.equal(createMedicalSpecialtySlug("Ginecologia e Obstetrícia"), "ginecologia-e-obstetricia");
  assert.equal(resolveMedicalSpecialtySlug(
    ["Cardiologia", "Ginecologia e Obstetrícia"],
    "ginecologia-e-obstetricia",
  ), "Ginecologia e Obstetrícia");
  assert.equal(resolveMedicalSpecialtySlug(["Cardiologia"], "neurologia"), null);
  assert.equal(extractMedicalSpecialtySlug("encontrar-medico-cardiologia"), "cardiologia");
  assert.equal(extractMedicalSpecialtySlug("sobre"), null);
  assert.equal(extractMedicalSpecialtySlug("encontrar-medico-"), null);
});

test("matches the hyphenated doctor-search URL through its dynamic route segment", () => {
  const match = matchRoutes(
    [{ path: DOCTOR_SEARCH_ROUTE_PATH }],
    "/encontrar-medico-ginecologia",
  );
  assert.equal(match?.at(-1)?.params["specialty"], "encontrar-medico-ginecologia");
});

test("builds an appointment destination with the selected doctor and local date", () => {
  assert.equal(
    buildAppointmentPath(7, new Date(2026, 8, 3)),
    "/agendar/7?date=2026-09-03",
  );
});

test("formats calendar month in lowercase and identifies weekends", () => {
  assert.equal(formatCalendarMonth(new Date(2026, 8, 1)), "setembro de 2026");
  assert.equal(isWeekendDate(new Date(2026, 8, 5)), true);
  assert.equal(isWeekendDate(new Date(2026, 8, 6)), true);
  assert.equal(isWeekendDate(new Date(2026, 8, 7)), false);
});

test("keeps pagination buttons centered around the active page", () => {
  assert.deepEqual(getVisiblePageNumbers(1, 68), [1, 2, 3, 4, 5]);
  assert.deepEqual(getVisiblePageNumbers(6, 68), [4, 5, 6, 7, 8]);
  assert.deepEqual(getVisiblePageNumbers(68, 68), [64, 65, 66, 67, 68]);
  assert.deepEqual(getVisiblePageNumbers(1, 0), []);
});
