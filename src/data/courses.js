const matching = (pairs) => ({
  type: "matching",
  prompt: "Relaciona cada frase con su significado. Arrastra o pulsa un recuadro y luego su pareja.",
  pairs,
});

const timedMath = (equations, seconds = 120) => ({
  type: "timed",
  prompt: "Resuelve las ecuaciones antes de que se acabe el tiempo.",
  seconds,
  equations,
});

const deductor = (puzzle) => ({
  type: "deductor",
  prompt: "Arrastra, completa y escribe qué imprime el bloque de código.",
  ...puzzle,
});

function lessons(items) {
  return items.map((item, i) => ({
    id: String(i + 1),
    number: i + 1,
    title: item.title,
    exercise: item.exercise,
  }));
}

const under12English = lessons([
  { title: "COLORES", exercise: matching([
    { id: "c1", left: "RED", right: "ROJO" },
    { id: "c2", left: "BLUE", right: "AZUL" },
    { id: "c3", left: "GREEN", right: "VERDE" },
    { id: "c4", left: "YELLOW", right: "AMARILLO" },
    { id: "c5", left: "PINK", right: "ROSADO" },
    { id: "c6", left: "BLACK", right: "NEGRO" },
  ]) },
  { title: "ANIMALES", exercise: matching([
    { id: "a1", left: "CAT", right: "GATO" },
    { id: "a2", left: "DOG", right: "PERRO" },
    { id: "a3", left: "BIRD", right: "PAJARO" },
    { id: "a4", left: "FISH", right: "PEZ" },
    { id: "a5", left: "RABBIT", right: "CONEJO" },
    { id: "a6", left: "HORSE", right: "CABALLO" },
  ]) },
  { title: "FAMILIA", exercise: matching([
    { id: "f1", left: "MOM", right: "MAMA" },
    { id: "f2", left: "DAD", right: "PAPA" },
    { id: "f3", left: "SISTER", right: "HERMANA" },
    { id: "f4", left: "BROTHER", right: "HERMANO" },
    { id: "f5", left: "GRANDMA", right: "ABUELA" },
    { id: "f6", left: "FRIEND", right: "AMIGO" },
  ]) },
  { title: "NUMEROS", exercise: matching([
    { id: "n1", left: "ONE", right: "UNO" },
    { id: "n2", left: "TWO", right: "DOS" },
    { id: "n3", left: "THREE", right: "TRES" },
    { id: "n4", left: "FOUR", right: "CUATRO" },
    { id: "n5", left: "FIVE", right: "CINCO" },
    { id: "n6", left: "TEN", right: "DIEZ" },
  ]) },
  { title: "SALUDOS", exercise: matching([
    { id: "s1", left: "HELLO", right: "HOLA" },
    { id: "s2", left: "GOOD MORNING", right: "BUENOS DIAS" },
    { id: "s3", left: "THANK YOU", right: "GRACIAS" },
    { id: "s4", left: "PLEASE", right: "POR FAVOR" },
    { id: "s5", left: "BYE", right: "ADIOS" },
    { id: "s6", left: "YES", right: "SI" },
  ]) },
  { title: "ESCUELA", exercise: matching([
    { id: "e1", left: "BOOK", right: "LIBRO" },
    { id: "e2", left: "PENCIL", right: "LAPIZ" },
    { id: "e3", left: "TEACHER", right: "DOCENTE" },
    { id: "e4", left: "SCHOOL", right: "ESCUELA" },
    { id: "e5", left: "CHAIR", right: "SILLA" },
    { id: "e6", left: "BAG", right: "MOCHILA" },
  ]) },
  { title: "COMIDA", exercise: matching([
    { id: "d1", left: "APPLE", right: "MANZANA" },
    { id: "d2", left: "BREAD", right: "PAN" },
    { id: "d3", left: "WATER", right: "AGUA" },
    { id: "d4", left: "MILK", right: "LECHE" },
    { id: "d5", left: "RICE", right: "ARROZ" },
    { id: "d6", left: "EGG", right: "HUEVO" },
  ]) },
  { title: "CASA", exercise: matching([
    { id: "h1", left: "HOUSE", right: "CASA" },
    { id: "h2", left: "DOOR", right: "PUERTA" },
    { id: "h3", left: "WINDOW", right: "VENTANA" },
    { id: "h4", left: "BED", right: "CAMA" },
    { id: "h5", left: "TABLE", right: "MESA" },
    { id: "h6", left: "KITCHEN", right: "COCINA" },
  ]) },
  { title: "JUEGO", exercise: matching([
    { id: "p1", left: "BALL", right: "PELOTA" },
    { id: "p2", left: "GAME", right: "JUEGO" },
    { id: "p3", left: "SONG", right: "CANCION" },
    { id: "p4", left: "DRAW", right: "DIBUJAR" },
    { id: "p5", left: "RUN", right: "CORRER" },
    { id: "p6", left: "JUMP", right: "SALTAR" },
  ]) },
]);

const over12English1 = lessons([
  { title: "COLORES", exercise: matching([
    { id: "c1", left: "RED", right: "ROJO" },
    { id: "c2", left: "BLUE", right: "AZUL" },
    { id: "c3", left: "GREEN", right: "VERDE" },
    { id: "c4", left: "YELLOW", right: "AMARILLO" },
    { id: "c5", left: "PURPLE", right: "MORADO" },
    { id: "c6", left: "ORANGE", right: "NARANJA" },
  ]) },
  { title: "SALUDOS", exercise: matching([
    { id: "p1", left: "HI, HOW ARE YOU?", right: "HOLA QUE TAL?" },
    { id: "p2", left: "BEAUTIFUL DAY", right: "HERMOSO DIA" },
    { id: "p3", left: "ALL GOOD, AND YOU?", right: "TODO BIEN Y TU" },
    { id: "p4", left: "WHAT TIME IS IT?", right: "QUE HORA ES?" },
    { id: "p5", left: "BAD WEATHER", right: "MAL CLIMA" },
    { id: "p6", left: "I FEEL SICK", right: "ME SIENTO ENFERMO" },
  ]) },
  { title: "RUTINA", exercise: matching([
    { id: "r1", left: "I WAKE UP", right: "ME DESPIERTO" },
    { id: "r2", left: "I STUDY", right: "ESTUDIO" },
    { id: "r3", left: "I HAVE LUNCH", right: "ALMUERZO" },
    { id: "r4", left: "I DO HOMEWORK", right: "HAGO TAREA" },
    { id: "r5", left: "I GO TO SLEEP", right: "ME DUERMO" },
    { id: "r6", left: "I HELP AT HOME", right: "AYUDO EN CASA" },
  ]) },
  { title: "ESCUELA", exercise: matching([
    { id: "e1", left: "CLASSMATE", right: "COMPAÑERO DE CLASE" },
    { id: "e2", left: "HOMEWORK", right: "TAREA" },
    { id: "e3", left: "EXAM", right: "EXAMEN" },
    { id: "e4", left: "NOTEBOOK", right: "CUADERNO" },
    { id: "e5", left: "BREAK TIME", right: "RECREO" },
    { id: "e6", left: "SUBJECT", right: "MATERIA" },
  ]) },
  { title: "SENTIMIENTOS", exercise: matching([
    { id: "t1", left: "I AM HAPPY", right: "ESTOY FELIZ" },
    { id: "t2", left: "I AM TIRED", right: "ESTOY CANSADO" },
    { id: "t3", left: "I AM NERVOUS", right: "ESTOY NERVIOSO" },
    { id: "t4", left: "I AM PROUD", right: "ESTOY ORGULLOSO" },
    { id: "t5", left: "I AM CONFUSED", right: "ESTOY CONFUNDIDO" },
    { id: "t6", left: "I AM CALM", right: "ESTOY TRANQUILO" },
  ]) },
  { title: "CIUDAD", exercise: matching([
    { id: "u1", left: "STREET", right: "CALLE" },
    { id: "u2", left: "MARKET", right: "MERCADO" },
    { id: "u3", left: "HOSPITAL", right: "HOSPITAL" },
    { id: "u4", left: "LIBRARY", right: "BIBLIOTECA" },
    { id: "u5", left: "BUS STOP", right: "PARADA DE BUS" },
    { id: "u6", left: "PARK", right: "PARQUE" },
  ]) },
  { title: "TIEMPO", exercise: matching([
    { id: "w1", left: "TODAY", right: "HOY" },
    { id: "w2", left: "YESTERDAY", right: "AYER" },
    { id: "w3", left: "TOMORROW", right: "MAÑANA" },
    { id: "w4", left: "WEEK", right: "SEMANA" },
    { id: "w5", left: "MONTH", right: "MES" },
    { id: "w6", left: "YEAR", right: "AÑO" },
  ]) },
  { title: "VERBOS", exercise: matching([
    { id: "v1", left: "TO READ", right: "LEER" },
    { id: "v2", left: "TO WRITE", right: "ESCRIBIR" },
    { id: "v3", left: "TO LISTEN", right: "ESCUCHAR" },
    { id: "v4", left: "TO SPEAK", right: "HABLAR" },
    { id: "v5", left: "TO LEARN", right: "APRENDER" },
    { id: "v6", left: "TO PRACTICE", right: "PRACTICAR" },
  ]) },
  { title: "CONVERSACION", exercise: matching([
    { id: "k1", left: "SEE YOU TOMORROW", right: "NOS VEMOS MAÑANA" },
    { id: "k2", left: "PLEASE, HELP ME", right: "POR FAVOR, AYUDAME" },
    { id: "k3", left: "I AM LEARNING", right: "ESTOY APRENDIENDO" },
    { id: "k4", left: "WHERE IS THE SCHOOL?", right: "DONDE ESTA LA ESCUELA?" },
    { id: "k5", left: "THANK YOU VERY MUCH", right: "MUCHAS GRACIAS" },
    { id: "k6", left: "HAVE A NICE DAY", right: "QUE TENGAS UN LINDO DIA" },
  ]) },
]);

const under12Math = lessons([
  { title: "SUMAS", exercise: timedMath([{ expr: "4+5", answer: 9 }, { expr: "7+2", answer: 9 }, { expr: "6+6", answer: 12 }], 90) },
  { title: "RESTAS", exercise: timedMath([{ expr: "9-3", answer: 6 }, { expr: "8-5", answer: 3 }, { expr: "10-4", answer: 6 }], 90) },
  { title: "DECENAS", exercise: timedMath([{ expr: "10+8", answer: 18 }, { expr: "12+7", answer: 19 }, { expr: "15-6", answer: 9 }], 90) },
  { title: "GRUPOS", exercise: timedMath([{ expr: "2x3", answer: 6 }, { expr: "4x2", answer: 8 }, { expr: "5x2", answer: 10 }], 90) },
  { title: "MITADES", exercise: timedMath([{ expr: "8/2", answer: 4 }, { expr: "6/2", answer: 3 }, { expr: "10/2", answer: 5 }], 90) },
  { title: "MIXTO 1", exercise: timedMath([{ expr: "3+4+2", answer: 9 }, { expr: "9-1-3", answer: 5 }, { expr: "2x4", answer: 8 }], 90) },
  { title: "MIXTO 2", exercise: timedMath([{ expr: "5+5+5", answer: 15 }, { expr: "20-7", answer: 13 }, { expr: "3x3", answer: 9 }], 90) },
  { title: "RAPIDEZ", exercise: timedMath([{ expr: "11+9", answer: 20 }, { expr: "14-8", answer: 6 }, { expr: "6x2", answer: 12 }], 60) },
  { title: "RETO", exercise: timedMath([{ expr: "7+8-3", answer: 12 }, { expr: "4x3-2", answer: 10 }, { expr: "18/2+1", answer: 10 }], 90) },
]);

