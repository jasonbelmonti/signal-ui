import { noiseCueDefinitions } from "./noiseCueDefinitions.js";
import type {
  MaterializedNoiseCue,
  NoiseCueName,
  NoiseCueOptions,
} from "./noiseCueTypes.js";

const defaultOptions: Required<NoiseCueOptions> = {
  gain: 1,
  pitchShift: 0,
  durationScale: 1,
  brightness: 1,
  detune: 0,
};

function clampPositive(value: number | undefined, fallback: number) {
  if (value === undefined || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return value;
}

function normalizeNoiseCueOptions(options: NoiseCueOptions = {}): Required<NoiseCueOptions> {
  return {
    gain: clampPositive(options.gain, defaultOptions.gain),
    pitchShift: Number.isFinite(options.pitchShift)
      ? (options.pitchShift as number)
      : defaultOptions.pitchShift,
    durationScale: clampPositive(
      options.durationScale,
      defaultOptions.durationScale,
    ),
    brightness: clampPositive(options.brightness, defaultOptions.brightness),
    detune: Number.isFinite(options.detune)
      ? (options.detune as number)
      : defaultOptions.detune,
  };
}

function pitchRatio(semitones: number) {
  return 2 ** (semitones / 12);
}

export function materializeNoiseCue(
  name: NoiseCueName,
  options: NoiseCueOptions = {},
): MaterializedNoiseCue {
  const definition = noiseCueDefinitions[name];
  const normalizedOptions = normalizeNoiseCueOptions(options);
  const frequencyRatio = pitchRatio(normalizedOptions.pitchShift);
  const layers = definition.layers.map((layer) => {
    const scaledLayer = {
      start: layer.start * normalizedOptions.durationScale,
      duration: layer.duration * normalizedOptions.durationScale,
      gain: layer.gain,
      attack: layer.attack * normalizedOptions.durationScale,
      decay: layer.decay * normalizedOptions.durationScale,
    };

    if (layer.kind === "tone") {
      return {
        ...scaledLayer,
        kind: "tone" as const,
        waveform: layer.waveform,
        frequency: layer.frequency * frequencyRatio,
        endFrequency: layer.endFrequency
          ? layer.endFrequency * frequencyRatio
          : undefined,
        detune: (layer.detune ?? 0) + normalizedOptions.detune,
        filterType: layer.filterType,
        filterFrequency: layer.filterFrequency
          ? layer.filterFrequency * normalizedOptions.brightness
          : undefined,
        q: layer.q ?? 0.7,
      };
    }

    return {
      ...scaledLayer,
      kind: "noise" as const,
      filterType: layer.filterType,
      filterFrequency:
        layer.filterFrequency *
        frequencyRatio *
        normalizedOptions.brightness,
      q: layer.q ?? 0.7,
      playbackRate:
        (layer.playbackRate ?? 1) *
        Math.max(0.5, Math.min(1.75, normalizedOptions.brightness)),
    };
  });

  const duration = layers.reduce(
    (maxDuration, layer) => Math.max(maxDuration, layer.start + layer.duration),
    0,
  );

  return {
    outputGain: definition.outputGain * normalizedOptions.gain,
    duration,
    layers,
  };
}
