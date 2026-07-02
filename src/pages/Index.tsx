import { Link } from "react-router-dom";
import { Apple, Smartphone } from "lucide-react";
import logo from "@/assets/kognit-logo.png";
import { PhoneFrame } from "@/components/kognit/PhoneFrame";
import { OnboardingScreen } from "./kognit/Onboarding";
import { HomeScreen } from "./kognit/Home";
import { TiltScreen } from "./kognit/Tilt";
import { CardsScreen } from "./kognit/Cards";
import { CalendarScreen } from "./kognit/Calendar";
import { ProfileScreen } from "./kognit/Profile";
import { CommunityScreen } from "./kognit/Community";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="px-6 md:px-8 pt-14 pb-16 max-w-6xl mx-auto">
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

        <div className="mt-12">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            ● DIARIO MENTAL - ENTRENAMIENTO MENTAL - COMUNIDAD
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
            <span className="block">Vuelve al foco</span>
            <span className="text-gradient block">Se convierte en rendimiento.</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            Reset en segundos, herramientas prácticas para volver al presente, rituales diarios de conexión y una comunidad que comparte el camino hacia un rendimiento mental más sólido.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/auth" className="bg-gradient-primary text-primary-foreground font-bold px-6 py-3 rounded-full shadow-soft text-sm">
              Crear una cuenta
            </Link>
            <a href="#prototipo" className="bg-card border border-border font-bold px-6 py-3 rounded-full text-sm">
              Ver prototipo
            </a>
            <a href="#" className="flex items-center gap-2 bg-foreground text-background font-bold px-5 py-2.5 rounded-full text-sm">
              <Apple size={20} />
              <span className="text-left leading-tight">
                <span className="block text-[9px] font-normal opacity-70 uppercase tracking-wide">Descargar en</span>
                <span className="block text-sm font-bold -mt-0.5">App Store</span>
              </span>
            </a>
            <a href="#" className="flex items-center gap-2 bg-foreground text-background font-bold px-5 py-2.5 rounded-full text-sm">
              <Smartphone size={20} />
              <span className="text-left leading-tight">
                <span className="block text-[9px] font-normal opacity-70 uppercase tracking-wide">Disponible en</span>
                <span className="block text-sm font-bold -mt-0.5">Google Play</span>
              </span>
            </a>
          </div>
        </div>
      </header>

      <main id="prototipo" className="px-6 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-primary">Prototipo interactivo</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">Así se ve por dentro</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-16">
          <PhoneFrame label="01 · Onboarding"><OnboardingScreen /></PhoneFrame>
          <PhoneFrame label="02 · Inicio"><HomeScreen /></PhoneFrame>
          <PhoneFrame label={"03 · RESET\u00a0"}><TiltScreen /></PhoneFrame>
          <PhoneFrame label="04 · Cartas Mentales"><CardsScreen /></PhoneFrame>
          <PhoneFrame label="05 · Diario · Calendario"><CalendarScreen /></PhoneFrame>
          <PhoneFrame label="06 · Comunidad"><CommunityScreen /></PhoneFrame>
          <PhoneFrame label="07 · Perfil del Usuario"><ProfileScreen /></PhoneFrame>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        kognit · diseñado para usar bajo presión
      </footer>
    </div>
  );
};

export default Index;