const over12Math = lessons([
  { title: "SUMAS", exercise: timedMath([{ expr: "3+48-23x3+20", answer: 2 }, { expr: "28-71+13x6+11", answer: 46 }, { expr: "48-23+40-15/3+2", answer: 62 }]) },
  { title: "RESTAS", exercise: timedMath([{ expr: "12+8x3-6", answer: 30 }, { expr: "45-9/3+7", answer: 49 }, { expr: "6x5-4+10", answer: 36 }]) },
  { title: "MULTIPLOS", exercise: timedMath([{ expr: "100-25x2+8", answer: 58 }, { expr: "9+16/4x3", answer: 21 }, { expr: "18-3x4+11", answer: 17 }]) },
  { title: "FRACCIONES", exercise: timedMath([{ expr: "12/3+8", answer: 12 }, { expr: "20-15/5", answer: 17 }, { expr: "7x2+9/3", answer: 17 }]) },
  { title: "MIXTO 1", exercise: timedMath([{ expr: "5x6-4x3", answer: 18 }, { expr: "40/5+11", answer: 19 }, { expr: "9+8x2-7", answer: 18 }]) },
  { title: "DESAFIO", exercise: timedMath([{ expr: "3x(4+5)", answer: 27 }, { expr: "36/6x2", answer: 12 }, { expr: "15-3x2+4", answer: 13 }]) },
  { title: "RAPIDEZ", exercise: timedMath([{ expr: "11x3-8", answer: 25 }, { expr: "48/4+7", answer: 19 }, { expr: "2+9x4-6", answer: 32 }]) },
  { title: "PRECISION", exercise: timedMath([{ expr: "81/9+6x2", answer: 21 }, { expr: "14-2x5+8", answer: 12 }, { expr: "7x7-19", answer: 30 }]) },
  { title: "FINAL", exercise: timedMath([{ expr: "5+12x2-9/3", answer: 26 }, { expr: "64/8x3-6", answer: 18 }, { expr: "9x3-4x4", answer: 11 }]) },
]);

const under12Code = lessons([
  { title: "NOMBRE", exercise: deductor({
    lines: [{ text: 'nombre = "Ana"' }, { text: "print(", slot: "slot1", afterText: ")" }],
    blocks: ["nombre", "Ana", "print"],
    slots: { slot1: { prefix: "", accept: "nombre" } },
    output: "Ana",
  }) },
  { title: "SALUDO", exercise: deductor({
    lines: [{ text: 'saludo = "Hola"' }, { text: "print(", slot: "slot1", afterText: ")" }],
    blocks: ["saludo", "Hola", "print"],
    slots: { slot1: { prefix: "", accept: "saludo" } },
    output: "Hola",
  }) },
  { title: "NUMERO", exercise: deductor({
    lines: [{ text: "n = 5" }, { text: "print(", slot: "slot1", afterText: ")" }],
    blocks: ["n", "5", "print"],
    slots: { slot1: { prefix: "", accept: "n" } },
    output: "5",
  }) },
  { title: "SUMA", exercise: deductor({
    lines: [{ text: "a = 2" }, { text: "b = 3" }, { text: "print(a ", slot: "slot1", afterText: ")" }],
    blocks: ["+", "b", "a"],
    slots: { slot1: { prefix: "+", accept: "b" } },
    output: "5",
  }) },
  { title: "COLOR", exercise: deductor({
    lines: [{ text: 'color = "azul"' }, { text: "print(", slot: "slot1", afterText: ")" }],
    blocks: ["color", "azul", "print"],
    slots: { slot1: { prefix: "", accept: "color" } },
    output: "azul",
  }) },
  { title: "TEXTO", exercise: deductor({
    lines: [{ text: 'palabra = "FIF"' }, { text: "print(", slot: "slot1", afterText: ")" }],
    blocks: ["palabra", "FIF", "print"],
    slots: { slot1: { prefix: "", accept: "palabra" } },
    output: "FIF",
  }) },
  { title: "UNION", exercise: deductor({
    lines: [{ text: 'a = "Hola "' }, { text: 'b = "FIF"' }, { text: "print(a ", slot: "slot1", afterText: ")" }],
    blocks: ["+", "b", "a"],
    slots: { slot1: { prefix: "+", accept: "b" } },
    output: "Hola FIF",
  }) },
  { title: "EDAD", exercise: deductor({
    lines: [{ text: "edad = 10" }, { text: "print(", slot: "slot1", afterText: ")" }],
    blocks: ["edad", "10", "print"],
    slots: { slot1: { prefix: "", accept: "edad" } },
    output: "10",
  }) },
  { title: "RETO", exercise: deductor({
    lines: [{ text: 'nombre = "Luz"' }, { text: 'mensaje = "Hola "' }, { text: "print(mensaje ", slot: "slot1", afterText: ")" }],
    blocks: ["nombre", "+", "Luz"],
    slots: { slot1: { prefix: "+", accept: "nombre" } },
    output: "Hola Luz",
  }) },
]);

const over12Code = lessons([
  { title: "VARIABLES", exercise: deductor({
    lines: [{ text: 'nombre = "Ariel"' }, { text: 'mensaje = "Hola "', slot: "slot1" }, { text: "print(", slot: "slot2", afterText: ")" }],
    blocks: ["nombre", "mensaje", "Ariel", "print", "="],
    slots: { slot1: { prefix: "+", accept: "nombre" }, slot2: { prefix: "", accept: "mensaje" } },
    output: "Hola Ariel",
  }) },
  { title: "TEXTOS", exercise: deductor({
    lines: [{ text: 'color = "verde"' }, { text: 'frase = "Mi color es "', slot: "slot1" }, { text: "print(", slot: "slot2", afterText: ")" }],
    blocks: ["color", "frase", "print", "=", "verde"],
    slots: { slot1: { prefix: "+", accept: "color" }, slot2: { prefix: "", accept: "frase" } },
    output: "Mi color es verde",
  }) },
  { title: "SUMA", exercise: deductor({
    lines: [{ text: "a = 4" }, { text: "b = 6" }, { text: "total = a ", slot: "slot1" }, { text: "print(", slot: "slot2", afterText: ")" }],
    blocks: ["total", "b", "+", "print", "a"],
    slots: { slot1: { prefix: "+", accept: "b" }, slot2: { prefix: "", accept: "total" } },
    output: "10",
  }) },
  { title: "RESTA", exercise: deductor({
    lines: [{ text: "puntos = 20" }, { text: "uso = 5" }, { text: "queda = puntos ", slot: "slot1" }, { text: "print(", slot: "slot2", afterText: ")" }],
    blocks: ["queda", "-", "uso", "print"],
    slots: { slot1: { prefix: "-", accept: "uso" }, slot2: { prefix: "", accept: "queda" } },
    output: "15",
  }) },
  { title: "MENSAJES", exercise: deductor({
    lines: [{ text: 'curso = "Ingles"' }, { text: 'texto = "Hoy toca "', slot: "slot1" }, { text: "print(", slot: "slot2", afterText: ")" }],
    blocks: ["curso", "texto", "print", "Ingles"],
    slots: { slot1: { prefix: "+", accept: "curso" }, slot2: { prefix: "", accept: "texto" } },
    output: "Hoy toca Ingles",
  }) },
  { title: "DOBLE", exercise: deductor({
    lines: [{ text: "n = 7" }, { text: "doble = n ", slot: "slot1" }, { text: "print(", slot: "slot2", afterText: ")" }],
    blocks: ["*", "2", "doble", "n"],
    slots: { slot1: { prefix: "*", accept: "2" }, slot2: { prefix: "", accept: "doble" } },
    output: "14",
  }) },
  { title: "TOTALES", exercise: deductor({
    lines: [{ text: "x = 9" }, { text: "y = 3" }, { text: "r = x ", slot: "slot1" }, { text: "print(", slot: "slot2", afterText: ")" }],
    blocks: ["/", "y", "r", "x"],
    slots: { slot1: { prefix: "/", accept: "y" }, slot2: { prefix: "", accept: "r" } },
    output: "3",
  }) },
  { title: "SALIDA", exercise: deductor({
    lines: [{ text: 'a = "FIF"' }, { text: 'b = " Learning"' }, { text: "print(a ", slot: "slot1", afterText: ")" }],
    blocks: ["+", "b", "a", "print"],
    slots: { slot1: { prefix: "+", accept: "b" } },
    output: "FIF Learning",
  }) },
  { title: "RETO FINAL", exercise: deductor({
    lines: [{ text: "vidas = 3" }, { text: "bonus = 2" }, { text: "total = vidas ", slot: "slot1" }, { text: "print(", slot: "slot2", afterText: ")" }],
    blocks: ["+", "bonus", "total", "vidas"],
    slots: { slot1: { prefix: "+", accept: "bonus" }, slot2: { prefix: "", accept: "total" } },
    output: "5",
  }) },
]);

