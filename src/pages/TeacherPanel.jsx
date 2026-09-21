import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { parseTestCode } from "../utils/parseTestCode";
import { makeTestCode } from "../utils/security";

const emptyQuestion = () => ({ prompt: "", options: ["", "", "", ""], correctIndex: 0 });

export default function TeacherPanel() {
  const { user, hydrated, tests, attempts, saveTest, logout } = useGame();
  const [tab, setTab] = useState("crear");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [codeText, setCodeText] = useState(`TITULO: Prueba de ejemplo

PREGUNTA: ¿Cuánto es 2+2?
A) 3
B) 4
C) 5
CORRECTA: B`);
  const [feedback, setFeedback] = useState("");

  const mine = tests.filter((test) => test.teacherEmail === user?.email);
  const myAttempts = attempts.filter((item) => mine.some((test) => test.code === item.code));

  const published = useMemo(() => mine.slice().reverse(), [mine]);

  if (!hydrated) return null;
  if (!user || user.role !== "teacher") return <Navigate to="/profesores" replace />;

  const publishFromForm = () => {
    const clean = questions
      .map((question) => ({
        prompt: question.prompt.trim(),
        options: question.options.map((option) => option.trim()).filter(Boolean),
        correctIndex: Number(question.correctIndex),
      }))
      .filter((question) => question.prompt && question.options.length >= 2);
    if (!title.trim() || !clean.length) {
      setFeedback("Pon un título y al menos una pregunta con dos opciones.");
      return;
    }
    const test = {
      code: makeTestCode(),
      title: title.trim(),
      teacherEmail: user.email,
      teacherName: `${user.firstName} ${user.lastName}`,
      questions: clean,
      createdAt: Date.now(),
    };
    saveTest(test);
    setFeedback(`Prueba publicada. Código para estudiantes: ${test.code}`);
    setTitle("");
    setQuestions([emptyQuestion()]);
  };

  const publishFromCode = () => {
    try {
      const parsed = parseTestCode(codeText);
      const test = {
        code: makeTestCode(),
        ...parsed,
        teacherEmail: user.email,
        teacherName: `${user.firstName} ${user.lastName}`,
        createdAt: Date.now(),
      };
      saveTest(test);
      setFeedback(`Prueba publicada. Código para estudiantes: ${test.code}`);
    } catch (error) {
      setFeedback(error.message);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-top">
          <h1 className="course-title" style={{ margin: 0 }}>Docentes FIF</h1>
          <div className="header-actions">
            <Link className="btn btn-blue login-chip" to="/fif-learning">Volver al portal</Link>
            <button className="btn btn-green login-chip" type="button" onClick={logout}>Cerrar sesión</button>
          </div>
        </div>
        <p>Hola, {user.firstName}. Crea pruebas y revisa calificaciones de este dispositivo.</p>
      </header>
      <nav className="app-nav">
        <button type="button" className={tab === "crear" ? "active" : ""} onClick={() => setTab("crear")}>Crear prueba</button>
        <button type="button" className={tab === "codigo" ? "active" : ""} onClick={() => setTab("codigo")}>Crear con código</button>
        <button type="button" className={tab === "notas" ? "active" : ""} onClick={() => setTab("notas")}>Calificaciones</button>
      </nav>

      {feedback && <p className="feedback ok" role="status">{feedback}</p>}

      {tab === "crear" && (
        <section className="panel">
          <h2>Nueva prueba</h2>
          <label htmlFor="test-title">Título</label>
          <input id="test-title" className="pill-input" value={title} onChange={(e) => setTitle(e.target.value)} />
          {questions.map((question, qi) => (
            <fieldset key={qi} className="question-card">
              <legend>Pregunta {qi + 1}</legend>
              <label htmlFor={`q-${qi}`}>Enunciado</label>
              <input id={`q-${qi}`} className="pill-input" value={question.prompt} onChange={(e) => {
                const next = [...questions];
                next[qi] = { ...question, prompt: e.target.value };
                setQuestions(next);
              }} />
              {question.options.map((option, oi) => (
                <label key={oi} htmlFor={`q-${qi}-o-${oi}`}>
                  Opción {String.fromCharCode(65 + oi)}
                  <input id={`q-${qi}-o-${oi}`} className="pill-input" value={option} onChange={(e) => {
                    const next = [...questions];
                    const options = [...question.options];
                    options[oi] = e.target.value;
                    next[qi] = { ...question, options };
                    setQuestions(next);
                  }} />
                </label>
              ))}
              <label htmlFor={`q-${qi}-ok`}>Respuesta correcta</label>
              <select id={`q-${qi}-ok`} className="pill-select" value={question.correctIndex} onChange={(e) => {
                const next = [...questions];
                next[qi] = { ...question, correctIndex: Number(e.target.value) };
                setQuestions(next);
              }}>
                {question.options.map((_, oi) => (
                  <option key={oi} value={oi}>{String.fromCharCode(65 + oi)}</option>
                ))}
              </select>
            </fieldset>
          ))}
          <div className="actions-row">
            <button className="btn btn-blue" type="button" onClick={() => setQuestions((current) => [...current, emptyQuestion()])}>
              Añadir pregunta
            </button>
            <button className="btn btn-green" type="button" onClick={publishFromForm}>
              Publicar prueba
            </button>
          </div>
        </section>
      )}

      {tab === "codigo" && (
        <section className="panel">
          <h2>Pegar prueba en código de texto</h2>
          <p>Usa TITULO, PREGUNTA, opciones A) B) C) y CORRECTA. Separa preguntas con una línea en blanco.</p>
          <label htmlFor="code-test">Código de la prueba</label>
          <textarea id="code-test" className="code-editor" value={codeText} onChange={(e) => setCodeText(e.target.value)} />
          <button className="btn btn-green" type="button" onClick={publishFromCode}>Publicar desde código</button>
        </section>
      )}

      {tab === "notas" && (
        <section className="panel">
          <h2>Calificaciones</h2>
          <p>Pruebas publicadas: {published.map((test) => `${test.title} (${test.code})`).join(" · ") || "ninguna aún"}.</p>
          <table className="progress-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Correo</th>
                <th>Prueba</th>
                <th>Código</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {myAttempts.length === 0 && (
                <tr><td colSpan={5}>Todavía no hay envíos en este dispositivo.</td></tr>
              )}
              {myAttempts.map((item) => (
                <tr key={item.id}>
                  <td>{item.studentName}</td>
                  <td>{item.studentEmail}</td>
                  <td>{item.title}</td>
                  <td>{item.code}</td>
                  <td>{item.score}/{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
