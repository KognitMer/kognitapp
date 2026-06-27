import { useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronRight, Volume2, VolumeX, Plus } from "lucide-react";
import mascot from "@/assets/kognit-mascot.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { playBong } from "@/lib/sound";


interface TiltProps { onExit?: () => void; }

type Mode = "deep" | "fast";
type Stage = "intro" | "pulse" | "breathe" | "grounding" | "state" | "check" | "exit";
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

const STATE_OPTIONS = [
  "Frustración", "Ansiedad", "Impaciencia", "Fatiga", "Exceso de confianza", "Distracción", "Miedo",
];

const STATE_MESSAGES: Record<string, string[]> = {
  Frustración: ["Una mano no define tu sesión.", "Volvé a la decisión, no al resultado."],
  Ansiedad: ["Respirá. Observá. Continuá.", "No necesitás recuperar nada ahora."],
  Impaciencia: ["Tu próximo paso es lo único que importa.", "Esperá una ronda antes de volver al ritmo."],
  Fatiga: ["Si el cuerpo pide pausa, escuchalo.", "Jugar sólido pesa más que jugar mucho."],
  "Exceso de confianza": ["Volvé a tu rango por posición.", "El proceso es más confiable que la racha."],
  Distracción: ["Una decisión a la vez.", "Cerrá lo que no es la mesa."],
  Miedo: ["Decidí desde el plan, no desde el miedo.", "El resultado no juega esta mano: tu lectura sí."],
};

