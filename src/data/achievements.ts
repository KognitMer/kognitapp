import flowState from "@/assets/achievements/flow-state.png";
import firstAlly from "@/assets/achievements/first-ally.png";
import fiveDayStreak from "@/assets/achievements/five-day-streak.png";
import unstoppable from "@/assets/achievements/unstoppable.png";
import twoMinuteRule from "@/assets/achievements/two-minute-rule.png";
import caterpillarEffect from "@/assets/achievements/caterpillar-effect.png";
import onePercentBetter from "@/assets/achievements/one-percent-better.png";
import closingRitual from "@/assets/achievements/closing-ritual.png";
import calmAnchor from "@/assets/achievements/calm-anchor.png";

export type AchievementId =
  | "flowState" | "firstAlly" | "fiveDayStreak" | "unstoppable" | "twoMinuteRule"
  | "caterpillarEffect" | "onePercentBetter" | "closingRitual" | "calmAnchor";

export interface AchievementStats {
  streakDays: number;
  totalResets: number;
}

// isUnlocked: solo devuelve algo distinto de "siempre bloqueado" para los logros
// cuyo criterio se puede medir con datos que la app ya registra hoy (racha y
// resets). El resto describe comportamientos que la app todavía no rastrea
// (socio corresponsable, etc.) y quedan como referencia informativa hasta que
// exista esa función.
export const ACHIEVEMENTS: { id: AchievementId; icon: string; isUnlocked: (stats: AchievementStats) => boolean }[] = [
  { id: "flowState", icon: flowState, isUnlocked: () => false },
  { id: "firstAlly", icon: firstAlly, isUnlocked: () => false },
  { id: "fiveDayStreak", icon: fiveDayStreak, isUnlocked: (s) => s.streakDays >= 5 },
  { id: "unstoppable", icon: unstoppable, isUnlocked: () => false },
  { id: "twoMinuteRule", icon: twoMinuteRule, isUnlocked: () => false },
  { id: "caterpillarEffect", icon: caterpillarEffect, isUnlocked: () => false },
  { id: "onePercentBetter", icon: onePercentBetter, isUnlocked: () => false },
  { id: "closingRitual", icon: closingRitual, isUnlocked: () => false },
  { id: "calmAnchor", icon: calmAnchor, isUnlocked: (s) => s.totalResets >= 1 },
];
