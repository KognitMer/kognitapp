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
    name: "Tilt",
    tagline: "Cortá la reacción antes que decida por vos.",
    accent: "destructive",
    cards: [
      { title: "Detectá la señal antes", message: "El tilt avisa antes de explotar: pulso, mandíbula, respiración corta. Leelo a tiempo.", action: "Escaneá tu cuerpo 5 segundos. ¿Dónde está la tensión?" },
      { title: "Lógica contra la ira", message: "La ira quiere venganza. La lógica quiere EV. Elegí cuál juega la próxima mano.", action: "Antes de actuar, decí en voz baja el motivo técnico de tu jugada." },
      { title: "La varianza no juzga", message: "Perder una mano bien jugada no es un error. Es estadística trabajando.", action: "Repetí: 'jugué bien, perdí la mano. Sigo el plan'." },
      { title: "Silenciá al yo crítico", message: "La voz que te insulta después de una mano no es coach. Es ruido.", action: "Nombrala: 'esa es la voz crítica'. Y volvé al spot." },
      { title: "Vaciá el tanque emocional", message: "La emoción acumulada se descarga en la peor decisión. Soltala antes.", action: "Levantate, exhalá fuerte 3 veces, sacudí los brazos." },
    ],
  },
  {
    id: "focus",
    name: "Foco",
    tagline: "Una mano. Un rango. Un presente.",
    accent: "primary",
    cards: [
      { title: "Observá las costuras", message: "Los detalles chicos del rival cuentan la historia: timing, sizing, líneas raras.", action: "Antes de actuar, listá 1 detalle nuevo del villano." },
      { title: "Solo esta mano", message: "La anterior ya no juega. La próxima todavía no existe. Esta sí.", action: "Mirá tus cartas como si fuera tu primera mano de la sesión." },
      { title: "Entrá en la zona", message: "La zona no llega sola. Se invita con un ritual corto y repetible.", action: "Postura recta, hombros abajo, 3 respiraciones lentas. Empezá." },
      { title: "Calidad antes que resultados", message: "El resultado es ruido. La calidad de la decisión es la señal.", action: "Calificá tu última decisión del 1 al 5. Sin mirar el bote." },
      { title: "Diversificá tus metas diarias", message: "Si tu única meta es ganar, perder te rompe. Sumá metas de proceso.", action: "Definí 1 meta técnica para esta sesión (ej: leer rangos OOP)." },
    ],
  },
  {
    id: "decisions",
    name: "Toma de decisiones",
    tagline: "EV primero. Resultado después.",
    accent: "accent",
    cards: [
      { title: "Cambiá el marco mental", message: "Si el spot te paraliza, cambiá la pregunta: no '¿gano o pierdo?', sino '¿qué hace el mejor jugador acá?'.", action: "Reformulá el spot en una sola pregunta técnica." },
      { title: "Intuición vs. yo crítico", message: "La intuición entrenada es señal. El miedo disfrazado de intuición es trampa.", action: "Antes de hacer caso a la corazonada, pedí 1 razón concreta." },
      { title: "Verificá tus mapas mentales", message: "El rango que asumiste hace 5 manos puede ya no ser cierto.", action: "Actualizá el rango del villano antes del próximo street." },
      { title: "Decidí desde la maestría", message: "No juegues como el que querés ser. Jugá como el mejor que ya sos.", action: "Hacé la jugada que harías si estuvieras en tu mejor día." },
      { title: "Analizá sin juzgar", message: "Revisar manos para aprender no es lo mismo que castigarte.", action: "Anotá la mano. Una línea técnica, cero adjetivos." },
    ],
  },
  {
    id: "discipline",
    name: "Disciplina",
    tagline: "Respetá el plan que armaste sin emoción.",
    accent: "warning",
    cards: [
      { title: "Estructurá tu éxito", message: "El talento sin estructura se dispersa. La rutina convierte talento en winrate.", action: "Definí horario de inicio, duración y stop-loss antes de sentarte." },
      { title: "Conectá con tus valores", message: "Cuando sabés por qué jugás, las decisiones difíciles se vuelven obvias.", action: "Escribí en una línea por qué estás en esta sesión." },
      { title: "La base mínima importa", message: "Sueño, agua, comida, postura. Sin base, no hay A-game posible.", action: "Chequeá: ¿dormiste bien, comiste y estás hidratado?" },
      { title: "Del 'debo' al 'quiero'", message: "Jugar desde la obligación cansa. Jugar desde la elección rinde.", action: "Reformulá: 'elijo jugar esta sesión porque ___'." },
      { title: "Descanso es rendimiento", message: "Parar a tiempo es parte del juego. No es debilidad, es gestión.", action: "Programá un break de 5 minutos cada 60 de juego." },
    ],
  },
  {
    id: "resilience",
    name: "Resiliencia",
    tagline: "Estable adentro, aunque afuera tiemble.",
    accent: "primary",
    cards: [
      { title: "Tu confianza es estable", message: "Tu nivel no se mide en una sesión. Se mide en miles de manos.", action: "Recordá tu winrate de los últimos 3 meses antes de dudar." },
      { title: "Feedback, no fracaso", message: "Cada error bien revisado es una mano que ya no vas a volver a perder.", action: "Convertí el último error en 1 regla concreta para mañana." },
      { title: "Estabilidad interior total", message: "El resultado de una mano no define quién sos como jugador.", action: "Respirá lento 4-7-8 una vez. Volvé al centro." },
      { title: "Aceptá el caos necesario", message: "La varianza no es un castigo, es la condición del juego.", action: "Decí: 'esto es parte del juego' y seguí el plan." },
      { title: "El museo de creencias", message: "Algunas creencias tuyas sobre poker ya no te sirven. Visitalas y dejalas ir.", action: "Identificá 1 creencia vieja que hoy te limita." },
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
