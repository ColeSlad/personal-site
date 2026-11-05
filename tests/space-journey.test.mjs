import test from "node:test";
import assert from "node:assert/strict";
import { mixSpacePose, spacePoseAtScroll, spacePoses } from "../app/lib/space-journey.ts";

test("scrolling is bounded before and after the authored flight path", () => {
  const markers = [{ chapter: "orbit", top: 0 }, { chapter: "approach", top: 800 }, { chapter: "work", top: 1600 }];
  assert.deepEqual(spacePoseAtScroll(markers, -300, "orbit"), spacePoses.orbit);
  assert.deepEqual(spacePoseAtScroll(markers, 5000, "orbit"), spacePoses.work);
});

test("camera flight remains continuous at a chapter boundary", () => {
  const markers = [{ chapter: "intro", top: 0 }, { chapter: "experience", top: 800 }, { chapter: "life", top: 1600 }];
  const before = spacePoseAtScroll(markers, 799.99, "intro");
  const after = spacePoseAtScroll(markers, 800.01, "intro");
  for (const key of Object.keys(before)) assert.ok(Math.abs(before[key] - after[key]) < 0.00001, key);
});

test("camera destinations remain outside Io throughout every flight segment", () => {
  const poses = Object.values(spacePoses);
  for (const a of poses) for (const b of poses) for (let step = 0; step <= 20; step++) {
    const pose = mixSpacePose(a, b, step / 20);
    assert.ok(pose.distance > 1.3);
    assert.ok(pose.focusX > 0 && pose.focusX < 1);
    assert.ok(pose.focusY > 0 && pose.focusY < 1);
  }
});

test("a direct About visit has a defined destination before markers are measured", () => {
  assert.deepEqual(spacePoseAtScroll([], 0, "intro"), spacePoses.intro);
  assert.notStrictEqual(spacePoseAtScroll([], 0, "intro"), spacePoses.intro);
});
