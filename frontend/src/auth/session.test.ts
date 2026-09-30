import assert from "node:assert/strict";
import { test } from "node:test";
import { getFirstName, getNameInitial } from "./session.js";

test("returns the first letter of the user's name in uppercase", () => {
  assert.equal(getNameInitial("  maria Silva"), "M");
  assert.equal(getNameInitial(""), "?");
});

test("returns only the first name", () => {
  assert.equal(getFirstName(" Maria da Silva "), "Maria");
});
