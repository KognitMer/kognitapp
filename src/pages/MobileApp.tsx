import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PhoneFrame } from "@/components/kognit/PhoneFrame";
import { SplashScreen } from "@/components/kognit/SplashScreen";
import { HomeScreen } from "./kognit/Home";
import { TiltScreen } from "./kognit/Tilt";
import { CardsScreen } from "./kognit/Cards";
import { CalendarScreen } from "./kognit/Calendar";
import { ProfileScreen } from "./kognit/Profile";
import { SettingsScreen } from "./kognit/Settings";
import { CommunityScreen } from "./kognit/Community";
import { BottomNav } from "@/components/kognit/BottomNav";

type Tab = "home" | "cards" | "calendar" | "community" | "profile";
type View = Tab | "tilt" | "settings";

interface Profile {
  display_name: string;
  avatar_url: string | null;
  focus_level: number;
  emotional_control: number;
  total_resets: number;
  streak_days: number;
  xp: number;
}

export default function MobileApp() {
  const { user, loading, signOut } = useAuth();
  const { t } = useTranslation();
  const [view, setView] = useState<View>("home");
  const [profile, setProfile] = useState<Profile | null>(null);

  const refreshProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (data) setProfile(data as any);
  };

  useEffect(() => { refreshProfile(); }, [user]);

  if (loading) return <SplashScreen />;
  if (!user) return <Navigate to="/auth" replace />;

  const avatarUrl = profile?.avatar_url
    ? supabase.storage.from("avatars").getPublicUrl(profile.avatar_url).data.publicUrl
    : null;

  const goTilt = async () => {
    setView("tilt");
    if (profile) {
      const next = { ...profile, total_resets: profile.total_resets + 1 };
      setProfile(next);
      await supabase.from("profiles").update({ total_resets: next.total_resets }).eq("id", user.id);
    }
  };

  const screen = (() => {
    switch (view) {
      case "tilt":
        return <TiltScreen onExit={() => { setView("home"); refreshProfile(); }} />;
      case "community":
        return <CommunityScreen onBack={() => setView("home")} />;
      case "cards":
        return <CardsScreen onBack={() => setView("home")} />;
      case "calendar":
        return <CalendarScreen />;
      case "profile":
        return <ProfileScreen
          name={profile?.display_name ?? t("common.defaultUserName")}
          avatarUrl={avatarUrl}
          focusLevel={profile?.focus_level ?? 60}
          emotionalControl={profile?.emotional_control ?? 60}
          totalResets={profile?.total_resets ?? 0}
          streakDays={profile?.streak_days ?? 0}
          xp={profile?.xp ?? 0}
          onSettings={() => setView("settings")}
        />;
      case "settings":
        return <SettingsScreen
          name={profile?.display_name ?? t("common.defaultUserName")}
          email={user.email || t("common.guestAccount")}
          onBack={() => setView("profile")}
          onSignOut={signOut}
        />;
      default:
        return <HomeScreen
          name={profile?.display_name ?? t("common.defaultUserName")}
          avatarUrl={avatarUrl}
          onTilt={goTilt}
          onCards={() => setView("cards")}
          onProfile={() => setView("profile")}
        />;
    }
  })();

  // Mobile-first: full screen on phones, framed on desktop
  return (
    <div className="min-h-screen bg-gradient-hero md:flex md:items-center md:justify-center md:py-8">
      <div className={`md:hidden relative ${view === "cards" || view === "tilt" ? "h-dvh overflow-hidden" : "min-h-screen"}`}>
        {screen}
        {view !== "tilt" && view !== "settings" && (
          <BottomNav
            active={view as Tab}
            onChange={(k) => setView(k)}
            onReset={goTilt}
          />
        )}
      </div>
      <div className="hidden md:block">
        <PhoneFrame>
          <div className="relative h-full">
            {screen}
            {view !== "tilt" && view !== "settings" && (
              <BottomNav active={view as Tab} onChange={(k) => setView(k)} onReset={goTilt} />
            )}
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}
