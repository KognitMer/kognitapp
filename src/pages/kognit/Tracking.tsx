import { TrendingUp, ChevronLeft } from "lucide-react";
import { BottomNav } from "@/components/kognit/BottomNav";

const week = [
  { d: "M", v: 60 }, { d: "T", v: 75 }, { d: "W", v: 50 },
  { d: "T", v: 80 }, { d: "F", v: 90 }, { d: "S", v: 65 }, { d: "S", v: 85 },
];

const sessions = [
  { time: "Today · 8:42 PM", title: "NL50 — Stars", mood: "Focused", tag: "🎯", trend: "+12%", positive: true },
  { time: "Today · 2:15 PM", title: "Tilt reset", mood: "Recovered", tag: "🧘", trend: "Calm", positive: true },
  { time: "Yesterday · 11:20 PM", title: "MTT Bubble", mood: "Edgy", tag: "😤", trend: "-4%", positive: false },
  { time: "Yesterday · 7:00 PM", title: "Pre-session ritual", mood: "Calm", tag: "✨", trend: "Ready", positive: true },
];

export const TrackingScreen = () => (
  <div className="min-h-full bg-gradient-hero pb-28">
    <div className="px-6 pt-3 flex items-center justify-between">
      <button className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"><ChevronLeft size={18} /></button>
      <p className="text-sm font-bold">Emotional Log</p>
      <button className="text-xs font-semibold text-primary">Week ▾</button>
    </div>

    {/* Quick log */}
    <div className="mx-6 mt-5 p-5 rounded-3xl bg-card shadow-card">
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Log right now</p>
      <p className="text-base font-bold mt-1">Where's your head at?</p>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground font-medium">
          <span>Tilted</span><span>Neutral</span><span>Locked in</span>
        </div>
        <div className="mt-2 relative h-2 bg-muted rounded-full">
          <div className="absolute inset-y-0 left-0 w-[68%] bg-gradient-primary rounded-full" />
          <div className="absolute top-1/2 -translate-y-1/2 left-[68%] -translate-x-1/2 w-5 h-5 rounded-full bg-card border-2 border-primary shadow-soft" />
        </div>
        <p className="mt-3 text-sm font-semibold text-primary">Focused · 7.2 / 10</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {["Played well", "Bad beat", "Distracted", "In flow", "Tired"].map((t, i) => (
          <button key={t} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
            i < 2 ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary text-muted-foreground border-transparent"
          }`}>+ {t}</button>
        ))}
      </div>

      <button className="mt-4 w-full bg-gradient-primary text-primary-foreground font-semibold py-3 rounded-2xl text-sm shadow-soft">Save entry</button>
    </div>

    {/* Chart */}
    <div className="mx-6 mt-4 p-5 rounded-3xl bg-gradient-deep text-primary-foreground shadow-card relative overflow-hidden">
      <div className="absolute -right-10 top-0 w-40 h-40 rounded-full bg-primary-glow/25 blur-2xl" />
      <div className="flex items-center justify-between relative">
        <div>
          <p className="text-xs opacity-70 uppercase tracking-widest font-semibold">Focus this week</p>
          <p className="text-2xl font-bold mt-1">72.4 <span className="text-sm opacity-70 font-medium">avg</span></p>
        </div>
        <div className="flex items-center gap-1 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold">
          <TrendingUp size={14} /> +8%
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between h-24 gap-2 relative">
        {week.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full rounded-lg bg-gradient-to-t from-primary-glow to-accent" style={{ height: `${d.v}%` }} />
            <span className="text-[10px] opacity-70 font-semibold">{d.d}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Recent */}
    <div className="px-6 mt-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">Recent sessions</h3>
        <button className="text-xs font-semibold text-primary">All</button>
      </div>
      <div className="mt-3 space-y-2.5">
        {sessions.map((s, i) => (
          <div key={i} className="p-3.5 rounded-2xl bg-card shadow-soft flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-xl">{s.tag}</div>
            <div className="flex-1">
              <p className="text-sm font-bold leading-tight">{s.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{s.time} · {s.mood}</p>
            </div>
            <span className={`text-xs font-bold ${s.positive ? "text-primary" : "text-destructive"}`}>{s.trend}</span>
          </div>
        ))}
      </div>
    </div>

    <BottomNav active="track" />
  </div>
);