const under12Lang = lessons([
  { title: "PALABRAS", exercise: matching([
    { id: "l1", left: "SUSTANTIVO", right: "NOMBRA PERSONAS O COSAS" },
    { id: "l2", left: "VERBO", right: "ACCION" },
    { id: "l3", left: "ADJETIVO", right: "DESCRIBE" },
    { id: "l4", left: "ORACION", right: "IDEA COMPLETA" },
    { id: "l5", left: "CUENTO", right: "HISTORIA BREVE" },
    { id: "l6", left: "TITULO", right: "NOMBRE DEL TEXTO" },
  ]) },
  { title: "LECTURA", exercise: matching([
    { id: "r1", left: "PERSONAJE", right: "QUIEN APARECE EN LA HISTORIA" },
    { id: "r2", left: "LUGAR", right: "DONDE OCURRE" },
    { id: "r3", left: "INICIO", right: "COMIENZO" },
    { id: "r4", left: "FINAL", right: "CIERRE" },
    { id: "r5", left: "MORALEJA", right: "ENSEÑANZA" },
    { id: "r6", left: "DIALOGO", right: "LO QUE DICEN LOS PERSONAJES" },
  ]) },
  { title: "RIMA", exercise: matching([
    { id: "m1", left: "SOL", right: "FAROL" },
    { id: "m2", left: "CASA", right: "TASA" },
    { id: "m3", left: "LUNA", right: "CUNA" },
    { id: "m4", left: "PAN", right: "JUAN" },
    { id: "m5", left: "FLOR", right: "AMOR" },
    { id: "m6", left: "MAR", right: "BRILLAR" },
  ]) },
  { title: "IDEAS", exercise: matching([
    { id: "i1", left: "TEMA", right: "DE QUE TRATA" },
    { id: "i2", left: "RESUMEN", right: "LO PRINCIPAL EN POCO TEXTO" },
    { id: "i3", left: "EJEMPLO", right: "CASO QUE AYUDA A ENTENDER" },
    { id: "i4", left: "PREGUNTA", right: "SE RESPONDE CON INFORMACION" },
    { id: "i5", left: "ORDEN", right: "PRIMERO, DESPUES, AL FINAL" },
    { id: "i6", left: "DETALLE", right: "DATO PEQUEÑO Y UTIL" },
  ]) },
  { title: "PUNTOS", exercise: matching([
    { id: "s1", left: "PUNTO", right: "CIERRA UNA IDEA" },
    { id: "s2", left: "COMA", right: "HACE UNA PAUSA" },
    { id: "s3", left: "MAYUSCULA", right: "EMPIEZA EL NOMBRE PROPIO" },
    { id: "s4", left: "INTERROGACION", right: "MARCA UNA PREGUNTA" },
    { id: "s5", left: "EXCLAMACION", right: "MARCA EMOCION" },
    { id: "s6", left: "PARRAFO", right: "GRUPO DE ORACIONES" },
  ]) },
  { title: "FABULA", exercise: matching([
    { id: "b1", left: "FABULA", right: "CUENTO CON ENSEÑANZA" },
    { id: "b2", left: "POEMA", right: "TEXTO CON RITMO" },
    { id: "b3", left: "NOTICIA", right: "CUENTA UN HECHO" },
    { id: "b4", left: "INSTRUCCION", right: "EXPLICA COMO HACER ALGO" },
    { id: "b5", left: "CARTA", right: "MENSAJE PARA ALGUIEN" },
    { id: "b6", left: "DESCRIPCION", right: "DICE COMO ES ALGO" },
  ]) },
  { title: "VOCES", exercise: matching([
    { id: "v1", left: "NARRADOR", right: "CUENTA LA HISTORIA" },
    { id: "v2", left: "PROTAGONISTA", right: "PERSONAJE PRINCIPAL" },
    { id: "v3", left: "AUTOR", right: "QUIEN ESCRIBE" },
    { id: "v4", left: "LECTOR", right: "QUIEN LEE" },
    { id: "v5", left: "TITULO", right: "NOMBRE DE LA OBRA" },
    { id: "v6", left: "ESCENA", right: "MOMENTO DE LA HISTORIA" },
  ]) },
  { title: "ORDEN", exercise: matching([
    { id: "o1", left: "PRIMERO", right: "AL INICIO" },
    { id: "o2", left: "LUEGO", right: "DESPUES" },
    { id: "o3", left: "MIENTRAS", right: "AL MISMO TIEMPO" },
    { id: "o4", left: "AL FINAL", right: "PARA CERRAR" },
    { id: "o5", left: "ANTES", right: "CON ANTERIORIDAD" },
    { id: "o6", left: "AHORA", right: "EN ESTE MOMENTO" },
  ]) },
  { title: "CIERRE", exercise: matching([
    { id: "z1", left: "LEER", right: "ENTENDER UN TEXTO" },
    { id: "z2", left: "ESCRIBIR", right: "EXPRESAR CON PALABRAS" },
    { id: "z3", left: "ESCUCHAR", right: "PRESTAR ATENCION" },
    { id: "z4", left: "HABLAR", right: "DECIR IDEAS EN VOZ ALTA" },
    { id: "z5", left: "REVISAR", right: "CORREGIR ANTES DE ENTREGAR" },
    { id: "z6", left: "PRACTICAR", right: "REPETIR PARA MEJORAR" },
  ]) },
]);

const over12Lang = lessons([
  { title: "LECTURA", exercise: matching([
    { id: "l1", left: "METAFORA", right: "COMPARACION IMPLICITA" },
    { id: "l2", left: "NARRADOR", right: "QUIEN CUENTA LA HISTORIA" },
    { id: "l3", left: "PROTAGONISTA", right: "PERSONAJE PRINCIPAL" },
    { id: "l4", left: "RIMA", right: "SONIDO PARECIDO AL FINAL" },
    { id: "l5", left: "FABULA", right: "RELATO CON ENSEÑANZA" },
    { id: "l6", left: "DIALOGOS", right: "CONVERSACION ENTRE PERSONAJES" },
  ]) },
  { title: "IDEA", exercise: matching([
    { id: "i1", left: "IDEA PRINCIPAL", right: "LO MAS IMPORTANTE DEL TEXTO" },
    { id: "i2", left: "IDEA SECUNDARIA", right: "DETALLE QUE APOYA" },
    { id: "i3", left: "INFERENCIA", right: "CONCLUSION A PARTIR DE PISTAS" },
    { id: "i4", left: "RESUMEN", right: "SINTESIS BREVE" },
    { id: "i5", left: "CONTEXTO", right: "SITUACION DEL TEXTO" },
    { id: "i6", left: "TEMA", right: "ASUNTO GENERAL" },
  ]) },
  { title: "PERSONAJES", exercise: matching([
    { id: "p1", left: "ANTAGONISTA", right: "SE OPONE AL PROTAGONISTA" },
    { id: "p2", left: "CARACTERIZACION", right: "COMO SE MUESTRA AL PERSONAJE" },
    { id: "p3", left: "MOTIVACION", right: "POR QUE ACTUA ASI" },
    { id: "p4", left: "CONFLICTO", right: "PROBLEMA CENTRAL" },
    { id: "p5", left: "CLIMAX", right: "MOMENTO DE MAYOR TENSION" },
    { id: "p6", left: "DESENLACE", right: "RESOLUCION" },
  ]) },
  { title: "NARRADOR", exercise: matching([
    { id: "n1", left: "PRIMERA PERSONA", right: "NARRA CON YO" },
    { id: "n2", left: "TERCERA PERSONA", right: "NARRA CON EL O ELLA" },
    { id: "n3", left: "OMNISCIENTE", right: "SABE LO QUE PIENSAN TODOS" },
    { id: "n4", left: "TESTIGO", right: "CUENTA LO QUE VE" },
    { id: "n5", left: "FOCALIZACION", right: "PUNTO DE VISTA ELEGIDO" },
    { id: "n6", left: "VOZ", right: "QUIEN HABLA EN EL TEXTO" },
  ]) },
  { title: "FIGURAS", exercise: matching([
    { id: "g1", left: "SIMIL", right: "COMPARACION CON COMO" },
    { id: "g2", left: "HIPERBOLE", right: "EXAGERACION" },
    { id: "g3", left: "PERSONIFICACION", right: "DAR CUALIDADES HUMANAS" },
    { id: "g4", left: "ONOMATOPEYA", right: "PALABRA QUE IMITA UN SONIDO" },
    { id: "g5", left: "ALITERACION", right: "REPETICION DE SONIDOS" },
    { id: "g6", left: "IRONIA", right: "DECIR LO CONTRARIO DE LO QUE SE SUGIERE" },
  ]) },
  { title: "POEMA", exercise: matching([
    { id: "o1", left: "VERSO", right: "CADA LINEA DEL POEMA" },
    { id: "o2", left: "ESTROFA", right: "GRUPO DE VERSOS" },
    { id: "o3", left: "RITMO", right: "MUSICALIDAD" },
    { id: "o4", left: "METRICA", right: "MEDIDA DEL VERSO" },
    { id: "o5", left: "IMAGEN", right: "PICTURA CON PALABRAS" },
    { id: "o6", left: "TEMA LIRICO", right: "EMOCION O IDEA DEL POEMA" },
  ]) },
  { title: "CUENTO", exercise: matching([
    { id: "u1", left: "PLANTEAMIENTO", right: "PRESENTA MUNDO Y PERSONAJES" },
    { id: "u2", left: "NUDO", right: "SE COMPLICA EL CONFLICTO" },
    { id: "u3", left: "AMBIENTACION", right: "TIEMPO Y LUGAR" },
    { id: "u4", left: "SUSPENSO", right: "EXPECTATIVA" },
    { id: "u5", left: "GIRO", right: "CAMBIO SORPRESA" },
    { id: "u6", left: "CIERRE", right: "TERMINA LA HISTORIA" },
  ]) },
  { title: "ESCRITURA", exercise: matching([
    { id: "w1", left: "BORRADOR", right: "PRIMERA VERSION" },
    { id: "w2", left: "REVISION", right: "MEJORAR IDEAS Y ORDEN" },
    { id: "w3", left: "EDICION", right: "CORREGIR ORTOGRAFIA" },
    { id: "w4", left: "AUDIENCIA", right: "A QUIEN ESCRIBES" },
    { id: "w5", left: "PROPOSITO", right: "PARA QUE ESCRIBES" },
    { id: "w6", left: "COHESION", right: "CONEXION ENTRE IDEAS" },
  ]) },
  { title: "CIERRE", exercise: matching([
    { id: "z1", left: "ARGUMENTO", right: "RAZON QUE SOSTIENE UNA IDEA" },
    { id: "z2", left: "EJEMPLO", right: "CASO QUE ILUSTRA" },
    { id: "z3", left: "CITA", right: "PALABRAS TOMADAS DE OTRO TEXTO" },
    { id: "z4", left: "CONCLUSION", right: "CIERRE DEL TEXTO" },
    { id: "z5", left: "TESIS", right: "IDEA QUE SE DEFIENDE" },
    { id: "z6", left: "CONECTOR", right: "PALABRA QUE UNE IDEAS" },
  ]) },
]);

