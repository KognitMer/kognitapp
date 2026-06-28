import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Brain, ArrowRight, Loader2 } from "lucide-react";
import logo from "@/assets/kognit-logo.png";

type Mode = "login" | "signup" | "forgot";

export default function Auth() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/app");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast({ title: "Revisá tu email", description: "Si el email está disponible, te enviamos un link de confirmación." });
        setMode("login");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({ title: "Email enviado", description: "Si el email está registrado, recibirás un link para resetear tu clave." });
        setMode("login");
      }
    } catch (err: any) {
      console.error("[auth]", err);
      const generic =
        mode === "login"
          ? "Email o contraseña inválidos."
          : mode === "signup"
          ? "No pudimos completar el registro. Probá nuevamente."
          : "No pudimos procesar la solicitud. Probá nuevamente.";
      toast({ title: "Error", description: generic, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const guest = async () => {
    setLoading(true);
    const rand = Math.random().toString(36).slice(2, 10);
    const { error } = await supabase.auth.signUp({
      email: `guest_${rand}@kognit.app`,
      password: `Guest_${rand}_${Date.now()}`,
      options: { data: { display_name: "Usuario" } },
    });
    setLoading(false);
    if (error) {
      console.error("[auth:guest]", error);
      toast({ title: "Error", description: "No pudimos crear la sesión de invitado.", variant: "destructive" });
    } else {
      navigate("/app");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="Kognit" className="w-12 h-12 object-contain" />
          <div>
            <p className="text-xl font-bold tracking-tight">kognit</p>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest">Rendimiento mental · Poker</p>
          </div>
        </div>

        <div className="bg-card rounded-3xl shadow-card p-7">
          <div className="flex gap-2 mb-6">
            {(["login","signup"] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                  mode === m ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-secondary text-muted-foreground"
                }`}>
                {m === "login" ? "Ingresar" : "Crear cuenta"}
              </button>
            ))}
          </div>

          <h1 className="text-xl font-bold mb-1">
            {mode === "login" && "Entrá en modo juego"}
            {mode === "signup" && "Recuperá el foco"}
            {mode === "forgot" && "Recuperar acceso"}
          </h1>
          <p className="text-sm text-muted-foreground mb-5">
            {mode === "login" && "Tu rendimiento empieza acá."}
            {mode === "signup" && "Empezá a entrenar foco y control bajo presión."}
            {mode === "forgot" && "Te enviamos un link para resetear tu clave."}
          </p>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre de jugador"
                className="w-full px-4 py-3 rounded-xl bg-secondary text-sm font-medium outline-none focus:ring-2 focus:ring-primary" />
            )}
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
              className="w-full px-4 py-3 rounded-xl bg-secondary text-sm font-medium outline-none focus:ring-2 focus:ring-primary" />
            {mode !== "forgot" && (
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña"
                className="w-full px-4 py-3 rounded-xl bg-secondary text-sm font-medium outline-none focus:ring-2 focus:ring-primary" />
            )}

            <button disabled={loading} type="submit"
              className="w-full bg-gradient-primary text-primary-foreground font-bold py-3.5 rounded-xl shadow-soft flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>
                {mode === "login" ? "Entrar al juego" : mode === "signup" ? "Crear cuenta" : "Enviar link"} <ArrowRight size={16} />
              </>}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs">
            {mode === "login" ? (
              <button onClick={() => setMode("forgot")} className="text-primary font-semibold">¿Olvidaste tu clave?</button>
            ) : (
              <button onClick={() => setMode("login")} className="text-primary font-semibold">← Volver</button>
            )}
            <button onClick={guest} disabled={loading} className="text-muted-foreground font-semibold hover:text-primary">
              Continuar como invitado →
            </button>
          </div>

          <Link to="/tilt"
            className="mt-5 block text-center text-xs font-bold text-destructive bg-destructive/10 py-2.5 rounded-xl">
            ⚡ Reset de tilt sin login →
          </Link>
        </div>

        <Link to="/" className="mt-5 block text-center text-xs text-muted-foreground">Ver demo del prototipo</Link>
      </div>
    </div>
  );
}