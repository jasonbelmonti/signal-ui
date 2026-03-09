import type { SignalBackdropDensity } from "./types.js";
import { createRandom, createSeed } from "./noise.js";

export interface ContourFieldNode {
  u: number;
  v: number;
  x: number;
  z: number;
}

export interface ContourFieldClusterPoint {
  alertBias: number;
  altitude: number;
  depthMix: number;
  drift: number;
  flockBias: number;
  flockPhase: number;
  phase: number;
  spread: number;
  x: number;
  z: number;
}

export interface ContourFieldSweep {
  offset: number;
  opacity: number;
  speed: number;
}

export const TELEMETRY_NEIGHBOR_COUNT = 4;
export const NO_TELEMETRY_NEIGHBOR = 0xffff;

export interface ContourFieldLayout {
  columnCoordinates: Float32Array;
  columns: number;
  depth: number;
  nodes: ContourFieldNode[];
  rows: number;
  seed: number;
  segmentIndices: Uint16Array;
  sweeps: ContourFieldSweep[];
  telemetryNeighborIndices: Uint16Array;
  telemetryPoints: ContourFieldClusterPoint[];
  width: number;
}

const densityConfig = {
  high: {
    clusters: 148,
    columns: 52,
    rows: 30,
    sweepCount: 3,
  },
  low: {
    clusters: 68,
    columns: 32,
    rows: 18,
    sweepCount: 2,
  },
  medium: {
    clusters: 108,
    columns: 42,
    rows: 24,
    sweepCount: 3,
  },
} satisfies Record<
  SignalBackdropDensity,
  {
    clusters: number;
    columns: number;
    rows: number;
    sweepCount: number;
  }
>;

export function createContourFieldLayout(
  density: SignalBackdropDensity,
  seedInput: number | string | undefined,
): ContourFieldLayout {
  const config = densityConfig[density];
  const seed = createSeed(seedInput);
  const random = createRandom(seed ^ 0x9e3779b9);
  const width = density === "high" ? 28 : density === "low" ? 22 : 25;
  const depth = density === "high" ? 19 : density === "low" ? 15 : 17;
  const nodes: ContourFieldNode[] = [];
  const columnCoordinates = new Float32Array(config.columns);
  const segmentIndices = new Uint16Array(
    ((config.columns - 1) * config.rows + (config.rows - 1) * config.columns) * 2,
  );
  let segmentPointer = 0;

  for (let column = 0; column < config.columns; column += 1) {
    columnCoordinates[column] = ((column / (config.columns - 1)) - 0.5) * width;
  }

  for (let row = 0; row < config.rows; row += 1) {
    const v = row / (config.rows - 1);

    for (let column = 0; column < config.columns; column += 1) {
      const u = column / (config.columns - 1);
      nodes.push({
        u,
        v,
        x: columnCoordinates[column] ?? 0,
        z: (v - 0.5) * depth,
      });
    }
  }

  for (let row = 0; row < config.rows; row += 1) {
    for (let column = 0; column < config.columns; column += 1) {
      const index = row * config.columns + column;

      if (column < config.columns - 1) {
        segmentIndices[segmentPointer] = index;
        segmentIndices[segmentPointer + 1] = index + 1;
        segmentPointer += 2;
      }

      if (row < config.rows - 1) {
        segmentIndices[segmentPointer] = index;
        segmentIndices[segmentPointer + 1] = index + config.columns;
        segmentPointer += 2;
      }
    }
  }

  const telemetryPoints = createTelemetryPoints(config.clusters, depth, random, width);
  const telemetryNeighborIndices = createTelemetryNeighborIndices(
    telemetryPoints,
    TELEMETRY_NEIGHBOR_COUNT,
  );
  const sweeps = Array.from({ length: config.sweepCount }, (_, index) => ({
    offset: random(),
    opacity: 0.11 + index * 0.028,
    speed: 0.032 + random() * 0.024 + index * 0.01,
  }));

  return {
    columnCoordinates,
    columns: config.columns,
    depth,
    nodes,
    rows: config.rows,
    seed,
    segmentIndices,
    sweeps,
    telemetryNeighborIndices,
    telemetryPoints,
    width,
  };
}

function createTelemetryPoints(count: number, depth: number, random: () => number, width: number) {
  const gridColumns = Math.max(8, Math.ceil(Math.sqrt(count * (width / depth) * 1.18)));
  const gridRows = Math.max(6, Math.ceil(count / gridColumns));

  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / gridColumns);
    const column = index % gridColumns;
    const u = clamp01((column + 0.5 + (random() - 0.5) * 0.86) / gridColumns);
    const v = clamp01((row + 0.5 + (random() - 0.5) * 0.86) / gridRows);
    const lateralSpread = 1.04 + (random() - 0.5) * 0.1;
    const depthSpread = 1.18 + (random() - 0.5) * 0.1;
    const x = (u - 0.5) * width * lateralSpread;
    const z = (v - 0.5) * depth * depthSpread;
    const horizonLift = Math.pow(1 - v, 1.18) * 1.55;

    return {
      alertBias: 0.2 + random() * 0.8,
      altitude: 1.15 + random() * 1.85 + horizonLift,
      depthMix: v,
      drift: 0.08 + random() * 0.24,
      flockBias: random(),
      flockPhase: random() * Math.PI * 2,
      phase: random() * Math.PI * 2,
      spread: 0.45 + random() * 0.9,
      x,
      z,
    };
  });
}

function createTelemetryNeighborIndices(
  points: ContourFieldClusterPoint[],
  neighborCount: number,
) {
  const indices = new Uint16Array(points.length * neighborCount);
  indices.fill(NO_TELEMETRY_NEIGHBOR);

  for (let pointIndex = 0; pointIndex < points.length; pointIndex += 1) {
    const point = points[pointIndex];

    if (!point) {
      continue;
    }

    const nearestDistances = new Float32Array(neighborCount);
    nearestDistances.fill(Number.POSITIVE_INFINITY);

    for (let candidateIndex = 0; candidateIndex < points.length; candidateIndex += 1) {
      if (candidateIndex === pointIndex) {
        continue;
      }

      const candidate = points[candidateIndex];

      if (!candidate) {
        continue;
      }

      const offsetX = candidate.x - point.x;
      const offsetZ = candidate.z - point.z;
      const distanceSq = offsetX * offsetX + offsetZ * offsetZ;
      let insertionIndex = -1;

      for (let neighborIndex = 0; neighborIndex < neighborCount; neighborIndex += 1) {
        const nearestDistance = nearestDistances[neighborIndex] ?? Number.POSITIVE_INFINITY;

        if (distanceSq < nearestDistance) {
          insertionIndex = neighborIndex;
          break;
        }
      }

      if (insertionIndex === -1) {
        continue;
      }

      for (let shiftIndex = neighborCount - 1; shiftIndex > insertionIndex; shiftIndex -= 1) {
        nearestDistances[shiftIndex] = nearestDistances[shiftIndex - 1] ?? Number.POSITIVE_INFINITY;
        indices[pointIndex * neighborCount + shiftIndex] =
          indices[pointIndex * neighborCount + shiftIndex - 1] ?? NO_TELEMETRY_NEIGHBOR;
      }

      nearestDistances[insertionIndex] = distanceSq;
      indices[pointIndex * neighborCount + insertionIndex] = candidateIndex;
    }
  }

  return indices;
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}