const under12Art = lessons([
  { title: "COLORES", exercise: matching([
    { id: "a1", left: "ROJO + AMARILLO", right: "NARANJA" },
    { id: "a2", left: "AZUL + AMARILLO", right: "VERDE" },
    { id: "a3", left: "ROJO + AZUL", right: "MORADO" },
    { id: "a4", left: "BLANCO", right: "ACLARA UN COLOR" },
    { id: "a5", left: "NEGRO", right: "OSCURECE UN COLOR" },
    { id: "a6", left: "CIRCULO CROMATICO", right: "ORDEN DE LOS COLORES" },
  ]) },
  { title: "FORMAS", exercise: matching([
    { id: "f1", left: "CIRCULO", right: "REDONDO" },
    { id: "f2", left: "CUADRADO", right: "CUATRO LADOS IGUALES" },
    { id: "f3", left: "TRIANGULO", right: "TRES LADOS" },
    { id: "f4", left: "LINEA", right: "TRAZO CONTINUO" },
    { id: "f5", left: "PUNTO", right: "MARCA MINIMA" },
    { id: "f6", left: "SIMETRIA", right: "DOS MITADES PARECIDAS" },
  ]) },
  { title: "HERRAMIENTAS", exercise: matching([
    { id: "t1", left: "PINCEL", right: "PARA PINTAR" },
    { id: "t2", left: "LAPIZ", right: "PARA DIBUJAR" },
    { id: "t3", left: "TIJERAS", right: "PARA CORTAR PAPEL" },
    { id: "t4", left: "PEGAMENTO", right: "PARA UNIR" },
    { id: "t5", left: "HOJA", right: "SOPORTE DEL DIBUJO" },
    { id: "t6", left: "GOMA", right: "PARA BORRAR" },
  ]) },
  { title: "LUZ", exercise: matching([
    { id: "z1", left: "CLARO", right: "MUCHA LUZ" },
    { id: "z2", left: "OSCURO", right: "POCA LUZ" },
    { id: "z3", left: "SOMBRA", right: "ZONA SIN LUZ DIRECTA" },
    { id: "z4", left: "BRILLO", right: "PUNTO MAS LUMINOSO" },
    { id: "z5", left: "CONTRASTE", right: "DIFERENCIA CLARO-OSCURO" },
    { id: "z6", left: "FONDO", right: "LO QUE ESTA DETRAS" },
  ]) },
  { title: "TEXTURA", exercise: matching([
    { id: "x1", left: "SUAVE", right: "SE SIENTE LISO" },
    { id: "x2", left: "ASPERO", right: "SE SIENTE RUGOSO" },
    { id: "x3", left: "BRILLANTE", right: "REFLEJA LUZ" },
    { id: "x4", left: "OPACO", right: "NO BRILLA" },
    { id: "x5", left: "COLLAGE", right: "PEGAR MATERIALES" },
    { id: "x6", left: "ESTAMPADO", right: "REPETIR UNA FORMA" },
  ]) },
  { title: "EMOCION", exercise: matching([
    { id: "e1", left: "AMARILLO", right: "SUELE EVOLAR ALEGRIA" },
    { id: "e2", left: "AZUL", right: "SUELE EVOLAR CALMA" },
    { id: "e3", left: "ROJO", right: "SUELE EVOLAR ENERGIA" },
    { id: "e4", left: "VERDE", right: "SUELE EVOLAR NATURALEZA" },
    { id: "e5", left: "NEGRO", right: "SUELE EVOLAR FUERZA O MISTERIO" },
    { id: "e6", left: "ROSA", right: "SUELE EVOLAR CARIÑO" },
  ]) },
  { title: "COMPOSICION", exercise: matching([
    { id: "c1", left: "CENTRO", right: "MEDIO DE LA HOJA" },
    { id: "c2", left: "BORDE", right: "ORILLA" },
    { id: "c3", left: "EQUILIBRIO", right: "NADA SE SIENTE CAIDO" },
    { id: "c4", left: "REPETICION", right: "MISMA FORMA VARIAS VECES" },
    { id: "c5", left: "TAMAÑO", right: "GRANDE O PEQUEÑO" },
    { id: "c6", left: "ESPACIO", right: "LUGAR ENTRE FORMAS" },
  ]) },
  { title: "OBSERVAR", exercise: matching([
    { id: "o1", left: "MIRAR", right: "DETENERSE EN LOS DETALLES" },
    { id: "o2", left: "COPIAR", right: "REPETIR LO QUE VES" },
    { id: "o3", left: "INVENTAR", right: "CREAR ALGO NUEVO" },
    { id: "o4", left: "MEZCLAR", right: "JUNTAR COLORES" },
    { id: "o5", left: "ELEGIR", right: "DECIDIR UNA OPCION" },
    { id: "o6", left: "CUIDAR", right: "USAR LOS MATERIALES CON RESPETO" },
  ]) },
  { title: "CIERRE", exercise: matching([
    { id: "k1", left: "BOCETO", right: "DIBUJO RAPIDO INICIAL" },
    { id: "k2", left: "OBRA", right: "TRABAJO TERMINADO" },
    { id: "k3", left: "FIRMA", right: "NOMBRE DE QUIEN CREO" },
    { id: "k4", left: "TITULO", right: "NOMBRE DE LA OBRA" },
    { id: "k5", left: "EXPOSICION", right: "MOSTRAR EL TRABAJO" },
    { id: "k6", left: "CUIDADO", right: "GUARDAR SIN ROMPER" },
  ]) },
]);

const over12Art = lessons([
  { title: "ESTILOS", exercise: matching([
    { id: "a1", left: "IMPRESIONISMO", right: "LUZ Y PINCELADA SUELTA" },
    { id: "a2", left: "CUBISMO", right: "FORMAS GEOMETRICAS" },
    { id: "a3", left: "SURREALISMO", right: "IMAGENES DE SUEÑO" },
    { id: "a4", left: "REALISMO", right: "REPRESENTAR CON FIDELIDAD" },
    { id: "a5", left: "ABSTRACTO", right: "SIN FIGURA RECONOCIBLE" },
    { id: "a6", left: "POP", right: "IMAGENES DE LA CULTURA COTIDIANA" },
  ]) },
  { title: "OBRAS", exercise: matching([
    { id: "o1", left: "NOCHE ESTRELLADA", right: "VAN GOGH" },
    { id: "o2", left: "MONA LISA", right: "LEONARDO DA VINCI" },
    { id: "o3", left: "GUERNICA", right: "PICASSO" },
    { id: "o4", left: "LAS MENINAS", right: "VELAZQUEZ" },
    { id: "o5", left: "EL GRITO", right: "MUNCH" },
    { id: "o6", left: "LAS DOS FRIDAS", right: "KAHLO" },
  ]) },
  { title: "LENGUAJE", exercise: matching([
    { id: "r1", left: "EQUILIBRIO", right: "DISTRIBUCION VISUAL" },
    { id: "r2", left: "CONTRASTE", right: "DIFERENCIA FUERTE" },
    { id: "r3", left: "RITMO", right: "REPETICION CON MOVIMIENTO" },
    { id: "r4", left: "TEXTURA", right: "CALIDAD DE SUPERFICIE" },
    { id: "r5", left: "UNIDAD", right: "TODO SE SIENTE CONECTADO" },
    { id: "r6", left: "ESPACIO", right: "FONDO Y FIGURA" },
  ]) },
  { title: "COLOR", exercise: matching([
    { id: "c1", left: "PRIMARIOS", right: "ROJO, AMARILLO Y AZUL" },
    { id: "c2", left: "SECUNDARIOS", right: "NARANJA, VERDE Y VIOLETA" },
    { id: "c3", left: "COMPLEMENTARIOS", right: "COLORES OPUESTOS" },
    { id: "c4", left: "CALIDOS", right: "ROJOS Y AMARILLOS" },
    { id: "c5", left: "FRIOS", right: "AZULES Y VERDES" },
    { id: "c6", left: "SATURACION", right: "INTENSIDAD DEL COLOR" },
  ]) },
  { title: "COMPOSICION", exercise: matching([
    { id: "m1", left: "REGLA DE TERCIOS", right: "DIVIDIR EN NUEVE PARTES" },
    { id: "m2", left: "PUNTO FOCAL", right: "DONDE CAE LA MIRADA" },
    { id: "m3", left: "JERARQUIA", right: "QUE SE VE PRIMERO" },
    { id: "m4", left: "MARGEN", right: "ESPACIO ALREDEDOR" },
    { id: "m5", left: "SIMETRIA", right: "EQUILIBRIO ESPEJO" },
    { id: "m6", left: "ASIMETRIA", right: "EQUILIBRIO SIN ESPEJO" },
  ]) },
  { title: "MUSEOS", exercise: matching([
    { id: "u1", left: "MUSEO", right: "LUGAR PARA CONSERVAR OBRAS" },
    { id: "u2", left: "CURADOR", right: "ORGANIZA UNA EXPOSICION" },
    { id: "u3", left: "CATALOGO", right: "LISTA Y TEXTOS DE OBRAS" },
    { id: "u4", left: "RESTAURACION", right: "CUIDADO DE UNA OBRA" },
    { id: "u5", left: "COLECCION", right: "CONJUNTO DE OBRAS" },
    { id: "u6", left: "SALA", right: "ESPACIO DE EXHIBICION" },
  ]) },
  { title: "DISEÑO", exercise: matching([
    { id: "d1", left: "TIPOGRAFIA", right: "DISEÑO DE LETRAS" },
    { id: "d2", left: "PALETA", right: "CONJUNTO DE COLORES" },
    { id: "d3", left: "ICONO", right: "SIMBOLO SIMPLE" },
    { id: "d4", left: "BOCETO", right: "DIBUJO RAPIDO INICIAL" },
    { id: "d5", left: "LAYOUT", right: "ORGANIZACION DE PAGINA" },
    { id: "d6", left: "MARCA", right: "IDENTIDAD VISUAL" },
  ]) },
  { title: "CRITICA", exercise: matching([
    { id: "k1", left: "DESCRIBIR", right: "DECIR LO QUE SE VE" },
    { id: "k2", left: "ANALIZAR", right: "EXPLICAR COMO ESTA HECHO" },
    { id: "k3", left: "INTERPRETAR", right: "PROPONER UN SIGNIFICADO" },
    { id: "k4", left: "VALORAR", right: "DAR UNA OPINION FUNDADA" },
    { id: "k5", left: "CONTEXTO", right: "EPOCA Y LUGAR DE LA OBRA" },
    { id: "k6", left: "TECNICA", right: "MATERIALES Y PROCEDIMIENTO" },
  ]) },
  { title: "CIERRE", exercise: matching([
    { id: "z1", left: "PROCESO", right: "PASOS HASTA LA OBRA" },
    { id: "z2", left: "INTENCION", right: "LO QUE SE QUIERE COMUNICAR" },
    { id: "z3", left: "PUBLICO", right: "QUIEN MIRA LA OBRA" },
    { id: "z4", left: "SOPORTE", right: "LIENZO, PAPEL U OTRO" },
    { id: "z5", left: "FORMATO", right: "TAMAÑO Y PROPORCION" },
    { id: "z6", left: "SERIE", right: "VARIAS OBRAS CONECTADAS" },
  ]) },
]);

const over12Algebra = lessons([
  { title: "INCOGNITA", exercise: timedMath([{ expr: "x+4=10", answer: 6 }, { expr: "x-3=5", answer: 8 }, { expr: "2+x=9", answer: 7 }]) },
  { title: "DOBLE", exercise: timedMath([{ expr: "2x=12", answer: 6 }, { expr: "3x=15", answer: 5 }, { expr: "4x=20", answer: 5 }]) },
  { title: "MIXTO", exercise: timedMath([{ expr: "2x+1=9", answer: 4 }, { expr: "3x-3=12", answer: 5 }, { expr: "5x+5=20", answer: 3 }]) },
  { title: "PARENTESIS", exercise: timedMath([{ expr: "2(x+3)=10", answer: 2 }, { expr: "3(x-1)=9", answer: 4 }, { expr: "4(x+2)=24", answer: 4 }]) },
  { title: "NEGATIVOS", exercise: timedMath([{ expr: "x+8=3", answer: -5 }, { expr: "x-6=-2", answer: 4 }, { expr: "5+x=0", answer: -5 }]) },
  { title: "PRODUCTO", exercise: timedMath([{ expr: "x*3=21", answer: 7 }, { expr: "x*5=0", answer: 0 }, { expr: "x*2=-8", answer: -4 }]) },
  { title: "COCIENTE", exercise: timedMath([{ expr: "x/2=6", answer: 12 }, { expr: "x/4=3", answer: 12 }, { expr: "x/5=5", answer: 25 }]) },
  { title: "DESPEJE", exercise: timedMath([{ expr: "x+15=40", answer: 25 }, { expr: "2x-4=10", answer: 7 }, { expr: "3x+6=18", answer: 4 }]) },
  { title: "FINAL", exercise: timedMath([{ expr: "4x-8=12", answer: 5 }, { expr: "x/3+2=6", answer: 12 }, { expr: "2(x+5)=18", answer: 4 }]) },
]);

