export type PixelCubePathAnimationProfile = {
  cycleMs: number;
  delaysMs: number[];
};

type CreatePixelCubePathAnimationProfileOptions = {
  count: number;
  cycleMs: number;
  seed: number;
};

const cycleVarianceMs = 180;
const jitterCeiling = 1.34;
const jitterFloor = 0.72;
const minimumCycleMs = 2800;

export function createPixelCubePathAnimationProfile({
  count,
  cycleMs,
  seed,
}: CreatePixelCubePathAnimationProfileOptions): PixelCubePathAnimationProfile {
  const random = createPrng(seed);
  const adjustedCycleMs = Math.max(
    minimumCycleMs,
    Math.round(cycleMs + (random() - 0.5) * cycleVarianceMs * 2),
  );
  const averageStepMs = adjustedCycleMs / count;
  const rawDurations = Array.from({ length: count }, () => {
    const jitterWeight = (random() + random()) / 2;
    const jitter = jitterFloor + jitterWeight * (jitterCeiling - jitterFloor);

    return averageStepMs * jitter;
  });
  const totalDuration = rawDurations.reduce((sum, duration) => sum + duration, 0);
  const normalizedDurations = rawDurations.map(
    (duration) => (duration / totalDuration) * adjustedCycleMs,
  );
  const phaseOffsetMs = Math.round(random() * adjustedCycleMs);
  let elapsedMs = 0;
  const delaysMs = normalizedDurations.map((duration) => {
    const delayMs = Math.round((phaseOffsetMs + elapsedMs) % adjustedCycleMs);

    elapsedMs += duration;

    return delayMs;
  });

  return {
    cycleMs: adjustedCycleMs,
    delaysMs,
  };
}

export function getPixelCubePathAnimationSeed(value: string) {
  let hash = 2166136261;

  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createPrng(seed: number) {
  let state = seed || 0x9e3779b9;

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;

    return state / 4294967296;
  };
}
