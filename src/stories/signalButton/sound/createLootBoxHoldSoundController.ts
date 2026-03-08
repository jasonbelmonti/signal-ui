import type { HoldToTriggerFrame } from "../holdToTriggerState.js";

import { createSeededNoiseBuffer } from "./createSeededNoiseBuffer.js";

export type LootBoxHoldSoundController = {
  destroy: () => void;
  reset: () => void;
  resume: () => Promise<void>;
  startHolding: (charge: number) => void;
  stopHolding: (charge: number) => void;
  syncFrame: (nextFrame: HoldToTriggerFrame, previousFrame: HoldToTriggerFrame) => void;
};

type SpreadOscillatorVoice = {
  baseDetuneCents: number;
  gain: GainNode;
  intervalRatio: number;
  level: number;
  oscillator: OscillatorNode;
  pan: StereoPannerNode;
};

type BuildVoice = {
  airFilter: BiquadFilterNode;
  airGain: GainNode;
  harmonyGain: GainNode;
  harmonyOscillator: OscillatorNode;
  noiseSource: AudioBufferSourceNode;
  output: GainNode;
  stack: SpreadOscillatorVoice[];
  subGain: GainNode;
  subOscillator: OscillatorNode;
  toneFilter: BiquadFilterNode;
};

const MIN_LEVEL = 0.0001;
const HOLD_TIME_CONSTANT = 0.036;
const DRAIN_TIME_CONSTANT = 0.11;
const BUILD_ROOT_MIDI = 50;
const CONFIRMATION_ROOT_MIDI = 45;
const BUILD_SCALE_OFFSETS = [0, 2, 4, 7, 9, 12, 14, 16, 19] as const;
const CONFIRMATION_NOTE_OFFSETS = [24, 28] as const;