const over12Geo = lessons([
  { title: "FIGURAS", exercise: timedMath([{ expr: "3+3+3+3", answer: 12 }, { expr: "5+5+5+5", answer: 20 }, { expr: "2+2+2", answer: 6 }]) },
  { title: "PERIMETRO", exercise: timedMath([{ expr: "4*6", answer: 24 }, { expr: "2*(5+3)", answer: 16 }, { expr: "3*8", answer: 24 }]) },
  { title: "AREA", exercise: timedMath([{ expr: "5*4", answer: 20 }, { expr: "6*6", answer: 36 }, { expr: "8*3", answer: 24 }]) },
  { title: "TRIANGULO", exercise: timedMath([{ expr: "(6*4)/2", answer: 12 }, { expr: "(10*5)/2", answer: 25 }, { expr: "(8*3)/2", answer: 12 }]) },
  { title: "ANGULOS", exercise: timedMath([{ expr: "90+90", answer: 180 }, { expr: "180-45", answer: 135 }, { expr: "360/4", answer: 90 }]) },
  { title: "CIRCULO", exercise: timedMath([{ expr: "2*3*5", answer: 30 }, { expr: "3*3*3", answer: 27 }, { expr: "2*7", answer: 14 }]) },
  { title: "VOLUMEN", exercise: timedMath([{ expr: "2*3*4", answer: 24 }, { expr: "5*5*2", answer: 50 }, { expr: "3*3*3", answer: 27 }]) },
  { title: "ESCALA", exercise: timedMath([{ expr: "12/2", answer: 6 }, { expr: "15/3", answer: 5 }, { expr: "20/4", answer: 5 }]) },
  { title: "FINAL", exercise: timedMath([{ expr: "(8*6)/2", answer: 24 }, { expr: "4*4*2", answer: 32 }, { expr: "180-70", answer: 110 }]) },
]);

const under12Geo = lessons([
  { title: "LADOS", exercise: timedMath([{ expr: "3+3+3", answer: 9 }, { expr: "4+4+4+4", answer: 16 }, { expr: "5+5", answer: 10 }], 90) },
  { title: "CUENTA", exercise: timedMath([{ expr: "4*2", answer: 8 }, { expr: "3*3", answer: 9 }, { expr: "6+4", answer: 10 }], 90) },
  { title: "CUADRADO", exercise: timedMath([{ expr: "4*4", answer: 16 }, { expr: "5*5", answer: 25 }, { expr: "2*2", answer: 4 }], 90) },
  { title: "RECTANGULO", exercise: timedMath([{ expr: "3*5", answer: 15 }, { expr: "2*7", answer: 14 }, { expr: "4*6", answer: 24 }], 90) },
  { title: "MITAD", exercise: timedMath([{ expr: "8/2", answer: 4 }, { expr: "12/2", answer: 6 }, { expr: "10/2", answer: 5 }], 90) },
  { title: "VUELTAS", exercise: timedMath([{ expr: "4+4+4+4", answer: 16 }, { expr: "3+3+3", answer: 9 }, { expr: "2+2+2+2", answer: 8 }], 90) },
  { title: "BLOQUES", exercise: timedMath([{ expr: "2*3*1", answer: 6 }, { expr: "2*2*2", answer: 8 }, { expr: "4*2*1", answer: 8 }], 90) },
  { title: "COMPARAR", exercise: timedMath([{ expr: "10-4", answer: 6 }, { expr: "9-3", answer: 6 }, { expr: "8-8", answer: 0 }], 90) },
  { title: "RETO", exercise: timedMath([{ expr: "3*4+2", answer: 14 }, { expr: "5*2+1", answer: 11 }, { expr: "6*2-4", answer: 8 }], 90) },
]);

const over12English2 = lessons([
  { title: "PASADO", exercise: matching([
    { id: "p1", left: "I WENT", right: "YO FUI" },
    { id: "p2", left: "I SAW", right: "YO VI" },
    { id: "p3", left: "I ATE", right: "YO COMI" },
    { id: "p4", left: "I STUDIED", right: "YO ESTUDIE" },
    { id: "p5", left: "I HELPED", right: "YO AYUDE" },
    { id: "p6", left: "I LEARNED", right: "YO APRENDI" },
  ]) },
  { title: "FUTURO", exercise: matching([
    { id: "f1", left: "I WILL GO", right: "YO IRE" },
    { id: "f2", left: "I WILL STUDY", right: "YO ESTUDIARE" },
    { id: "f3", left: "WE WILL HELP", right: "NOSOTROS AYUDAREMOS" },
    { id: "f4", left: "SHE WILL READ", right: "ELLA LEERA" },
    { id: "f5", left: "THEY WILL PLAY", right: "ELLOS JUGARAN" },
    { id: "f6", left: "IT WILL RAIN", right: "VA A LLOVER" },
  ]) },
  { title: "VERBOS", exercise: matching([
    { id: "v1", left: "MAKE", right: "HACER / CREAR" },
    { id: "v2", left: "THINK", right: "PENSAR" },
    { id: "v3", left: "DECIDE", right: "DECIDIR" },
    { id: "v4", left: "EXPLAIN", right: "EXPLICAR" },
    { id: "v5", left: "COMPARE", right: "COMPARAR" },
    { id: "v6", left: "IMPROVE", right: "MEJORAR" },
  ]) },
  { title: "CONECTORES", exercise: matching([
    { id: "c1", left: "BECAUSE", right: "PORQUE" },
    { id: "c2", left: "ALTHOUGH", right: "AUNQUE" },
    { id: "c3", left: "HOWEVER", right: "SIN EMBARGO" },
    { id: "c4", left: "THEREFORE", right: "POR LO TANTO" },
    { id: "c5", left: "FIRST", right: "PRIMERO" },
    { id: "c6", left: "FINALLY", right: "FINALMENTE" },
  ]) },
  { title: "PREGUNTAS", exercise: matching([
    { id: "q1", left: "HOW OFTEN?", right: "CON QUE FRECUENCIA?" },
    { id: "q2", left: "HOW LONG?", right: "CUANTO TIEMPO?" },
    { id: "q3", left: "HOW MANY?", right: "CUANTOS?" },
    { id: "q4", left: "WHOSE?", right: "DE QUIEN?" },
    { id: "q5", left: "WHICH?", right: "CUAL?" },
    { id: "q6", left: "WHY NOT?", right: "POR QUE NO?" },
  ]) },
  { title: "CASA", exercise: matching([
    { id: "h1", left: "CHORES", right: "TAREAS DEL HOGAR" },
    { id: "h2", left: "NEIGHBOR", right: "VECINO" },
    { id: "h3", left: "BILL", right: "FACTURA" },
    { id: "h4", left: "SAVINGS", right: "AHORROS" },
    { id: "h5", left: "SCHEDULE", right: "HORARIO" },
    { id: "h6", left: "AGREEMENT", right: "ACUERDO" },
  ]) },
  { title: "OPINION", exercise: matching([
    { id: "o1", left: "I AGREE", right: "ESTOY DE ACUERDO" },
    { id: "o2", left: "I DISAGREE", right: "NO ESTOY DE ACUERDO" },
    { id: "o3", left: "IN MY OPINION", right: "EN MI OPINION" },
    { id: "o4", left: "IT DEPENDS", right: "DEPENDE" },
    { id: "o5", left: "FOR EXAMPLE", right: "POR EJEMPLO" },
    { id: "o6", left: "THAT IS TRUE", right: "ESO ES CIERTO" },
  ]) },
  { title: "LECTURA", exercise: matching([
    { id: "r1", left: "HEADING", right: "ENCABEZADO" },
    { id: "r2", left: "PARAGRAPH", right: "PARRAFO" },
    { id: "r3", left: "MAIN IDEA", right: "IDEA PRINCIPAL" },
    { id: "r4", left: "DETAIL", right: "DETALLE" },
    { id: "r5", left: "AUTHOR", right: "AUTOR" },
    { id: "r6", left: "TITLE", right: "TITULO" },
  ]) },
  { title: "CIERRE", exercise: matching([
    { id: "z1", left: "FLUENCY", right: "FLUIDEZ" },
    { id: "z2", left: "ACCURACY", right: "PRECISION" },
    { id: "z3", left: "VOCABULARY", right: "VOCABULARIO" },
    { id: "z4", left: "PRONUNCIATION", right: "PRONUNCIACION" },
    { id: "z5", left: "LISTENING", right: "COMPRENSION AUDITIVA" },
    { id: "z6", left: "WRITING", right: "ESCRITURA" },
  ]) },
]);

const over12DailyMath = lessons([
  { title: "COMPRAS", exercise: timedMath([{ expr: "12+8+5", answer: 25 }, { expr: "50-19", answer: 31 }, { expr: "3*7", answer: 21 }]) },
  { title: "VUELTO", exercise: timedMath([{ expr: "20-13", answer: 7 }, { expr: "50-28", answer: 22 }, { expr: "100-64", answer: 36 }]) },
  { title: "TIEMPO", exercise: timedMath([{ expr: "60/4", answer: 15 }, { expr: "45+30", answer: 75 }, { expr: "90-25", answer: 65 }]) },
  { title: "RECETA", exercise: timedMath([{ expr: "2*250", answer: 500 }, { expr: "3*4", answer: 12 }, { expr: "1000/4", answer: 250 }]) },
  { title: "AHORRO", exercise: timedMath([{ expr: "5*7", answer: 35 }, { expr: "10*12", answer: 120 }, { expr: "80-25", answer: 55 }]) },
  { title: "MEDIDAS", exercise: timedMath([{ expr: "100*3", answer: 300 }, { expr: "250+250", answer: 500 }, { expr: "2*150", answer: 300 }]) },
  { title: "PORCENTAJE", exercise: timedMath([{ expr: "10*0.5*10", answer: 50 }, { expr: "200/2", answer: 100 }, { expr: "25*2", answer: 50 }]) },
  { title: "PROMEDIO", exercise: timedMath([{ expr: "(8+10)/2", answer: 9 }, { expr: "(6+6+6)/3", answer: 6 }, { expr: "(10+8+6)/3", answer: 8 }]) },
  { title: "FINAL", exercise: timedMath([{ expr: "15*4-20", answer: 40 }, { expr: "90/3+8", answer: 38 }, { expr: "7*5+9", answer: 44 }]) },
]);

