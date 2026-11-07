import { COURSES, courseAgeKey } from "./courses";

export const SUBJECTS = [
  { id: "programacion", label: "Programación", cover: "code", color: "#42a5f5", courses: ["programacion-teoria", "programacion-practica", "programacion-lecturas", "programacion-2"] },
  { id: "matematica", label: "Matemática", cover: "chalkboard", color: "#ffd56a", courses: ["matematica-teoria", "matematica-practica", "geometria", "algebra"] },
  { id: "arte", label: "Arte", cover: "starry", color: "#f06292", courses: ["arte-teoria", "arte-practica", "arte-lecturas", "historia-arte"] },
  { id: "musica", label: "Música", cover: "music", color: "#4dd0e1", courses: ["musica-teoria", "musica-practica", "musica-lecturas"] },
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

export function getSubject(id) {
  return SUBJECTS.find((item) => item.id === id) || null;
}

export function subjectOfCourse(courseId) {
  return SUBJECTS.find((item) => item.courses.includes(courseId)) || null;
}

export function subjectsForAge(ageGroup) {
  const key = courseAgeKey(ageGroup);
  return SUBJECTS.filter((subject) =>
    subject.courses.some((courseId) => COURSES.find((course) => course.id === courseId)?.ageGroups.includes(key)),
  ).map((subject) => ({
    ...subject,
    courses: subject.courses.filter((courseId) => COURSES.find((course) => course.id === courseId)?.ageGroups.includes(key)),
  }));
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
