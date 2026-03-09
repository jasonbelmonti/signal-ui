export type CueLayerDefinition = ToneLayerDefinition | NoiseLayerDefinition;

type BaseLayerDefinition = {
  start: number;
  duration: number;
  gain: number;
  attack: number;
  decay: number;
};

export type ToneLayerDefinition = BaseLayerDefinition & {
  kind: "tone";
  waveform: OscillatorType;
  frequency: number;
  endFrequency?: number;
  detune?: number;
  filterType?: BiquadFilterType;
  filterFrequency?: number;
  q?: number;
};

export type NoiseLayerDefinition = BaseLayerDefinition & {
  kind: "noise";
  filterType: BiquadFilterType;
  filterFrequency: number;
  q?: number;
  playbackRate?: number;
};

export type CueDefinition = {
  outputGain: number;
  layers: readonly CueLayerDefinition[];
};

export type NoiseCueName = "boot" | "click" | "confirm" | "error";

export type NoiseCueOptions = {
  gain?: number;
  pitchShift?: number;
  durationScale?: number;
  brightness?: number;
  detune?: number;
};

export type MaterializedCueLayer = MaterializedToneLayer | MaterializedNoiseLayer;

type MaterializedBaseLayer = {
  start: number;
  duration: number;
  gain: number;
  attack: number;
  decay: number;
};

export type MaterializedToneLayer = MaterializedBaseLayer & {
  kind: "tone";
  waveform: OscillatorType;
  frequency: number;
  endFrequency?: number;
  detune: number;
  filterType?: BiquadFilterType;
  filterFrequency?: number;
  q: number;
};

export type MaterializedNoiseLayer = MaterializedBaseLayer & {
  kind: "noise";
  filterType: BiquadFilterType;
  filterFrequency: number;
  q: number;
  playbackRate: number;
};

export type MaterializedNoiseCue = {
  outputGain: number;
  duration: number;
  layers: MaterializedCueLayer[];
};