const mathTheory = lessons([
  { title: "SUMA", exercise: matching([{ id: "m1", left: "SUMAR", right: "JUNTAR CANTIDADES" }, { id: "m2", left: "+", right: "SIGNO DE SUMA" }, { id: "m3", left: "TOTAL", right: "RESULTADO" }, { id: "m4", left: "2+3", right: "5" }, { id: "m5", left: "CERO", right: "NADA QUE SUMAR" }, { id: "m6", left: "PAR", right: "NUMERO DIVISIBLE PARA 2" }]) },
  { title: "RESTA", exercise: matching([{ id: "r1", left: "RESTAR", right: "QUITAR" }, { id: "r2", left: "-", right: "SIGNO DE RESTA" }, { id: "r3", left: "DIFERENCIA", right: "RESULTADO DE RESTAR" }, { id: "r4", left: "10-4", right: "6" }, { id: "r5", left: "MINUENDO", right: "NUMERO DEL QUE SE QUITA" }, { id: "r6", left: "SUSTRAENDO", right: "LO QUE SE QUITA" }]) },
  { title: "MULTIPLICAR", exercise: matching([{ id: "x1", left: "MULTIPLICAR", right: "SUMAR VARIAS VECES" }, { id: "x2", left: "x", right: "SIGNO DE MULTIPLICAR" }, { id: "x3", left: "PRODUCTO", right: "RESULTADO" }, { id: "x4", left: "3x4", right: "12" }, { id: "x5", left: "TABLA DEL 2", right: "2,4,6,8,10" }, { id: "x6", left: "DOBLE", right: "MULTIPLICAR POR 2" }]) },
  { title: "DIVIDIR", exercise: matching([{ id: "d1", left: "DIVIDIR", right: "REPARTIR EN PARTES IGUALES" }, { id: "d2", left: "/", right: "SIGNO DE DIVISION" }, { id: "d3", left: "COCIENTE", right: "RESULTADO" }, { id: "d4", left: "12/3", right: "4" }, { id: "d5", left: "MITAD", right: "DIVIDIR PARA 2" }, { id: "d6", left: "RESTO", right: "LO QUE SOBRA" }]) },
  { title: "FRACCION", exercise: matching([{ id: "f1", left: "1/2", right: "MITAD" }, { id: "f2", left: "1/4", right: "UN CUARTO" }, { id: "f3", left: "NUMERADOR", right: "PARTE DE ARRIBA" }, { id: "f4", left: "DENOMINADOR", right: "PARTE DE ABAJO" }, { id: "f5", left: "ENTERO", right: "1" }, { id: "f6", left: "3/3", right: "UN ENTERO" }]) },
  { title: "MEDIR", exercise: matching([{ id: "e1", left: "CM", right: "CENTIMETRO" }, { id: "e2", left: "M", right: "METRO" }, { id: "e3", left: "KG", right: "KILOGRAMO" }, { id: "e4", left: "LITRO", right: "CAPACIDAD" }, { id: "e5", left: "HORA", right: "60 MINUTOS" }, { id: "e6", left: "ANGULO", right: "APERTURA ENTRE RECTAS" }]) },
]);

const mathReadings = lessons([
  { title: "IDEA", exercise: matching([{ id: "i1", left: "PROBLEMA", right: "PREGUNTA A RESOLVER" }, { id: "i2", left: "DATO", right: "INFORMACION NUMERICA" }, { id: "i3", left: "OPERACION", right: "PASO DE CALCULO" }, { id: "i4", left: "RESPUESTA", right: "SOLUCION" }, { id: "i5", left: "UNIDAD", right: "METRO, LITRO O KILO" }, { id: "i6", left: "ESTIMAR", right: "APROXIMAR" }]) },
  { title: "COMPRAS", exercise: matching([{ id: "c1", left: "PRECIO", right: "CUANTO CUESTA" }, { id: "c2", left: "VUELTO", right: "DINERO QUE REGRESAN" }, { id: "c3", left: "DESCUENTO", right: "SE PAGA MENOS" }, { id: "c4", left: "TOTAL", right: "SUMA A PAGAR" }, { id: "c5", left: "CANTIDAD", right: "CUANTOS OBJETOS" }, { id: "c6", left: "OFERTA", right: "PRECIO ESPECIAL" }]) },
  { title: "TIEMPO", exercise: matching([{ id: "t1", left: "DIA", right: "24 HORAS" }, { id: "t2", left: "SEMANA", right: "7 DIAS" }, { id: "t3", left: "MES", right: "APROX. 30 DIAS" }, { id: "t4", left: "MINUTO", right: "60 SEGUNDOS" }, { id: "t5", left: "CALENDARIO", right: "ORGANIZA FECHAS" }, { id: "t6", left: "DURACION", right: "CUANTO TARDA" }]) },
  { title: "GRAFICO", exercise: matching([{ id: "g1", left: "EJE X", right: "HORIZONTAL" }, { id: "g2", left: "EJE Y", right: "VERTICAL" }, { id: "g3", left: "PUNTO", right: "PAR DE NUMEROS" }, { id: "g4", left: "TABLA", right: "DATOS EN FILAS" }, { id: "g5", left: "PROMEDIO", right: "VALOR MEDIO" }, { id: "g6", left: "COMPARAR", right: "VER QUE ES MAYOR" }]) },
  { title: "CIERRE", exercise: matching([{ id: "z1", left: "REVISAR", right: "COMPROBAR EL RESULTADO" }, { id: "z2", left: "ERROR", right: "ALGO QUE CORREGIR" }, { id: "z3", left: "ESTRATEGIA", right: "FORMA DE RESOLVER" }, { id: "z4", left: "PATRON", right: "LO QUE SE REPITE" }, { id: "z5", left: "LOGICA", right: "RAZONAR CON ORDEN" }, { id: "z6", left: "PRACTICA", right: "REPETIR PARA MEJORAR" }]) },
]);

const musicTheory = lessons([
  { title: "NOTAS", exercise: matching([{ id: "n1", left: "DO", right: "PRIMERA NOTA" }, { id: "n2", left: "RE", right: "SEGUNDA NOTA" }, { id: "n3", left: "MI", right: "TERCERA NOTA" }, { id: "n4", left: "FA", right: "CUARTA NOTA" }, { id: "n5", left: "SOL", right: "QUINTA NOTA" }, { id: "n6", left: "LA", right: "SEXTA NOTA" }]) },
  { title: "PENTAGRAMA", exercise: matching([{ id: "p1", left: "PENTAGRAMA", right: "5 LINEAS" }, { id: "p2", left: "CLAVE DE SOL", right: "INDICA ALTURA" }, { id: "p3", left: "NOTA", right: "SONIDO ESCRITO" }, { id: "p4", left: "SILENCIO", right: "PAUSA" }, { id: "p5", left: "COMPAS", right: "GRUPO DE TIEMPOS" }, { id: "p6", left: "PARTITURA", right: "MUSICA ESCRITA" }]) },
  { title: "RITMO", exercise: matching([{ id: "r1", left: "PULSO", right: "LATIDO DE LA MUSICA" }, { id: "r2", left: "RITMO", right: "COMBINACION DE DURACIONES" }, { id: "r3", left: "NEGRA", right: "UN TIEMPO" }, { id: "r4", left: "BLANCA", right: "DOS TIEMPOS" }, { id: "r5", left: "CORCHEA", right: "MEDIO TIEMPO" }, { id: "r6", left: "TEMPO", right: "VELOCIDAD" }]) },
  { title: "DINAMICA", exercise: matching([{ id: "d1", left: "FORTE", right: "FUERTE" }, { id: "d2", left: "PIANO", right: "SUAVE" }, { id: "d3", left: "CRESCENDO", right: "IR CRECIENDO" }, { id: "d4", left: "DECRESCENDO", right: "IR BAJANDO" }, { id: "d5", left: "ACENTO", right: "GOLPE MAS MARCADO" }, { id: "d6", left: "SILENCIO", right: "NO SONAR" }]) },
  { title: "FAMILIAS", exercise: matching([{ id: "f1", left: "CUERDA", right: "GUITARRA O VIOLIN" }, { id: "f2", left: "VIENTO", right: "FLAUTA" }, { id: "f3", left: "PERCUSION", right: "TAMBOR" }, { id: "f4", left: "VOZ", right: "INSTRUMENTO DEL CUERPO" }, { id: "f5", left: "TECLADO", right: "PIANO" }, { id: "f6", left: "ORQUESTA", right: "VARIOS INSTRUMENTOS JUNTOS" }]) },
  { title: "CIERRE", exercise: matching([{ id: "c1", left: "MELODIA", right: "LINEA QUE SE CANTA" }, { id: "c2", left: "ARMONIA", right: "SONIDOS A LA VEZ" }, { id: "c3", left: "ESCUCHAR", right: "PRESTAR ATENCION AL SONIDO" }, { id: "c4", left: "AFINAR", right: "DEJAR EL SONIDO CORRECTO" }, { id: "c5", left: "ENSAYAR", right: "PRACTICAR JUNTOS" }, { id: "c6", left: "CONCIERTO", right: "MOSTRAR LO APRENDIDO" }]) },
]);

