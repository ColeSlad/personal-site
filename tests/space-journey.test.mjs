import test from "node:test";
import assert from "node:assert/strict";
import { createSpaceJourneySampler, mixSpacePose, spacePoseAtScroll, spacePoses } from "../app/lib/space-journey.ts";

function frameQueue() {
  let nextId = 0;
  const callbacks = new Map();
  return {
    request(callback) { callbacks.set(++nextId, callback); return nextId; },
    cancel(id) { callbacks.delete(id); },
    flush() {
      const pending = [...callbacks.values()];
      callbacks.clear();
      pending.forEach((callback) => callback());
    },
  };
}

function assertPose(actual, expected) {
  for (const key of Object.keys(expected)) assert.ok(Math.abs(actual[key] - expected[key]) < 1e-10, key);
}

test("Work ↔ About navigation samples only the restored destination, never the intermediate offset", () => {
  const frames = frameQueue();
  const routes = {
    orbit: [{ chapter: "orbit", top: 0 }, { chapter: "approach", top: 800 }, { chapter: "work", top: 1600 }],
    about: [{ chapter: "intro", top: 0 }, { chapter: "experience", top: 800 }, { chapter: "life", top: 1600 }],
  };
  let route = "orbit";
  let scrollY = 1600;
  const destinations = [];
  const sampler = createSpaceJourneySampler(() => {
    destinations.push(spacePoseAtScroll(routes[route], scrollY, route === "orbit" ? "orbit" : "intro"));
  }, frames.request, frames.cancel);

  route = "about"; // New DOM commits while the Work scroll offset still exists.
  sampler.schedule();
  sampler.schedule(); // Layout observer reports the new page size.
  scrollY = 0; // Router restores About before the next paint.
  sampler.schedule();
  assert.equal(destinations.length, 0);
  frames.flush();
  assert.deepEqual(destinations, [spacePoses.intro]);

  route = "orbit";
  sampler.schedule();
  scrollY = 1600; // The Work hash is applied after the Orbit page commits.
  sampler.schedule();
  frames.flush();
  assert.equal(destinations.length, 2);
  assertPose(destinations[0], spacePoses.intro);
  assertPose(destinations[1], spacePoses.work);

  scrollY = 800; // Native scrolling still updates the flight after navigation.
  sampler.schedule();
  frames.flush();
  assertPose(destinations.at(-1), spacePoses.approach);
});

test("disposing the renderer cancels a pending journey sample", () => {
  const frames = frameQueue();
  let samples = 0;
  const sampler = createSpaceJourneySampler(() => samples++, frames.request, frames.cancel);
  sampler.schedule();
  sampler.cancel();
  frames.flush();
  assert.equal(samples, 0);
});

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
