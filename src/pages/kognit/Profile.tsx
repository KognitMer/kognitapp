import { Settings, Award, Flame, Brain, ChevronRight, Bell, Shield, LogOut, Sparkles, Volume2, UserRound, Trash2, X, Moon, Vibrate } from "lucide-react";
import { BottomNav } from "@/components/kognit/BottomNav";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { playBong } from "@/lib/sound";
import { toast } from "@/components/ui/sonner";
import { getDarkMode, setDarkMode, getSoundEnabled, setSoundEnabled, getVibrationEnabled, setVibrationEnabled } from "@/lib/preferences";

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
  name = "Usuario",
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
  const [soundFeedback, setSoundFeedback] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState(name);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [editName, setEditName] = useState(name);
  const [savingName, setSavingName] = useState(false);

  const [openPrivacy, setOpenPrivacy] = useState(false);

  const [openPreferences, setOpenPreferences] = useState(false);
  const [darkMode, setDarkModeState] = useState(getDarkMode);
  const [soundPref, setSoundPref] = useState(getSoundEnabled);
  const [vibrationPref, setVibrationPref] = useState(getVibrationEnabled);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { setDisplayName(name); setEditName(name); }, [name]);

  const playTestSound = () => {
    playBong();
    setSoundFeedback("Sonando...");
    window.setTimeout(() => setSoundFeedback(null), 1800);
  };

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

  const saveName = async () => {
    if (!user || !editName.trim()) return;
    setSavingName(true);
    const { error } = await supabase.from("profiles").update({ display_name: editName.trim() }).eq("id", user.id);
    setSavingName(false);
    if (error) {
      toast.error("No se pudo guardar el nombre");
      return;
    }
    setDisplayName(editName.trim());
    toast.success("Nombre actualizado");
    setOpenEditProfile(false);
  };

  const toggleDarkMode = (v: boolean) => {
    setDarkModeState(v);
    setDarkMode(v);
  };
  const toggleSoundPref = (v: boolean) => {
    setSoundPref(v);
    setSoundEnabled(v);
  };
  const toggleVibrationPref = (v: boolean) => {
    setVibrationPref(v);
    setVibrationEnabled(v);
  };

  const deleteAccount = async () => {
    if (!user || deleteConfirmText !== "ELIMINAR") return;
    setDeleting(true);
    try {
      const { data: files } = await supabase.storage.from("note-images").list(user.id);
      if (files?.length) {
        await supabase.storage.from("note-images").remove(files.map(f => `${user.id}/${f.name}`));
      }
      await Promise.all([
        supabase.from("notes").delete().eq("user_id", user.id),
        supabase.from("note_reactions").delete().eq("user_id", user.id),
        supabase.from("reset_sessions").delete().eq("user_id", user.id),
        supabase.from("ritual_entries").delete().eq("user_id", user.id),
        supabase.from("messages").delete().eq("sender_id", user.id),
        supabase.from("messages").delete().eq("recipient_id", user.id),
        supabase.from("profiles").delete().eq("id", user.id),
      ]);
      toast.success("Tu cuenta y tus datos fueron eliminados");
    } catch {
      toast.error("Hubo un problema, pero vamos a cerrar tu sesión igual");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setDeleteConfirmText("");
      onSignOut?.();
    }
  };

  return (
  <div className="min-h-full bg-gradient-hero pb-28 relative">
    <div className="px-6 pt-3 flex items-center justify-between">
      <p className="text-sm font-bold">Perfil</p>
      <button onClick={() => setOpenPreferences(o => !o)} className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"><Settings size={16} /></button>
    </div>

    <div className="mx-6 mt-4 p-5 rounded-3xl bg-gradient-deep text-primary-foreground shadow-card relative overflow-hidden">
      <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-primary-glow/25 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-2xl font-bold shadow-glow">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-base font-bold">{displayName}</p>
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
          <p className="text-lg font-bold mt-1.5">{s.value}</p>
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
        <h3 className="text-xs font-bold">Logros</h3>
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
            <p className="mt-2 text-xs font-bold">{a.t}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{a.s}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="mx-6 mt-5 rounded-3xl bg-card shadow-soft overflow-hidden">
      {/* Editar perfil */}
      <div className="p-4 border-b border-border">
        <button onClick={() => setOpenEditProfile(o => !o)} className="w-full flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary"><UserRound size={16} /></div>
          <span className="flex-1 text-sm font-semibold text-left">Editar perfil</span>
          <ChevronRight size={16} className={`text-muted-foreground transition-transform ${openEditProfile ? "rotate-90" : ""}`} />
        </button>
        {openEditProfile && (
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-sm font-semibold">Nombre</p>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Tu nombre"
                className="mt-1.5 w-full bg-secondary px-3 py-2 rounded-lg text-sm font-semibold focus:outline-none"
              />
            </div>
            <button
              onClick={saveName}
              disabled={!editName.trim() || savingName}
              className="w-full bg-gradient-primary text-primary-foreground font-bold py-2.5 rounded-xl text-sm disabled:opacity-40">
              {savingName ? "Guardando..." : "Guardar"}
            </button>
          </div>
        )}
      </div>

      {/* Recordatorio diario */}
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

      {/* Probar sonido */}
      <button
        onClick={playTestSound}
        aria-label="Probar sonido del reset"
        className="w-full flex items-center gap-3 p-4 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary"><Volume2 size={16} /></div>
        <span className="flex-1 text-sm font-semibold text-left">Probar sonido</span>
        <span className="text-xs text-primary font-semibold">{soundFeedback ?? "Tocá para escuchar"}</span>
        <ChevronRight size={16} className="text-muted-foreground" />
      </button>

      {/* Preferencias */}
      <div className="p-4 border-b border-border">
        <button onClick={() => setOpenPreferences(o => !o)} className="w-full flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary"><Settings size={16} /></div>
          <span className="flex-1 text-sm font-semibold text-left">Preferencias</span>
          <ChevronRight size={16} className={`text-muted-foreground transition-transform ${openPreferences ? "rotate-90" : ""}`} />
        </button>
        {openPreferences && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Moon size={15} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold">Modo oscuro</p>
                  <p className="text-[11px] text-muted-foreground">Pantallas con menos brillo.</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Volume2 size={15} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold">Sonido por defecto</p>
                  <p className="text-[11px] text-muted-foreground">Activa el audio al entrar a Reset.</p>
                </div>
              </div>
              <Switch checked={soundPref} onCheckedChange={toggleSoundPref} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Vibrate size={15} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold">Vibración</p>
                  <p className="text-[11px] text-muted-foreground">Pulsos táctiles durante la respiración.</p>
                </div>
              </div>
              <Switch checked={vibrationPref} onCheckedChange={toggleVibrationPref} />
            </div>
          </div>
        )}
      </div>

      {/* Privacidad */}
      <div className="p-4 border-b border-border">
        <button onClick={() => setOpenPrivacy(o => !o)} className="w-full flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary"><Shield size={16} /></div>
          <span className="flex-1 text-sm font-semibold text-left">Privacidad</span>
          <ChevronRight size={16} className={`text-muted-foreground transition-transform ${openPrivacy ? "rotate-90" : ""}`} />
        </button>
        {openPrivacy && (
          <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
            Tus resets, rituales y notas privadas solo los ves vos. Las notas que marqués como públicas se muestran en Comunidad con tu nombre. Nunca compartimos tu información con terceros.
          </p>
        )}
      </div>

      {/* Cerrar sesión */}
      <button onClick={onSignOut}
        className="w-full flex items-center gap-3 p-4 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary"><LogOut size={16} /></div>
        <span className="flex-1 text-sm font-semibold text-left">Cerrar sesión</span>
        <ChevronRight size={16} className="text-muted-foreground" />
      </button>

      {/* Eliminar cuenta */}
      <button onClick={() => setDeleteOpen(true)}
        className="w-full flex items-center gap-3 p-4 text-destructive">
        <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center"><Trash2 size={16} /></div>
        <span className="flex-1 text-sm font-semibold text-left">Eliminar cuenta</span>
        <ChevronRight size={16} className="text-muted-foreground" />
      </button>
    </div>

    <BottomNav active="profile" />

    {deleteOpen && (
      <div className="absolute inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end md:items-center justify-center">
        <div className="w-full bg-card rounded-t-3xl md:rounded-3xl shadow-card p-5 max-h-[85%] overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-destructive">Eliminar cuenta</p>
            <button onClick={() => { setDeleteOpen(false); setDeleteConfirmText(""); }} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <X size={14} />
            </button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            Esta acción borra tus notas, reacciones, mensajes, sesiones de reset, entradas de ritual y fotos subidas, y cierra tu sesión. No se puede deshacer.
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed italic">
            Por una limitación técnica actual, el registro de tu cuenta en el sistema de autenticación puede quedar sin datos asociados en vez de borrarse por completo. Si necesitás eso, contactanos aparte.
          </p>

          <p className="mt-4 text-xs font-semibold">Escribí <span className="font-bold">ELIMINAR</span> para confirmar</p>
          <input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="ELIMINAR"
            className="mt-2 w-full bg-secondary px-3 py-2.5 rounded-lg text-sm font-semibold focus:outline-none"
          />

          <button
            onClick={deleteAccount}
            disabled={deleteConfirmText !== "ELIMINAR" || deleting}
            className="mt-4 w-full bg-destructive text-destructive-foreground font-bold py-3.5 rounded-2xl text-sm shadow-card disabled:opacity-40">
            {deleting ? "Eliminando..." : "Eliminar mi cuenta para siempre"}
          </button>
        </div>
      </div>
    )}
  </div>
  );
};
