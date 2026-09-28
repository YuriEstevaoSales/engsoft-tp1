import assert from "node:assert/strict";
import { test } from "node:test";
import {
  advanceTestimonialIndex,
  TESTIMONIAL_ROTATION_INTERVAL_MS,
  testimonials,
} from "./home-content.js";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

test("rotates through four testimonials every four seconds", () => {
  assert.equal(testimonials.length, 4);
  assert.equal(TESTIMONIAL_ROTATION_INTERVAL_MS, 4000);
  assert.deepEqual(
    testimonials.map((_, index) => advanceTestimonialIndex(index, testimonials.length)),
    [1, 2, 3, 0],
  );
});

test("each testimonial has a distinct avatar image available in frontend/public", () => {
  const avatarPaths = testimonials.map((testimonial) => testimonial.avatar);

  assert.equal(new Set(avatarPaths).size, testimonials.length);
  for (const avatarPath of avatarPaths) {
    assert.equal(typeof avatarPath, "string");
    assert.equal(
      existsSync(resolve("frontend/public", `.${avatarPath}`)),
      true,
      `missing avatar image ${avatarPath}`,
    );
  }
});