export const TiltScreen = ({ onExit }: TiltProps) => {
  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>("intro");
  const [mode, setMode] = useState<Mode>("deep");
  const [sound, setSound] = useState(false);

  // breathing state
  const [cycle, setCycle] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(1);
  const [extraCycles, setExtraCycles] = useState(0);

  // grounding state
  const groundingQs = useMemo(() => [GROUNDING_Q[Math.floor(Math.random() * GROUNDING_Q.length)], GROUNDING_Q[Math.floor(Math.random() * GROUNDING_Q.length)]], [stage === "grounding"]);
  const [gIdx, setGIdx] = useState(0);

  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState("");
  const [preIntensity, setPreIntensity] = useState(6);
  const [postIntensity, setPostIntensity] = useState(4);
  const sessionSavedRef = useRef(false);

  const primaryState = selectedStates[0] ?? null;
  const exitText = useMemo(() => {
    const pool = primaryState ? STATE_MESSAGES[primaryState] : ["Volvé al juego con cabeza."];
    return pool[Math.floor(Math.random() * pool.length)];
  }, [primaryState, stage === "exit"]);

  const toggleState = (s: string) => {
    setSelectedStates(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const confirmStates = () => {
    if (selectedStates.length === 0) return;
    setStage("check");
  };

  const finishReset = async () => {
    if (user && !sessionSavedRef.current) {
      sessionSavedRef.current = true;
      await supabase.from("reset_sessions").insert({
        user_id: user.id,
        state: primaryState,
        states: selectedStates,
        mode,
        pre_intensity: preIntensity,
        post_intensity: postIntensity,
        note: customNote.trim() || null,
      });
    }
    setStage("exit");
  };

  const vibrate = (ms: number | number[]) => {
    try { (navigator as any).vibrate?.(ms); } catch {}
  };

  const beep = (freq = 660) => {
    if (!sound) return;
    playBong(freq);
  };


  // Breathing engine
  useEffect(() => {
    if (stage !== "breathe") return;
    const pattern = PATTERNS[mode];
    const secs = pattern.secs[phaseIdx];
    if (count === 1) {
      beep(phaseIdx === 0 ? 740 : phaseIdx === 1 ? 520 : 420);
      vibrate(phaseIdx === 1 ? 25 : 60);
    }
    if (count >= secs) {
      const t = setTimeout(() => {
        const nextPhase = phaseIdx + 1;
        if (nextPhase >= pattern.phases.length) {
          const nextCycle = cycle + 1;
          if (nextCycle >= pattern.cycles + extraCycles) {
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
  }, [stage, count, phaseIdx, cycle, mode, extraCycles]);

  const startBreath = (m: Mode) => {
    setMode(m);
    setStage("pulse");
    setCycle(0); setPhaseIdx(0); setCount(1);
    setExtraCycles(0);
    sessionSavedRef.current = false;
  };

  const pattern = PATTERNS[mode];
  const phase = pattern.phases[phaseIdx];
  const phaseSecs = pattern.secs[phaseIdx];
  const scale = phase === "in" ? 0.7 + (count / phaseSecs) * 0.55 : phase === "out" ? 1.25 - (count / phaseSecs) * 0.55 : 1.25;
  const totalCycles = pattern.cycles + extraCycles;
  const delta = preIntensity - postIntensity;

  return (
    <div className="min-h-full bg-gradient-deep text-primary-foreground relative overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-primary-glow/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-primary/30 blur-3xl" />

      {/* Header */}
      <div className="relative px-6 pt-3 flex items-center justify-between">
        <button onClick={onExit} aria-label="Salir del reset" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
          <X size={18} />
        </button>
        <span className="text-[10px] font-bold opacity-80 tracking-[0.25em]">RESET MENTAL</span>
        <button onClick={() => setSound(s => !s)} aria-label={sound ? "Silenciar sonido" : "Activar sonido"} aria-pressed={sound} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
          {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* INTRO — pick mode */}
      {stage === "intro" && (
        <div className="relative px-6 pt-6">
          <div className="flex justify-center">
          <img src={mascot} alt="" aria-hidden="true" className="w-40 h-40 object-contain drop-shadow-[0_8px_30px_rgba(94,234,212,0.35)]" />
          </div>
          <p className="mt-2 text-center text-[10px] uppercase tracking-[0.3em] opacity-70 font-bold">Protocolo</p>
          <h1 className="mt-2 text-center text-2xl font-bold leading-tight">Conectá con vos</h1>
          <p className="mt-3 text-center text-sm opacity-85 px-4 whitespace-pre-line">Bajá el pulso.{"\n"}Volvé a decidir desde el equilibrio interno</p>

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
            {Array.from({ length: totalCycles }).map((_, i) => (
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

          <p className="mt-8 text-center text-xs opacity-70 font-semibold tracking-widest">PATRÓN {pattern.label} · CICLO {cycle + 1}/{totalCycles}</p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              onClick={() => setExtraCycles(n => n + 1)}
              aria-label="Extender un ciclo más"
              className="inline-flex items-center gap-1.5 text-xs opacity-90 bg-white/10 backdrop-blur border border-white/15 rounded-full px-3 py-1.5">
              <Plus size={12} /> Un ciclo más
            </button>
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
            <h2 className="mt-3 text-center text-2xl font-bold leading-tight px-2">{q.q}</h2>
            <p className="mt-3 text-center text-xs opacity-75 px-4">No pienses mucho la respuesta. Tocá la primera que te parezca.</p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {q.options.map(opt => (
                <button key={opt}
                  onClick={() => {
                    if (gIdx < groundingQs.length - 1) setGIdx(gIdx + 1);
                    else setStage("state");
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

      {/* STATE — pick what you're feeling */}
      {stage === "state" && (
        <div className="relative px-6 pt-6">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] opacity-70 font-bold">Estado actual</p>
          <h2 className="mt-2 text-center text-xl font-bold leading-tight px-4">¿Qué sentís ahora mismo?</h2>
          <p className="mt-2 text-center text-xs opacity-75 px-6">Nombrarlo ya es regularlo. Podés marcar varios.</p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            {STATE_OPTIONS.map(s => {
              const active = selectedStates.includes(s);
              return (
                <button key={s} onClick={() => toggleState(s)} aria-pressed={active}
                  className={`p-4 rounded-2xl border text-sm font-bold active:scale-95 transition-all ${
                    active ? "bg-primary-glow/30 border-primary-glow shadow-glow" : "bg-white/10 backdrop-blur border-white/15"
                  }`}>
                  {s}
                </button>
              );
            })}
          </div>

          <textarea
            value={customNote}
            onChange={e => setCustomNote(e.target.value)}
            placeholder="Otra cosa que quieras anotar (opcional)"
            rows={2}
            maxLength={200}
            className="mt-4 w-full bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-3 text-sm placeholder:text-white/50 focus:outline-none resize-none"
          />

          <button
            onClick={confirmStates}
            disabled={selectedStates.length === 0}
            className="mt-4 w-full bg-primary-foreground text-foreground font-bold py-3.5 rounded-2xl disabled:opacity-40">
            Continuar
          </button>
        </div>
      )}

      {/* PULSE — pre intensity */}
      {stage === "pulse" && (
        <div className="relative px-6 pt-8">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] opacity-70 font-bold">Pulso actual</p>
          <h2 className="mt-2 text-center text-xl font-bold leading-tight px-4">¿Qué tan acelerado estás?</h2>
          <p className="mt-2 text-center text-xs opacity-75 px-6">Sé honesto. Vamos a comparar al final.</p>

          <div className="mt-10 text-center">
            <p className="text-7xl font-bold leading-none">{preIntensity}</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest opacity-70 font-bold">de 10</p>
          </div>

          <input
            type="range" min={1} max={10} value={preIntensity}
            onChange={e => setPreIntensity(parseInt(e.target.value, 10))}
            aria-label="Nivel de pulso actual"
            className="mt-8 w-full accent-primary-glow"
          />
          <div className="mt-1 flex justify-between text-[10px] opacity-60 font-semibold">
            <span>Tranquilo</span><span>Desbordado</span>
          </div>

          <button
            onClick={() => setStage("breathe")}
            className="mt-8 w-full bg-primary-foreground text-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-glow">
            Empezar respiración <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* CHECK — post intensity */}
      {stage === "check" && (
        <div className="relative px-6 pt-8">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] opacity-70 font-bold">Después del reset</p>
          <h2 className="mt-2 text-center text-xl font-bold leading-tight px-4">¿Cómo estás ahora?</h2>
          <p className="mt-2 text-center text-xs opacity-75 px-6">No tiene que ser cero. Solo más estable que al empezar.</p>

          <div className="mt-8 text-center">
            <p className="text-7xl font-bold leading-none">{postIntensity}</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest opacity-70 font-bold">de 10</p>
          </div>

          <input
            type="range" min={1} max={10} value={postIntensity}
            onChange={e => setPostIntensity(parseInt(e.target.value, 10))}
            aria-label="Nivel de pulso después del reset"
            className="mt-6 w-full accent-primary-glow"
          />
          <div className="mt-1 flex justify-between text-[10px] opacity-60 font-semibold">
            <span>Tranquilo</span><span>Desbordado</span>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/15 text-center">
            <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Cambio</p>
            <p className="mt-1 text-2xl font-bold">
              {delta > 0 ? `−${delta}` : delta < 0 ? `+${Math.abs(delta)}` : "0"} puntos
            </p>
            <p className="text-[11px] opacity-75 mt-0.5">
              {delta >= 3 ? "Reset sólido. Buen trabajo." : delta > 0 ? "Bajaste el pulso. Sigue." : "A veces solo nombrarlo alcanza."}
            </p>
          </div>

          <button onClick={finishReset}
            className="mt-6 w-full bg-primary-foreground text-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-glow">
            Cerrar reset <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* EXIT */}
      {stage === "exit" && (
        <div className="relative px-6 pt-8 flex flex-col items-center">
          <img src={mascot} alt="" aria-hidden="true" className="w-32 h-32 object-contain drop-shadow-[0_8px_30px_rgba(94,234,212,0.4)]" />
          <p className="mt-3 text-[10px] uppercase tracking-[0.3em] opacity-70 font-bold">Reset completado</p>
          <h2 className="mt-2 text-2xl font-bold text-center leading-tight">Volvé al juego con cabeza</h2>

          <div className="mt-6 mx-2 p-5 rounded-3xl bg-white/10 backdrop-blur border border-white/15 w-full">
            <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Instrucción</p>
            <p className="mt-2 text-lg font-bold leading-snug">"{exitText}"</p>
            {selectedStates.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {selectedStates.map(s => (
                  <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15">{s}</span>
                ))}
              </div>
            )}
            <div className="mt-3 flex justify-between text-[10px] opacity-70 font-semibold">
              <span>Antes: {preIntensity}/10</span>
              <span>Ahora: {postIntensity}/10</span>
            </div>
          </div>

          <div className="mt-6 w-full space-y-3">
            <button onClick={onExit}
              className="w-full bg-primary-foreground text-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-glow">
              Volver al juego <ChevronRight size={18} />
            </button>
            <button onClick={() => {
              setStage("intro");
              setSelectedStates([]); setCustomNote(""); setExtraCycles(0);
              sessionSavedRef.current = false;
            }} className="w-full text-sm opacity-80 font-medium py-2">
              Repetir reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
