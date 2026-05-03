import { ChevronLeft, Shuffle, Bookmark, Check } from "lucide-react";
import { BottomNav } from "@/components/kognit/BottomNav";
import { CATEGORIES, pickRandom, MentalCard } from "@/data/mentalCards";
import { useMemo, useState } from "react";

interface CardsProps { onBack?: () => void; }

export const CardsScreen = ({ onBack }: CardsProps) => {
  const [catIdx, setCatIdx] = useState(0);
  const [cardIdx, setCardIdx] = useState(0);
  const [seed, setSeed] = useState(0);

  const cat = CATEGORIES[catIdx];
  const cards: MentalCard[] = useMemo(
    () => pickRandom(cat.cards, Math.min(cat.cards.length, 5)),
    [catIdx, seed]
  );
  const card = cards[cardIdx % cards.length];

  const accentMap: Record<string, string> = {
    primary: "bg-gradient-primary text-primary-foreground",
    destructive: "bg-gradient-emergency text-destructive-foreground",
    warning: "bg-warning text-warning-foreground",
    accent: "bg-gradient-deep text-primary-foreground",
  };

  return (
    <div className="min-h-full bg-gradient-hero pb-28">
      <div className="px-6 pt-3 flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center">
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Cartas Mentales</p>
          <p className="text-sm font-bold">{cat.name}</p>
        </div>
        <button onClick={() => { setSeed(s => s + 1); setCardIdx(0); }} className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center">
          <Shuffle size={16} />
        </button>
      </div>

      {/* Selector de categoría */}
      <div className="mt-4 px-6 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((c, i) => (
          <button key={c.id}
            onClick={() => { setCatIdx(i); setCardIdx(0); setSeed(s => s + 1); }}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              i === catIdx ? "bg-foreground text-background border-transparent" : "bg-card text-muted-foreground border-border"
            }`}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Carta */}
      <div className="relative mt-5 mx-6 h-[400px]">
        <div className="absolute inset-x-8 top-6 h-[360px] rounded-3xl bg-card shadow-soft opacity-50" />
        <div className="absolute inset-x-4 top-3 h-[380px] rounded-3xl bg-card shadow-card" />
        <div className={`absolute inset-x-0 top-0 h-[390px] rounded-3xl shadow-glow p-7 flex flex-col ${accentMap[cat.accent]}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold bg-white/20 backdrop-blur px-3 py-1 rounded-full">
              {cat.name}
            </span>
            <span className="text-xs opacity-80 font-bold">{String((cardIdx % cards.length) + 1).padStart(2,"0")} / {cards.length}</span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-3xl font-bold leading-tight">{card.title}</h2>
            <p className="mt-3 text-sm opacity-90 leading-relaxed">{card.message}</p>
          </div>
          <div className="mt-4 p-4 rounded-2xl bg-white/15 backdrop-blur">
            <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Acción concreta</p>
            <p className="mt-1 text-sm font-bold leading-snug">{card.action}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {cards.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === (cardIdx % cards.length) ? "w-6 bg-primary" : "w-1.5 bg-muted"}`} />
        ))}
      </div>

      <div className="px-6 mt-5 flex gap-3">
        <button className="flex-1 py-3 rounded-2xl bg-card shadow-soft text-sm font-bold flex items-center justify-center gap-2">
          <Bookmark size={15} /> Guardar
        </button>
        <button onClick={() => setCardIdx(i => i + 1)}
          className="flex-[2] py-3 rounded-2xl bg-foreground text-background text-sm font-bold flex items-center justify-center gap-2">
          <Check size={15} /> Aplicar y siguiente
        </button>
      </div>

      <p className="text-center mt-4 text-[11px] text-muted-foreground px-8">
        {cat.tagline}
      </p>

      <BottomNav active="cards" />
    </div>
  );
};
