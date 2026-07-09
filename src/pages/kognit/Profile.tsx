import { Settings, Award, Flame, Brain, ChevronRight, Sparkles, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BottomNav } from "@/components/kognit/BottomNav";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Avatar } from "@/components/kognit/Avatar";
import { ACHIEVEMENTS, type AchievementId } from "@/data/achievements";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

interface ProfileProps {
  name?: string;
  avatarUrl?: string | null;
  focusLevel?: number;
  emotionalControl?: number;
  totalResets?: number;
  streakDays?: number;
  xp?: number;
  onSettings?: () => void;
}

export const ProfileScreen = ({
  name,
  avatarUrl = null,
  focusLevel = 72,
  emotionalControl = 64,
  totalResets = 0,
  streakDays = 0,
  xp = 0,
  onSettings,
}: ProfileProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const resolvedName = name ?? t("profile.defaultName");

  const [displayName, setDisplayName] = useState(resolvedName);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(avatarUrl);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [openAchievement, setOpenAchievement] = useState<AchievementId | null>(null);

  useEffect(() => { setDisplayName(resolvedName); }, [resolvedName]);
  useEffect(() => { setAvatarPreviewUrl(avatarUrl); }, [avatarUrl]);

  const onPickAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("profile.avatar.invalidType"));
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error(t("profile.avatar.tooLarge"));
      return;
    }
    setUploadingAvatar(true);

    // Limpia archivos previos del usuario para no acumular avatares huérfanos.
    const { data: existing } = await supabase.storage.from("avatars").list(user.id);
    if (existing?.length) {
      await supabase.storage.from("avatars").remove(existing.map(f => `${user.id}/${f.name}`));
    }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (uploadError) {
      setUploadingAvatar(false);
      toast.error(t("profile.avatar.uploadError"));
      return;
    }

    const { error } = await supabase.from("profiles").update({ avatar_url: path }).eq("id", user.id);
    setUploadingAvatar(false);
    if (error) {
      toast.error(t("profile.avatar.uploadError"));
      return;
    }
    setAvatarPreviewUrl(supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl);
    toast.success(t("profile.avatar.uploadSuccess"));
  };

  return (
  <div className="min-h-full bg-gradient-hero pb-28 relative">
    <div className="px-6 pt-3 flex items-center justify-between">
      <p className="text-sm font-bold">{t("profile.title")}</p>
      <button onClick={onSettings} aria-label={t("profile.settingsAria")} className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center">
        <Settings size={16} />
      </button>
    </div>

    <div className="mx-6 mt-4 p-5 rounded-3xl bg-gradient-deep text-primary-foreground shadow-card relative overflow-hidden">
      <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-primary-glow/25 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <button
          type="button"
          onClick={() => avatarInputRef.current?.click()}
          aria-label={t("profile.avatar.changeAria")}
          disabled={uploadingAvatar}
          className="relative shrink-0 shadow-glow rounded-2xl disabled:opacity-60">
          <Avatar src={avatarPreviewUrl} name={displayName} size={64} shape="square" className="text-2xl" />
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card text-foreground flex items-center justify-center shadow-soft">
            <Camera size={12} />
          </span>
        </button>
        <input ref={avatarInputRef} type="file" accept="image/*" onChange={onPickAvatar} className="hidden" />
        <div className="flex-1">
          <p className="text-base font-bold">{displayName}</p>
          <div className="mt-1.5 inline-flex items-center gap-1 bg-white/15 backdrop-blur px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            <Sparkles size={10} /> {t("profile.proBadge")}
          </div>
        </div>
      </div>
    </div>

    <div className="px-6 mt-4 grid grid-cols-3 gap-3">
      {[
        { icon: Flame, label: t("profile.stats.streak"), value: String(streakDays), c: "text-cyan" },
        { icon: Brain, label: t("profile.stats.resets"), value: String(totalResets), c: "text-primary" },
        { icon: Award, label: t("profile.stats.xp"), value: String(xp), c: "text-accent" },
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
          <p className="text-sm font-bold">{t("profile.focusLevel")}</p>
          <span className="text-xs font-bold text-primary">{focusLevel}%</span>
        </div>
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${focusLevel}%` }} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">{t("profile.emotionalControl")}</p>
          <span className="text-xs font-bold text-accent">{emotionalControl}%</span>
        </div>
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full" style={{ width: `${emotionalControl}%` }} />
        </div>
      </div>
    </div>

    <div className="px-6 mt-5">
      <h3 className="text-xs font-bold mb-3">{t("profile.achievementsTitle")}</h3>
      <div className="space-y-2">
        {ACHIEVEMENTS.map(a => {
          const unlocked = a.isUnlocked({ streakDays, totalResets });
          const expanded = openAchievement === a.id;
          return (
            <div key={a.id} className="rounded-2xl bg-card shadow-soft overflow-hidden">
              <button
                onClick={() => setOpenAchievement(expanded ? null : a.id)}
                className="w-full p-3 flex items-center gap-3 text-left">
                <div className={`w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-secondary flex items-center justify-center ${unlocked ? "" : "grayscale opacity-50"}`}>
                  <img src={a.icon} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{t(`profile.achievementsList.${a.id}.title`)}</p>
                  <p className={`text-[10px] font-semibold mt-0.5 ${unlocked ? "text-primary" : "text-muted-foreground"}`}>
                    {unlocked ? t("profile.achievementUnlocked") : t("profile.achievementLocked")}
                  </p>
                </div>
                <ChevronRight size={15} className={`text-muted-foreground transition-transform shrink-0 ${expanded ? "rotate-90" : ""}`} />
              </button>
              {expanded && (
                <div className="px-3 pb-3 -mt-1">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{t(`profile.achievementsList.${a.id}.criterion`)}</p>
                  <p className="mt-1.5 text-[10px] text-muted-foreground/80 italic leading-relaxed">{t(`profile.achievementsList.${a.id}.reference`)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>

    <BottomNav active="profile" />
  </div>
  );
};
