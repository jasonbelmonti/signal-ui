export type PixelCubePathAnimationProfile = {
  breakpoints: boolean[];
  cycleMs: number;
  delaysMs: number[];
  glitchOffsetsPx: Array<{
    x: number;
    y: number;
    z: number;
  }>;
  liftsPx: number[];
  misfires: boolean[];
  signalStrengths: number[];
  tremorAmplitudesPx: number[];
  tremorCyclesMs: number[];
  tremorDelaysMs: number[];
};

type CreatePixelCubePathAnimationProfileOptions = {
  broken?: boolean;
  count: number;
  cycleMs: number;
  seed: number;
};

const cycleVarianceMs = 180;
const jitterCeiling = 1.34;
const jitterFloor = 0.72;
const minimumCycleMs = 2800;

export function createPixelCubePathAnimationProfile({
  broken = false,
  count,
  cycleMs,
  seed,
}: CreatePixelCubePathAnimationProfileOptions): PixelCubePathAnimationProfile {
  return broken
    ? createBrokenPixelCubePathAnimationProfile({ count, cycleMs, seed })
    : createDefaultPixelCubePathAnimationProfile({ count, cycleMs, seed });
}

function createDefaultPixelCubePathAnimationProfile({
  count,
  cycleMs,
  seed,
}: Omit<CreatePixelCubePathAnimationProfileOptions, "broken">): PixelCubePathAnimationProfile {
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
  const delaysMs = createDelaysMs(normalizedDurations, adjustedCycleMs, random);

  return {
    breakpoints: Array.from({ length: count }, () => false),
    cycleMs: adjustedCycleMs,
    delaysMs,
    glitchOffsetsPx: Array.from({ length: count }, () => ({ x: 0, y: 0, z: 0 })),
    liftsPx: Array.from({ length: count }, () => 2),
    misfires: Array.from({ length: count }, () => false),
    signalStrengths: Array.from({ length: count }, () => 1),
    tremorAmplitudesPx: Array.from({ length: count }, () => 0),
    tremorCyclesMs: Array.from({ length: count }, () => 2000),
    tremorDelaysMs: Array.from({ length: count }, () => 0),
  };
}

