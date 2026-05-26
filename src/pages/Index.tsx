import { Link } from "react-router-dom";
import logo from "@/assets/kognit-logo.png";
import { PhoneFrame } from "@/components/kognit/PhoneFrame";
import { OnboardingScreen } from "./kognit/Onboarding";
import { HomeScreen } from "./kognit/Home";
import { TiltScreen } from "./kognit/Tilt";
import { CardsScreen } from "./kognit/Cards";
import { TrackingScreen } from "./kognit/Tracking";
import { CalendarScreen } from "./kognit/Calendar";
import { ProfileScreen } from "./kognit/Profile";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="px-8 pt-14 pb-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Kognit" className="w-14 h-14 object-contain" />
          <div>
            <p className="text-xl font-bold tracking-tight">kognit</p>
            <p className="text-xs text-muted-foreground font-medium">Entrenamiento mental&nbsp;</p>
          </div>
        </div>

        <div className="mt-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            ● Rendimiento mental para poker
          </span>
          <h1 className="mt-5 text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
            <span>Vuelve al foco</span>
            <br />
            <span className="text-gradient">Decide afilado.</span>
          </h1>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-lg">
            Herramienta de rendimiento mental para jugadores de poker. 
            <br />
            Reset de tilt en 90 segundos. Cartas accionables para jugar mejor bajo presión y registro inteligente de enfoque en tiempo real.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/auth" className="bg-gradient-primary text-primary-foreground font-bold px-6 py-3 rounded-full shadow-soft text-sm">
              Entrar a la app →
            </Link>
            <a href="#prototipo" className="bg-card border border-border font-bold px-6 py-3 rounded-full text-sm">
              Ver prototipo
            </a>
          </div>
        </div>
      </header>

      <main id="prototipo" className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16 place-items-center">
          <PhoneFrame label="01 · Onboarding"><OnboardingScreen /></PhoneFrame>
          <PhoneFrame label="02 · Inicio"><HomeScreen /></PhoneFrame>
          <PhoneFrame label="03 · Reset de Tilt"><TiltScreen /></PhoneFrame>
          <PhoneFrame label="04 · Cartas Mentales"><CardsScreen /></PhoneFrame>
          <PhoneFrame label="05 · Diario · Calendario"><CalendarScreen /></PhoneFrame>
          <PhoneFrame label="06 · Registro Emocional"><TrackingScreen /></PhoneFrame>
          <PhoneFrame label="07 · Perfil del Jugador"><ProfileScreen /></PhoneFrame>
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        kognit · diseñado para usar bajo presión
      </footer>
    </div>
  );
};

export default Index;
