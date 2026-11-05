import test from "node:test";
import assert from "node:assert/strict";
import { activeAlternateSection } from "../app/lib/alternate-navigation.ts";

test("the navigation follows Orbit, Work, and About while scrolling in either direction", () => {
  for (const viewport of [600, 1000]) {
    const threshold = viewport * 0.4;
    assert.equal(activeAlternateSection({ work: viewport, about: viewport * 3 }, viewport), "orbit");
    assert.equal(activeAlternateSection({ work: threshold, about: viewport }, viewport), "work");
    assert.equal(activeAlternateSection({ work: -viewport, about: threshold }, viewport), "about");
    assert.equal(activeAlternateSection({ work: -viewport, about: threshold + 1 }, viewport), "work");
    assert.equal(activeAlternateSection({ work: threshold + 1, about: viewport * 2 }, viewport), "orbit");
  }
});

test("direct section jumps select About and Work, and About stays selected through the photos", () => {
  assert.equal(activeAlternateSection({ work: -2000, about: 100 }, 800), "about");
  assert.equal(activeAlternateSection({ work: -6000, about: -3000 }, 800), "about");
  assert.equal(activeAlternateSection({ work: 100, about: 2100 }, 800), "work");
});

test("before the sections mount, the navigation defaults to Orbit", () => {
  assert.equal(activeAlternateSection({}, 800), "orbit");
});
