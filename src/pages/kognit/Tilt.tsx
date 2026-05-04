import { useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronRight, Volume2, VolumeX } from "lucide-react";
import mascot from "@/assets/kognit-mascot.png";

interface TiltProps { onExit?: () => void; }

type Mode = "deep" | "fast";
type Stage = "intro" | "breathe" | "grounding" | "exit";
type Phase = "in" | "hold" | "out";

const PATTERNS: Record<Mode, { phases: Phase[]; secs: number[]; label: string; cycles: number }> = {
  deep: { phases: ["in", "hold", "out"], secs: [4, 7, 8], label: "4 · 7 · 8", cycles: 3 },
  fast: { phases: ["in", "out"], secs: [4, 4], label: "4 · 4", cycles: 4 },
};

const PHASE_TEXT: Record<Phase, string> = { in: "Inhalar", hold: "Mantener", out: "Exhalar" };

const GROUNDING_Q = [
  {
    q: "¿Dónde estás sentado ahora?",
    options: ["Casa", "Sala / club", "Oficina", "Otro lugar"],
  },
  {
    q: "¿Qué comiste hoy?",
    options: ["Una comida", "Dos o más", "Solo snacks", "Nada todavía"],
  },
  {
    q: "¿Cuántas fichas / stack tenías al empezar?",
    options: ["Más que ahora", "Igual", "Menos", "No recuerdo"],
  },
  {
    q: "¿Qué hacías antes de esa mano?",
    options: ["Jugando focalizado", "Distraído", "Hablando", "Otro"],
  },
];

const EXIT_INSTRUCTIONS = [
  "Esperá 1 ronda antes de jugar.",
  "Volvé a tu rango por posición.",
  "Es más importante jugar sólido que recuperar.",
  "Una decisión a la vez. La mano anterior no juega esta.",
];

