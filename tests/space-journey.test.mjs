import test from "node:test";
import assert from "node:assert/strict";
import { createSpaceJourneySampler, mixSpacePose, spaceArrivalDuration, spacePoseAtScroll, spacePoseDuringArrival, spacePoses } from "../app/lib/space-journey.ts";

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

test("arrival starts wide and rotated, then approaches the close-up without scrolling", () => {
  const target = spacePoses.orbit;
  const original = { ...target };
  const start = spacePoseDuringArrival(target, 0);
  assert.ok(start.distance > target.distance * 2);
  assert.ok(Math.abs(start.azimuth - target.azimuth) > Math.PI / 4);
  assert.equal(start.focusX, 0.6);
  let previous = start;
  for (let step = 1; step <= 100; step++) {
    const next = spacePoseDuringArrival(target, spaceArrivalDuration * step / 100);
    assert.ok(next.distance <= previous.distance);
    assert.ok(next.azimuth >= previous.azimuth);
    assert.ok(next.distance > 1.3);
    previous = next;
  }
  assertPose(previous, target);
  assert.deepEqual(target, original);
});

test("arrival hands off continuously to the current scroll-driven camera", () => {
  for (const target of Object.values(spacePoses)) {
    const before = spacePoseDuringArrival(target, spaceArrivalDuration - 0.001);
    const atEnd = spacePoseDuringArrival(target, spaceArrivalDuration);
    assertPose(atEnd, target);
    assertPose(spacePoseDuringArrival(target, spaceArrivalDuration + 10), target);
    for (const key of Object.keys(target)) assert.ok(Math.abs(before[key] - atEnd[key]) < 0.000001, key);
  }
  // A scroll or section jump during arrival changes the base camera; the
  // entrance never resets it to the hero or retains an old destination.
  const scrolled = mixSpacePose(spacePoses.intro, spacePoses.education, 0.4);
  const originalView = spacePoseDuringArrival(spacePoses.orbit, spaceArrivalDuration / 2);
  const scrolledView = spacePoseDuringArrival(scrolled, spaceArrivalDuration / 2);
  assert.ok(Math.abs((originalView.distance - spacePoses.orbit.distance) - (scrolledView.distance - scrolled.distance)) < 1e-10);
  assert.ok(Math.abs((originalView.azimuth - spacePoses.orbit.azimuth) - (scrolledView.azimuth - scrolled.azimuth)) < 1e-10);
  assertPose(spacePoseDuringArrival(scrolled, spaceArrivalDuration), scrolled);
});

test("reduced motion skips arrival by rendering the completed approach", () => {
  assertPose(spacePoseDuringArrival(spacePoses.work, 0, true), spacePoses.work);
  assertPose(spacePoseDuringArrival(spacePoses.intro, spaceArrivalDuration / 2, true), spacePoses.intro);
  assertPose(spacePoseDuringArrival(spacePoses.orbit, -1), spacePoseDuringArrival(spacePoses.orbit, 0));
});

test("About ↔ Work anchor navigation samples the latest scroll position on the shared camera path", () => {
  const frames = frameQueue();
  const markers = [
    { chapter: "orbit", top: 0 },
    { chapter: "intro", top: 1600 },
    { chapter: "education", top: 2400 },
    { chapter: "life", top: 3200 },
    { chapter: "contact", top: 4000 },
    { chapter: "work", top: 4800 },
  ];
  let scrollY = 1600;
  const destinations = [];
  const sampler = createSpaceJourneySampler(() => {
    destinations.push(spacePoseAtScroll(markers, scrollY, "orbit"));
  }, frames.request, frames.cancel);

  sampler.schedule();
  scrollY = 3600; // Intermediate anchor scroll positions arrive within a frame.
  sampler.schedule();
  scrollY = 4800;
  sampler.schedule();
  assert.equal(destinations.length, 0);
  frames.flush();
  assert.equal(destinations.length, 1);
  assertPose(destinations[0], spacePoses.work);

  sampler.schedule();
  scrollY = 1600; // Return to About without remounting the scene or page.
  sampler.schedule();
  frames.flush();
  assert.equal(destinations.length, 2);
  assertPose(destinations[0], spacePoses.work);
  assertPose(destinations[1], spacePoses.intro);

  scrollY = 2400; // Native scrolling continues into About's education and photos.
  sampler.schedule();
  frames.flush();
  assertPose(destinations.at(-1), spacePoses.education);
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
  const markers = [{ chapter: "intro", top: 0 }, { chapter: "education", top: 800 }, { chapter: "life", top: 1600 }];
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

test("the shared scene has a defined destination before scroll markers are measured", () => {
  assert.deepEqual(spacePoseAtScroll([], 0, "orbit"), spacePoses.orbit);
  assert.notStrictEqual(spacePoseAtScroll([], 0, "orbit"), spacePoses.orbit);
});
