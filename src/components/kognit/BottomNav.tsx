import { Home, Layers, Calendar, Users, User } from "lucide-react";

type Key = "home" | "cards" | "calendar" | "community" | "profile";
interface Props { active: Key; onChange?: (k: Key) => void; }

const items = [
  { key: "home", icon: Home, label: "Inicio" },
  { key: "cards", icon: Layers, label: "Cartas" },
  { key: "calendar", icon: Calendar, label: "Diario" },
  { key: "community", icon: Users, label: "Comunidad" },
  { key: "profile", icon: User, label: "Perfil" },
] as const;

export const BottomNav = ({ active, onChange }: Props) => (
  <div className="fixed bottom-0 inset-x-0 px-3 pb-4 pt-2 z-20">
    <div className="bg-card/90 backdrop-blur-xl border border-border rounded-[1.75rem] shadow-card flex justify-around py-2.5 px-2">
      {items.map(({ key, icon: Icon, label }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            onClick={() => onChange?.(key as Key)}
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
