import { ChevronLeft, Shuffle, RotateCw } from "lucide-react";
import { motion, useMotionValue, animate, type PanInfo } from "framer-motion";
import { BottomNav } from "@/components/kognit/BottomNav";
import { CATEGORIES, MentalCard } from "@/data/mentalCards";
import { useState, useRef, useEffect } from "react";

interface CardsProps { onBack?: () => void; }

function getRandomCard() {
  const randomCat = Math.floor(Math.random() * CATEGORIES.length);
  const randomCard = Math.floor(Math.random() * CATEGORIES[randomCat].cards.length);
  return { catIdx: randomCat, cardIdx: randomCard };
}

export const CardsScreen = ({ onBack }: CardsProps) => {
  const initial = getRandomCard();
  const [catIdx, setCatIdx] = useState(initial.catIdx);
  const [cardIdx, setCardIdx] = useState(initial.cardIdx);

  const cat = CATEGORIES[catIdx];
  const card: MentalCard = cat.cards[cardIdx];

  const rotateY = useMotionValue(0);
  const wasDragged = useRef(false);

  // Cada carta nueva arranca mostrando el frente, sin animación.
  useEffect(() => {
    rotateY.set(0);
  }, [catIdx, cardIdx, rotateY]);

  const snapTo = (target: number) => {
    animate(rotateY, target, { type: "spring", stiffness: 260, damping: 24 });
  };

  const handlePan = (_e: PointerEvent, info: PanInfo) => {
    wasDragged.current = true;
    rotateY.set(rotateY.get() + info.delta.x * 0.6);
  };

  const handlePanEnd = (_e: PointerEvent, info: PanInfo) => {
    const current = rotateY.get();
    const isFlick = Math.abs(info.velocity.x) > 500;
    const target = isFlick
      ? (info.velocity.x > 0 ? Math.ceil(current / 180) : Math.floor(current / 180)) * 180
      : Math.round(current / 180) * 180;
    snapTo(target);
    setTimeout(() => { wasDragged.current = false; }, 0);
  };

  const handleClick = () => {
    if (wasDragged.current) return;
    snapTo(rotateY.get() + 180);
  };

  const accentMap: Record<string, string> = {
    primary: "bg-gradient-primary text-primary-foreground",
    destructive: "bg-gradient-emergency text-destructive-foreground",
    warning: "bg-warning text-warning-foreground",
    accent: "bg-gradient-deep text-primary-foreground",
    info: "bg-gradient-info text-info-foreground",
    violet: "bg-gradient-violet text-violet-foreground",
    gold: "bg-gradient-gold text-gold-foreground",
    seafoam: "bg-gradient-seafoam text-seafoam-foreground",
  };

  const drawCard = () => {
    const next = getRandomCard();
    setCatIdx(next.catIdx);
    setCardIdx(next.cardIdx);
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
        <div className="w-10" />
      </div>

      {/* Tagline de la categoría */}
      <p className="mt-5 px-6 text-sm font-bold leading-tight">{cat.tagline}</p>

      {/* Carta */}
      <div className="relative mt-4 mx-6 h-[480px]" style={{ perspective: 1400 }}>
        <div className="absolute inset-x-8 top-6 h-[440px] rounded-3xl bg-card shadow-soft opacity-50" />
        <div className="absolute inset-x-4 top-3 h-[460px] rounded-3xl bg-card shadow-card" />
        <motion.div
          className="absolute inset-x-0 top-0 h-[470px] cursor-grab active:cursor-grabbing"
          style={{ transformStyle: "preserve-3d", rotateY }}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
          onClick={handleClick}
        >
          {/* Lado A — título */}
          <div
            className={`absolute inset-0 rounded-3xl shadow-glow p-7 flex flex-col ${accentMap[cat.accent]}`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-bold bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                {cat.name}
              </span>
              <span className="text-xs opacity-80 font-bold">{cardIdx + 1} / {cat.cards.length}</span>
            </div>
            <div className="flex-1 flex items-center justify-center text-center">
              <h2 className="text-3xl font-bold leading-tight">{card.title}</h2>
            </div>
            <div className="flex items-center justify-center gap-2 opacity-80">
              <RotateCw size={14} />
              <p className="text-[11px] uppercase tracking-widest font-bold">Deslizá para dar vuelta</p>
            </div>
          </div>

          {/* Lado B — mensaje + acción */}
          <div
            className={`absolute inset-0 rounded-3xl shadow-glow p-7 flex flex-col overflow-y-auto no-scrollbar ${accentMap[cat.accent]}`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="flex items-center justify-between shrink-0">
              <span className="text-[10px] uppercase tracking-widest font-bold bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                {cat.name}
              </span>
              <span className="text-xs opacity-80 font-bold">{cardIdx + 1} / {cat.cards.length}</span>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-sm opacity-90 leading-relaxed">{card.message}</p>
            </div>
            <div className="mt-4 p-4 rounded-2xl bg-white/15 backdrop-blur shrink-0">
              <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Acción concreta</p>
              <p className="mt-1 text-sm font-bold leading-snug">{card.action}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 mt-6">
        <button onClick={drawCard}
          className="w-full py-4 rounded-2xl bg-foreground text-background text-sm font-bold flex items-center justify-center gap-2 shadow-card hover:opacity-90 transition-opacity">
          <Shuffle size={16} /> Sacar carta
        </button>
      </div>

      <BottomNav active="cards" />
    </div>
  );
};