export function createLootBoxHoldSoundController(): LootBoxHoldSoundController {
  const context = new window.AudioContext({ latencyHint: "interactive" });
  const dryBus = new GainNode(context, { gain: 1 });
  const mixBus = new GainNode(context, { gain: 1 });
  const buildBus = new GainNode(context, { gain: 0.76 });
  const transientBus = new GainNode(context, { gain: 1 });
  const effectsGain = new GainNode(context, { gain: 1 });
  const master = new GainNode(context, { gain: 0.68 });
  const lowShelf = new BiquadFilterNode(context, {
    frequency: 170,
    gain: 6,
    type: "lowshelf",
  });
  const highShelf = new BiquadFilterNode(context, {
    frequency: 4_400,
    gain: -3.4,
    type: "highshelf",
  });
  const drive = new WaveShaperNode(context, {
    curve: createDriveCurve(13),
    oversample: "4x",
  });
  const compressor = new DynamicsCompressorNode(context, {
    attack: 0.004,
    knee: 24,
    ratio: 7,
    release: 0.26,
    threshold: -24,
  });
  const reverb = new ConvolverNode(context, {
    buffer: createImpulseResponseBuffer(context, 2.8, 2.4),
  });
  const buildReverbSend = new GainNode(context, { gain: 0.028 });
  const transientReverbSend = new GainNode(context, { gain: 0.42 });
  const reverbWet = new GainNode(context, { gain: 0.24 });
  const transientEchoSend = new GainNode(context, { gain: 0.28 });
  const echoDelay = new DelayNode(context, { delayTime: 0.23 });
  const echoFilter = new BiquadFilterNode(context, {
    frequency: 2_450,
    Q: 0.7,
    type: "lowpass",
  });
  const echoFeedback = new GainNode(context, { gain: 0.34 });
  const echoWet = new GainNode(context, { gain: 0.14 });
  const noiseBuffer = createSeededNoiseBuffer(context, 2.1);
  const buildVoice = createBuildVoice(context, buildBus, noiseBuffer);

  buildBus.connect(dryBus);
  transientBus.connect(dryBus);
  dryBus.connect(lowShelf);
  lowShelf.connect(highShelf);
  highShelf.connect(drive);
  drive.connect(mixBus);

  buildBus.connect(buildReverbSend);
  buildReverbSend.connect(reverb);
  transientBus.connect(transientReverbSend);
  transientReverbSend.connect(reverb);
  reverb.connect(reverbWet);
  reverbWet.connect(effectsGain);

  transientBus.connect(transientEchoSend);
  transientEchoSend.connect(echoDelay);
  echoDelay.connect(echoWet);
  echoWet.connect(effectsGain);
  echoDelay.connect(echoFilter);
  echoFilter.connect(echoFeedback);
  echoFeedback.connect(echoDelay);

  effectsGain.connect(mixBus);
  mixBus.connect(compressor);
  compressor.connect(master);
  master.connect(context.destination);

  return {
    async resume() {
      if (context.state === "suspended") {
        await context.resume();
      }
    },
    startHolding(charge) {
      armGainNode(effectsGain, context);
      updateBuildVoice(buildVoice, context, charge, false);
    },
    stopHolding(charge) {
      armGainNode(transientBus, context);
      armGainNode(effectsGain, context);
      updateBuildVoice(buildVoice, context, charge, true);
      playAbortSweep(context, transientBus, charge);
    },
    syncFrame(nextFrame, previousFrame) {
      if (nextFrame.phase === "holding") {
        armGainNode(effectsGain, context);
        updateBuildVoice(buildVoice, context, nextFrame.charge, false);
        return;
      }

      if (nextFrame.phase === "draining") {
        updateBuildVoice(buildVoice, context, nextFrame.charge, true);
        return;
      }

      if (nextFrame.phase === "resolving") {
        fadeBuildVoice(buildVoice, context, HOLD_TIME_CONSTANT);

        if (previousFrame.phase !== "resolving") {
          armGainNode(transientBus, context);
          armGainNode(effectsGain, context);
          playConfirmationChime(context, transientBus, noiseBuffer);
        }

        return;
      }

      if (nextFrame.phase === "completed" || nextFrame.phase === "idle") {
        fadeBuildVoice(
          buildVoice,
          context,
          nextFrame.phase === "completed" ? HOLD_TIME_CONSTANT : DRAIN_TIME_CONSTANT,
        );
      }
    },
    reset() {
      const now = context.currentTime;

      fadeBuildVoice(buildVoice, context, DRAIN_TIME_CONSTANT);

      transientBus.gain.cancelScheduledValues(now);
      transientBus.gain.setValueAtTime(Math.max(transientBus.gain.value, MIN_LEVEL), now);
      transientBus.gain.setTargetAtTime(MIN_LEVEL, now, 0.014);

      effectsGain.gain.cancelScheduledValues(now);
      effectsGain.gain.setValueAtTime(Math.max(effectsGain.gain.value, MIN_LEVEL), now);
      effectsGain.gain.setTargetAtTime(MIN_LEVEL, now, 0.02);
    },
    destroy() {
      fadeBuildVoice(buildVoice, context, 0.02);

      for (const stackVoice of buildVoice.stack) {
        stackVoice.oscillator.stop();
      }

      buildVoice.harmonyOscillator.stop();
      buildVoice.subOscillator.stop();
      buildVoice.noiseSource.stop();
      void context.close();
    },
  };
}

