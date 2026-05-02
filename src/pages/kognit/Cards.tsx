import { ChevronLeft, Heart, Bookmark, Share2 } from "lucide-react";
import { BottomNav } from "@/components/kognit/BottomNav";

const cards = [
  { tag: "Disciplina", title: "Jugá el largo plazo.", body: "Una sesión es una muestra. Mil sesiones son la verdad. Confiá en el proceso." },
];

export const CardsScreen = () => (
  <div className="min-h-full bg-gradient-hero pb-28">
    <div className="px-6 pt-3 flex items-center justify-between">
      <button className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"><ChevronLeft size={18} /></button>
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Cartas Mentales</p>
        <p className="text-sm font-bold">Reset de Mindset</p>
      </div>
      <button className="w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center"><Bookmark size={16} /></button>
    </div>

    <p className="text-center text-xs text-muted-foreground mt-3">Deslizá. Pausá donde te resuene.</p>

    <div className="relative mt-6 mx-6 h-[420px]">
      <div className="absolute inset-x-8 top-6 h-[380px] rounded-3xl bg-card shadow-soft opacity-60" />
      <div className="absolute inset-x-4 top-3 h-[400px] rounded-3xl bg-card shadow-card" />
      <div className="absolute inset-x-0 top-0 h-[410px] rounded-3xl bg-gradient-primary text-primary-foreground shadow-glow p-7 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest font-bold bg-white/20 backdrop-blur px-3 py-1 rounded-full">{cards[0].tag}</span>
          <span className="text-xs opacity-80 font-semibold">01 / 12</span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-bold leading-tight">{cards[0].title}</h2>
          <p className="mt-4 text-sm opacity-90 leading-relaxed">{cards[0].body}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center"><Heart size={16} /></button>
            <button className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center"><Share2 size={16} /></button>
          </div>
          <button className="px-5 py-2.5 rounded-full bg-white text-primary text-sm font-bold">Siguiente →</button>
        </div>
      </div>
    </div>

    <div className="mt-4 flex justify-center gap-1.5">
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? "w-6 bg-primary" : "w-1.5 bg-muted"}`} />
      ))}
    </div>

    <div className="px-6 mt-6">
      <h3 className="text-sm font-bold mb-3">Explorar por mentalidad</h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "Pre-juego", count: "8 cartas", c: "bg-gradient-primary text-primary-foreground" },
          { name: "Bad beats", count: "12 cartas", c: "bg-card" },
          { name: "Sesiones largas", count: "6 cartas", c: "bg-card" },
          { name: "Downswings", count: "9 cartas", c: "bg-card" },
        ].map(cat => (
          <button key={cat.name} className={`p-4 rounded-2xl text-left shadow-soft ${cat.c}`}>
            <p className="font-bold text-sm">{cat.name}</p>
            <p className="text-[11px] opacity-80 mt-0.5">{cat.count}</p>
          </button>
        ))}
      </div>
    </div>

    <BottomNav active="cards" />
  </div>
);
