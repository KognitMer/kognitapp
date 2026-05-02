import { Home, Layers, Activity, Calendar, User } from "lucide-react";

interface Props { active: "home" | "cards" | "track" | "calendar" | "profile"; }

const items = [
  { key: "home", icon: Home, label: "Inicio" },
  { key: "cards", icon: Layers, label: "Cartas" },
  { key: "calendar", icon: Calendar, label: "Diario" },
  { key: "track", icon: Activity, label: "Registro" },
  { key: "profile", icon: User, label: "Perfil" },
] as const;

export const BottomNav = ({ active }: Props) => (
  <div className="absolute bottom-0 inset-x-0 px-3 pb-4 pt-2">
    <div className="bg-card/90 backdrop-blur-xl border border-border rounded-[1.75rem] shadow-card flex justify-around py-2.5 px-2">
      {items.map(({ key, icon: Icon, label }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-2xl transition-all ${
              isActive ? "bg-gradient-primary text-primary-foreground shadow-soft" : "text-muted-foreground"
            }`}
          >
            <Icon size={17} strokeWidth={2.2} />
            <span className="text-[9px] font-semibold">{label}</span>
          </button>
        );
      })}
    </div>
  </div>
);
