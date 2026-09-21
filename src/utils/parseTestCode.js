function parseBlock(block) {
  const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
  const question = { prompt: "", options: [], correctIndex: -1 };
  lines.forEach((line) => {
    if (/^PREGUNTA:/i.test(line)) question.prompt = line.replace(/^PREGUNTA:\s*/i, "").trim();
    else if (/^[A-D]\)/i.test(line)) question.options.push(line.slice(2).trim());
    else if (/^CORRECTA:/i.test(line)) {
      const letter = line.replace(/^CORRECTA:\s*/i, "").trim().toUpperCase();
      question.correctIndex = letter.charCodeAt(0) - 65;
    }
  });
  if (!question.prompt || question.options.length < 2 || question.correctIndex < 0) return null;
  return question;
}

export function parseTestCode(raw) {
  const text = raw.trim();
  const titleMatch = text.match(/^TITULO:\s*(.+)$/im);
  const title = titleMatch ? titleMatch[1].trim() : "Prueba sin título";
  const chunks = text.split(/\n\s*\n/).map((chunk) => chunk.trim()).filter(Boolean);
  const questions = chunks
    .filter((chunk) => /PREGUNTA:/i.test(chunk))
    .map(parseBlock)
    .filter(Boolean);
  if (!questions.length) {
    throw new Error("No encontramos preguntas. Usa TITULO, PREGUNTA, A) B) C) y CORRECTA.");
  }
  return { title, questions };
}