function createBrokenPixelCubePathAnimationProfile({
  count,
  cycleMs,
  seed,
}: Omit<CreatePixelCubePathAnimationProfileOptions, "broken">): PixelCubePathAnimationProfile {
  const random = createPrng(seed ^ 0xa5a5a5a5);
  const adjustedCycleMs = Math.max(
    minimumCycleMs + 2000,
    Math.round(cycleMs * 1.92 + (random() - 0.5) * cycleVarianceMs * 4.8),
  );
  const averageStepMs = adjustedCycleMs / count;
  const breakpoints = createBreakpoints(count, random, {
    jumpMax: 4,
    jumpMin: 2,
    startMax: 2,
    startMin: 1,
  });
  const misfires = createMisfires(count, breakpoints, random);
  const rawDurations = Array.from({ length: count }, (_, index) => {
    const jitterWeight = (random() + random()) / 2;
    const jitter = 0.28 + jitterWeight * 1.52;
    const breakpointPauseMs = breakpoints[index] ? averageStepMs * (1.1 + random() * 2.1) : 0;
    const misfirePauseMs = misfires[index] ? averageStepMs * (0.35 + random() * 0.95) : 0;

    return averageStepMs * jitter + breakpointPauseMs + misfirePauseMs;
  });
  const totalDuration = rawDurations.reduce((sum, duration) => sum + duration, 0);
  const normalizedDurations = rawDurations.map(
    (duration) => (duration / totalDuration) * adjustedCycleMs,
  );
  const delaysMs = applyBrokenDelayOffsets(
    createDelaysMs(normalizedDurations, adjustedCycleMs, random),
    averageStepMs,
    breakpoints,
    misfires,
    adjustedCycleMs,
    random,
  );
  const glitchOffsetsPx = Array.from({ length: count }, (_, index) => {
    const unstableMultiplier =
      breakpoints[index] || misfires[index] || breakpoints[index - 1] || breakpoints[index + 1]
        ? 1.7
        : 1;

    return {
      x: roundToTenths((random() - 0.5) * 8.8 * unstableMultiplier),
      y: roundToTenths((random() - 0.5) * 6.2 * unstableMultiplier),
      z: roundToTenths((random() - 0.5) * 4.6 * unstableMultiplier),
    };
  });
  const liftsPx = Array.from({ length: count }, (_, index) =>
    roundToTenths(
      2.4 +
        random() * 4.2 +
        (breakpoints[index] ? 1.6 : 0) +
        (misfires[index] ? 0.9 : 0),
    ),
  );
  const signalStrengths = Array.from({ length: count }, (_, index) => {
    const unstable =
      breakpoints[index] ||
      misfires[index] ||
      breakpoints[index - 1] ||
      breakpoints[index + 1] ||
      misfires[index - 1] ||
      misfires[index + 1];
    const minimumStrength = unstable ? 0.24 : 0.5;
    const maximumStrength = unstable ? 0.64 : 0.86;

    return roundToTenths(minimumStrength + random() * (maximumStrength - minimumStrength));
  });
  const tremorCyclesMs = Array.from({ length: count }, (_, index) => {
    const unstable = breakpoints[index] || misfires[index];
    const baseCycleMs = unstable
      ? 1080 + random() * 1360
      : 1760 + random() * 2480;

    return Math.round(baseCycleMs);
  });
  const tremorDelaysMs = tremorCyclesMs.map((tremorCycleMs) =>
    Math.round(random() * tremorCycleMs),
  );
  const tremorAmplitudesPx = Array.from({ length: count }, (_, index) =>
    roundToTenths(
      0.4 +
        random() * 1.35 +
        (breakpoints[index] ? 0.8 : 0) +
        (misfires[index] ? 0.65 : 0),
    ),
  );

  return {
    breakpoints,
    cycleMs: adjustedCycleMs,
    delaysMs,
    glitchOffsetsPx,
    liftsPx,
    misfires,
    signalStrengths,
    tremorAmplitudesPx,
    tremorCyclesMs,
    tremorDelaysMs,
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

function createBreakpoints(
  count: number,
  random: () => number,
  options: {
    jumpMax: number;
    jumpMin: number;
    startMax: number;
    startMin: number;
  } = {
    jumpMax: 6,
    jumpMin: 3,
    startMax: 3,
    startMin: 2,
  },
) {
  const breakpoints = Array.from({ length: count }, () => false);
  let index = options.startMin + Math.floor(random() * (options.startMax - options.startMin + 1));

  while (index < count - 2) {
    breakpoints[index] = true;
    index += options.jumpMin + Math.floor(random() * (options.jumpMax - options.jumpMin + 1));
  }

  return breakpoints;
}

function createMisfires(count: number, breakpoints: boolean[], random: () => number) {
  const misfires = Array.from({ length: count }, () => false);

  breakpoints.forEach((isBreakpoint, index) => {
    if (!isBreakpoint || random() < 0.18) {
      return;
    }

    const direction = random() < 0.5 ? -1 : 1;
    const distance = 1 + Math.floor(random() * 2);
    const misfireIndex = index + direction * distance;

    if (
      misfireIndex > 0 &&
      misfireIndex < count - 1 &&
      !breakpoints[misfireIndex]
    ) {
      misfires[misfireIndex] = true;
    }
  });

  for (let index = 1; index < count - 1; index += 1) {
    if (!breakpoints[index] && random() < 0.14) {
      misfires[index] = true;
    }
  }

  return misfires;
}

function createDelaysMs(
  normalizedDurations: number[],
  cycleMs: number,
  random: () => number,
) {
  const phaseOffsetMs = Math.round(random() * cycleMs);
  let elapsedMs = 0;

  return normalizedDurations.map((duration) => {
    const delayMs = Math.round((phaseOffsetMs + elapsedMs) % cycleMs);

    elapsedMs += duration;

    return delayMs;
  });
}

function applyBrokenDelayOffsets(
  delaysMs: number[],
  averageStepMs: number,
  breakpoints: boolean[],
  misfires: boolean[],
  cycleMs: number,
  random: () => number,
) {
  return delaysMs.map((delayMs, index) => {
    if (!misfires[index] && !(breakpoints[index] && random() < 0.45)) {
      return delayMs;
    }

    const direction = random() < 0.58 ? -1 : 1;
    const stepCount =
      1 +
      Math.floor(random() * 3) +
      (breakpoints[index] ? 1 : 0) +
      (misfires[index] && random() < 0.3 ? 1 : 0);
    const shiftedDelayMs =
      delayMs + direction * averageStepMs * stepCount * (0.7 + random() * 0.65);

    return wrapMs(shiftedDelayMs, cycleMs);
  });
}

function wrapMs(value: number, cycleMs: number) {
  return ((Math.round(value) % cycleMs) + cycleMs) % cycleMs;
}

function roundToTenths(value: number) {
  return Math.round(value * 10) / 10;
}
