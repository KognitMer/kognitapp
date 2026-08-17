import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, ChevronRight, UserRound, Info } from "lucide-react";
import { BottomNav } from "@/components/kognit/BottomNav";
import { MoodIcon, moodMascotSrc } from "@/components/kognit/MoodIcon";
import { Avatar } from "@/components/kognit/Avatar";
import { MOOD_OPTIONS, type MoodId } from "@/data/moods";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { getCalmAnchorPhrase, setCalmAnchorPhrase } from "@/lib/preferences";
import mascot from "@/assets/kognit-mascot.png";
import calmAnchorIcon from "@/assets/achievements/calm-anchor.png";

interface HomeProps {
  name?: string;
  avatarUrl?: string | null;
  onTilt?: () => void;
  onProfile?: () => void;
}

export const HomeScreen = ({ name = "\n", avatarUrl = null, onTilt, onProfile }: HomeProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [mood, setMood] = useState<MoodId | null>(null);
  const [saving, setSaving] = useState(false);
  const [anchorInfoOpen, setAnchorInfoOpen] = useState(false);
  const [anchorPhrase, setAnchorPhrase] = useState(() => getCalmAnchorPhrase());
  const anchorTextareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeAnchorTextarea = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleAnchorPhraseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAnchorPhrase(value);
    setCalmAnchorPhrase(value);
    resizeAnchorTextarea(e.target);
  };

  useEffect(() => {
    if (anchorTextareaRef.current) resizeAnchorTextarea(anchorTextareaRef.current);
  }, []);

  useEffect(() => {
    if (!user) return;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    supabase
      .from("notes")
      .select("mood")
      .eq("user_id", user.id)
      .gte("created_at", startOfDay.toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => data?.mood && setMood(data.mood as MoodId));
  }, [user]);

  const pickMood = async (id: MoodId) => {
    if (saving) return;
    setMood(id);
    if (!user) return; // showcase sin login (landing): solo cambia el personaje, no persiste
    const label = t(`moods.options.${id}`);
    setSaving(true);
    const { error } = await supabase.from("notes").insert({
      user_id: user.id,
      mood: id,
      content: t("home.moodNoteContent", { label }),
      visibility: "private",
    });
    setSaving(false);
    if (error) {
      toast.error(t("home.toasts.saveError"));
      return;
    }
    toast.success(t("home.toasts.saveSuccess"));
  };

  return (
  <div className="min-h-full bg-gradient-hero pb-28">
    <div className="px-6 pt-3 flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t("home.activeSession")}</p>
        <h1 className="text-xl font-bold">{name}</h1>
      </div>
      <button onClick={onProfile} aria-label={t("home.profileAria")} className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center text-primary overflow-hidden">
        {name.trim() ? (
          <Avatar src={avatarUrl} name={name.trim()} size={40} shape="circle" className="text-sm" />
        ) : (
          <UserRound size={16} />
        )}
      </button>
    </div>

    {/* Mascota chica + ancla de calma editable, estilo burbuja */}
    <div className="flex items-start gap-3 px-6 mt-4">
      <div className="w-14 h-14 rounded-full bg-card shadow-soft flex items-center justify-center shrink-0 overflow-hidden">
        <img
          key={mood ?? "default"}
          src={mood ? moodMascotSrc(mood) : mascot}
          alt="kognit"
          className="w-11 h-11 object-contain"
        />
      </div>
      <div className="flex-1 p-4 rounded-2xl rounded-tl-md bg-card shadow-soft relative">
        <button
          onClick={() => setAnchorInfoOpen(o => !o)}
          aria-label={t("home.calmAnchor.infoAria")}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
          <Info size={13} />
        </button>
        <p className="text-sm font-bold leading-snug pr-8">{t("home.calmAnchor.introLine")}</p>
        <textarea
          ref={anchorTextareaRef}
          value={anchorPhrase}
          onChange={handleAnchorPhraseChange}
          placeholder={t("home.calmAnchor.subtitle")}
          rows={1}
          className="mt-1.5 w-full bg-transparent text-[11px] text-muted-foreground placeholder:text-muted-foreground leading-relaxed outline-none resize-none overflow-hidden"
        />
        <p className="text-[10px] text-muted-foreground font-semibold text-right mt-1">{t("home.calmAnchor.editHint")}</p>
      </div>
    </div>

    <div className="mx-6 mt-4 p-5 rounded-3xl bg-card shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">{t("home.currentMoodTitle")}</p>
        <span className="text-[10px] text-muted-foreground font-semibold">{t("home.currentMoodHint")}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {MOOD_OPTIONS.map(({ id }) => (
          <button
            key={id}
            onClick={() => pickMood(id)}
            disabled={saving}
            aria-pressed={mood === id}
            className={`flex flex-col items-center gap-1 py-3 rounded-2xl transition-all disabled:opacity-60 ${
              mood === id ? "bg-gradient-info text-info-foreground shadow-soft scale-[1.03]" : "bg-secondary text-muted-foreground"
            }`}
          >
            <MoodIcon mood={id} size={36} />
            <span className="text-[10px] font-bold leading-none">{t(`moods.options.${id}`)}</span>
          </button>
        ))}
      </div>
    </div>

    {/* ANCLA DE CALMA (resumen) + RESET, lado a lado */}
    <div className="px-6 mt-5 grid grid-cols-2 gap-3 items-stretch">
      <div className="p-4 rounded-2xl bg-card shadow-soft flex flex-col">
        <img src={calmAnchorIcon} alt="" className="w-9 h-9 rounded-xl object-contain bg-secondary shrink-0" />
        <p className="text-sm font-bold leading-tight mt-2.5">{t("home.calmAnchor.title")}</p>
        <p className="text-[11px] text-muted-foreground leading-relaxed mt-1 flex-1">{t("home.calmAnchor.bottomSubtitle")}</p>
        <button
          onClick={() => setAnchorInfoOpen(o => !o)}
          className="text-[11px] font-bold text-primary text-left mt-2 underline underline-offset-2">
          {t("home.calmAnchor.howItWorks")}
        </button>
      </div>

      <button onClick={onTilt}
        className="p-4 rounded-2xl bg-gradient-emergency text-destructive-foreground shadow-emergency flex flex-col items-start text-left active:scale-[0.98] transition-transform">
        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
          <AlertCircle size={18} strokeWidth={2.4} />
        </div>
        <p className="text-sm font-bold leading-tight mt-2.5">{t("home.resetTitle")}</p>
        <p className="text-[11px] opacity-90 leading-relaxed mt-1 flex-1">{t("home.resetSubtitle")}</p>
        <span className="text-[11px] font-bold mt-2 inline-flex items-center gap-0.5">
          {t("home.resetCta")}
          <ChevronRight size={14} strokeWidth={2.6} />
        </span>
      </button>
    </div>

    {anchorInfoOpen && (
      <div className="mx-6 mt-4 p-4 rounded-2xl bg-card shadow-soft space-y-2.5">
        {(t("home.calmAnchor.steps", { returnObjects: true }) as { title: string; body: string }[]).map((s, i) => (
          <div key={s.title}>
            <p className="text-xs font-bold">{i + 1}. {s.title}</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{s.body}</p>
          </div>
        ))}
      </div>
    )}

    <BottomNav active="home" />
  </div>
  );
};
