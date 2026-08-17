export type CardCategory = {
  id: string;
  accent: "primary" | "destructive" | "accent" | "info" | "cyan" | "seafoam" | "azure";
  cardCount: number;
};

export const CATEGORIES: CardCategory[] = [
  { id: "reframe", accent: "azure", cardCount: 10 },
  { id: "regulation", accent: "destructive", cardCount: 10 },
  { id: "flow", accent: "cyan", cardCount: 10 },
  { id: "systems", accent: "primary", cardCount: 10 },
  { id: "logic", accent: "info", cardCount: 10 },
];

export function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}
