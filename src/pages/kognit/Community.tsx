import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, Lock } from "lucide-react";
import { BottomNav } from "@/components/kognit/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { NoteComposer } from "@/components/kognit/NoteComposer";

interface Props { onBack?: () => void; }

const REACTIONS = [
  { key: "breathe", emoji: "🫁", label: "Me ayudó a respirar" },
  { key: "focus", emoji: "🎯", label: "Me ayudó a enfocarme" },
  { key: "inspire", emoji: "🌱", label: "Me inspira" },
  { key: "reflect", emoji: "💭", label: "Me hizo reflexionar" },
  { key: "identify", emoji: "🤝", label: "Me siento identificado" },
];

interface NoteRow {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  mood: string | null;
  created_at: string;
  author?: string;
  reactions: Record<string, number>;
  myReaction?: string | null;
}

const timeAgo = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

export const CommunityScreen = ({ onBack }: Props) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: ns } = await supabase
      .from("notes")
      .select("id, user_id, title, content, mood, created_at")
      .eq("visibility", "public")
      .order("created_at", { ascending: false })
      .limit(50);

    const list = ns ?? [];
    const ids = list.map(n => n.id);
    const userIds = Array.from(new Set(list.map(n => n.user_id)));

    const [{ data: rxs }, { data: profs }] = await Promise.all([
      ids.length
        ? supabase.from("note_reactions").select("note_id, reaction, user_id").in("note_id", ids)
        : Promise.resolve({ data: [] as any[] }),
      userIds.length
        ? supabase.from("profiles").select("id, display_name").in("id", userIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const nameById = new Map((profs ?? []).map((p: any) => [p.id, p.display_name as string]));
    const counts: Record<string, Record<string, number>> = {};
    const mine: Record<string, string> = {};
    (rxs ?? []).forEach((r: any) => {
      counts[r.note_id] ??= {};
      counts[r.note_id][r.reaction] = (counts[r.note_id][r.reaction] ?? 0) + 1;
      if (user && r.user_id === user.id) mine[r.note_id] = r.reaction;
    });

    setNotes(list.map(n => ({
      ...n,
      author: nameById.get(n.user_id) ?? "Jugador",
      reactions: counts[n.id] ?? {},
      myReaction: mine[n.id] ?? null,
    })));
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const react = async (noteId: string, reaction: string, current: string | null | undefined) => {
    if (!user) return;
    if (current === reaction) {
      await supabase.from("note_reactions").delete().eq("note_id", noteId).eq("user_id", user.id);
    } else {
      await supabase.from("note_reactions").upsert(
        { note_id: noteId, user_id: user.id, reaction },
        { onConflict: "note_id,user_id" }
      );
    }
    load();
  };

  return (
    <div className="min-h-full bg-gradient-hero pb-28 relative">
      <div className="px-6 pt-3 flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center">
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Comunidad</p>
          <p className="text-xs font-bold">Momentos de Conexión</p>
        </div>
        <div className="w-10" />
      </div>

      <div className="mx-6 mt-4 p-4 rounded-3xl bg-gradient-deep text-primary-foreground shadow-card">
        <p className="text-xs opacity-80">Un espacio tranquilo para compartir lo que aprendemos.</p>
        <button onClick={() => setComposerOpen(true)}
          className="mt-3 w-full bg-white/15 backdrop-blur text-xs font-bold py-2.5 rounded-xl">
          Compartir un momento
        </button>
      </div>

      <div className="px-6 mt-5 space-y-3">
        {loading && <p className="text-xs text-muted-foreground text-center py-10">Cargando…</p>}
        {!loading && notes.length === 0 && (
          <div className="text-center py-10 px-4">
            <Lock size={20} className="mx-auto text-muted-foreground" />
            <p className="mt-3 text-xs font-bold">Todavía no hay momentos compartidos</p>
            <p className="mt-1 text-xs text-muted-foreground">Sé el primero en compartir una reflexión.</p>
          </div>
        )}
        {notes.map(n => (
          <div key={n.id} className="p-4 rounded-2xl bg-card shadow-soft">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {(n.author ?? "?").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold leading-tight">{n.author}</p>
                <p className="text-[10px] text-muted-foreground">{timeAgo(n.created_at)}</p>
              </div>
              {n.mood && <span className="text-lg">{n.mood}</span>}
            </div>
            {n.title && <p className="mt-3 text-sm font-bold">{n.title}</p>}
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{n.content}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {REACTIONS.map(r => {
                const active = n.myReaction === r.key;
                const count = n.reactions[r.key] ?? 0;
                return (
                  <button key={r.key} onClick={() => react(n.id, r.key, n.myReaction)}
                    title={r.label}
                    className={`px-2.5 py-1 rounded-full text-xs flex items-center gap-1 transition-all border ${
                      active
                        ? "bg-primary/10 text-primary border-primary/30 font-bold"
                        : "bg-secondary text-muted-foreground border-transparent"
                    }`}>
                    <span>{r.emoji}</span>
                    {count > 0 && <span className="text-[10px] font-bold">{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <NoteComposer open={composerOpen} onClose={() => setComposerOpen(false)} onSaved={load} />
      <BottomNav active="home" />
    </div>
  );
};