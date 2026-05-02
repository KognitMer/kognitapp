import { AlertOctagon, Play, Sparkles, Wind, Target, ChevronRight, Bell } from "lucide-react";
import { BottomNav } from "@/components/kognit/BottomNav";

const moods = [
  { emoji: "🧘", label: "Calm" },
  { emoji: "🎯", label: "Focused" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😤", label: "Edgy" },
  { emoji: "🔥", label: "Tilted" },
];

export const HomeScreen = () => (
  <div className="min-h-full bg-gradient-hero pb-28">
    {/* Header */}
    <div className="px-6 pt-3 flex items-center justify-between">
      <div>
        <p className="text-xs text-muted-foreground font-medium">Good evening</p>
        <h1 className="text-2xl font-bold">Alex</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center">
          <Bell size={16} />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">A</div>
      </div>
    </div>

    {/* Mood check */}
    <div className="mx-6 mt-5 p-5 rounded-3xl bg-card shadow-card">
      <p className="text-sm font-semibold text-foreground">How are you feeling right now?</p>
      <div className="mt-3 flex justify-between">
        {moods.map((m, i) => (
          <button key={m.label} className={`flex flex-col items-center gap-1 transition-all ${i === 1 ? "scale-110" : "opacity-70"}`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${i === 1 ? "bg-gradient-primary shadow-soft" : "bg-secondary"}`}>
              {m.emoji}
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">{m.label}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Tilt Emergency */}
    <div className="mx-6 mt-4 relative">
      <div className="absolute inset-0 rounded-3xl bg-destructive/30 animate-pulse-ring" />
      <button className="relative w-full bg-gradient-emergency text-destructive-foreground rounded-3xl p-5 shadow-emergency flex items-center gap-4 active:scale-[0.98] transition-transform">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
          <AlertOctagon size={26} strokeWidth={2.4} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[11px] uppercase tracking-widest opacity-90 font-bold">Emergency</p>
          <p className="text-lg font-bold leading-tight">Tilt Reset</p>
          <p className="text-xs opacity-90">Tap for an instant calming flow</p>
        </div>
        <ChevronRight size={22} />
      </button>
    </div>

    {/* Quick actions */}
    <div className="px-6 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">Quick tools</h2>
        <button className="text-xs font-semibold text-primary">See all</button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <ToolCard icon={Play} title="Start session" subtitle="Pre-game ritual" gradient />
        <ToolCard icon={Sparkles} title="Reset your focus" subtitle="2 min mental clear" />
        <ToolCard icon={Wind} title="Breath" subtitle="4-7-8 technique" />
        <ToolCard icon={Target} title="Mental cards" subtitle="Quick mindset boost" />
      </div>
    </div>

    {/* Today */}
    <div className="px-6 mt-6">
      <h2 className="text-base font-bold">Today's mindset</h2>
      <div className="mt-3 p-5 rounded-3xl bg-gradient-deep text-primary-foreground shadow-card relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary-glow/30 blur-2xl" />
        <p className="text-xs uppercase tracking-widest opacity-70 font-semibold">Card of the day</p>
        <p className="mt-2 text-xl font-bold leading-snug">"You don't lose hands. You lose focus."</p>
        <button className="mt-4 text-xs font-semibold bg-white/15 backdrop-blur px-4 py-2 rounded-full">Reflect →</button>
      </div>
    </div>

    <BottomNav active="home" />
  </div>
);

const ToolCard = ({ icon: Icon, title, subtitle, gradient }: any) => (
  <button className={`p-4 rounded-2xl text-left transition-all active:scale-95 ${gradient ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-card shadow-soft"}`}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${gradient ? "bg-white/20" : "bg-secondary text-primary"}`}>
      <Icon size={18} />
    </div>
    <p className="text-sm font-bold leading-tight">{title}</p>
    <p className={`text-[11px] mt-0.5 ${gradient ? "opacity-90" : "text-muted-foreground"}`}>{subtitle}</p>
  </button>
);
