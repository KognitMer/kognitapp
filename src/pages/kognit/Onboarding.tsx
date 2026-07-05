import { useState } from "react";
import { ArrowRight, Check, Brain, Heart, Target, Zap } from "lucide-react";
import mascot from "@/assets/kognit-mascot.png";
import mascotAngry from "@/assets/mascot-angry.png";
import mascotFear from "@/assets/mascot-fear.png";
import mascotOverthinking from "@/assets/mascot-overthinking.png";
import mascotOverwhelmed from "@/assets/mascot-overwhelmed.png";
import mascotFrustrated from "@/assets/mascot-frustrated.png";

const GOALS = [
  { id: "calm", icon: Heart, label: "Mantener la calma bajo presión" },
  { id: "recover", icon: Zap, label: "Recuperarme más rápido\u00a0" },
  { id: "decide", icon: Target, label: "Afilar mis decisiones" },
  { id: "resilience", icon: Brain, label: "Construir resistencia mental" },
];

const EMOTIONS = [
  { id: "frustration", name: "Frustración", face: mascotFrustrated, description: "Cuando las cosas no salen como esperaba" },
  { id: "fear", name: "Miedo", face: mascotFear, description: "Ante decisiones o pérdidas potenciales" },
  { id: "overthinking", name: "Análisis excesivo", face: mascotOverthinking, description: "Cuando no puedo dejar de pensar" },
  { id: "tilt", name: "Tilt / Rabia", face: mascotAngry, description: "Pérdida de control emocional rápida" },
  { id: "unmotivated", name: "Desmotivación", face: mascotFrustrated, description: "Falta de energía o propósito" },
  { id: "overwhelm", name: "Abrumación", face: mascotOverwhelmed, description: "Todo se siente demasiado" },
] as const;

export const OnboardingScreen = () => {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [step, setStep] = useState<"form" | "welcome">("form");

  const toggleEmotion = (id: string) => {
    setSelectedEmotions(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  if (step === "welcome") {
    return (
      <div className="min-h-full bg-gradient-hero px-6 flex flex-col items-center justify-center text-center">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-breathe" />
          <div className="absolute inset-6 rounded-full bg-primary/10" />
          <img src={mascot} alt="" aria-hidden="true" className="relative w-24 h-24 object-contain animate-breathe" />
        </div>
        <h1 className="mt-10 text-[26px] leading-tight font-bold text-foreground">
          Bienvenido/a a la <span className="text-gradient">introspección</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-[280px]">
          Ya personalizamos kognit con lo que sentís y lo que querés lograr.
        </p>
      </div>
    );
  }

  return (
  <div className="min-h-full bg-gradient-hero px-6 pt-6 pb-10">
    <div className="flex justify-center">
      <img src={mascot} alt="Mascota kognit" className="w-32 h-32 object-contain animate-float-slow" />
    </div>

    <h1 className="mt-2 text-[26px] leading-tight font-bold text-foreground">
      ¿Qué suele <span className="text-gradient">sacarte del foco?</span>
    </h1>
    <p className="mt-2 text-sm text-muted-foreground">Podés elegir varias. Nos ayuda a personalizar tus resets.</p>

    <div className="mt-5 grid grid-cols-2 gap-3">
      {EMOTIONS.map(emotion => {
        const selected = selectedEmotions.includes(emotion.id);
        return (
          <button
            key={emotion.id}
            onClick={() => toggleEmotion(emotion.id)}
            aria-pressed={selected}
            className={`relative flex flex-col items-center text-center gap-1 p-4 rounded-2xl border transition-all active:scale-95 ${
              selected ? "bg-info/10 border-info shadow-glow" : "bg-card border-border"
            }`}
          >
            {selected && (
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-info text-info-foreground flex items-center justify-center animate-in zoom-in duration-200">
                <Check size={14} strokeWidth={3} />
              </span>
            )}
            <img
              src={emotion.face}
              alt=""
              aria-hidden="true"
              className="w-14 h-14 object-contain"
            />
            <span className="text-sm font-bold leading-tight">{emotion.name}</span>
            <span className="text-[11px] text-muted-foreground leading-snug">{emotion.description}</span>
          </button>
        );
      })}
    </div>

    <h2 className="mt-7 text-sm font-semibold">¿Qué querés mejorar?</h2>
    <div className="mt-3 space-y-2.5">
      {GOALS.map(({ id, icon: Icon, label }) => {
        const selected = selectedGoals.includes(id);
        return (
          <button
            key={id}
            onClick={() => toggleGoal(id)}
            aria-pressed={selected}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all active:scale-95 ${
              selected ? "bg-card border-info shadow-soft" : "bg-card/60 border-border"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? "bg-gradient-info text-info-foreground" : "bg-secondary text-primary"}`}>
              <Icon size={18} />
            </div>
            <span className="flex-1 text-sm font-medium text-left">{label}</span>
            {selected && <Check size={18} className="text-info" />}
          </button>
        );
      })}
    </div>

    <button
      disabled={selectedEmotions.length === 0 || selectedGoals.length === 0}
      onClick={() => setStep("welcome")}
      className="mt-7 w-full bg-gradient-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-soft flex items-center justify-center gap-2 disabled:opacity-40">
      Continuar <ArrowRight size={18} />
    </button>
  </div>
  );
};
