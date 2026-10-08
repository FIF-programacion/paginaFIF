export { COURSES, LANDING_COURSES, DAILY_GOALS, coursesForAge, courseWithLessons, getCourse, getLesson } from "./courses";
export { AGE_GROUPS, ageLabel, ORG } from "./org";

export const TUTORIAL_SLIDES = [
  {
    title: "Cómo entrar a un curso",
    heading: "Tus cursos te esperan",
    text: "En Mis Cursos ves lo que ya empezaste y el siguiente paso. Entra a una materia y sigue el mapa de lecciones: un nodo a la vez, unos minutos al día.",
  },
  {
    title: "Puntos y rachas",
    heading: "Tu progreso queda registrado",
    text: "Cada ejercicio bien resuelto suma puntos. El verde es progreso; el gris todavía está por descubrir. Puedes volver a una lección ya completada para practicar.",
  },
  {
    title: "Cómo se juega",
    heading: "Tres tipos de práctica",
    text: "Vas a relacionar frases, resolver operaciones con tiempo y completar bloques de código. Si te trabas, abre Asistencia. Preguntar es parte del aprendizaje.",
  },
];

export const PLATFORM_GUIDE_SLIDES = [
  {
    title: "La barra de estudiante",
    heading: "Todo empieza arriba",
    text: "Usa Inicio, Cursos, Progreso, Mis recursos y Asistencia. A la derecha está Ingresar código de prueba, para las evaluaciones que envía el docente.",
  },
  {
    title: "Cómo estudiar",
    heading: "Un nodo a la vez",
    text: "Entra a un curso, sigue el mapa y completa la lección abierta. Relaciona frases, resuelve operaciones o arma bloques de código. El verde es lo ya logrado.",
  },
  {
    title: "Tu kardex",
    heading: "El progreso queda registrado",
    text: "En Progreso ves puntos, racha e insignias. Al terminar un curso puedes descargar un PDF de reconocimiento de FIF Learning; no es un título oficial.",
  },
];

export const PARENT_GUIDE_SLIDES = [
  {
    title: "Acompañar, no reemplazar",
    heading: "FIF Learning es refuerzo en casa",
    text: "La plataforma apoya la práctica diaria. No sustituye la escuela ni un informe oficial. Coordinación FIF crea tu cuenta y te da el acceso.",
  },
  {
    title: "Cuidar la cuenta",
    heading: "Contraseña y tiempo de uso",
    text: "No compartas la contraseña. Acuerda un horario corto, revisa Progreso juntos y celebra los nodos completados. Preguntar en Asistencia es parte del aprendizaje.",
  },
  {
    title: "Hablar con la fundación",
    heading: "Asistencia FIF por WhatsApp",
    text: "Si necesitan orientación, usen Asistencia FIF. El mensaje pide tu nombre, el del estudiante y la consulta, y llega formateado al equipo de la fundación.",
  },
];

export const HELP_ITEMS = [
  {
    id: "guia",
    title: "Guía de la plataforma",
    color: "#b7f5d0",
    textColor: "#14532d",
    slides: true,
    body: "Recorre las diapositivas para ver cómo moverte por FIF Learning, estudiar en el mapa de cursos y revisar tu progreso.",
  },
  {
    id: "docentes",
    title: "Zona de docentes",
    color: "#b7dbff",
    textColor: "#1e3a8a",
    body: "El equipo FIF entra con la cuenta que entrega coordinación. Docentes de matemática, arte y programación ven aula, sílabo y tablero. Multimedia sigue podcast y contenidos. Nadie crea su propia cuenta.",
  },
  {
    id: "alumnos",
    title: "Calificaciones",
    color: "#ffb4b0",
    textColor: "#7f1d1d",
    body: "Las calificaciones de pruebas creadas por docentes se guardan en este dispositivo cuando el estudiante envía la prueba con el código. No sustituyen un registro oficial de la institución hasta que exista un servidor institucional.",
  },
  {
    id: "padres",
    title: "Guía para padres o tutores",
    color: "#ffe08a",
    textColor: "#78350f",
    slides: true,
    body: "Estas diapositivas resumen cómo acompañar a tu hija o hijo, cuidar la cuenta y contactar a la fundación cuando haga falta.",
  },
  {
    id: "fif",
    title: "Asistencia FIF",
    color: "#f5b4ff",
    textColor: "#831843",
    body: "Completa los datos y envía la consulta por WhatsApp. El equipo de FIF verá que el mensaje salió de la plataforma y podrá contactar a la familia.",
  },
];
