export type MentalCard = {
  title: string;
  message: string;
  action: string;
};

export type CardCategory = {
  id: string;
  name: string;
  tagline: string;
  accent: "primary" | "destructive" | "warning" | "accent" | "info" | "violet" | "gold" | "seafoam";
  cards: MentalCard[];
};

export const CATEGORIES: CardCategory[] = [
  {
    id: "habits",
    name: "Formación de hábitos",
    tagline: "Construí identidad, no solo rutina.",
    accent: "seafoam",
    cards: [
      { title: "Identidad, no resultados", message: "No digas “estoy intentando correr”, decí “soy un corredor”. Es más fácil sostener un hábito que se alinea con quién creés que sos. — James Clear", action: "Centrate en tu identidad, no en tus resultados." },
      { title: "Regla de los dos minutos", message: "Todo hábito nuevo tiene que poder arrancar en menos de dos minutos. Primero estandarizá, después optimizá: lo importante es empezar. — James Clear", action: "Reducí tu próximo hábito a una versión de menos de 2 minutos." },
      { title: "El ciclo del hábito", message: "Todo hábito sigue 4 pasos: señal (el disparador), anhelo (la motivación), respuesta (la acción) y recompensa (la satisfacción). — James Clear", action: "Identificá la señal que dispara tu próximo hábito." },
      { title: "Acumulación de hábitos", message: "Usá la fórmula: “Después de [hábito actual], voy a hacer [hábito nuevo]”. Por ejemplo: “después de servirme el café, medito un minuto”. — James Clear", action: "Elegí un hábito que ya tenés y enganchale uno nuevo detrás." },
      { title: "El entorno diseña tus hábitos", message: "El entorno genera señales todo el tiempo. Si querés comer sano, poné fruta a la vista; si querés leer, dejá el libro sobre la almohada. — James Clear", action: "Hacé visible una señal de un buen hábito que querés instalar." },
      { title: "El autocontrol es un mito", message: "Las personas disciplinadas no tienen más fuerza de voluntad: diseñan su entorno para no toparse con la tentación. Evitarla es más fácil que resistirla. — James Clear", action: "Sacá de tu entorno una tentación en vez de prometer resistirla." },
      { title: "Nunca dos veces seguidas", message: "Faltar un día es un error normal. Faltar dos es el inicio de un hábito nuevo — y malo. Lo que importa es la recuperación inmediata. — James Clear", action: "Si ayer fallaste, hoy retomá sin excusas." },
      { title: "Contrato de hábitos", message: "Firmá un compromiso escrito con alguien que te haga de socio corresponsable. Saber que hay un costo social si fallás sostiene la constancia. — James Clear", action: "Contale a alguien tu compromiso y pedile que te lo reclame si fallás." },
      { title: "Hacelo invisible", message: "Si el celular te distrae, dejalo en otra habitación. Si mirás mucha tele, desenchufala. Sacar la señal visual es la forma más efectiva de cortar el ciclo. — James Clear", action: "Sacá de tu vista la señal de tu peor hábito hoy mismo." },
      { title: "El momento decisivo", message: "Pequeñas elecciones, como ponerte la ropa de entrenar, definen si las próximas dos horas van a ser productivas o no. — James Clear", action: "Identificá la primera decisión de tu bloque y resolvela a favor del hábito." },
    ],
  },
  {
    id: "focus",
    name: "Foco y concentración",
    tagline: "Una tarea, toda tu intensidad.",
    accent: "info",
    cards: [
      { title: "Residuo de atención", message: "Cuando pasás de una tarea a otra, tu atención no viaja entera: una parte se queda pegada en lo anterior y te baja el rendimiento. — Sophie Leroy", action: "Cerrá mentalmente la tarea anterior antes de arrancar la siguiente." },
      { title: "La fórmula del trabajo de calidad", message: "Calidad = tiempo invertido × intensidad de concentración. Si trabajás distraído, la intensidad cae y el resultado es pobre aunque le metas horas. — Cal Newport", action: "Antes de empezar, eliminá una distracción concreta de tu entorno." },
      { title: "Trabajo profundo", message: "Es la actividad hecha en un estado de concentración total, libre de distracciones, que lleva tu capacidad cognitiva al límite y genera valor real. — Cal Newport", action: "Bloqueá 30 minutos sin notificaciones para una sola tarea." },
      { title: "Entrená el músculo de la atención", message: "Programá horarios fijos para usar internet y quedate desconectado el resto del día. Resistir el impulso de “mirar algo rápido” entrena tu cerebro contra la gratificación instantánea. — Cal Newport", action: "Definí un horario de pantalla hoy y respetalo fuera de esa franja." },
      { title: "Técnica Roosevelt", message: "Asignale a una tarea difícil un plazo drásticamente corto y comprometete en voz alta a cumplirlo. La presión te empuja a una intensidad extrema. — Cal Newport", action: "Ponele a tu próxima tarea un plazo más corto del que te gustaría." },
      { title: "Ritual de cierre", message: "Anotá todo lo pendiente para mañana y cerrá el día con una frase en voz alta, tipo “día terminado”. Tu mente deja de tener que recordarlo. — Cal Newport", action: "Anotá tus pendientes de mañana y decí en voz alta que el día terminó." },
      { title: "Aprendé a aburrirte", message: "Si escapás del aburrimiento mirando el celular todo el tiempo, le enseñás a tu cerebro a distraerse. Tolerar el aburrimiento es lo que después te permite concentrarte profundo. — Cal Newport", action: "La próxima vez que te aburras, no agarres el celular: sostenelo 2 minutos." },
      { title: "El límite real de la concentración", message: "Incluso los expertos sostienen concentración profunda un máximo de 4 horas por día; un principiante se agota en una sola hora. No fuerces más de lo que tu cerebro puede procesar. — Anders Ericsson", action: "Programá tu bloque de foco más exigente según tu nivel real, no el ideal." },
      { title: "El test del recién graduado", message: "Preguntate cuánto tardaría un recién graduado inteligente en aprender a hacer esa tarea. Si la respuesta es “poco”, es superficial y no genera valor real. — Cal Newport", action: "Aplicá ese test a tu próxima tarea antes de priorizarla." },
      { title: "Agrupá, no revises todo el tiempo", message: "Chequear el mail cada 10 minutos destruye tu foco. La “semidistracción” constante es enemiga del rendimiento alto: agrupá la revisión en bloques fijos. — Cal Newport", action: "Definí 2 o 3 horarios fijos del día para revisar mensajes." },
    ],
  },
  {
    id: "mindfulness",
    name: "Mindfulness y Respiración",
    tagline: "Tu aire ordena tu mente.",
    accent: "violet",
    cards: [
      { title: "Respirar para pensar", message: "Frente a una emoción fuerte, una respiración profunda crea una separación física entre vos y esa emoción, y te da tiempo para inyectar lógica antes de reaccionar. — Jared Tendler", action: "Tomá una respiración profunda antes de responder a algo que te alteró." },
      { title: "Entropía psíquica", message: "Sin algo externo en qué enfocarse, la mente divaga sola — y tiende a ir hacia pensamientos dolorosos, frustraciones o rencores. — Mihaly Csikszentmihalyi", action: "Si tu mente divaga sin rumbo, dale un foco concreto a propósito." },
      { title: "Naturaleza como recarga", message: "Caminar en un entorno natural repone tus reservas de atención dirigida, según la Teoría de la Restauración de la Atención. — Marc Berman", action: "Salí a caminar 10 minutos al aire libre, sin pantalla." },
      { title: "Meditación productiva", message: "Elegí un único problema bien definido y pensalo mientras caminás o hacés algo físico rutinario. Si tu mente se va, traela de vuelta al problema. — Cal Newport", action: "En tu próxima caminata, llevá un solo problema para pensar." },
      { title: "Inventario de fisiología", message: "Revisá tus hombros, tu respiración y tu postura. Cambiar el cuerpo — postura y aire — cambia el estado mental. — Robert Dilts", action: "Hacé ahora un chequeo de hombros, respiración y postura." },
      { title: "Microflujo", message: "Gestos chicos como silbar o tamborilear los dedos son “microflujo”: mantienen un orden mental mínimo. Privarte de ellos te puede volver irritable en pocas horas. — Mihaly Csikszentmihalyi", action: "No te reprimas un gesto chico que te calma — dejalo pasar." },
      { title: "Tu vida es tu atención", message: "Tu vida es la suma de aquello a lo que le prestás atención. La calidad de tu experiencia depende de enfocar tu energía psíquica en metas que valgan la pena. — Winifred Gallagher", action: "Elegí, ahora, a qué le vas a prestar atención la próxima hora." },
      { title: "Respirar para activarte", message: "Si te sentís bajo de energía, respiraciones rápidas y profundas suben tu nivel de alerta — el lado opuesto al que necesitás cuando estás sobreactivado. — Jared Tendler", action: "Si estás desmotivado, hacé 5 respiraciones rápidas y profundas." },
      { title: "La atención ordena la mente", message: "Concentrarte intensamente en algo no deja lugar para preocupaciones ni ruido irrelevante. De ahí sale la sensación de paz y control. — Mihaly Csikszentmihalyi", action: "Elegí una sola cosa para hacer ahora, con atención completa." },
      { title: "Ocio con propósito", message: "El tiempo libre sin estructura puede generar inquietud. Dale a tu ocio una meta — aprender algo, un deporte — para que la mente no caiga en el caos. — Mihaly Csikszentmihalyi", action: "Elegí una meta chica para tu próximo rato libre." },
    ],
  },
  {
    id: "stress",
    name: "Manejo del estrés y Emociones",
    tagline: "Bajá la emoción antes de decidir.",
    accent: "destructive",
    cards: [
      { title: "Umbral emocional", message: "Cuando la emoción supera cierto umbral, el cerebro apaga las funciones superiores de pensamiento. No podés razonar ahí: primero hay que bajar la emoción. — Jared Tendler", action: "Si estás muy alterado, no decidas todavía: bajá la intensidad primero." },
      { title: "Reencuadre", message: "Preguntate qué intención positiva esconde ese pensamiento o miedo — por ejemplo, “este miedo trata de protegerme”. Reconocer su función te permite buscar una alternativa más sana. — Robert Dilts", action: "Identificá qué intenta protegerte tu último pensamiento negativo." },
      { title: "Inyección de lógica", message: "Tené escrita de antemano una frase lógica y potente — como “es solo varianza, seguí tu plan” — y leela cuando sientas que perdés el control. Reactiva tu mente racional. — Jared Tendler", action: "Escribí ahora tu frase de inyección de lógica para usar en crisis." },
      { title: "Actuá como si", message: "Visualizá el objetivo ya alcanzado y practicá hoy los comportamientos de esa versión de vos. Estimula la neurología del éxito. — Robert Dilts", action: "Hacé hoy una acción concreta de la persona que querés ser." },
      { title: "No hay fracaso, hay datos", message: "No existe el fracaso, solo realimentación. Tratá cada error como un científico: datos para mejorar el próximo experimento. — James Clear / Robert Dilts", action: "Anotá una lección concreta de tu último error, sin juzgarte." },
      { title: "Reescribí la pregunta", message: "Cambiá “¿qué pasa si fracaso?” por “¿qué necesito hacer ahora para darme la mejor oportunidad de éxito?”. Cambiar la pregunta reduce la incertidumbre. — Jared Tendler", action: "Reformulá tu preocupación actual con esa segunda pregunta." },
      { title: "Anclaje", message: "Asociá un gesto físico — como apretar un puño — con un recuerdo de calma total. Repetir ese gesto en momentos de estrés recupera parte de ese estado. — Robert Dilts", action: "Elegí tu gesto ancla y practicalo ahora con un recuerdo de calma." },
      { title: "Tilt de merecimiento", message: "Creer que por esforzarte “merecés” ganar genera tilt. Los resultados de corto plazo son variables por naturaleza — aceptarlo libera el estrés. — Jared Tendler", action: "Repetí: “el resultado de hoy no mide si lo merecía”." },
      { title: "El mapa no es el territorio", message: "Tus creencias no son la realidad, son tu representación de ella. Si tu mapa actual te genera estrés, expandilo con una perspectiva nueva. — Alfred Korzybski", action: "Buscá una segunda lectura posible de la situación que te estresa." },
      { title: "La intención detrás de la crítica", message: "Preguntate qué intenta proteger o mejorar quien te critica. Responder a esa necesidad real, en vez de al ataque, cambia toda la conversación. — Robert Dilts", action: "Ante la próxima crítica, buscá la intención antes de reaccionar." },
    ],
  },
  {
    id: "performance",
    name: "Rendimiento mental",
    tagline: "La excelencia se entrena, no se improvisa.",
    accent: "gold",
    cards: [
      { title: "El equilibrio del flow", message: "El flujo aparece en el punto exacto donde el desafío iguala tu habilidad: ni tan fácil que te aburra, ni tan difícil que te angustie. — Mihaly Csikszentmihalyi", action: "Subí o bajá la dificultad de tu tarea actual hasta sentir ese punto." },
      { title: "Práctica deliberada", message: "Concentrate en una destreza específica, repetila y buscá feedback inmediato. Así se acelera el aprendizaje real. — Anders Ericsson", action: "Elegí una sola destreza para practicar con feedback hoy." },
      { title: "Dominio bajo presión", message: "Una habilidad está dominada recién cuando sale bien bajo presión extrema. Si se rompe con el estrés, todavía hay trabajo por hacer. — Jared Tendler", action: "Probá tu habilidad más nueva en una situación de presión real." },
      { title: "Metas con feedback inmediato", message: "El flujo necesita metas que te digan, segundo a segundo, si te estás acercando. Eso mantiene tu energía enfocada y lejos de las distracciones. — Mihaly Csikszentmihalyi", action: "Definí una meta de esta sesión que puedas medir en el momento." },
      { title: "Recorrido mental", message: "Asociá lo que querés recordar con objetos de una casa conocida y recorrela mentalmente. Visualizar funciona mejor que repetir. — Ron White", action: "Probá memorizar 3 datos asociándolos a objetos de tu casa." },
      { title: "La oruga (Inchworm)", message: "Tu rendimiento tiene un mejor nivel y un peor nivel. Mejorar de verdad significa subir el peor nivel, para que toda tu base avance. — Jared Tendler", action: "Identificá tu peor nivel actual y elegí una mejora concreta para él." },
      { title: "Pocas metas, bien ambiciosas", message: "No más de 2 o 3 metas ambiciosas a la vez. El entusiasmo genuino por algo que te atrae te protege de las distracciones triviales. — Cal Newport", action: "Recortá tu lista de metas a un máximo de 3." },
      { title: "El ritual de inicio", message: "Un ritual fijo de arranque le avisa a tu cerebro que es hora de concentrarse, y reduce la fricción de entrar en profundidad. — Cal Newport", action: "Definí un ritual corto y repetible para arrancar tus sesiones de foco." },
      { title: "Cuerpo y mente en equilibrio", message: "Atletas necesitan disciplina mental para rendir; pensadores necesitan salud física para sostener horas de concentración. Cuerpo y mente se entrenan juntos. — Mihaly Csikszentmihalyi", action: "Sumá hoy una acción física, aunque sea corta, a tu rutina mental." },
      { title: "Confianza real vs. ilusoria", message: "Una confianza estable se apoya en hechos y habilidades probadas, no en rachas de suerte. No depende de los resultados de corto plazo, sino de la calidad de tu proceso. — Jared Tendler", action: "Listá 1 hecho concreto (no un resultado) que sostiene tu confianza." },
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
