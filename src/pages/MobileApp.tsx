import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PhoneFrame } from "@/components/kognit/PhoneFrame";
import { HomeScreen } from "./kognit/Home";
import { TiltScreen } from "./kognit/Tilt";
import { CardsScreen } from "./kognit/Cards";
import { TrackingScreen } from "./kognit/Tracking";
import { CalendarScreen } from "./kognit/Calendar";
import { ProfileScreen } from "./kognit/Profile";
import { BottomNav } from "@/components/kognit/BottomNav";

type Tab = "home" | "cards" | "calendar" | "track" | "profile";
type View = Tab | "tilt";

interface Profile {
  display_name: string;
  focus_level: number;
  emotional_control: number;
  total_resets: number;
  streak_days: number;
  xp: number;
}

export default function MobileApp() {
  const { user, loading, signOut } = useAuth();
  const [view, setView] = useState<View>("home");
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      .then(({ data }) => data && setProfile(data as any));
  }, [user]);

  if (loading) return <div className="min-h-screen bg-gradient-hero" />;
  if (!user) return <Navigate to="/auth" replace />;

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
        return <TiltScreen onExit={() => setView("home")} />;
      case "cards":
        return <CardsScreen onBack={() => setView("home")} />;
      case "calendar":
        return <CalendarScreen />;
      case "track":
        return <TrackingScreen />;
      case "profile":
        return <ProfileScreen
          name={profile?.display_name ?? "Jugador"}
          email={user.email ?? ""}
          focusLevel={profile?.focus_level ?? 60}
          emotionalControl={profile?.emotional_control ?? 60}
          totalResets={profile?.total_resets ?? 0}
          streakDays={profile?.streak_days ?? 0}
          xp={profile?.xp ?? 0}
          onSignOut={signOut}
        />;
      default:
        return <HomeScreen
          name={profile?.display_name ?? "Jugador"}
          onTilt={goTilt}
          onCards={() => setView("cards")}
          onTrack={() => setView("track")}
        />;
    }
  })();

  // Mobile-first: full screen on phones, framed on desktop
  return (
    <div className="min-h-screen bg-gradient-hero md:flex md:items-center md:justify-center md:py-8">
      <div className="md:hidden relative min-h-screen">
        {screen}
        {view !== "tilt" && (
          <BottomNav
            active={view as Tab}
            onChange={(k) => setView(k)}
          />
        )}
      </div>
      <div className="hidden md:block">
        <PhoneFrame>
          <div className="relative h-full">
            {screen}
            {view !== "tilt" && (
              <BottomNav active={view as Tab} onChange={(k) => setView(k)} />
            )}
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}