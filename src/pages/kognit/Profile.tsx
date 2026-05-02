import { Settings, Award, Flame, Brain, ChevronRight, Bell, Shield, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/kognit/BottomNav";

const stats = [
  { icon: Flame, label: "Day streak", value: "27", c: "text-warning" },
  { icon: Brain, label: "Resets", value: "142", c: "text-primary" },
  { icon: Award, label: "Mind level", value: "B+", c: "text-accent" },
];

export const ProfileScreen = () => (
  <div className="min-h-full bg-gradient-hero pb-28">
    <div className="px-6 pt-3 flex items-center justify-between">
      <p className="text-sm font-bold">Profile</p>
      <button className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"><Settings size={16} /></button>
    </div>

    {/* Identity card */}
    <div className="mx-6 mt-4 p-5 rounded-3xl bg-gradient-deep text-primary-foreground shadow-card relative overflow-hidden">
      <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-primary-glow/25 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-2xl font-bold shadow-glow">A</div>
        <div className="flex-1">
          <p className="text-lg font-bold">Alex Mendez</p>
          <p className="text-xs opacity-80">NL50 grinder · Joined Mar 2026</p>
          <div className="mt-1.5 inline-flex items-center gap-1 bg-white/15 backdrop-blur px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            <Sparkles size={10} /> KOGNIT PRO
          </div>
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="px-6 mt-4 grid grid-cols-3 gap-3">
      {stats.map(s => (
        <div key={s.label} className="p-4 rounded-2xl bg-card shadow-soft text-center">
          <s.icon size={18} className={`${s.c} mx-auto`} />
          <p className="text-xl font-bold mt-1.5">{s.value}</p>
          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>

    {/* Progress */}
    <div className="mx-6 mt-4 p-5 rounded-3xl bg-card shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">Mental fitness</p>
        <span className="text-xs font-semibold text-primary">Lvl 7</span>
      </div>
      <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full w-[72%] bg-gradient-primary rounded-full" />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">280 XP to next level — keep your streak alive.</p>
    </div>

    {/* Recent achievements */}
    <div className="px-6 mt-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">Achievements</h3>
        <button className="text-xs font-semibold text-primary">All</button>
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
        {[
          { e: "🛡", t: "Tilt-proof", s: "5 resets in a row" },
          { e: "🌊", t: "Flow state", s: "3 hr deep focus" },
          { e: "♠", t: "Cool head", s: "Survived a downswing" },
        ].map(a => (
          <div key={a.t} className="min-w-[140px] p-4 rounded-2xl bg-card shadow-soft text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-soft flex items-center justify-center text-2xl">{a.e}</div>
            <p className="mt-2 text-sm font-bold">{a.t}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{a.s}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Settings list */}
    <div className="mx-6 mt-5 rounded-3xl bg-card shadow-soft overflow-hidden">
      {[
        { i: Bell, l: "Reminders", v: "Daily · 7 PM" },
        { i: Shield, l: "Privacy", v: "Local only" },
        { i: Settings, l: "Preferences", v: "" },
      ].map((r, i) => (
        <button key={r.l} className={`w-full flex items-center gap-3 p-4 ${i !== 2 ? "border-b border-border" : ""}`}>
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
