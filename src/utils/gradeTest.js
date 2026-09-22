import { normalizeQuestion } from "../data/teacher";

function normalizeAnswer(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function scoreQuestion(question, answer) {
  const item = normalizeQuestion(question);
  if (item.type === "choice" || item.type === "truefalse") {
    return Number(answer) === Number(item.correctIndex) ? item.points : 0;
  }
  if (!item.correctText) return 0;
  return normalizeAnswer(answer) === normalizeAnswer(item.correctText) ? item.points : 0;
}

export function gradeAttempt(test, answers) {
  const questions = (test?.questions || []).map(normalizeQuestion);
  const total = questions.reduce((sum, question) => sum + question.points, 0);
  const score = questions.reduce((sum, question, index) => sum + scoreQuestion(question, answers?.[index]), 0);
  const percent = total ? Math.round((score / total) * 100) : 0;
  return { score, total, percent };
}
