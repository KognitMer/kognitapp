import { ChevronLeft, Shuffle, RotateCw, Lock } from "lucide-react";
import { motion, useMotionValue, animate, type PanInfo } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BottomNav } from "@/components/kognit/BottomNav";
import { CATEGORIES } from "@/data/mentalCards";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface CardsProps { onBack?: () => void; locked?: boolean; }

function getRandomCard() {
  const randomCat = Math.floor(Math.random() * CATEGORIES.length);
  const randomCard = Math.floor(Math.random() * CATEGORIES[randomCat].cardCount);
  return { catIdx: randomCat, cardIdx: randomCard };
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export const CardsScreen = ({ onBack, locked }: CardsProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const initial = getRandomCard();
  const [catIdx, setCatIdx] = useState(initial.catIdx);
  const [cardIdx, setCardIdx] = useState(initial.cardIdx);
  // Un usuario no suscripto tiene 1 carta gratis por día; se resuelve al cargar el perfil.
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("is_subscribed, last_free_card_draw_at")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setIsSubscribed(data.is_subscribed);
        setDailyLimitReached(!data.is_subscribed && !!data.last_free_card_draw_at && isToday(data.last_free_card_draw_at));
      });
  }, [user]);

  const cat = CATEGORIES[catIdx];
  const catName = t(`mentalCards.categories.${cat.id}.name`);
  const catTagline = t(`mentalCards.categories.${cat.id}.tagline`);
  const cardTitle = t(`mentalCards.categories.${cat.id}.cards.${cardIdx}.title`);
  const cardMessage = t(`mentalCards.categories.${cat.id}.cards.${cardIdx}.message`);
  const cardAction = t(`mentalCards.categories.${cat.id}.cards.${cardIdx}.action`);

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
    accent: "bg-gradient-deep text-primary-foreground",
    info: "bg-gradient-info text-info-foreground",
    cyan: "bg-gradient-cyan text-cyan-foreground",
    seafoam: "bg-gradient-seafoam text-seafoam-foreground",
  };

  // Glow por categoría (mismo tono que su gradiente) en vez del glow cian fijo
  const glowColorMap: Record<string, string> = {
    primary: "205 55% 40%",
    destructive: "226 68% 50%",
    accent: "195 48% 58%",
    info: "212 55% 52%",
    cyan: "188 48% 54%",
    seafoam: "173 43% 56%",
  };
  const glow = glowColorMap[cat.accent] ?? "195 48% 58%";
  const cardGlowStyle = { boxShadow: `0 0 45px hsl(${glow} / 0.35), inset 0 0 0 1px hsl(${glow} / 0.3)` };

  const drawCard = () => {
    if (dailyLimitReached) return;
    const next = getRandomCard();
    setCatIdx(next.catIdx);
    setCardIdx(next.cardIdx);
    if (user && !isSubscribed) {
      setDailyLimitReached(true);
      supabase.from("profiles").update({ last_free_card_draw_at: new Date().toISOString() }).eq("id", user.id);
    }
  };

  const onSubscribePress = () => {
    toast(t("cards.subscribeComingSoon"));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gradient-hero pb-28">
      <div className="px-6 pt-3 flex items-center justify-between shrink-0">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center">
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t("cards.eyebrow")}</p>
          <p className="text-sm font-bold">{catName}</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Carta */}
      <div className="relative mt-4 mx-6 flex-1 min-h-0" style={{ perspective: 1400 }}>
        <div className="absolute inset-x-8 top-6 bottom-4 rounded-3xl bg-card shadow-soft opacity-50" />
        <div className="absolute inset-x-4 top-3 bottom-2 rounded-3xl bg-card shadow-card" />
        <motion.div
          className="absolute inset-x-0 top-0 bottom-3 cursor-grab active:cursor-grabbing"
          style={{ transformStyle: "preserve-3d", rotateY }}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
          onClick={handleClick}
        >
          {/* Lado A — título */}
          <div
            className={`absolute inset-0 rounded-3xl p-6 flex flex-col overflow-hidden ${accentMap[cat.accent]}`}
            style={{ backfaceVisibility: "hidden", ...cardGlowStyle }}
          >
            <p className="text-center text-[9px] uppercase tracking-[0.18em] font-bold opacity-80 shrink-0">{catTagline}</p>
            <div className="flex-1 min-h-0 flex items-center justify-center text-center">
              <h2 className="font-serif text-3xl font-semibold leading-tight">{cardTitle}</h2>
            </div>
            <div className="flex items-center justify-center gap-2 opacity-80">
              <RotateCw size={14} />
              <p className="text-[11px] uppercase tracking-widest font-bold">{t("cards.flipHint")}</p>
            </div>
          </div>

          {/* Lado B — mensaje + acción */}
          <div
            className={`absolute inset-0 rounded-3xl p-6 flex flex-col overflow-y-auto no-scrollbar ${accentMap[cat.accent]}`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", ...cardGlowStyle }}
          >
            <p className="text-center text-[9px] uppercase tracking-[0.18em] font-bold opacity-80 shrink-0">{catTagline}</p>
            <div className="flex-1 flex flex-col justify-center">
              <p className="font-serif text-base opacity-90 leading-relaxed">{cardMessage}</p>
            </div>
            <div className="mt-4 pl-4 pr-3 py-3 border-l-4 border-white/50 bg-white/5 rounded-r-xl shrink-0">
              <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">{t("cards.actionLabel")}</p>
              <p className="font-serif mt-1 text-base font-semibold leading-snug">{cardAction}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 mt-4 shrink-0">
        {!locked && dailyLimitReached ? (
          <div className="w-full py-3.5 px-5 rounded-2xl bg-foreground/40 text-background/70 flex flex-col items-center gap-1.5 text-center">
            <Lock size={16} />
            <p className="text-sm font-bold leading-snug">{t("cards.dailyLimitTitle")}</p>
            <button onClick={onSubscribePress} className="text-xs font-bold underline underline-offset-2">
              {t("cards.dailyLimitSubscribe")}
            </button>
          </div>
        ) : (
          <button onClick={locked ? undefined : drawCard} disabled={locked}
            className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-opacity ${
              locked
                ? "bg-foreground/40 text-background/70 cursor-not-allowed"
                : "bg-foreground text-background shadow-card hover:opacity-90"
            }`}>
            {locked ? <Lock size={16} /> : <Shuffle size={16} />}
            {locked ? t("cards.lockedHint") : t("cards.drawCard")}
          </button>
        )}
      </div>

      <BottomNav active="cards" />
    </div>
  );
};
