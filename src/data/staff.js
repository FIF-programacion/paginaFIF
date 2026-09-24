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
};

export const STAFF_KIND_LABEL = {
  admin: "Coordinación FIF",
  teacher: "Profesor",
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
