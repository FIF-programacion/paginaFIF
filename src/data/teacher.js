import { COURSES } from "./courses";

export const SUBJECTS = [
  { id: "matematica", label: "Matemática", courses: ["matematica-teoria", "matematica-practica", "matematica-lecturas", "geometria", "algebra", "matematica-cotidiana"] },
  { id: "musica", label: "Música", courses: ["musica-teoria", "musica-practica", "musica-lecturas"] },
  { id: "arte", label: "Arte", courses: ["arte-teoria", "arte-practica", "arte-lecturas", "historia-arte"] },
  { id: "programacion", label: "Programación", courses: ["programacion-teoria", "programacion-practica", "programacion-lecturas", "programacion-2"] },
];

export const QUESTION_TYPES = [
  { id: "choice", label: "Opción múltiple" },
  { id: "truefalse", label: "Verdadero o falso" },
  { id: "complete", label: "Completar" },
  { id: "short", label: "Respuesta corta" },
];

export const ACTIVITY_TYPES = [
  { id: "tarea", label: "Tarea" },
  { id: "lectura", label: "Lectura" },
  { id: "practica", label: "Práctica" },
  { id: "proyecto", label: "Proyecto" },
];

export function coursesForSubject(subjectId) {
  const subject = SUBJECTS.find((item) => item.id === subjectId);
  if (!subject) return COURSES;
  return COURSES.filter((course) => subject.courses.includes(course.id));
}

export function emptyQuestion() {
  return {
    type: "choice",
    prompt: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    correctText: "",
    points: 1,
  };
}

export function normalizeQuestion(question) {
  const type = QUESTION_TYPES.some((item) => item.id === question.type) ? question.type : "choice";
  const points = Math.max(1, Number(question.points) || 1);
  if (type === "truefalse") {
    return {
      type,
      prompt: String(question.prompt || "").trim(),
      options: ["Verdadero", "Falso"],
      correctIndex: Number(question.correctIndex) === 1 ? 1 : 0,
      correctText: "",
      points,
    };
  }
  if (type === "complete" || type === "short") {
    return {
      type,
      prompt: String(question.prompt || "").trim(),
      options: [],
      correctIndex: -1,
      correctText: String(question.correctText || "").trim(),
      points,
    };
  }
  const options = (question.options || []).map((option) => String(option).trim()).filter(Boolean);
  return {
    type: "choice",
    prompt: String(question.prompt || "").trim(),
    options,
    correctIndex: Number(question.correctIndex) || 0,
    correctText: "",
    points,
  };
}

export function isQuestionReady(question) {
  const normalized = normalizeQuestion(question);
  if (!normalized.prompt) return false;
  if (normalized.type === "choice") return normalized.options.length >= 2;
  if (normalized.type === "truefalse") return true;
  return Boolean(normalized.correctText);
}
