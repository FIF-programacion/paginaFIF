export const ACCESS_KEYS = [
  { id: "tests", label: "Crear y publicar pruebas" },
  { id: "grades", label: "Ver calificaciones" },
  { id: "attendance", label: "Tomar asistencia" },
  { id: "activities", label: "Publicar actividades" },
  { id: "schedules", label: "Ver horarios" },
];

export const ACCESS_PRESETS = {
  admin: { tests: true, grades: true, attendance: true, activities: true, schedules: true },
  teacher: { tests: true, grades: true, attendance: true, activities: true, schedules: true },
  permanent: { tests: true, grades: true, attendance: true, activities: true, schedules: true },
  temporary: { tests: false, grades: false, attendance: true, activities: true, schedules: true },
  member: { tests: false, grades: false, attendance: false, activities: false, schedules: false },
};

export const TEAMS = [
  { id: "matematica", label: "Matemática", teaches: true, blurb: "Clases, sílabo y olimpiadas." },
  { id: "arte", label: "Artes", teaches: true, blurb: "Clases, sílabo y producción creativa." },
  { id: "programacion", label: "Programación", teaches: true, blurb: "Clases, sílabo y desarrollo de la web FIF." },
  { id: "multimedia", label: "Multimedia", teaches: false, blurb: "Podcast, contenido, redes y piezas de comunicación." },
];

export const DUTIES = [
  { id: "teacher", label: "Docente" },
  { id: "member", label: "Miembro de la fundación" },
];

export const BOARD_COLUMNS = [
  { id: "todo", label: "Por hacer" },
  { id: "in_progress", label: "En curso" },
  { id: "review", label: "Revisión" },
  { id: "completed", label: "Hecho" },
];

export const CONTENT_KINDS = [
  { id: "podcast", label: "Podcast" },
  { id: "video", label: "Video / YouTube" },
  { id: "social", label: "Redes" },
  { id: "diseno", label: "Diseño" },
  { id: "otro", label: "Otro" },
];

export function teamById(id) {
  return TEAMS.find((item) => item.id === id) || null;
}

export function teamLabel(id) {
  return teamById(id)?.label || "Sin equipo";
}

export function dutyLabel(id) {
  return DUTIES.find((item) => item.id === id)?.label || "Miembro";
}

export function accessForDuty(duty, teamId) {
  const team = teamById(teamId);
  if (duty === "teacher" && team?.teaches) return { ...ACCESS_PRESETS.teacher };
  return { ...ACCESS_PRESETS.member };
}

export const STAFF_KIND_LABEL = {
  admin: "Coordinación FIF",
  teacher: "Docente",
  staff: "Equipo FIF",
  permanent: "Voluntario permanente",
  temporary: "Voluntario temporal",
};

export const WEEKDAYS = [
  { id: "lunes", label: "Lunes" },
  { id: "martes", label: "Martes" },
  { id: "miercoles", label: "Miércoles" },
  { id: "jueves", label: "Jueves" },
  { id: "viernes", label: "Viernes" },
  { id: "sabado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
];

export const DEFAULT_ADMIN = {
  email: "coordinacion@fif.org",
  firstName: "Coordinación",
  lastName: "FIF",
  password: "FIFCoord2026",
};

export const DEFAULT_TEMP_PASSWORD = "FIFVoluntario2026";

export const DEFAULT_TEMP_VOLUNTEERS = [
  { slot: "voluntario1", email: "voluntario1@fif.org", firstName: "Voluntario", lastName: "Temporal 1" },
  { slot: "voluntario2", email: "voluntario2@fif.org", firstName: "Voluntario", lastName: "Temporal 2" },
  { slot: "voluntario3", email: "voluntario3@fif.org", firstName: "Voluntario", lastName: "Temporal 3" },
];
