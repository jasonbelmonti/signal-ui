import { materializeNoiseCue } from "./materializeNoiseCue.js";
import type {
  MaterializedCueLayer,
  MaterializedNoiseLayer,
  MaterializedToneLayer,
  NoiseCueName,
  NoiseCueOptions,
} from "./noiseCueTypes.js";

type AudioContextWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

function resolveAudioContextConstructor() {
  if (typeof window === "undefined") {
    return null;
  }

  const audioWindow = window as AudioContextWindow;
  return audioWindow.AudioContext ?? audioWindow.webkitAudioContext ?? null;
}

class NoiseEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private wireCueCleanup(
    source: AudioScheduledSourceNode,
    nodes: AudioNode[],
    onComplete: () => void,
  ) {
    let hasCleanedUp = false;
    source.onended = () => {
      if (hasCleanedUp) {
        return;
      }

      hasCleanedUp = true;
      for (const node of nodes) {
        node.disconnect();
      }
      onComplete();
    };
  }

  private ensureAudioContext() {
    if (this.audioContext) {
      return this.audioContext;
    }

    const AudioContextConstructor = resolveAudioContextConstructor();
    if (!AudioContextConstructor) {
      return null;
    }

    this.audioContext = new AudioContextConstructor({
      latencyHint: "interactive",
    });
    return this.audioContext;
  }

  private ensureMasterGain(context: AudioContext) {
    if (this.masterGain && this.masterGain.context === context) {
      return this.masterGain;
    }

    this.masterGain = context.createGain();
    this.masterGain.gain.value = 0.55;
    this.masterGain.connect(context.destination);
    return this.masterGain;
  }

  private ensureNoiseBuffer(context: AudioContext) {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === context.sampleRate) {
      return this.noiseBuffer;
    }

    const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < channel.length; index += 1) {
      channel[index] = Math.random() * 2 - 1;
    }

    this.noiseBuffer = buffer;
    return buffer;
  }

  private applyEnvelope(
    gainNode: GainNode,
    startAt: number,
    layer: MaterializedCueLayer,
  ) {
    const attackEndAt = startAt + Math.max(layer.attack, 0.001);
    const endAt = startAt + Math.max(layer.duration, 0.002);

    gainNode.gain.cancelScheduledValues(startAt);
    gainNode.gain.setValueAtTime(0.0001, startAt);
    gainNode.gain.linearRampToValueAtTime(
      Math.max(layer.gain, 0.0001),
      attackEndAt,
    );
    gainNode.gain.exponentialRampToValueAtTime(0.0001, endAt);

    return endAt;
  }

  private scheduleToneLayer(
    context: AudioContext,
    output: GainNode,
    layer: MaterializedToneLayer,
    baseTime: number,
    onComplete: () => void,
  ) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const startAt = baseTime + layer.start;
    const endAt = this.applyEnvelope(gainNode, startAt, layer);
    const nodesToDisconnect: AudioNode[] = [oscillator, gainNode];

    oscillator.type = layer.waveform;
    oscillator.frequency.setValueAtTime(Math.max(layer.frequency, 1), startAt);
    oscillator.detune.setValueAtTime(layer.detune, startAt);

    if (layer.endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(layer.endFrequency, 1),
        endAt,
      );
    }

    if (layer.filterType && layer.filterFrequency) {
      const filterNode = context.createBiquadFilter();
      filterNode.type = layer.filterType;
      filterNode.frequency.setValueAtTime(
        Math.max(layer.filterFrequency, 120),
        startAt,
      );
      filterNode.Q.setValueAtTime(layer.q, startAt);
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      nodesToDisconnect.push(filterNode);
    } else {
      oscillator.connect(gainNode);
    }

    gainNode.connect(output);
    this.wireCueCleanup(oscillator, nodesToDisconnect, onComplete);
    oscillator.start(startAt);
    oscillator.stop(endAt + 0.02);
  }

  private scheduleNoiseLayer(
    context: AudioContext,
    output: GainNode,
    layer: MaterializedNoiseLayer,
    baseTime: number,
    onComplete: () => void,
  ) {
    const source = context.createBufferSource();
    const filterNode = context.createBiquadFilter();
    const gainNode = context.createGain();
    const startAt = baseTime + layer.start;
    const endAt = this.applyEnvelope(gainNode, startAt, layer);

    source.buffer = this.ensureNoiseBuffer(context);
    source.playbackRate.setValueAtTime(layer.playbackRate, startAt);
    filterNode.type = layer.filterType;
    filterNode.frequency.setValueAtTime(
      Math.max(layer.filterFrequency, 120),
      startAt,
    );
    filterNode.Q.setValueAtTime(layer.q, startAt);

    source.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(output);
    this.wireCueCleanup(source, [source, filterNode, gainNode], onComplete);
    source.start(startAt);
    source.stop(endAt + 0.02);
  }

  async prime() {
    const context = this.ensureAudioContext();
    if (!context) {
      return false;
    }

    if (context.state !== "running") {
      try {
        await context.resume();
      } catch {
        return false;
      }
    }

    return context.state === "running";
  }

  async playCue(name: NoiseCueName, options: NoiseCueOptions = {}) {
    const context = this.ensureAudioContext();
    if (!context) {
      return false;
    }

    const isReady = await this.prime();
    if (!isReady) {
      return false;
    }

    const cue = materializeNoiseCue(name, options);
    const cueGain = context.createGain();
    cueGain.gain.value = cue.outputGain;
    cueGain.connect(this.ensureMasterGain(context));

    const baseTime = context.currentTime + 0.005;
    let pendingLayers = cue.layers.length;
    const handleLayerComplete = () => {
      pendingLayers -= 1;
      if (pendingLayers === 0) {
        cueGain.disconnect();
      }
    };

    for (const layer of cue.layers) {
      if (layer.kind === "tone") {
        this.scheduleToneLayer(
          context,
          cueGain,
          layer,
          baseTime,
          handleLayerComplete,
        );
        continue;
      }

      this.scheduleNoiseLayer(
        context,
        cueGain,
        layer,
        baseTime,
        handleLayerComplete,
      );
    }

    return true;
  }
}

const noiseEngine = new NoiseEngine();

export function primeNoiseEngine() {
  return noiseEngine.prime();
}

export function playNoiseCue(
  name: NoiseCueName,
  options: NoiseCueOptions = {},
) {
  return noiseEngine.playCue(name, options);
}