function createBuildVoice(
  context: AudioContext,
  destination: AudioNode,
  noiseBuffer: AudioBuffer,
): BuildVoice {
  const output = new GainNode(context, { gain: MIN_LEVEL });
  const toneFilter = new BiquadFilterNode(context, {
    frequency: 1_180,
    Q: 2.1,
    type: "lowpass",
  });
  const stack = [
    createStackVoice(context, toneFilter, -0.58, -14, 0.4, "sine"),
    createStackVoice(context, toneFilter, -0.22, -5, 0.72, "triangle"),
    createStackVoice(context, toneFilter, 0.22, 5, 0.72, "triangle"),
    createStackVoice(context, toneFilter, 0.58, 14, 0.4, "sine"),
  ];
  const harmonyGain = new GainNode(context, { gain: MIN_LEVEL });
  const harmonyOscillator = new OscillatorNode(context, {
    frequency: midiToFrequency(BUILD_ROOT_MIDI + 7),
    type: "sine",
  });
  const subGain = new GainNode(context, { gain: MIN_LEVEL });
  const subOscillator = new OscillatorNode(context, {
    frequency: midiToFrequency(BUILD_ROOT_MIDI - 12),
    type: "triangle",
  });
  const airHighpass = new BiquadFilterNode(context, {
    frequency: 1_500,
    Q: 0.8,
    type: "highpass",
  });
  const airFilter = new BiquadFilterNode(context, {
    frequency: 2_200,
    Q: 1.8,
    type: "bandpass",
  });
  const airGain = new GainNode(context, { gain: MIN_LEVEL });
  const noiseSource = new AudioBufferSourceNode(context, {
    buffer: noiseBuffer,
    loop: true,
  });

  toneFilter.connect(output);
  harmonyOscillator.connect(harmonyGain);
  harmonyGain.connect(toneFilter);

  subOscillator.connect(subGain);
  subGain.connect(output);

  noiseSource.connect(airHighpass);
  airHighpass.connect(airFilter);
  airFilter.connect(airGain);
  airGain.connect(output);

  output.connect(destination);

  for (const stackVoice of stack) {
    stackVoice.oscillator.start();
  }

  harmonyOscillator.start();
  subOscillator.start();
  noiseSource.start();

  return {
    airFilter,
    airGain,
    harmonyGain,
    harmonyOscillator,
    noiseSource,
    output,
    stack,
    subGain,
    subOscillator,
    toneFilter,
  };
}

function createStackVoice(
  context: AudioContext,
  destination: AudioNode,
  pan: number,
  baseDetuneCents: number,
  level: number,
  type: OscillatorType,
): SpreadOscillatorVoice {
  const gain = new GainNode(context, { gain: MIN_LEVEL });
  const stereoPan = new StereoPannerNode(context, { pan });
  const oscillator = new OscillatorNode(context, {
    frequency: midiToFrequency(BUILD_ROOT_MIDI),
    type,
  });

  oscillator.connect(gain);
  gain.connect(stereoPan);
  stereoPan.connect(destination);

  return {
    baseDetuneCents,
    gain,
    intervalRatio: 1,
    level,
    oscillator,
    pan: stereoPan,
  };
}

