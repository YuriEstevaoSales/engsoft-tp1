import assert from "node:assert/strict";
import { test } from "node:test";
import { toggleSpecialtySelection } from "./doctor-search/filter-panel.js";

test("keeps selected specialties and adds another specialty", () => {
  assert.deepEqual(toggleSpecialtySelection(["cardiologia"], "dermatologia"), [
    "cardiologia",
    "dermatologia",
  ]);
});

test("removes only the selected specialty", () => {
  assert.deepEqual(toggleSpecialtySelection(["cardiologia", "dermatologia"], "cardiologia"), [
    "dermatologia",
  ]);
});
