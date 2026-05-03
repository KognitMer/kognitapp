import { X, ChevronRight } from "lucide-react";
import { useState } from "react";

const steps = [
  { tag: "Paso 1 · Stop", title: "Frená la próxima mano", body: "No tomes ninguna decisión por 60 segundos. La mano que viene no la jugás.", action: "Pausa activada" },
  { tag: "Paso 2 · Reducir activación", title: "Bajá el pulso", body: "Inhalá 4 · sostené 7 · exhalá 8. Tres ciclos. Tu ventaja es la calma.", action: "Listo, bajé pulso" },
  { tag: "Paso 3 · Resetear foco", title: "Volvé al rango", body: "Abrí tu rango por posición. Mirá las próximas 2 manos solo desde ahí.", action: "Foco recuperado" },
  { tag: "Paso 4 · Decidir", title: "Seguís o cerrás", body: "Si seguís: stop-loss claro. Si dudás: cerrá ahora. No hay punto medio.", action: "Volver al juego" },
];

interface TiltProps { onExit?: () => void; }

export const TiltScreen = ({ onExit }: TiltProps) => {
  const [step, setStep] = useState(0);
  const s = steps[step];
  const next = () => step < steps.length - 1 ? setStep(step + 1) : onExit?.();

  return (
    <div className="min-h-full bg-gradient-deep text-primary-foreground relative overflow-hidden">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-primary-glow/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-primary/30 blur-3xl" />

      <div className="relative px-6 pt-3 flex items-center justify-between">
        <button onClick={onExit} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
          <X size={18} />
        </button>
        <span className="text-xs font-bold opacity-80 tracking-widest">RESET DE TILT · {step + 1}/{steps.length}</span>
        <span className="w-10" />
      </div>

      <div className="relative mt-6 flex justify-center gap-2">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all ${i <= step ? "w-8 bg-primary-glow" : "w-4 bg-white/20"}`} />
        ))}
      </div>

      <div className="relative mt-10 flex justify-center">
        <div className="relative w-52 h-52 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary-glow/20 animate-breathe" />
          <div className="absolute inset-6 rounded-full bg-primary-glow/30 animate-breathe" style={{ animationDelay: "0.3s" }} />
          <div className="absolute inset-12 rounded-full bg-gradient-primary shadow-glow" />
          <span className="relative text-xl font-bold">{step + 1}</span>
        </div>
      </div>

      <div className="relative mt-10 px-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] opacity-70 font-bold">{s.tag}</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight">{s.title}</h1>
        <p className="mt-3 text-sm opacity-85 leading-relaxed">{s.body}</p>
      </div>

      <div className="relative px-6 mt-8">
        <button onClick={next} className="w-full bg-primary-foreground text-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-glow">
          {s.action} <ChevronRight size={18} />
        </button>
        <button onClick={onExit} className="mt-3 w-full text-sm opacity-80 font-medium py-2">Salir del protocolo</button>
      </div>
    </div>
  );
};