function updateBuildVoice(
  voice: BuildVoice,
  context: AudioContext,
  charge: number,
  draining: boolean,
) {
  const now = context.currentTime;
  const progress = clamp(charge, 0, 1);
  const timeConstant = draining ? DRAIN_TIME_CONSTANT : HOLD_TIME_CONSTANT;
  const chirpRate = 5.6 + progress * 7.8;
  const chirpPulse = Math.pow(Math.max(0, Math.sin(now * Math.PI * 2 * chirpRate)), 5);
  const secondaryPulse = Math.pow(
    Math.max(0, Math.sin(now * Math.PI * 2 * (chirpRate * 0.54 + 1.2) + Math.PI * 0.3)),
    7,
  );
  const slowMotion = 0.5 + 0.5 * Math.sin(now * Math.PI * 2 * (0.14 + progress * 0.18));
  const glitchStep = sampleSteppedNoise(now, 7 + progress * 11, 17);
  const glitchGate = glitchStep > 0.25 ? 1 : glitchStep > -0.1 ? 0.7 : 0.4;
  const airAccent = Math.max(0, sampleSteppedNoise(now, 6 + progress * 8, 37));
  const vibrato = Math.sin(now * Math.PI * 2 * (3 + progress * 0.35)) * (0.35 + progress * 0.25);
  const rootFrequency = midiToFrequency(BUILD_ROOT_MIDI);
  const widthAmount = 1 + progress * 0.12;
  const toneLevel = draining ? 0.008 + progress * 0.04 : 0.02 + progress * 0.07;

  for (const stackVoice of voice.stack) {
    const detune =
      stackVoice.baseDetuneCents * widthAmount +
      vibrato +
      Math.sin(now * Math.PI * 2 * (0.08 + Math.abs(stackVoice.baseDetuneCents) * 0.0016)) * 0.5;
    const sustainLevel = (0.006 + progress * 0.006) * stackVoice.level;
    const pulseLevel =
      sustainLevel * (1.12 + glitchGate * 0.2) +
      (0.005 + progress * 0.012) * stackVoice.level * (0.55 + chirpPulse * 0.85);

    stackVoice.oscillator.frequency.setTargetAtTime(
      rootFrequency * stackVoice.intervalRatio,
      now,
      timeConstant,
    );
    stackVoice.oscillator.detune.setTargetAtTime(detune, now, timeConstant);
    schedulePulseEnvelope(stackVoice.gain.gain, now, sustainLevel, pulseLevel, 0.038);
  }

  voice.harmonyOscillator.frequency.setTargetAtTime(rootFrequency * 1.5, now, timeConstant);
  voice.harmonyOscillator.detune.setTargetAtTime(vibrato * 0.45, now, timeConstant);
  schedulePulseEnvelope(
    voice.harmonyGain.gain,
    now,
    0.0014 + progress * 0.004,
    0.0024 + progress * 0.008 * (0.7 + chirpPulse * 0.8),
    0.034,
  );

  voice.subOscillator.frequency.setTargetAtTime(rootFrequency / 2, now, timeConstant * 1.35);
  voice.subGain.gain.setTargetAtTime(
    0.008 + progress * 0.02 + chirpPulse * 0.003,
    now,
    timeConstant * 1.6,
  );

  voice.toneFilter.frequency.setTargetAtTime(
    980 + chirpPulse * 1_350 + secondaryPulse * 520 + slowMotion * 110,
    now,
    timeConstant * 1.2,
  );
  voice.toneFilter.Q.setTargetAtTime(1.35 + chirpPulse * 1.15, now, timeConstant * 1.2);

  voice.airFilter.frequency.setTargetAtTime(
    2_650 + chirpPulse * 2_300 + secondaryPulse * 900 + airAccent * 220,
    now,
    timeConstant,
  );
  voice.airFilter.Q.setTargetAtTime(1.05 + chirpPulse * 1.2, now, timeConstant * 1.2);
  schedulePulseEnvelope(
    voice.airGain.gain,
    now,
    0.0006 + progress * 0.0018,
    0.0014 + progress * 0.0046 + chirpPulse * 0.004 + airAccent * 0.0014,
    0.03,
  );

  voice.output.gain.setTargetAtTime(toneLevel, now, timeConstant);
}

function fadeBuildVoice(voice: BuildVoice, context: AudioContext, timeConstant: number) {
  const now = context.currentTime;

  voice.output.gain.cancelScheduledValues(now);
  voice.output.gain.setValueAtTime(Math.max(voice.output.gain.value, MIN_LEVEL), now);
  voice.output.gain.setTargetAtTime(MIN_LEVEL, now, timeConstant);
}

function schedulePulseEnvelope(
  audioParam: AudioParam,
  now: number,
  sustainLevel: number,
  peakLevel: number,
  durationSeconds: number,
) {
  const safeSustain = Math.max(sustainLevel, MIN_LEVEL);
  const safePeak = Math.max(peakLevel, safeSustain);

  audioParam.cancelScheduledValues(now);
  audioParam.setValueAtTime(Math.max(audioParam.value, MIN_LEVEL), now);
  audioParam.linearRampToValueAtTime(safePeak, now + durationSeconds * 0.34);
  audioParam.linearRampToValueAtTime(safeSustain, now + durationSeconds);
}

