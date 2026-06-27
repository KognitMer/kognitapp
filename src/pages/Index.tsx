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
        <div className="flex items-center gap-5 md:gap-6 group">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-110" />
            <img
              src={logo}
              alt="Logo de Kognit, app de entrenamiento mental para jugadores de poker"
              className="relative w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline gap-2">
              <p className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">kognit</p>
              <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            </div>
            <span className="mt-1.5 text-base md:text-lg font-medium text-muted-foreground tracking-wide">La ventaja está en tu mente.</span>
          </div>
        </div>

        <div className="mt-12 max-w-4xl">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            ● REGISTRO EMOCIONAL - ENTRENAMIENTO MENTAL - COMUNIDAD
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-justify">
            <span className="inline-block w-full">Vuelve al foco</span>
            <br />
            <span className="text-gradient inline-block w-full">Donde la mente juega a ganar.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed text-justify">
            Reset de tilt en segundos, herramientas prácticas para volver al presente, rituales diarios de conexión y una comunidad que comparte el camino hacia un rendimiento mental más sólido.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/auth" className="bg-gradient-primary text-primary-foreground font-bold px-6 py-3 rounded-full shadow-soft text-sm">
              Crear una cuenta
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
          <PhoneFrame label={"03 · RESET\u00a0"}><TiltScreen /></PhoneFrame>
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
