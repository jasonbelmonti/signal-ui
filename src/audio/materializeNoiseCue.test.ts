import { describe, expect, test } from "bun:test";

import { materializeNoiseCue } from "./materializeNoiseCue.js";

describe("materializeNoiseCue", () => {
  test("builds click cues from both noise and tone layers", () => {
    const cue = materializeNoiseCue("click");

    expect(cue.layers.filter((layer) => layer.kind === "tone")).toHaveLength(2);
    expect(cue.layers.filter((layer) => layer.kind === "noise")).toHaveLength(1);
    expect(cue.duration).toBeGreaterThan(0.02);
  });

  test("scales pitch and duration for confirmations", () => {
    const baseCue = materializeNoiseCue("confirm");
    const shiftedCue = materializeNoiseCue("confirm", {
      pitchShift: 12,
      durationScale: 0.5,
    });

    const [baseLayer] = baseCue.layers;
    const [shiftedLayer] = shiftedCue.layers;

    if (!baseLayer || baseLayer.kind !== "tone") {
      throw new Error("Expected a tone layer for the base confirmation cue.");
    }
    if (!shiftedLayer || shiftedLayer.kind !== "tone") {
      throw new Error("Expected a tone layer for the shifted confirmation cue.");
    }

    expect(shiftedCue.duration).toBeCloseTo(baseCue.duration * 0.5, 6);
    expect(shiftedLayer.frequency).toBeCloseTo(baseLayer.frequency * 2, 6);
  });

  test("uses brightness to push click filters upward", () => {
    const baseCue = materializeNoiseCue("click");
    const brightCue = materializeNoiseCue("click", {
      brightness: 1.5,
    });

    const baseNoiseLayer = baseCue.layers.find((layer) => layer.kind === "noise");
    const brightNoiseLayer = brightCue.layers.find(
      (layer) => layer.kind === "noise",
    );

    if (!baseNoiseLayer || baseNoiseLayer.kind !== "noise") {
      throw new Error("Expected a noise layer in the base click cue.");
    }
    if (!brightNoiseLayer || brightNoiseLayer.kind !== "noise") {
      throw new Error("Expected a noise layer in the bright click cue.");
    }

    expect(brightNoiseLayer.filterFrequency).toBeGreaterThan(
      baseNoiseLayer.filterFrequency,
    );
    expect(brightNoiseLayer.playbackRate).toBeGreaterThan(
      baseNoiseLayer.playbackRate,
    );
  });

  test("scales tone filter frequencies for brighter synth cues", () => {
    const baseCue = materializeNoiseCue("confirm");
    const brightCue = materializeNoiseCue("confirm", {
      brightness: 1.4,
    });

    const baseToneLayer = baseCue.layers.find(
      (layer) => layer.kind === "tone" && layer.filterFrequency !== undefined,
    );
    const brightToneLayer = brightCue.layers.find(
      (layer) => layer.kind === "tone" && layer.filterFrequency !== undefined,
    );

    if (!baseToneLayer || baseToneLayer.kind !== "tone") {
      throw new Error("Expected a filtered tone layer in the base confirm cue.");
    }
    if (!brightToneLayer || brightToneLayer.kind !== "tone") {
      throw new Error("Expected a filtered tone layer in the bright confirm cue.");
    }

    expect(brightToneLayer.filterFrequency).toBeGreaterThan(
      baseToneLayer.filterFrequency ?? 0,
    );
  });
});
