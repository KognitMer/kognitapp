export type MentalCard = {
  title: string;
  message: string;
  action: string;
};

export type CardCategory = {
  id: string;
  name: string;
  tagline: string;
  accent: "primary" | "destructive" | "warning" | "accent";
  cards: MentalCard[];
};

export const CATEGORIES: CardCategory[] = [
  {
    id: "tilt",
    name: "Control de tilt",
    tagline: "Cortá la reacción antes que decida por vos.",
    accent: "destructive",
    cards: [
      { title: "No persigas pérdidas", message: "El tilt te quiere recuperar todo en una mano. Ese no es tu plan.", action: "Jugá solo manos fuertes por 2 rondas." },
      { title: "Pausa obligatoria", message: "La próxima decisión va a salir del enojo, no del análisis.", action: "No jugar la próxima mano." },
      { title: "Bajá la activación", message: "Tu pulso decide por vos. Bajalo antes de actuar.", action: "Respirá 4-7-8 una vez. Después seguís." },
      { title: "Cerrá la mesa caliente", message: "Hay mesas que te leen tilteado y se aprovechan.", action: "Cerrá la mesa donde perdiste y abrí otra." },
      { title: "Un buy-in es muestra", message: "Una mano es ruido. Mil manos son señal.", action: "Recordá tu winrate de los últimos 3 meses." },
    ],
  },
  {
    id: "focus",
    name: "Foco",
    tagline: "Volvé al rango. Volvé al presente.",
    accent: "primary",
    cards: [
      { title: "Volvé al rango", message: "Estás jugando manos, no rangos. Eso es ego.", action: "Revisar rango antes de actuar." },
      { title: "Una decisión a la vez", message: "El resultado anterior no juega esta mano.", action: "Ignorar la mano previa. Mirar solo este spot." },
      { title: "Cerrá pestañas", message: "Cada distracción te roba EV.", action: "Cerrar Twitch, Discord y notificaciones." },
      { title: "Reset de 90 segundos", message: "Tu cabeza se vació. Recargala antes de la próxima.", action: "Mirá un punto fijo 90 seg. Sin pantalla." },
    ],
  },
  {
    id: "decisions",
    name: "Toma de decisiones",
    tagline: "Pensá en EV, no en resultado.",
    accent: "accent",
    cards: [
      { title: "Pensá la peor mano del rival", message: "Estás asumiendo bluffs que no existen.", action: "Listá 3 manos que te ganan. ¿Sigue el call?" },
      { title: "Pot odds primero", message: "Tu intuición miente. La matemática no.", action: "Calcular pot odds antes de cualquier call." },
      { title: "¿Por qué apostás?", message: "Si no tenés un motivo claro, no es una apuesta.", action: "Definir: value, bluff o protección." },
      { title: "Posición manda", message: "Fuera de posición jugás un juego distinto.", action: "Achicar rango si estás OOP." },
      { title: "Resultado ≠ decisión", message: "Una buena jugada puede perder. No la cambies.", action: "Anotá la mano para revisar fría." },
    ],
  },
  {
    id: "discipline",
    name: "Disciplina",
    tagline: "Respetá el plan que armaste sin emoción.",
    accent: "warning",
    cards: [
      { title: "Respetá tu plan", message: "El plan se arma frío. La sesión es ejecución.", action: "No improvisar. Volver al plan escrito." },
      { title: "No fuerces spots", message: "Si tenés que pensar mucho si jugar, no lo juegues.", action: "Esperar ventaja real antes de entrar." },
      { title: "Stop-loss activo", message: "Pusiste un límite por algo. Era tu vos lúcido.", action: "Si llegaste al stop-loss, cerrá. Sin excepción." },
      { title: "Bankroll primero", message: "El stake correcto es el que no te tiltea.", action: "Bajar de stake si dudás del próximo buy-in." },
    ],
  },
  {
    id: "recovery",
    name: "Recuperación",
    tagline: "Cerrá fuerte, no perfecto.",
    accent: "primary",
    cards: [
      { title: "Cerrá la sesión", message: "Querer 'recuperar' es la trampa. Cerrá.", action: "Cerrar el cliente ahora. Revisión mañana." },
      { title: "Despegá del resultado", message: "El cuerpo necesita salir del modo juego.", action: "10 min de caminata sin pantalla." },
      { title: "Hidratate y comé", message: "Glucosa baja = decisiones malas.", action: "Agua + algo sólido antes de seguir." },
      { title: "Anotá una sola cosa", message: "El review largo viene después. Ahora una sola.", action: "Escribir 1 frase: ¿qué aprendiste hoy?" },
      { title: "Dormí", message: "Mañana sos otro jugador. Mejor.", action: "Apagar notificaciones de poker hasta mañana." },
    ],
  },
];

export function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}