function playAbortSweep(context: AudioContext, destination: AudioNode, charge: number) {
  const now = context.currentTime + 0.001;
  const sweepGain = new GainNode(context, { gain: MIN_LEVEL });
  const sweepFilter = new BiquadFilterNode(context, {
    frequency: 1_600 + charge * 1_000,
    Q: 1.8,
    type: "lowpass",
  });
  const lowVoice = new OscillatorNode(context, {
    frequency: midiToFrequency(57 + charge * 2),
    type: "triangle",
  });
  const highVoice = new OscillatorNode(context, {
    frequency: midiToFrequency(64 + charge * 2),
    type: "sine",
  });

  lowVoice.connect(sweepFilter);
  highVoice.connect(sweepFilter);
  sweepFilter.connect(sweepGain);
  sweepGain.connect(destination);

  sweepGain.gain.setValueAtTime(MIN_LEVEL, now);
  sweepGain.gain.exponentialRampToValueAtTime(0.085 + charge * 0.05, now + 0.02);
  sweepGain.gain.exponentialRampToValueAtTime(MIN_LEVEL, now + 0.26);

  sweepFilter.frequency.setValueAtTime(1_600 + charge * 1_000, now);
  sweepFilter.frequency.exponentialRampToValueAtTime(340, now + 0.26);

  lowVoice.frequency.setValueAtTime(midiToFrequency(57 + charge * 2), now);
  lowVoice.frequency.exponentialRampToValueAtTime(midiToFrequency(45), now + 0.26);

  highVoice.frequency.setValueAtTime(midiToFrequency(64 + charge * 2), now);
  highVoice.frequency.exponentialRampToValueAtTime(midiToFrequency(52), now + 0.22);

  lowVoice.start(now);
  highVoice.start(now);
  lowVoice.stop(now + 0.3);
  highVoice.stop(now + 0.28);
}

function playConfirmationChime(
  context: AudioContext,
  destination: AudioNode,
  noiseBuffer: AudioBuffer,
) {
  playPinballSparkle(context, destination, noiseBuffer);
  playTwoToneChirpConfirmation(context, destination);
  playConfirmationHalo(context, destination);
}

