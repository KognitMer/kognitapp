import { ChevronLeft, ChevronRight, Plus, Sparkles, Lock, Users } from "lucide-react";
import { BottomNav } from "@/components/kognit/BottomNav";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { NoteComposer } from "@/components/kognit/NoteComposer";

const days = ["L", "M", "M", "J", "V", "S", "D"];
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const moodByDay: Record<number, { c: string; e: string }> = {
  3: { c: "bg-accent/40", e: "🧘" },
  5: { c: "bg-primary/30", e: "🎯" },
  8: { c: "bg-destructive/30", e: "🔥" },
  12: { c: "bg-primary/30", e: "🎯" },
  14: { c: "bg-warning/40", e: "😤" },
  17: { c: "bg-accent/40", e: "🧘" },
  18: { c: "bg-primary/40", e: "🎯" },
};

const fallbackNotes = [
  {
    time: "20:30",
    mood: "🎯",
    title: "Sesión NL50 — 2 horas",
    body: "Buen control en spots difíciles. Foldeé un set en river leído, no me sacó del eje el resultado.",
    tag: "Foco",
    color: "text-primary",
  },
  {
    time: "15:10",
    mood: "🔥",
    title: "Recuperación post bad beat",
    body: "Set vs runner-runner flush. Hice respiración 4-7-8 y volví limpio en 6 minutos.",
    tag: "Reset",
    color: "text-destructive",
  },
  {
    time: "09:00",
    mood: "✨",
    title: "Ritual pre-sesión",
    body: "Visualicé 3 manos clave de ayer. Definí stop-loss: 3 buy-ins.",
    tag: "Ritual",
    color: "text-accent",
  },
];

interface Row {
  id: string;
  content: string;
  title: string | null;
  mood: string | null;
  visibility: string;
  created_at: string;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const CalendarScreen = () => {
  const { user } = useAuth();
  const [composerOpen, setComposerOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [loaded, setLoaded] = useState(false);
  const today = new Date();
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Lunes = 0 ... Domingo = 6
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const monthDays = Array.from({ length: totalCells }, (_, i) => i - firstDay + 1);
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const goPrev = () => setCursor(new Date(year, month - 1, 1));
  const goNext = () => setCursor(new Date(year, month + 1, 1));

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notes")
      .select("id, content, title, mood, visibility, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setRows(data ?? []);
    setLoaded(true);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  return (
  <div className="min-h-full bg-gradient-hero pb-28">
    {/* Header */}
    <div className="px-6 pt-3 flex items-center justify-between">
      <button onClick={goPrev} aria-label="Mes anterior" className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center">
        <ChevronLeft size={18} />
      </button>
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Diario mental</p>
        <p className="text-sm font-bold">{MONTH_NAMES[month]} {year}</p>
      </div>
      <button onClick={goNext} aria-label="Mes siguiente" className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center">
        <ChevronRight size={18} />
      </button>
    </div>

    {/* Resumen */}
    <div className="mx-6 mt-4 p-4 rounded-3xl bg-gradient-deep text-primary-foreground shadow-card relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-primary-glow/25 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs opacity-70 uppercase tracking-widest font-semibold">Este mes</p>
          <p className="text-xl font-bold mt-0.5">14 días enfocado</p>
          <p className="text-[11px] opacity-80 mt-0.5">3 resets · 9 sesiones registradas</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
          <Sparkles size={20} />
        </div>
      </div>
    </div>

    {/* Calendario */}
    <div className="mx-6 mt-4 p-4 rounded-3xl bg-card shadow-card">
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((d, i) => (
          <span key={i} className="text-[10px] font-bold text-muted-foreground py-1">{d}</span>
        ))}
        {monthDays.map((n, i) => {
          if (n < 1 || n > daysInMonth) return <span key={i} />;
          const isToday = isCurrentMonth && n === todayDate;
          const mood = moodByDay[n];
          return (
            <button
              key={i}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all ${
                isToday
                  ? "bg-gradient-primary text-primary-foreground shadow-soft"
                  : mood
                  ? `${mood.c} text-foreground`
                  : "hover:bg-secondary text-foreground"
              }`}
            >
              <span>{n}</span>
              {mood && !isToday && <span className="text-[9px] leading-none mt-0.5">{mood.e}</span>}
              {isToday && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground font-medium pt-3 border-t border-border">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" />Foco</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" />Calma</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" />Tenso</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" />Tilt</span>
      </div>
    </div>

    {/* Día seleccionado */}
    <div className="px-6 mt-5 flex items-end justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Día seleccionado</p>
        <h3 className="text-base font-bold">Miércoles 18</h3>
      </div>
      <button onClick={() => setComposerOpen(true)} className="flex items-center gap-1.5 bg-gradient-primary text-primary-foreground text-xs font-bold px-3.5 py-2 rounded-full shadow-soft">
        <Plus size={14} /> Nueva nota
      </button>
    </div>

    {/* Notas */}
    <div className="px-6 mt-3 space-y-3">
      {loaded && rows.length === 0 && fallbackNotes.map((n, i) => (
        <div key={i} className="p-4 rounded-2xl bg-card shadow-soft opacity-70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-lg">{n.mood}</div>
              <div>
                <p className="text-[10px] text-muted-foreground font-semibold">{n.time} · ejemplo</p>
                <p className="text-sm font-bold leading-tight">{n.title}</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${n.color}`}>{n.tag}</span>
          </div>
          <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">{n.body}</p>
        </div>
      ))}
      {rows.map(n => (
        <div key={n.id} className="p-4 rounded-2xl bg-card shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-lg">{n.mood ?? "📝"}</div>
              <div>
                <p className="text-[10px] text-muted-foreground font-semibold">{formatTime(n.created_at)}</p>
                <p className="text-sm font-bold leading-tight">{n.title ?? "Nota"}</p>
              </div>
            </div>
            <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${n.visibility === "public" ? "text-primary" : "text-muted-foreground"}`}>
              {n.visibility === "public" ? <Users size={11} /> : <Lock size={11} />}
              {n.visibility === "public" ? "Pública" : "Privada"}
            </span>
          </div>
          <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{n.content}</p>
        </div>
      ))}
    </div>

    {/* Input rápido */}
    <div className="mx-6 mt-4 p-4 rounded-2xl bg-card shadow-soft border border-dashed border-border">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Agregar nota rápida</p>
      <p className="mt-1.5 text-sm text-muted-foreground italic">¿Qué pasó por tu cabeza hoy?</p>
      <div className="mt-3 flex items-center gap-2">
        {["🧘","🎯","😐","😤","🔥"].map(e => (
          <button key={e} className="w-8 h-8 rounded-xl bg-secondary text-base flex items-center justify-center hover:scale-110 transition-transform">{e}</button>
        ))}
        <button onClick={() => setComposerOpen(true)} className="ml-auto w-9 h-9 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-soft">
          <Plus size={16} />
        </button>
      </div>
    </div>

    <NoteComposer open={composerOpen} onClose={() => setComposerOpen(false)} onSaved={load} />
    <BottomNav active="calendar" />
  </div>
  );
};
