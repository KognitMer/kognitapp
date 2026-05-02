import { X, ChevronRight } from "lucide-react";

const steps = ["Pausá", "Respirá", "Tenés el control", "Soltá"];

export const TiltScreen = () => (
  <div className="min-h-full bg-gradient-deep text-primary-foreground relative overflow-hidden">
    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-primary-glow/20 blur-3xl" />
    <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-primary/30 blur-3xl" />

    <div className="relative px-6 pt-3 flex items-center justify-between">
      <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
        <X size={18} />
      </button>
      <span className="text-xs font-semibold opacity-80 tracking-widest">RESET DE TILT • 2 / 4</span>
      <span className="w-10" />
    </div>

    <div className="relative mt-6 flex justify-center gap-2">
      {steps.map((_, i) => (
        <div key={i} className={`h-1 rounded-full transition-all ${i <= 1 ? "w-8 bg-primary-glow" : "w-4 bg-white/20"}`} />
      ))}
    </div>

    <div className="relative mt-12 flex justify-center">
      <div className="relative w-56 h-56 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary-glow/20 animate-breathe" />
        <div className="absolute inset-6 rounded-full bg-primary-glow/30 animate-breathe" style={{ animationDelay: "0.3s" }} />
        <div className="absolute inset-12 rounded-full bg-gradient-primary shadow-glow" />
        <span className="relative text-2xl font-bold">Respirá</span>
      </div>
    </div>

    <div className="relative mt-12 px-8 text-center">
      <p className="text-xs uppercase tracking-[0.3em] opacity-70 font-semibold">Paso 2</p>
      <h1 className="mt-3 text-4xl font-bold leading-tight">Tomá aire</h1>
      <p className="mt-3 text-sm opacity-80 leading-relaxed">
        Inhalá 4. Sostené 7. Exhalá 8.<br />
        La mano terminó. Tu ventaja es tu calma.
      </p>
    </div>

    <div className="relative px-6 mt-10">
      <button className="w-full bg-primary-foreground text-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-glow">
        Estoy en eje <ChevronRight size={18} />
      </button>
      <button className="mt-3 w-full text-sm opacity-80 font-medium py-2">Necesito un minuto más</button>
    </div>
  </div>
);
