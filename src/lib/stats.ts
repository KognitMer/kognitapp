interface ResetIntensitySample {
  pre_intensity: number | null;
  post_intensity: number | null;
}

const clamp = (n: number) => Math.round(Math.min(100, Math.max(0, n)));

// Mismo criterio que ya usa el gráfico de foco semanal en Calendar.tsx:
// cuanto más baja la intensidad post-reset, más alto el foco.
export function computeFocusLevel(sessions: ResetIntensitySample[]): number | null {
  const valid = sessions.filter((s): s is { pre_intensity: number | null; post_intensity: number } => s.post_intensity != null);
  if (!valid.length) return null;
  const avg = valid.reduce((sum, s) => sum + (10 - s.post_intensity) * 10, 0) / valid.length;
  return clamp(avg);
}

// Distinto de focus_level: mide cuánto baja la intensidad emocional entre el
// inicio y el final del reset (la habilidad de autorregularse), no el nivel
// de calma final en sí.
export function computeEmotionalControl(sessions: ResetIntensitySample[]): number | null {
  const valid = sessions.filter((s): s is { pre_intensity: number; post_intensity: number } => s.pre_intensity != null && s.post_intensity != null);
  if (!valid.length) return null;
  const avg = valid.reduce((sum, s) => sum + (Math.max(0, s.pre_intensity - s.post_intensity) / 9) * 100, 0) / valid.length;
  return clamp(avg);
}
