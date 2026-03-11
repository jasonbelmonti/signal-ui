export interface ExampleLoadingMetric {
  label: string;
  value: string;
}

export interface ExampleLoadingFrame {
  acknowledgementBody: string;
  acknowledgementLabel: string;
  description: string;
  eyebrow: string;
  isComplete: boolean;
  metrics: ExampleLoadingMetric[];
  progress: number;
  progressLabel: string;
  status: string;
  title: string;
}

interface LoadingStage {
  description: string;
  durationMs: number;
  key: string;
  progressEnd: number;
  progressStart: number;
  rateEnd: number;
  rateStart: number;
  status: string;
  title: string;
}

const loadingStages: LoadingStage[] = [
  {
    key: "routing",
    title: "Acquiring relay route",
    description:
      "Interrogating the route lattice and warming the first relay lane before any payload bytes move.",
    status: "routing",
    progressStart: 0,
    progressEnd: 24,
    rateStart: 4,
    rateEnd: 11,
    durationMs: 920,
  },
  {
    key: "indexing",
    title: "Indexing payload shards",
    description:
      "Walking the shard map, verifying signatures, and staging the transfer envelope for live uplink.",
    status: "indexing",
    progressStart: 24,
    progressEnd: 57,
    rateStart: 11,
    rateEnd: 18,
    durationMs: 1280,
  },
  {
    key: "locking",
    title: "Locking reticle envelope",
    description:
      "Projecting the final containment plane so the splash loader can pretend this is all very classified.",
    status: "locking",
    progressStart: 57,
    progressEnd: 83,
    rateStart: 18,
    rateEnd: 13,
    durationMs: 1100,
  },
  {
    key: "committing",
    title: "Committing uplink seal",
    description:
      "Writing the final command envelope and waiting for a hard confirmation from the remote relay.",
    status: "committing",
    progressStart: 83,
    progressEnd: 100,
    rateStart: 13,
    rateEnd: 9,
    durationMs: 980,
  },
];

export const EXAMPLE_LOADING_TOTAL_MS = loadingStages.reduce(
  (total, stage) => total + stage.durationMs,
  0,
);

export function getExampleLoadingFrame(elapsedMs: number): ExampleLoadingFrame {
  if (elapsedMs >= EXAMPLE_LOADING_TOTAL_MS) {
    return {
      acknowledgementBody:
        "Relay sealed. The splash lane settles into a steady phosphor hold and the completion chime acknowledges the lock.",
      acknowledgementLabel: "uplink sealed",
      description:
        "The envelope is live, the relay accepted the signature, and the last segment can stop pretending it was nervous.",
      eyebrow: "Example Loading",
      isComplete: true,
      metrics: [
        { label: "Stage", value: "04/04" },
        { label: "Integrity", value: "100%" },
        { label: "Latency", value: "022 ms" },
      ],
      progress: 100,
      progressLabel: "uplink completion",
      status: "completed",
      title: "Relay envelope sealed",
    };
  }

  let stageOffset = 0;

  for (const [index, stage] of loadingStages.entries()) {
    const stageElapsed = elapsedMs - stageOffset;

    if (stageElapsed <= stage.durationMs) {
      const stageProgress = easeOutCubic(clamp(stageElapsed / stage.durationMs, 0, 1));
      const progress = roundToTenth(
        interpolate(stage.progressStart, stage.progressEnd, stageProgress),
      );
      const rate = Math.round(interpolate(stage.rateStart, stage.rateEnd, stageProgress));
      const remainingMs = Math.max(0, EXAMPLE_LOADING_TOTAL_MS - elapsedMs);

      return {
        acknowledgementBody:
          "Replay the run to arm the completion chime if your browser is still holding audio hostage.",
        acknowledgementLabel: "awaiting seal",
        description: stage.description,
        eyebrow: "Example Loading",
        isComplete: false,
        metrics: [
          { label: "Stage", value: `${String(index + 1).padStart(2, "0")}/${String(loadingStages.length).padStart(2, "0")}` },
          { label: "Rate", value: `${String(rate).padStart(2, "0")} MB/S` },
          { label: "ETA", value: formatDurationMs(remainingMs) },
        ],
        progress,
        progressLabel: "uplink completion",
        status: stage.status,
        title: stage.title,
      };
    }

    stageOffset += stage.durationMs;
  }

  return getExampleLoadingFrame(EXAMPLE_LOADING_TOTAL_MS);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3;
}

function formatDurationMs(durationMs: number) {
  const totalSeconds = Math.ceil(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function interpolate(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function roundToTenth(value: number) {
  return Math.round(value * 10) / 10;
}