const musicPractice = lessons([
  { title: "PULSO", exercise: matching([{ id: "a1", left: "PALMAS", right: "MARCAR EL PULSO" }, { id: "a2", left: "1-2-3-4", right: "COMPAS DE 4" }, { id: "a3", left: "LENTO", right: "TEMPO ADAGIO" }, { id: "a4", left: "RAPIDO", right: "TEMPO ALLEGRO" }, { id: "a5", left: "PAUSA", right: "NO GOLPEAR" }, { id: "a6", left: "UNISONO", right: "TODOS A LA VEZ" }]) },
  { title: "CANTO", exercise: matching([{ id: "b1", left: "RESPIRAR", right: "TOMAR AIRE ANTES" }, { id: "b2", left: "POSTURA", right: "ESPALDA RECTA" }, { id: "b3", left: "AFINACION", right: "DAR LA NOTA" }, { id: "b4", left: "LETRA", right: "PALABRAS DE LA CANCION" }, { id: "b5", left: "CORO", right: "CANTAR EN GRUPO" }, { id: "b6", left: "SOLO", right: "CANTAR UNO" }]) },
  { title: "PERCUSION", exercise: matching([{ id: "c1", left: "CAJON", right: "CAJA QUE SE GOLPEA" }, { id: "c2", left: "MARACA", right: "SE AGITA" }, { id: "c3", left: "CLAVES", right: "DOS PALOS" }, { id: "c4", left: "BOMBO", right: "GOLPE GRAVE" }, { id: "c5", left: "OSTINATO", right: "RITMO QUE SE REPITE" }, { id: "c6", left: "ACENTO", right: "GOLPE MAS FUERTE" }]) },
  { title: "FLAUTA", exercise: matching([{ id: "d1", left: "SOPLAR", right: "MANDAR AIRE" }, { id: "d2", left: "ORIFICIO", right: "AGUJERO DE LA FLAUTA" }, { id: "d3", left: "DEDOS", right: "TAPAR HOYOS" }, { id: "d4", left: "DO", right: "NOTA BASE" }, { id: "d5", left: "ESCALA", right: "NOTAS EN ORDEN" }, { id: "d6", left: "LIMPIAR", right: "CUIDAR EL INSTRUMENTO" }]) },
  { title: "ENSAYO", exercise: matching([{ id: "e1", left: "ENTRAR", right: "EMPEZAR JUNTOS" }, { id: "e2", left: "ESCUCHARSE", right: "NO TAPAR AL OTRO" }, { id: "e3", left: "DINAMICA", right: "FUERTE O SUAVE" }, { id: "e4", left: "REPETIR", right: "VOLVER A TOCAR" }, { id: "e5", left: "CORREGIR", right: "ARREGLAR UN ERROR" }, { id: "e6", left: "CIERRE", right: "TERMINAR A LA VEZ" }]) },
  { title: "PRESENTAR", exercise: matching([{ id: "f1", left: "SALUDAR", right: "EMPEZAR CON RESPETO" }, { id: "f2", left: "SILENCIO", right: "ANTES DE TOCAR" }, { id: "f3", left: "MIRAR", right: "SEGUIR AL DIRECTOR" }, { id: "f4", left: "SONREIR", right: "DISFRUTAR EN ESCENA" }, { id: "f5", left: "APLAUSO", right: "AGRADECER AL PUBLICO" }, { id: "f6", left: "EQUIPO", right: "TOCAR CON OTROS" }]) },
]);

const musicReadings = lessons([
  { title: "ESCUCHA", exercise: matching([{ id: "s1", left: "GRAVE", right: "SONIDO BAJO" }, { id: "s2", left: "AGUDO", right: "SONIDO ALTO" }, { id: "s3", left: "RUIDO", right: "SONIDO SIN ORDEN" }, { id: "s4", left: "SILENCIO", right: "AUSENCIA DE SONIDO" }, { id: "s5", left: "ECO", right: "SONIDO QUE VUELVE" }, { id: "s6", left: "TIMBRE", right: "COLOR DEL SONIDO" }]) },
  { title: "CULTURA", exercise: matching([{ id: "k1", left: "FOLCLOR", right: "MUSICA TRADICIONAL" }, { id: "k2", left: "BOMBA", right: "RITMO DEL ECUADOR" }, { id: "k3", left: "SANJUANITO", right: "BAILE ANDINO" }, { id: "k4", left: "PASILLO", right: "GENERO ECUATORIANO" }, { id: "k5", left: "MARIMBA", right: "MUSICA DEL LITORAL" }, { id: "k6", left: "CANCION", right: "MUSICA CON LETRA" }]) },
  { title: "CUIDADO", exercise: matching([{ id: "u1", left: "OIDOS", right: "NO PONER VOLUMEN ALTO" }, { id: "u2", left: "RESPETO", right: "ESCUCHAR AL COMPAÑERO" }, { id: "u3", left: "TURNO", right: "ESPERAR PARA TOCAR" }, { id: "u4", left: "GUARDAR", right: "ORDENAR EL INSTRUMENTO" }, { id: "u5", left: "AGRADECER", right: "VALORAR EL ENSAYO" }, { id: "u6", left: "COMUNIDAD", right: "HACER MUSICA JUNTOS" }]) },
  { title: "IDEAS", exercise: matching([{ id: "v1", left: "INSPIRAR", right: "SACAR UNA IDEA" }, { id: "v2", left: "IMPROVISAR", right: "CREAR EN EL MOMENTO" }, { id: "v3", left: "COPIAR", right: "REPETIR UNA MELODIA" }, { id: "v4", left: "VARIAR", right: "CAMBIAR UN POCO" }, { id: "v5", left: "LETRA", right: "CONTAR UNA HISTORIA" }, { id: "v6", left: "EMOCION", right: "LO QUE SIENTE QUIEN ESCUCHA" }]) },
  { title: "CIERRE", exercise: matching([{ id: "w1", left: "APRENDER", right: "SABER MAS MUSICA" }, { id: "w2", left: "COMPARTIR", right: "TOCAR PARA OTROS" }, { id: "w3", left: "MEMORIA", right: "RECORDAR LA CANCION" }, { id: "w4", left: "CONSTANCIA", right: "PRACTICAR SEGUIDO" }, { id: "w5", left: "GOZO", right: "DISFRUTAR EL SONIDO" }, { id: "w6", left: "FIF", right: "HACER MUSICA EN COMUNIDAD" }]) },
]);

const artTheory = lessons([
  { title: "COLOR", exercise: matching([{ id: "a1", left: "ROJO", right: "COLOR CALIDO" }, { id: "a2", left: "AZUL", right: "COLOR FRIO" }, { id: "a3", left: "AMARILLO", right: "COLOR PRIMARIO" }, { id: "a4", left: "VERDE", right: "AZUL + AMARILLO" }, { id: "a5", left: "BLANCO", right: "ACLARA" }, { id: "a6", left: "NEGRO", right: "OSCURECE" }]) },
  { title: "FORMA", exercise: matching([{ id: "b1", left: "LINEA", right: "TRAZO" }, { id: "b2", left: "CIRCULO", right: "FORMA REDONDA" }, { id: "b3", left: "CUADRADO", right: "4 LADOS IGUALES" }, { id: "b4", left: "TRIANGULO", right: "3 LADOS" }, { id: "b5", left: "CONTORNO", right: "BORDE DE LA FORMA" }, { id: "b6", left: "VOLUMEN", right: "SENSACION DE 3D" }]) },
  { title: "COMPOSICION", exercise: matching([{ id: "c1", left: "CENTRO", right: "MEDIO DE LA HOJA" }, { id: "c2", left: "FONDO", right: "LO QUE ESTA DETRAS" }, { id: "c3", left: "FIGURA", right: "LO QUE DESTACA" }, { id: "c4", left: "EQUILIBRIO", right: "QUE NO SE CAIGA LA IMAGEN" }, { id: "c5", left: "REPETIR", right: "USAR VARIAS VECES" }, { id: "c6", left: "CONTRASTE", right: "CLARO CONTRA OSCURO" }]) },
  { title: "MATERIAL", exercise: matching([{ id: "d1", left: "LAPIZ", right: "DIBUJAR" }, { id: "d2", left: "TEMPERA", right: "PINTURA AL AGUA" }, { id: "d3", left: "PINCEL", right: "APLICAR COLOR" }, { id: "d4", left: "PAPEL", right: "SOPORTE" }, { id: "d5", left: "TIJERA", right: "CORTAR" }, { id: "d6", left: "PEGAMENTO", right: "UNIR" }]) },
  { title: "CIERRE", exercise: matching([{ id: "e1", left: "OBSERVAR", right: "MIRAR CON ATENCION" }, { id: "e2", left: "BORRADOR", right: "CORREGIR" }, { id: "e3", left: "FIRMA", right: "MARCAR TU OBRA" }, { id: "e4", left: "TITULO", right: "NOMBRE DE LA OBRA" }, { id: "e5", left: "EXPONER", right: "MOSTRAR EL TRABAJO" }, { id: "e6", left: "CUIDAR", right: "NO ARRUINAR EL MATERIAL" }]) },
]);

const artReadings = lessons([
  { title: "OBRA", exercise: matching([{ id: "o1", left: "PINTURA", right: "IMAGEN CON COLOR" }, { id: "o2", left: "ESCULTURA", right: "OBRA EN VOLUMEN" }, { id: "o3", left: "DIBUJO", right: "TRAZO SOBRE PAPEL" }, { id: "o4", left: "MURAL", right: "ARTE EN LA PARED" }, { id: "o5", left: "COLLAGE", right: "PEGAR RECORTES" }, { id: "o6", left: "FOTOGRAFIA", right: "IMAGEN CON CAMARA" }]) },
  { title: "ARTISTA", exercise: matching([{ id: "r1", left: "PINTOR", right: "TRABAJA CON COLOR" }, { id: "r2", left: "MUSICO", right: "TRABAJA CON SONIDO" }, { id: "r3", left: "AUTOR", right: "QUIEN CREA LA OBRA" }, { id: "r4", left: "PUBLICO", right: "QUIEN MIRA" }, { id: "r5", left: "MUSEO", right: "LUGAR PARA VER ARTE" }, { id: "r6", left: "TALLER", right: "LUGAR PARA HACER ARTE" }]) },
  { title: "MENSAJE", exercise: matching([{ id: "s1", left: "EMOCION", right: "LO QUE SIENTE EL ARTISTA" }, { id: "s2", left: "HISTORIA", right: "LO QUE CUENTA LA OBRA" }, { id: "s3", left: "SIMBOLO", right: "IMAGEN CON SIGNIFICADO" }, { id: "s4", left: "COMUNIDAD", right: "ARTE HECHO CON OTROS" }, { id: "s5", left: "IDENTIDAD", right: "QUIENES SOMOS" }, { id: "s6", left: "CUIDADO", right: "RESPETAR LA OBRA AJENA" }]) },
  { title: "CIERRE", exercise: matching([{ id: "t1", left: "MIRAR", right: "DEDILE TIEMPO A LA OBRA" }, { id: "t2", left: "PREGUNTAR", right: "QUE QUIERE DECIR" }, { id: "t3", left: "COMPARAR", right: "VER PARECIDOS Y DIFERENCIAS" }, { id: "t4", left: "OPINAR", right: "DECIR QUE PIENSAS" }, { id: "t5", left: "CUIDAR", right: "NO TOCAR SIN PERMISO" }, { id: "t6", left: "INSPIRARSE", right: "CREAR DESPUES DE MIRAR" }]) },
]);

