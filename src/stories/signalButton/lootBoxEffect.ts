import { clamp01, easeOutCubic, roundPercent } from "./math.js";

export type LootBoxEffectState = {
  cooldownPercent: number;
  fillPercent: number;
  pulseBurst: number;
  wakePercent: number;
  label: string;
};

export function getLootBoxEffectState(elapsedMs: number): LootBoxEffectState {
  if (elapsedMs < 850) {
    const progress = easeOutCubic(elapsedMs / 850);

    return {
      cooldownPercent: 0,
      fillPercent: roundPercent(12 + progress * 88),
      wakePercent: 0,
      pulseBurst: 0,
      label: "Prime Cache",
    };
  }

  if (elapsedMs < 1450) {
    const progress = easeOutCubic((elapsedMs - 850) / 600);

    return {
      cooldownPercent: 0,
      fillPercent: 100,
      wakePercent: roundPercent(progress * 100),
      pulseBurst: 0,
      label: "Wake Relic",
    };
  }

  if (elapsedMs < 2100) {
    const progress = clamp01((elapsedMs - 1450) / 650);
    const stagedProgress =
      progress < 0.78
        ? easeOutCubic(progress / 0.78) * 0.72
        : 0.72 + easeOutCubic((progress - 0.78) / 0.22) * 0.28;
    const cooldownProgress = progress < 0.62 ? 0 : easeOutCubic((progress - 0.62) / 0.38);

    return {
      cooldownPercent: roundPercent(cooldownProgress * 62),
      fillPercent: 100,
      wakePercent: 100,
      pulseBurst: roundPercent(stagedProgress * 100),
      label: "Crack Loot",
    };
  }

  const progress = easeOutCubic((elapsedMs - 2100) / 300);

  return {
    cooldownPercent: roundPercent(progress * 100),
    fillPercent: 100,
    wakePercent: 100,
    pulseBurst: 0,
    label: "Reward Dispensed",
  };
}
