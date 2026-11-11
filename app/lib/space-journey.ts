export type SpacePose = {
  azimuth: number;
  elevation: number;
  distance: number;
  focusX: number;
  focusY: number;
  roll: number;
};

export const spacePoses = {
  orbit: { azimuth: -0.85, elevation: 0.12, distance: 1.95, focusX: 0.73, focusY: 0.48, roll: -0.09 },
  approach: { azimuth: -0.2, elevation: -0.12, distance: 1.62, focusX: 0.36, focusY: 0.44, roll: 0.08 },
  work: { azimuth: 0.35, elevation: 0.22, distance: 2.35, focusX: 0.22, focusY: 0.46, roll: 0.04 },
  intro: { azimuth: -0.58, elevation: 0.18, distance: 1.9, focusX: 0.8, focusY: 0.47, roll: -0.08 },
  education: { azimuth: 0.15, elevation: -0.2, distance: 1.75, focusX: 0.19, focusY: 0.42, roll: 0.09 },
  life: { azimuth: -0.18, elevation: 0.12, distance: 2.3, focusX: 0.7, focusY: 0.46, roll: -0.05 },
  contact: { azimuth: 0.45, elevation: 0.26, distance: 2.65, focusX: 0.45, focusY: 0.48, roll: 0 },
} satisfies Record<string, SpacePose>;

export type SpaceChapter = keyof typeof spacePoses;
export type SpaceMarker = { chapter: SpaceChapter; top: number };

export const spaceArrivalDuration = 5;

/** A timed camera approach, independent of the document's scroll position. */
export function spacePoseDuringArrival(pose: SpacePose, elapsed: number, reducedMotion = false): SpacePose {
  const t = reducedMotion ? 1 : Math.max(0, Math.min(1, elapsed / spaceArrivalDuration));
  const remaining = 1 - t * t * (3 - 2 * t);
  return {
    azimuth: pose.azimuth - 1.2 * remaining,
    elevation: pose.elevation + 0.24 * remaining,
    distance: pose.distance + 3.8 * remaining,
    focusX: pose.focusX + (0.6 - pose.focusX) * remaining,
    focusY: pose.focusY + (0.5 - pose.focusY) * remaining,
    roll: pose.roll - 0.12 * remaining,
  };
}

/** Read layout and scroll together after the router has restored the new page. */
export function createSpaceJourneySampler(
  sample: () => void,
  requestFrame: (callback: () => void) => number,
  cancelFrame: (frame: number) => void,
) {
  let frame: number | undefined;
  return {
    schedule() {
      if (frame !== undefined) return;
      frame = requestFrame(() => {
        frame = undefined;
        sample();
      });
    },
    cancel() {
      if (frame !== undefined) cancelFrame(frame);
      frame = undefined;
    },
  };
}

export function mixSpacePose(a: SpacePose, b: SpacePose, amount: number): SpacePose {
  const t = Math.max(0, Math.min(1, amount));
  const mix = (start: number, end: number) => start + (end - start) * t;
  return {
    azimuth: mix(a.azimuth, b.azimuth),
    elevation: mix(a.elevation, b.elevation),
    distance: mix(a.distance, b.distance),
    focusX: mix(a.focusX, b.focusX),
    focusY: mix(a.focusY, b.focusY),
    roll: mix(a.roll, b.roll),
  };
}

/** Native scroll position chooses a camera destination; the renderer eases toward it. */
export function spacePoseAtScroll(markers: SpaceMarker[], scrollY: number, fallback: SpaceChapter): SpacePose {
  if (!markers.length) return { ...spacePoses[fallback] };
  if (scrollY <= markers[0].top) return { ...spacePoses[markers[0].chapter] };
  for (let i = 1; i < markers.length; i++) {
    if (scrollY <= markers[i].top) {
      const previous = markers[i - 1];
      const t = Math.max(0, Math.min(1, (scrollY - previous.top) / Math.max(1, markers[i].top - previous.top)));
      return mixSpacePose(spacePoses[previous.chapter], spacePoses[markers[i].chapter], t * t * (3 - 2 * t));
    }
  }
  return { ...spacePoses[markers[markers.length - 1].chapter] };
}
