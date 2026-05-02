import { ArrowRight, Check, Brain, Heart, Target, Zap } from "lucide-react";
import mascot from "@/assets/kognit-mascot.png";

const goals = [
  { icon: Heart, label: "Mantener la calma bajo presión" },
  { icon: Zap, label: "Recuperarme más rápido del tilt" },
  { icon: Target, label: "Afilar mis decisiones" },
  { icon: Brain, label: "Construir resistencia mental" },
];

const triggers = ["Bad beats", "Sesiones largas", "Rivales agresivos", "Downswings"];

export const OnboardingScreen = () => (
  <div className="min-h-full bg-gradient-hero px-6 pt-6 pb-10">
    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
      <span>Paso 2 de 4</span>
      <button className="text-primary">Saltar</button>
    </div>
    <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
      <div className="h-full w-1/2 bg-gradient-primary rounded-full" />
    </div>

    <div className="mt-6 flex justify-center">
      <img src={mascot} alt="Mascota Kognit" className="w-32 h-32 object-contain animate-float-slow" />
    </div>

    <h1 className="mt-2 text-[28px] leading-tight font-bold text-foreground">
      ¿Qué suele <span className="text-gradient">afectar tu juego?</span>
    </h1>
    <p className="mt-2 text-sm text-muted-foreground">Elegí lo que más te saca del foco. Vamos a personalizar tus resets.</p>

    <div className="mt-5 flex flex-wrap gap-2">
      {triggers.map((t, i) => (
        <button
          key={t}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            i < 2 ? "bg-gradient-primary text-primary-foreground border-transparent shadow-soft" : "bg-card text-foreground border-border"
          }`}
        >
          {t}
        </button>
      ))}
    </div>

    <h2 className="mt-7 text-base font-semibold">¿Qué querés mejorar?</h2>
    <div className="mt-3 space-y-2.5">
      {goals.map(({ icon: Icon, label }, i) => (
        <div
          key={label}
          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
            i === 0 ? "bg-card border-primary shadow-soft" : "bg-card/60 border-border"
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${i === 0 ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
            <Icon size={18} />
          </div>
          <span className="flex-1 text-sm font-medium">{label}</span>
          {i === 0 && <Check size={18} className="text-primary" />}
        </div>
      ))}
    </div>

    <button className="mt-7 w-full bg-gradient-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-soft flex items-center justify-center gap-2">
      Continuar <ArrowRight size={18} />
    </button>
  </div>
);