const codeTheory = lessons([
  { title: "IDEAS", exercise: matching([{ id: "c1", left: "ALGORITMO", right: "PASOS EN ORDEN" }, { id: "c2", left: "VARIABLE", right: "CAJA QUE GUARDA UN VALOR" }, { id: "c3", left: "INSTRUCCION", right: "ORDEN PARA LA COMPUTADORA" }, { id: "c4", left: "ERROR", right: "ALGO QUE FALLA" }, { id: "c5", left: "DEPURAR", right: "CORREGIR EL ERROR" }, { id: "c6", left: "PROGRAMA", right: "CONJUNTO DE INSTRUCCIONES" }]) },
  { title: "DATOS", exercise: matching([{ id: "d1", left: "NUMERO", right: "VALOR PARA CALCULAR" }, { id: "d2", left: "TEXTO", right: "PALABRAS ENTRE COMILLAS" }, { id: "d3", left: "VERDADERO", right: "SI" }, { id: "d4", left: "FALSO", right: "NO" }, { id: "d5", left: "LISTA", right: "VARIOS VALORES JUNTOS" }, { id: "d6", left: "NOMBRE", right: "COMO SE LLAMA LA VARIABLE" }]) },
  { title: "CONTROL", exercise: matching([{ id: "e1", left: "SI", right: "DECIDIR" }, { id: "e2", left: "REPETIR", right: "HACER VARIAS VECES" }, { id: "e3", left: "MIENTRAS", right: "SEGUIR SI SE CUMPLE" }, { id: "e4", left: "FUNCION", right: "BLOQUE REUTILIZABLE" }, { id: "e5", left: "ENTRADA", right: "DATO QUE RECIBE" }, { id: "e6", left: "SALIDA", right: "LO QUE MUESTRA" }]) },
  { title: "CIERRE", exercise: matching([{ id: "f1", left: "PLANEAR", right: "PENSAR ANTES DE ESCRIBIR" }, { id: "f2", left: "PROBAR", right: "EJECUTAR PARA VER" }, { id: "f3", left: "COMENTARIO", right: "NOTA PARA HUMANOS" }, { id: "f4", left: "ORDEN", right: "LAS LINEAS VAN SEGUIDAS" }, { id: "f5", left: "EQUIPO", right: "PROGRAMAR CON OTROS" }, { id: "f6", left: "CREAR", right: "INVENTAR UNA SOLUCION" }]) },
]);

const codeReadings = lessons([
  { title: "SEGURIDAD", exercise: matching([{ id: "s1", left: "CONTRASEÑA", right: "CLAVE PRIVADA" }, { id: "s2", left: "DATO PERSONAL", right: "NO COMPARTIRLO" }, { id: "s3", left: "INTERNET", right: "RED MUNDIAL" }, { id: "s4", left: "RESPETO", right: "ESCRIBIR CON CUIDADO" }, { id: "s5", left: "FUENTE", right: "DE DONDE SALE LA INFO" }, { id: "s6", left: "PERMISO", right: "PEDIR ANTES DE PUBLICAR" }]) },
  { title: "PASOS", exercise: matching([{ id: "p1", left: "ENTENDER", right: "LEER EL PROBLEMA" }, { id: "p2", left: "DIVIDIR", right: "PARTIR EN TAREAS" }, { id: "p3", left: "ESCRIBIR", right: "PASAR A CODIGO" }, { id: "p4", left: "PROBAR", right: "VER SI FUNCIONA" }, { id: "p5", left: "CORREGIR", right: "ARREGLAR ERRORES" }, { id: "p6", left: "EXPLICAR", right: "CONTAR COMO LO HICISTE" }]) },
  { title: "CIERRE", exercise: matching([{ id: "q1", left: "LOGICA", right: "PENSAR CON ORDEN" }, { id: "q2", left: "CREATIVIDAD", right: "BUSCAR OTRA VIA" }, { id: "q3", left: "CONSTANCIA", right: "INTENTAR OTRA VEZ" }, { id: "q4", left: "AYUDA", right: "PEDIR APOYO" }, { id: "q5", left: "JUEGO", right: "APRENDER PRACTICANDO" }, { id: "q6", left: "FIF", right: "TECNOLOGIA CON PROPOSITO" }]) },
]);

export const COURSES = [
  { id: "matematica-teoria", title: "MATEMATICA TEORIA", tableName: "Matematica teoria.", dashboardTitle: "MATES TEORIA", cover: "chalkboard", color: "#ffd56a", description: "Ideas y vocabulario de matemática según tu grupo de edad.", ageGroups: ["under12", "over12"], unlockedByDefault: true, inProgress: true, lessonsByAge: { under12: mathTheory, over12: mathTheory } },
  { id: "matematica-practica", title: "MATEMATICA PRACTICA", tableName: "Matematica practica.", dashboardTitle: "MATES PRACTICA", cover: "chalkboard", color: "#f6c445", description: "Cálculo mental y ejercicios acordes a tu edad.", ageGroups: ["under12", "over12"], unlockedByDefault: true, inProgress: true, lessonsByAge: { under12: under12Math, over12: over12Math } },
  { id: "matematica-lecturas", title: "MATEMATICA LECTURAS", tableName: "Matematica lecturas.", dashboardTitle: "MATES LECTURAS", cover: "books", color: "#d4e157", description: "Leer problemas de la vida diaria y relacionar ideas.", ageGroups: ["under12", "over12"], unlockedByDefault: false, inProgress: false, lessonsByAge: { under12: mathReadings, over12: mathReadings } },
  { id: "geometria", title: "GEOMETRIA", tableName: "Geometria.", dashboardTitle: "GEOMETRIA", cover: "shapes", color: "#ff8b73", description: "Figuras y espacio. Nivel siguiente de matemática.", ageGroups: ["under12", "over12"], unlockedByDefault: false, inProgress: false, lessonsByAge: { under12: under12Geo, over12: over12Geo } },
  { id: "algebra", title: "ALGEBRA", tableName: "Algebra.", dashboardTitle: "ALGEBRA", cover: "chalkboard", color: "#80cbc4", description: "Incógnitas y ecuaciones para 12 años o más.", ageGroups: ["over12"], unlockedByDefault: false, inProgress: false, lessonsByAge: { over12: over12Algebra } },
  { id: "matematica-cotidiana", title: "MATEMATICA COTIDIANA", tableName: "Matematica cotidiana.", dashboardTitle: "MATES DIARIA", cover: "chalkboard", color: "#9ccc65", description: "Compras, tiempos y medidas. Nivel 12 años o más.", ageGroups: ["over12"], unlockedByDefault: false, inProgress: false, lessonsByAge: { over12: over12DailyMath } },
  { id: "musica-teoria", title: "MUSICA TEORIA", tableName: "Musica teoria.", dashboardTitle: "MUSICA TEORIA", cover: "music", color: "#80deea", description: "Notas, ritmo y familias de instrumentos.", ageGroups: ["under12", "over12"], unlockedByDefault: true, inProgress: true, lessonsByAge: { under12: musicTheory, over12: musicTheory } },
  { id: "musica-practica", title: "MUSICA PRACTICA", tableName: "Musica practica.", dashboardTitle: "MUSICA PRACTICA", cover: "music", color: "#4dd0e1", description: "Pulso, canto, percusión y flauta en grupo.", ageGroups: ["under12", "over12"], unlockedByDefault: true, inProgress: true, lessonsByAge: { under12: musicPractice, over12: musicPractice } },
  { id: "musica-lecturas", title: "MUSICA LECTURAS", tableName: "Musica lecturas.", dashboardTitle: "MUSICA LECTURAS", cover: "books", color: "#26c6da", description: "Escucha, folclor ecuatoriano y cuidado musical.", ageGroups: ["under12", "over12"], unlockedByDefault: false, inProgress: false, lessonsByAge: { under12: musicReadings, over12: musicReadings } },
  { id: "arte-teoria", title: "ARTE TEORIA", tableName: "Arte teoria.", dashboardTitle: "ARTE TEORIA", cover: "starry", color: "#f48fb1", description: "Color, forma, composición y materiales.", ageGroups: ["under12", "over12"], unlockedByDefault: true, inProgress: true, lessonsByAge: { under12: artTheory, over12: artTheory } },
  { id: "arte-practica", title: "ARTE PRACTICA", tableName: "Arte practica.", dashboardTitle: "ARTE PRACTICA", cover: "starry", color: "#f06292", description: "Observación visual y ejercicios de creación.", ageGroups: ["under12", "over12"], unlockedByDefault: true, inProgress: true, lessonsByAge: { under12: under12Art, over12: over12Art } },
  { id: "arte-lecturas", title: "ARTE LECTURAS", tableName: "Arte lecturas.", dashboardTitle: "ARTE LECTURAS", cover: "books", color: "#ec407a", description: "Obras, artistas y el mensaje de una imagen.", ageGroups: ["under12", "over12"], unlockedByDefault: false, inProgress: false, lessonsByAge: { under12: artReadings, over12: artReadings } },
  { id: "historia-arte", title: "HISTORIA DEL ARTE", tableName: "Historia del arte.", dashboardTitle: "HISTORIA ARTE", cover: "starry", color: "#b39ddb", description: "Estilos y vocabulario visual. Nivel 12 años o más.", ageGroups: ["over12"], unlockedByDefault: false, inProgress: false, lessonsByAge: { over12: over12Art } },
  { id: "programacion-teoria", title: "PROGRAMACION TEORIA", tableName: "Programacion teoria.", dashboardTitle: "CODE TEORIA", cover: "code", color: "#64b5f6", description: "Algoritmos, variables y decisiones.", ageGroups: ["under12", "over12"], unlockedByDefault: true, inProgress: true, lessonsByAge: { under12: codeTheory, over12: codeTheory } },
  { id: "programacion-practica", title: "PROGRAMACION PRACTICA", tableName: "Programacion practica.", dashboardTitle: "CODE PRACTICA", cover: "code", color: "#42a5f5", description: "Bloques y predicción de resultados según tu edad.", ageGroups: ["under12", "over12"], unlockedByDefault: false, inProgress: false, lessonsByAge: { under12: under12Code, over12: over12Code } },
  { id: "programacion-lecturas", title: "PROGRAMACION LECTURAS", tableName: "Programacion lecturas.", dashboardTitle: "CODE LECTURAS", cover: "books", color: "#1e88e5", description: "Pasos, seguridad digital y pensamiento lógico.", ageGroups: ["under12", "over12"], unlockedByDefault: false, inProgress: false, lessonsByAge: { under12: codeReadings, over12: codeReadings } },
  { id: "programacion-2", title: "PROGRAMACION 2", tableName: "Programacion 2.", dashboardTitle: "CODE 2", cover: "code", color: "#ce93d8", description: "Nivel siguiente de práctica para 12 años o más.", ageGroups: ["over12"], unlockedByDefault: false, inProgress: false, lessonsByAge: { over12: over12Code } },
];

export const LANDING_COURSES = COURSES.map((course) => ({
  id: course.id,
  title: course.title,
  color: course.color,
  ages: course.ageGroups,
}));

export const DAILY_GOALS = ["5 minutos", "10 minutos", "15 minutos", "20 minutos"];

export function courseAgeKey(ageGroup) {
  if (ageGroup === "inicial" || ageGroup === "under12") return "under12";
  return "over12";
}

export function coursesForAge(ageGroup) {
  const key = courseAgeKey(ageGroup);
  return COURSES.filter((course) => course.ageGroups.includes(key));
}

export function courseWithLessons(course, ageGroup) {
  if (!course) return null;
  const key = courseAgeKey(ageGroup);
  const group = course.ageGroups.includes(key) ? key : course.ageGroups[0];
  return { ...course, lessons: course.lessonsByAge[group] || [] };
}

export function getCourse(id, ageGroup = "regular") {
  return courseWithLessons(COURSES.find((course) => course.id === id), ageGroup);
}

export function getLesson(courseId, lessonId, ageGroup = "regular") {
  const course = getCourse(courseId, ageGroup);
  return course?.lessons.find((lesson) => lesson.id === String(lessonId));
}
