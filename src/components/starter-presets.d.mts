import type { TweakInfo } from "../types";
export type StarterPreset = {
  id:
    | "gaming"
    | "streaming"
    | "work"
    | "study"
    | "laptop"
    | "quiet"
    | "barebone"
    | "browser_only"
    | "office";
  icon: string;
  tweaks: { id: string; selected: boolean }[];
};
export const STARTER_PRESETS: StarterPreset[];
export function presetSelection(
  preset: StarterPreset,
  tweaks: TweakInfo[],
  selected: string[],
): {
  available: TweakInfo[];
  missing: string[];
  pending: TweakInfo[];
  unsupported: string[];
};
