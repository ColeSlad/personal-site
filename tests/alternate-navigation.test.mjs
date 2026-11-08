import test from "node:test";
import assert from "node:assert/strict";
import { activeAlternateSection } from "../app/lib/alternate-navigation.ts";

test("the navigation follows Orbit, About, and Work while scrolling in either direction", () => {
  for (const viewport of [600, 1000]) {
    const threshold = viewport * 0.4;
    assert.equal(activeAlternateSection({ about: viewport, work: viewport * 3 }, viewport), "orbit");
    assert.equal(activeAlternateSection({ about: threshold, work: viewport }, viewport), "about");
    assert.equal(activeAlternateSection({ about: -viewport, work: threshold }, viewport), "work");
    assert.equal(activeAlternateSection({ about: -viewport, work: threshold + 1 }, viewport), "about");
    assert.equal(activeAlternateSection({ about: threshold + 1, work: viewport * 2 }, viewport), "orbit");
  }
});

test("direct section jumps select About and Work, and About stays selected through the photos", () => {
  assert.equal(activeAlternateSection({ about: 100, work: 5100 }, 800), "about");
  assert.equal(activeAlternateSection({ about: -3000, work: 2100 }, 800), "about");
  assert.equal(activeAlternateSection({ about: -5000, work: 100 }, 800), "work");
});

test("before the sections mount, the navigation defaults to Orbit", () => {
  assert.equal(activeAlternateSection({}, 800), "orbit");
});
