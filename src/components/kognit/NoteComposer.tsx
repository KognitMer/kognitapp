import { useState } from "react";
import { X, Lock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const MOODS = ["🧘", "🎯", "😐", "😤", "🔥", "✨"];

export const NoteComposer = ({ open, onClose, onSaved }: Props) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string>("🎯");
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const save = async () => {
    if (!user || !content.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("notes").insert({
      user_id: user.id,
      title: title.trim() || null,
      content: content.trim(),
      mood,
      visibility,
    });
    setSaving(false);
    if (error) {
      toast.error("No se pudo guardar la nota");
      return;
    }
    toast.success(visibility === "public" ? "Compartida con la comunidad" : "Nota guardada");
    setTitle(""); setContent(""); setMood("🎯"); setVisibility("private");
    onSaved?.();
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end md:items-center justify-center">
      <div className="w-full bg-card rounded-t-3xl md:rounded-3xl shadow-card p-5 max-h-[85%] overflow-y-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">Nueva nota</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <X size={14} />
          </button>
        </div>

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Título (opcional)"
          className="mt-4 w-full bg-transparent text-base font-bold placeholder:text-muted-foreground/60 focus:outline-none"
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="¿Qué pasó por tu cabeza?"
          rows={4}
          className="mt-2 w-full bg-secondary/40 rounded-2xl p-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none resize-none"
        />

        <div className="mt-3 flex items-center gap-2">
          {MOODS.map(e => (
            <button key={e} onClick={() => setMood(e)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                mood === e ? "bg-gradient-primary text-primary-foreground shadow-soft scale-110" : "bg-secondary"
              }`}>{e}</button>
          ))}
        </div>

        <p className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Privacidad</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button onClick={() => setVisibility("private")}
            className={`p-3 rounded-2xl text-left transition-all border ${
              visibility === "private" ? "bg-gradient-primary text-primary-foreground border-transparent shadow-soft" : "bg-card border-border text-muted-foreground"
            }`}>
            <Lock size={14} />
            <p className="mt-1.5 text-xs font-bold">Privada</p>
            <p className="text-[10px] opacity-80 mt-0.5">Solo vos la ves</p>
          </button>
          <button onClick={() => setVisibility("public")}
            className={`p-3 rounded-2xl text-left transition-all border ${
              visibility === "public" ? "bg-gradient-deep text-primary-foreground border-transparent shadow-soft" : "bg-card border-border text-muted-foreground"
            }`}>
            <Users size={14} />
            <p className="mt-1.5 text-xs font-bold">Compartir</p>
            <p className="text-[10px] opacity-80 mt-0.5">Con la comunidad</p>
          </button>
        </div>

        <button
          onClick={save}
          disabled={!content.trim() || saving}
          className="mt-5 w-full bg-foreground text-background font-bold py-3.5 rounded-2xl text-sm shadow-card disabled:opacity-40">
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
};