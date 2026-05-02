import { Home, Layers, Activity, User } from "lucide-react";

interface Props { active: "home" | "cards" | "track" | "profile"; }

const items = [
  { key: "home", icon: Home, label: "Home" },
  { key: "cards", icon: Layers, label: "Cards" },
  { key: "track", icon: Activity, label: "Track" },
  { key: "profile", icon: User, label: "Profile" },
] as const;

export const BottomNav = ({ active }: Props) => (
  <div className="absolute bottom-0 inset-x-0 px-4 pb-4 pt-2">
    <div className="bg-card/90 backdrop-blur-xl border border-border rounded-[1.75rem] shadow-card flex justify-around py-2.5 px-3">
      {items.map(({ key, icon: Icon, label }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all ${
              isActive ? "bg-gradient-primary text-primary-foreground shadow-soft" : "text-muted-foreground"
            }`}
          >
            <Icon size={18} strokeWidth={2.2} />
            <span className="text-[10px] font-semibold">{label}</span>
          </button>
        );
      })}
    </div>
  </div>
);
