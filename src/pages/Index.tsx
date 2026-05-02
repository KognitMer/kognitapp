import logo from "@/assets/kognit-logo.png";
import { PhoneFrame } from "@/components/kognit/PhoneFrame";
import { OnboardingScreen } from "./kognit/Onboarding";
import { HomeScreen } from "./kognit/Home";
import { TiltScreen } from "./kognit/Tilt";
import { CardsScreen } from "./kognit/Cards";
import { TrackingScreen } from "./kognit/Tracking";
import { ProfileScreen } from "./kognit/Profile";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero header */}
      <header className="px-8 pt-14 pb-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Kognit" className="w-12 h-12 object-contain" />
          <div>
            <p className="text-xl font-bold tracking-tight">kognit</p>
            <p className="text-xs text-muted-foreground font-medium">Mental training for poker minds</p>
          </div>
        </div>

        <div className="mt-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            ● Mobile prototype
          </span>
          <h1 className="mt-5 text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
            Stay calm. <br />
            <span className="text-gradient">Play sharper.</span>
          </h1>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-lg">
            A pocket coach for poker players and cognitive athletes. Recover from tilt in seconds, reset your focus between hands, and train the mental edge that separates winners from the rest.
          </p>
        </div>
      </header>

      {/* Phones grid */}
      <main className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16 place-items-center">
          <PhoneFrame label="01 · Onboarding"><OnboardingScreen /></PhoneFrame>
          <PhoneFrame label="02 · Home"><HomeScreen /></PhoneFrame>
          <PhoneFrame label="03 · Tilt Emergency"><TiltScreen /></PhoneFrame>
          <PhoneFrame label="04 · Mental Cards"><CardsScreen /></PhoneFrame>
          <PhoneFrame label="05 · Emotional Tracking"><TrackingScreen /></PhoneFrame>
          <PhoneFrame label="06 · Player Profile"><ProfileScreen /></PhoneFrame>
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        kognit · designed for use under pressure
      </footer>
    </div>
  );
};

export default Index;