function playPinballSparkle(
  context: AudioContext,
  destination: AudioNode,
  noiseBuffer: AudioBuffer,
) {
  const now = context.currentTime + 0.002;
  const source = new AudioBufferSourceNode(context, { buffer: noiseBuffer });
  const highpass = new BiquadFilterNode(context, {
    frequency: 2_600,
    Q: 0.9,
    type: "highpass",
  });
  const bandpass = new BiquadFilterNode(context, {
    frequency: 4_200,
    Q: 2.1,
    type: "bandpass",
  });
  const gain = new GainNode(context, { gain: MIN_LEVEL });

  source.connect(highpass);
  highpass.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(destination);

  gain.gain.setValueAtTime(MIN_LEVEL, now);
  gain.gain.exponentialRampToValueAtTime(0.11, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(MIN_LEVEL, now + 0.16);

  bandpass.frequency.setValueAtTime(4_200, now);
  bandpass.frequency.exponentialRampToValueAtTime(6_100, now + 0.08);

  source.start(now);
  source.stop(now + 0.2);
}

function playTwoToneChirpConfirmation(context: AudioContext, destination: AudioNode) {
  const baseTime = context.currentTime + 0.014;

  playChirpClusterNote(
    context,
    destination,
    CONFIRMATION_ROOT_MIDI + CONFIRMATION_NOTE_OFFSETS[0],
    baseTime,
    -0.1,
    0.108,
    [0, 0.05],
  );
  playChirpClusterNote(
    context,
    destination,
    CONFIRMATION_ROOT_MIDI + CONFIRMATION_NOTE_OFFSETS[1],
    baseTime + 0.155,
    0.12,
    0.132,
    [0, 0.042, 0.094],
  );
}

function playChirpClusterNote(
  context: AudioContext,
  destination: AudioNode,
  midi: number,
  startTime: number,
  pan: number,
  peakLevel: number,
  pulseOffsets: readonly number[],
) {
  const bandpass = new BiquadFilterNode(context, {
    frequency: 2_800,
    Q: 1.5,
    type: "bandpass",
  });
  const lowpass = new BiquadFilterNode(context, {
    frequency: 5_300,
    Q: 0.9,
    type: "lowpass",
  });
  const highpass = new BiquadFilterNode(context, {
    frequency: 860,
    Q: 0.8,
    type: "highpass",
  });
  const panner = new StereoPannerNode(context, { pan });
  const gain = new GainNode(context, { gain: MIN_LEVEL });
  const baseFrequency = midiToFrequency(midi);
  const partials = [
    { detune: -2.5, gain: 1, ratio: 1, type: "triangle" as const },
    { detune: 2.5, gain: 0.54, ratio: 1.002, type: "sine" as const },
    { detune: -1.5, gain: 0.2, ratio: 2.01, type: "sine" as const },
  ];

  bandpass.connect(lowpass);
  lowpass.connect(highpass);
  highpass.connect(panner);
  panner.connect(gain);
  gain.connect(destination);

  gain.gain.setValueAtTime(MIN_LEVEL, startTime);
  bandpass.frequency.setValueAtTime(2_800, startTime);
  lowpass.frequency.setValueAtTime(5_300, startTime);

  for (const [index, pulseOffset] of pulseOffsets.entries()) {
    const pulseStart = startTime + pulseOffset;
    const durationSeconds = index === pulseOffsets.length - 1 ? 0.062 : 0.05;
    const pulsePeak = peakLevel * (index === pulseOffsets.length - 1 ? 1.08 : 0.88 + index * 0.07);
    const pulseTail = peakLevel * (0.18 + index * 0.02);
    const bandpassPeak = 3_200 + index * 360;
    const lowpassPeak = 6_000 + index * 450;

    scheduleOneShotPulse(gain.gain, pulseStart, pulsePeak, pulseTail, durationSeconds);
    scheduleFilterAccent(bandpass.frequency, pulseStart, 2_700, bandpassPeak, durationSeconds);
    scheduleFilterAccent(lowpass.frequency, pulseStart, 4_900, lowpassPeak, durationSeconds);
    bandpass.Q.setValueAtTime(1.45 + index * 0.08, pulseStart);
  }

  const finalPulseOffset = pulseOffsets.at(-1) ?? 0;
  const endTime = startTime + finalPulseOffset + 0.38;
  lowpass.frequency.linearRampToValueAtTime(2_600, endTime);

  for (const partial of partials) {
    const oscillator = new OscillatorNode(context, {
      frequency: baseFrequency * partial.ratio,
      detune: partial.detune,
      type: partial.type,
    });
    const partialGain = new GainNode(context, { gain: peakLevel * partial.gain });

    oscillator.connect(partialGain);
    partialGain.connect(bandpass);

    oscillator.start(startTime);
    oscillator.stop(endTime);
  }
}

function playConfirmationHalo(context: AudioContext, destination: AudioNode) {
  const now = context.currentTime + 0.28;
  const filter = new BiquadFilterNode(context, {
    frequency: 4_800,
    Q: 1.7,
    type: "bandpass",
  });
  const gain = new GainNode(context, { gain: MIN_LEVEL });
  const left = new OscillatorNode(context, {
    frequency: midiToFrequency(CONFIRMATION_ROOT_MIDI + CONFIRMATION_NOTE_OFFSETS[1]),
    type: "sine",
  });
  const right = new OscillatorNode(context, {
    frequency: midiToFrequency(CONFIRMATION_ROOT_MIDI + CONFIRMATION_NOTE_OFFSETS[1]),
    type: "sine",
  });
  const leftPan = new StereoPannerNode(context, { pan: -0.32 });
  const rightPan = new StereoPannerNode(context, { pan: 0.32 });

  left.connect(leftPan);
  right.connect(rightPan);
  leftPan.connect(filter);
  rightPan.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  gain.gain.setValueAtTime(MIN_LEVEL, now);
  gain.gain.exponentialRampToValueAtTime(0.024, now + 0.035);
  gain.gain.exponentialRampToValueAtTime(MIN_LEVEL, now + 0.74);

  left.frequency.setValueAtTime(
    midiToFrequency(CONFIRMATION_ROOT_MIDI + CONFIRMATION_NOTE_OFFSETS[1]),
    now,
  );
  left.frequency.exponentialRampToValueAtTime(
    midiToFrequency(CONFIRMATION_ROOT_MIDI + CONFIRMATION_NOTE_OFFSETS[1]) * 0.998,
    now + 0.64,
  );

  right.frequency.setValueAtTime(
    midiToFrequency(CONFIRMATION_ROOT_MIDI + CONFIRMATION_NOTE_OFFSETS[1]),
    now,
  );
  right.frequency.exponentialRampToValueAtTime(
    midiToFrequency(CONFIRMATION_ROOT_MIDI + CONFIRMATION_NOTE_OFFSETS[1]) * 1.002,
    now + 0.64,
  );

  left.start(now);
  right.start(now);
  left.stop(now + 0.8);
  right.stop(now + 0.8);
}

function scheduleOneShotPulse(
  audioParam: AudioParam,
  startTime: number,
  peakLevel: number,
  tailLevel: number,
  durationSeconds: number,
) {
  audioParam.setValueAtTime(MIN_LEVEL, startTime);
  audioParam.linearRampToValueAtTime(Math.max(peakLevel, MIN_LEVEL), startTime + durationSeconds * 0.24);
  audioParam.linearRampToValueAtTime(
    Math.max(tailLevel, MIN_LEVEL),
    startTime + durationSeconds * 0.72,
  );
  audioParam.exponentialRampToValueAtTime(MIN_LEVEL, startTime + durationSeconds);
}

function scheduleFilterAccent(
  audioParam: AudioParam,
  startTime: number,
  baseValue: number,
  peakValue: number,
  durationSeconds: number,
) {
  audioParam.setValueAtTime(baseValue, startTime);
  audioParam.linearRampToValueAtTime(peakValue, startTime + durationSeconds * 0.26);
  audioParam.linearRampToValueAtTime(baseValue * 0.94, startTime + durationSeconds);
}

function armGainNode(gainNode: GainNode, context: AudioContext, target = 1) {
  const now = context.currentTime;

  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(Math.max(gainNode.gain.value, MIN_LEVEL), now);
  gainNode.gain.setTargetAtTime(target, now, 0.016);
}

function createDriveCurve(amount: number) {
  const curve = new Float32Array(2_048);
  const gain = Math.max(1, amount);

  for (let index = 0; index < curve.length; index += 1) {
    const normalized = index / (curve.length - 1) * 2 - 1;
    curve[index] = Math.tanh(normalized * gain);
  }

  return curve;
}

function createImpulseResponseBuffer(
  context: BaseAudioContext,
  durationSeconds: number,
  decay: number,
) {
  const frameCount = Math.max(1, Math.floor(context.sampleRate * durationSeconds));
  const buffer = context.createBuffer(2, frameCount, context.sampleRate);

  for (let channelIndex = 0; channelIndex < buffer.numberOfChannels; channelIndex += 1) {
    const data = buffer.getChannelData(channelIndex);

    for (let sampleIndex = 0; sampleIndex < frameCount; sampleIndex += 1) {
      const progress = sampleIndex / frameCount;
      const noise = Math.random() * 2 - 1;
      data[sampleIndex] = noise * Math.pow(1 - progress, decay) * 0.42;
    }
  }

  return buffer;
}

function midiToFrequency(note: number) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function sampleSteppedNoise(time: number, rate: number, seed: number) {
  const step = Math.floor(time * rate);
  const value = Math.sin((step + 1) * 12.9898 + seed * 78.233) * 43_758.545_312_3;
  return (value - Math.floor(value)) * 2 - 1;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