export const TiltScreen = ({ onExit }: TiltProps) => {
  const [stage, setStage] = useState<Stage>("intro");
  const [mode, setMode] = useState<Mode>("deep");
  const [sound, setSound] = useState(false);

  // breathing state
  const [cycle, setCycle] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(1);

  // grounding state
  const groundingQs = useMemo(() => [GROUNDING_Q[Math.floor(Math.random() * GROUNDING_Q.length)], GROUNDING_Q[Math.floor(Math.random() * GROUNDING_Q.length)]], [stage === "grounding"]);
  const [gIdx, setGIdx] = useState(0);

  const exitText = useMemo(() => EXIT_INSTRUCTIONS[Math.floor(Math.random() * EXIT_INSTRUCTIONS.length)], [stage === "exit"]);

  const beep = (freq = 660) => {
    if (!sound) return;
    try {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new Ctx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = freq;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      o.start(); o.stop(ctx.currentTime + 0.2);
    } catch {}
  };

  // Breathing engine
  useEffect(() => {
    if (stage !== "breathe") return;
    const pattern = PATTERNS[mode];
    const secs = pattern.secs[phaseIdx];
    if (count === 1) beep(phaseIdx === 0 ? 740 : phaseIdx === 1 ? 520 : 420);
    if (count >= secs) {
      const t = setTimeout(() => {
        const nextPhase = phaseIdx + 1;
        if (nextPhase >= pattern.phases.length) {
          const nextCycle = cycle + 1;
          if (nextCycle >= pattern.cycles) {
            setStage("grounding");
            setCycle(0); setPhaseIdx(0); setCount(1);
            return;
          }
          setCycle(nextCycle); setPhaseIdx(0); setCount(1);
        } else {
          setPhaseIdx(nextPhase); setCount(1);
        }
      }, 1000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount(c => c + 1), 1000);
    return () => clearTimeout(t);
  }, [stage, count, phaseIdx, cycle, mode]);

  const startBreath = (m: Mode) => {
    setMode(m); setStage("breathe");
    setCycle(0); setPhaseIdx(0); setCount(1);
  };

  const pattern = PATTERNS[mode];
  const phase = pattern.phases[phaseIdx];
  const phaseSecs = pattern.secs[phaseIdx];
  const scale = phase === "in" ? 0.7 + (count / phaseSecs) * 0.55 : phase === "out" ? 1.25 - (count / phaseSecs) * 0.55 : 1.25;

  return (
    <div className="min-h-full bg-gradient-deep text-primary-foreground relative overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-primary-glow/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-primary/30 blur-3xl" />

      {/* Header */}
      <div className="relative px-6 pt-3 flex items-center justify-between">
        <button onClick={onExit} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
          <X size={18} />
        </button>
        <span className="text-[10px] font-bold opacity-80 tracking-[0.25em]">RESET DE TILT</span>
        <button onClick={() => setSound(s => !s)} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
          {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* INTRO — pick mode */}
      {stage === "intro" && (
        <div className="relative px-6 pt-6">
          <div className="flex justify-center">
            <img src={mascot} alt="" className="w-40 h-40 object-contain drop-shadow-[0_8px_30px_rgba(94,234,212,0.35)]" />
          </div>
          <p className="mt-2 text-center text-[10px] uppercase tracking-[0.3em] opacity-70 font-bold">Protocolo</p>
          <h1 className="mt-2 text-center text-3xl font-bold leading-tight">Recuperá el control</h1>
          <p className="mt-3 text-center text-sm opacity-85 px-4">Bajá el pulso. Volvé a decidir desde la cabeza, no desde la mano que perdiste.</p>

          <div className="mt-7 space-y-3">
            <button onClick={() => startBreath("fast")}
              className="w-full bg-gradient-emergency text-destructive-foreground rounded-2xl p-5 shadow-emergency text-left active:scale-[0.98] transition-transform">
              <p className="text-[10px] uppercase tracking-[0.25em] opacity-90 font-bold">Modo rápido</p>
              <p className="text-2xl font-bold mt-0.5">4 · 4</p>
              <p className="text-xs opacity-90 mt-1">Estás en mesa. ~40 segundos.</p>
            </button>
            <button onClick={() => startBreath("deep")}
              className="w-full bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-5 text-left active:scale-[0.98] transition-transform">
              <p className="text-[10px] uppercase tracking-[0.25em] opacity-80 font-bold">Modo profundo</p>
              <p className="text-2xl font-bold mt-0.5">4 · 7 · 8</p>
              <p className="text-xs opacity-80 mt-1">Tenés 90 segundos. Reset completo.</p>
            </button>
          </div>
        </div>
      )}

      {/* BREATHING */}
      {stage === "breathe" && (
        <div className="relative px-6">
          <div className="mt-5 flex justify-center gap-1.5">
            {Array.from({ length: pattern.cycles }).map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i < cycle ? "w-8 bg-primary-glow" : i === cycle ? "w-10 bg-primary-glow/70" : "w-4 bg-white/15"}`} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full bg-primary-glow/15"
                style={{ transform: `scale(${scale})`, transition: `transform 1s ease-in-out` }}
              />
              <div
                className="absolute inset-6 rounded-full bg-primary-glow/25"
                style={{ transform: `scale(${scale})`, transition: `transform 1s ease-in-out` }}
              />
              <div
                className="absolute inset-12 rounded-full bg-gradient-primary shadow-glow"
                style={{ transform: `scale(${scale})`, transition: `transform 1s ease-in-out` }}
              />
              <div className="relative text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-80 font-bold">{PHASE_TEXT[phase]}</p>
                <p className="text-6xl font-bold mt-1">{count}</p>
                <p className="text-[10px] opacity-70 mt-1">de {phaseSecs}</p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-xs opacity-70 font-semibold tracking-widest">PATRÓN {pattern.label} · CICLO {cycle + 1}/{pattern.cycles}</p>

          <div className="mt-6 flex justify-center">
            <button onClick={() => setStage("grounding")} className="text-xs opacity-80 underline-offset-4 underline">
              Saltar al grounding →
            </button>
          </div>
        </div>
      )}

      {/* GROUNDING */}
      {stage === "grounding" && (() => {
        const q = groundingQs[gIdx];
        return (
          <div className="relative px-6 pt-6">
            <p className="text-center text-[10px] uppercase tracking-[0.3em] opacity-70 font-bold">Recuperación de control · {gIdx + 1}/2</p>
            <h2 className="mt-3 text-center text-3xl font-bold leading-tight px-2">{q.q}</h2>
            <p className="mt-3 text-center text-xs opacity-75 px-4">No pienses la respuesta. Tocá la primera que aparezca.</p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {q.options.map(opt => (
                <button key={opt}
                  onClick={() => {
                    if (gIdx < groundingQs.length - 1) setGIdx(gIdx + 1);
                    else setStage("exit");
                  }}
                  className="p-5 rounded-2xl bg-white/10 backdrop-blur border border-white/15 text-sm font-bold text-left active:scale-95 transition-transform">
                  {opt}
                </button>
              ))}
            </div>

            <p className="mt-8 text-center text-[11px] opacity-60 px-6">
              Estás bajando del modo emocional al modo racional.
            </p>
          </div>
        );
      })()}

      {/* EXIT */}
      {stage === "exit" && (
        <div className="relative px-6 pt-8 flex flex-col items-center">
          <img src={mascot} alt="" className="w-32 h-32 object-contain drop-shadow-[0_8px_30px_rgba(94,234,212,0.4)]" />
          <p className="mt-3 text-[10px] uppercase tracking-[0.3em] opacity-70 font-bold">Reset completado</p>
          <h1 className="mt-2 text-3xl font-bold text-center leading-tight">Volvé al juego con cabeza</h1>

          <div className="mt-6 mx-2 p-5 rounded-3xl bg-white/10 backdrop-blur border border-white/15 w-full">
            <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Instrucción</p>
            <p className="mt-2 text-xl font-bold leading-snug">"{exitText}"</p>
          </div>

          <div className="mt-6 w-full space-y-3">
            <button onClick={onExit}
              className="w-full bg-primary-foreground text-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-glow">
              Volver al juego <ChevronRight size={18} />
            </button>
            <button onClick={() => { setStage("intro"); }} className="w-full text-sm opacity-80 font-medium py-2">
              Repetir reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
