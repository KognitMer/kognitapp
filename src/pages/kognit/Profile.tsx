import { Settings, Award, Flame, Brain, ChevronRight, Bell, Shield, LogOut, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/kognit/BottomNav";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";

interface ProfileProps {
  name?: string;
  email?: string;
  focusLevel?: number;
  emotionalControl?: number;
  totalResets?: number;
  streakDays?: number;
  xp?: number;
  onSignOut?: () => void;
}

export const ProfileScreen = ({
  name = "Jugador",
  email = "—",
  focusLevel = 72,
  emotionalControl = 64,
  totalResets = 0,
  streakDays = 0,
  xp = 0,
  onSignOut,
}: ProfileProps) => {
  const { user } = useAuth();
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("19:00");
  const [openReminders, setOpenReminders] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("reminder_enabled, reminder_time").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setReminderEnabled(!!data.reminder_enabled);
          setReminderTime(data.reminder_time ?? "19:00");
        }
      });
  }, [user]);

  const saveReminders = async (enabled: boolean, time: string) => {
    setReminderEnabled(enabled); setReminderTime(time);
    if (!user) return;
    await supabase.from("profiles").update({ reminder_enabled: enabled, reminder_time: time }).eq("id", user.id);
  };

  return (
  <div className="min-h-full bg-gradient-hero pb-28">
    <div className="px-6 pt-3 flex items-center justify-between">
      <p className="text-sm font-bold">Perfil</p>
      <button className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"><Settings size={16} /></button>
    </div>

    <div className="mx-6 mt-4 p-5 rounded-3xl bg-gradient-deep text-primary-foreground shadow-card relative overflow-hidden">
      <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-primary-glow/25 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-2xl font-bold shadow-glow">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold">{name}</p>
          <p className="text-xs opacity-80">{email}</p>
          <div className="mt-1.5 inline-flex items-center gap-1 bg-white/15 backdrop-blur px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            <Sparkles size={10} /> KOGNIT PRO
          </div>
        </div>
      </div>
    </div>

    <div className="px-6 mt-4 grid grid-cols-3 gap-3">
      {[
        { icon: Flame, label: "Racha", value: String(streakDays), c: "text-warning" },
        { icon: Brain, label: "Resets", value: String(totalResets), c: "text-primary" },
        { icon: Award, label: "XP", value: String(xp), c: "text-accent" },
      ].map(s => (
        <div key={s.label} className="p-4 rounded-2xl bg-card shadow-soft text-center">
          <s.icon size={18} className={`${s.c} mx-auto`} />
          <p className="text-xl font-bold mt-1.5">{s.value}</p>
          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>

    <div className="mx-6 mt-4 p-5 rounded-3xl bg-card shadow-soft space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">Nivel de foco</p>
          <span className="text-xs font-bold text-primary">{focusLevel}%</span>
        </div>
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${focusLevel}%` }} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">Control emocional</p>
          <span className="text-xs font-bold text-accent">{emotionalControl}%</span>
        </div>
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full" style={{ width: `${emotionalControl}%` }} />
        </div>
      </div>
    </div>

    <div className="px-6 mt-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">Logros</h3>
        <button className="text-xs font-semibold text-primary">Todos</button>
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
        {[
          { e: "🛡", t: "A prueba de tilt", s: "5 resets seguidos" },
          { e: "🌊", t: "Estado de flow", s: "3 hs de foco" },
          { e: "♠", t: "Cabeza fría", s: "Sobreviviste un downswing" },
        ].map(a => (
          <div key={a.t} className="min-w-[140px] p-4 rounded-2xl bg-card shadow-soft text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-soft flex items-center justify-center text-2xl">{a.e}</div>
            <p className="mt-2 text-sm font-bold">{a.t}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{a.s}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="mx-6 mt-5 rounded-3xl bg-card shadow-soft overflow-hidden">
      <div className="p-4 border-b border-border">
        <button onClick={() => setOpenReminders(o => !o)} className="w-full flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary"><Bell size={16} /></div>
          <span className="flex-1 text-sm font-semibold text-left">Recordatorio diario</span>
          <span className="text-xs text-muted-foreground">{reminderEnabled ? reminderTime : "Apagado"}</span>
          <ChevronRight size={16} className={`text-muted-foreground transition-transform ${openReminders ? "rotate-90" : ""}`} />
        </button>
        {openReminders && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Activar recordatorio</p>
                <p className="text-[11px] text-muted-foreground">Un mensaje suave para escucharte.</p>
              </div>
              <Switch checked={reminderEnabled} onCheckedChange={(v) => saveReminders(v, reminderTime)} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Horario</p>
              <input type="time" value={reminderTime}
                onChange={(e) => saveReminders(reminderEnabled, e.target.value)}
                className="bg-secondary px-3 py-1.5 rounded-lg text-sm font-semibold focus:outline-none" />
            </div>
            <p className="text-[11px] text-muted-foreground italic">"Antes de jugar, escuchate. Tu rendimiento empieza por tu estado mental."</p>
          </div>
        )}
      </div>
      {[
        { i: Shield, l: "Privacidad", v: "Solo local" },
        { i: Settings, l: "Preferencias", v: "" },
        { i: LogOut, l: "Cerrar sesión", v: "", danger: true, onClick: onSignOut },
      ].map((r: any, i, arr) => (
        <button key={r.l} onClick={r.onClick}
          className={`w-full flex items-center gap-3 p-4 ${i !== arr.length - 1 ? "border-b border-border" : ""} ${r.danger ? "text-destructive" : ""}`}>
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary"><r.i size={16} /></div>
          <span className="flex-1 text-sm font-semibold text-left">{r.l}</span>
          {r.v && <span className="text-xs text-muted-foreground">{r.v}</span>}
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
      ))}
    </div>

    <BottomNav active="profile" />
  </div>
  );
};
