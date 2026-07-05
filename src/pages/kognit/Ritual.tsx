import { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Props { onExit?: () => void; }

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const STATES = ["Calma", "Motivación", "Estrés", "Ansiedad", "Cansancio", "Frustración"];
const CLOSINGS = [
  "Gracias por escucharte.",
  "Tu estado importa.",
  "Pequeñas pausas generan grandes diferencias.",
  "Volver al cuerpo es volver al presente.",
  "Conectaste. Eso ya es entrenamiento.",
];

const Scale = ({ value, onChange, label }: { value: number | null; onChange: (n: number) => void; label: string }) => (
  <div>
    <p className="text-center text-[10px] uppercase tracking-[0.25em] opacity-70 font-bold">{label}</p>
    <div className="mt-6 flex justify-between gap-2">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} onClick={() => onChange(n)}
          className={`flex-1 aspect-square rounded-2xl text-xl font-bold transition-all ${
            value === n ? "bg-gradient-info text-info-foreground shadow-glow scale-105" : "bg-white/10 backdrop-blur border border-white/15"
          }`}>
          {n}
        </button>
      ))}
    </div>
    <div className="mt-3 flex justify-between text-[10px] opacity-60 font-semibold">
      <span>Bajo</span><span>Alto</span>
    </div>
  </div>
);

export const RitualScreen = ({ onExit }: Props) => {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>(0);
  const [energy, setEnergy] = useState<number | null>(null);
  const [tension, setTension] = useState<number | null>(null);
  const [emo, setEmo] = useState<string | null>(null);
  const [reflection, setReflection] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [intention, setIntention] = useState("");
  const [closing] = useState(() => CLOSINGS[Math.floor(Math.random() * CLOSINGS.length)]);
  const [saved, setSaved] = useState(false);

  const next = () => setStep(s => (s >= 6 ? 6 : ((s + 1) as Step)));

  const finish = async () => {
    if (!user || energy == null || tension == null || !emo) return;
    if (!saved) {
      await supabase.from("ritual_entries").insert({
        user_id: user.id,
        energy, body_tension: tension, emotional_state: emo,
        reflection: reflection.trim() || null,
        gratitude: gratitude.trim() || null,
        intention: intention.trim() || null,
      });
      setSaved(true);
    }
  };

  const progress = ((step + 1) / 7) * 100;

  return (
    <div className="min-h-full bg-gradient-deep text-primary-foreground relative overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-primary-glow/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[280px] h-[280px] rounded-full bg-accent/20 blur-3xl" />

      <div className="relative px-6 pt-3 flex items-center justify-between">
        <button onClick={onExit} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
          <X size={18} />
        </button>
        <span className="text-[10px] font-bold opacity-80 tracking-[0.25em]">RITUAL DIARIO</span>
        <div className="w-10" />
      </div>

      <div className="relative mx-6 mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-primary transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="relative px-6 pt-10">
        {step === 0 && (
          <>
            <h1 className="text-center text-xl font-bold leading-tight">¿Cómo está tu energía?</h1>
            <p className="mt-2 text-center text-xs opacity-70">Un minuto para escucharte.</p>
            <div className="mt-10"><Scale value={energy} onChange={setEnergy} label="Energía 1 a 5" /></div>
          </>
        )}
        {step === 1 && (
          <>
            <h1 className="text-center text-xl font-bold leading-tight">¿Cuánta tensión sentís?</h1>
            <p className="mt-2 text-center text-xs opacity-70">Hombros, mandíbula, pecho.</p>
            <div className="mt-10"><Scale value={tension} onChange={setTension} label="Tensión corporal" /></div>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="text-center text-xl font-bold leading-tight">¿Cómo estás emocionalmente?</h1>
            <p className="mt-2 text-center text-xs opacity-70">Elegí la que más se acerca.</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {STATES.map(s => (
                <button key={s} onClick={() => setEmo(s)}
                  className={`py-4 rounded-2xl text-sm font-bold transition-all ${
                    emo === s ? "bg-gradient-info text-info-foreground shadow-glow" : "bg-white/10 backdrop-blur border border-white/15"
                  }`}>{s}</button>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="text-center text-xl font-bold leading-tight">Reflexión</h1>
            <p className="mt-2 text-center text-xs opacity-70">Opcional. ¿Qué te llevás de hoy?</p>
            <textarea value={reflection} onChange={e => setReflection(e.target.value)} rows={5}
              placeholder="Escribí o saltea este paso."
              className="mt-6 w-full bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4 text-sm placeholder:text-white/40 focus:outline-none resize-none" />
          </>
        )}
        {step === 4 && (
          <>
            <h1 className="text-center text-xl font-bold leading-tight">Gratitud</h1>
            <p className="mt-2 text-center text-xs opacity-70">Opcional. Algo que agradeces hoy.</p>
            <textarea value={gratitude} onChange={e => setGratitude(e.target.value)} rows={4}
              placeholder="Una persona, un momento, un detalle..."
              className="mt-6 w-full bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4 text-sm placeholder:text-white/40 focus:outline-none resize-none" />
          </>
        )}
        {step === 5 && (
          <>
            <h1 className="text-center text-xl font-bold leading-tight">Intención para hoy</h1>
            <p className="mt-2 text-center text-xs opacity-70">Opcional. Algo simple y concreto.</p>
            <textarea value={intention} onChange={e => setIntention(e.target.value)} rows={4}
              placeholder="Hoy elijo..."
              className="mt-6 w-full bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4 text-sm placeholder:text-white/40 focus:outline-none resize-none" />
          </>
        )}
        {step === 6 && (
          <div className="text-center mt-10">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary shadow-glow flex items-center justify-center text-3xl">🌿</div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.3em] opacity-70 font-bold">Ritual completado</p>
            <h1 className="mt-2 text-xl font-bold leading-tight px-2">{closing}</h1>
            <p className="mt-4 text-xs opacity-70 px-4">Guardamos tu registro para que veas tu proceso con el tiempo.</p>
          </div>
        )}

        <div className="mt-10 space-y-2">
          {step < 6 && (
            <button
              onClick={next}
              disabled={(step === 0 && energy == null) || (step === 1 && tension == null) || (step === 2 && !emo)}
              className="w-full bg-primary-foreground text-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-glow disabled:opacity-40">
              Continuar <ChevronRight size={18} />
            </button>
          )}
          {step === 6 && (
            <>
              <button onClick={async () => { await finish(); onExit?.(); }}
                className="w-full bg-primary-foreground text-foreground font-bold py-4 rounded-2xl shadow-glow">
                Finalizar
              </button>
            </>
          )}
          {step >= 3 && step < 6 && (
            <button onClick={next} className="w-full text-xs opacity-70 py-2 font-semibold">Saltar este paso</button>
          )}
        </div>

        {step === 5 && (
          <button onClick={async () => { await finish(); next(); }} className="hidden" />
        )}
      </div>

      {/* auto-save when reaching closing */}
      {step === 6 && !saved && (
        <SaveOnMount onSave={finish} />
      )}
    </div>
  );
};

const SaveOnMount = ({ onSave }: { onSave: () => void }) => {
  // fire-and-forget
  if (typeof window !== "undefined") {
    Promise.resolve().then(onSave);
  }
  return null;
};