import { AlertOctagon, Layers, Activity, ChevronRight, Bell, TrendingUp } from "lucide-react";
import { BottomNav } from "@/components/kognit/BottomNav";
import mascot from "@/assets/kognit-mascot.png";

const states = [
  { key: "focus", label: "Foco", c: "bg-primary text-primary-foreground" },
  { key: "neutral", label: "Neutral", c: "bg-secondary text-foreground" },
  { key: "tense", label: "Tenso", c: "bg-warning/80 text-warning-foreground" },
  { key: "tilt", label: "Tilt", c: "bg-destructive text-destructive-foreground" },
];

interface HomeProps {
  name?: string;
  onTilt?: () => void;
  onCards?: () => void;
  onTrack?: () => void;
}

export const HomeScreen = ({ name = "Jugador", onTilt, onCards, onTrack }: HomeProps) => (
  <div className="min-h-full bg-gradient-hero pb-28">
    <div className="px-6 pt-3 flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Sesión activa</p>
        <h1 className="text-2xl font-bold">{name}</h1>
      </div>
      <button className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center">
        <Bell size={16} />
      </button>
    </div>

    {/* Mascota protagonista */}
    <div className="flex justify-center mt-2 relative">
      <div className="absolute top-6 w-44 h-44 rounded-full bg-primary-glow/25 blur-3xl" />
      <img src={mascot} alt="Kognit" className="relative w-32 h-32 object-contain animate-float-slow" />
    </div>

    <div className="mx-6 mt-2 p-5 rounded-3xl bg-card shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">Estado mental actual</p>
        <span className="text-[10px] text-muted-foreground font-semibold">Toca para fijar</span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {states.map((s, i) => (
          <button key={s.key} className={`py-2.5 rounded-2xl text-xs font-bold transition-all ${i === 0 ? `${s.c} shadow-soft` : "bg-secondary text-muted-foreground"}`}>
            {s.label}
          </button>
        ))}
      </div>
    </div>

    {/* ACCIÓN PRINCIPAL — RESET DE TILT */}
    <div className="mx-6 mt-5 relative">
      <div className="absolute inset-0 rounded-3xl bg-destructive/30 animate-pulse-ring" />
      <button onClick={onTilt}
        className="relative w-full bg-gradient-emergency text-destructive-foreground rounded-3xl p-6 shadow-emergency flex items-center gap-4 active:scale-[0.98] transition-transform">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
          <AlertOctagon size={32} strokeWidth={2.4} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[10px] uppercase tracking-[0.25em] opacity-90 font-bold">PROTOCOLO&nbsp;</p>
          <p className="text-2xl font-bold leading-tight mt-0.5">Reset&nbsp;</p>
          <p className="text-xs opacity-90 mt-0.5">Respirá, recuperá foco y volvé al juego</p>
        </div>
        <ChevronRight size={26} />
      </button>
    </div>

    {/* SECUNDARIAS — máximo 2 */}
    <div className="px-6 mt-5 grid grid-cols-2 gap-3">
      <ToolCard icon={Layers} title="Cartas mentales" subtitle="Instrucción ahora" onClick={onCards} gradient />
      <ToolCard icon={TrendingUp} title="Progreso" subtitle="Foco · control" onClick={onTrack} />
    </div>

    <BottomNav active="home" />
  </div>
);

const ToolCard = ({ icon: Icon, title, subtitle, gradient, onClick }: any) => (
  <button onClick={onClick} className={`p-4 rounded-2xl text-left transition-all active:scale-95 ${gradient ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-card shadow-soft"}`}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${gradient ? "bg-white/20" : "bg-secondary text-primary"}`}>
      <Icon size={18} />
    </div>
    <p className="text-sm font-bold leading-tight">{title}</p>
    <p className={`text-[11px] mt-0.5 ${gradient ? "opacity-90" : "text-muted-foreground"}`}>{subtitle}</p>
  </button>
);
