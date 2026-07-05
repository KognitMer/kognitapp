export type MoodId = "calm" | "focus" | "neutral" | "frustrated" | "tilt";

export const MOOD_OPTIONS: { id: MoodId; label: string }[] = [
  { id: "calm", label: "Tranquilo" },
  { id: "focus", label: "Enfocado" },
  { id: "neutral", label: "Neutral" },
  { id: "frustrated", label: "Frustrado" },
  { id: "tilt", label: "Tilt" },
];

// Notas guardadas antes del paquete de mascota tienen el mood como emoji plano.
const LEGACY_EMOJI_TO_ID: Record<string, MoodId> = {
  "🧘": "calm",
  "🎯": "focus",
  "😐": "neutral",
  "😤": "frustrated",
  "🔥": "tilt",
};

export function resolveMoodId(stored: string | null | undefined): MoodId | null {
  if (!stored) return null;
  if (stored in LEGACY_EMOJI_TO_ID) return LEGACY_EMOJI_TO_ID[stored];
  if (MOOD_OPTIONS.some(m => m.id === stored)) return stored as MoodId;
  return null;
}

export type ReactionId = "breathe" | "focus" | "inspire" | "reflect" | "identify";

export const REACTIONS: { id: ReactionId; label: string }[] = [
  { id: "breathe", label: "Me ayudó a respirar" },
  { id: "focus", label: "Me ayudó a enfocarme" },
  { id: "inspire", label: "Me inspira" },
  { id: "reflect", label: "Me hizo reflexionar" },
  { id: "identify", label: "Me siento identificado" },
];
