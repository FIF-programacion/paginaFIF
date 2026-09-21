import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

export default function TakeTest() {
  const { tests, saveAttempt, user } = useGame();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const load = (event) => {
    event.preventDefault();
    const found = tests.find((item) => item.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      setError("No hay una prueba con ese código en este dispositivo.");
      setTest(null);
      return;
    }
    setError("");
    setTest(found);
    setAnswers({});
    setResult(null);
  };

  const score = useMemo(() => {
    if (!test) return 0;
    return test.questions.reduce((total, question, index) => (
      total + (Number(answers[index]) === question.correctIndex ? 1 : 0)
    ), 0);
  }, [answers, test]);

  const submit = (event) => {
    event.preventDefault();
    if (!test) return;
    const total = test.questions.length;
    saveAttempt({
      id: crypto.randomUUID(),
      code: test.code,
      title: test.title,
      studentName: `${user.firstName} ${user.lastName}`,
      studentEmail: user.email,
      score,
      total,
      createdAt: Date.now(),
    });
    setResult({ score, total });
  };

  return (
    <section className="panel">
      <h2>Prueba de docente</h2>
      <p>Pide el código a tu docente e ingrésalo. La calificación queda en este dispositivo.</p>
      <form onSubmit={load} className="form-stack" style={{ maxWidth: 420 }}>
        <label htmlFor="test-code">Código de la prueba</label>
        <input id="test-code" className="pill-input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="FIF-XXXXX" />
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-blue" type="submit">Abrir prueba</button>
      </form>

      {test && !result && (
        <form onSubmit={submit} className="test-form">
          <h3>{test.title}</h3>
          {test.questions.map((question, index) => (
            <fieldset key={index} className="question-card">
              <legend>{question.prompt}</legend>
              {question.options.map((option, oi) => (
                <label key={oi} className="check-line">
                  <input
                    type="radio"
                    name={`q-${index}`}
                    value={oi}
                    checked={Number(answers[index]) === oi}
                    onChange={() => setAnswers((current) => ({ ...current, [index]: oi }))}
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </fieldset>
          ))}
          <button className="btn btn-green" type="submit">Enviar respuestas</button>
        </form>
      )}

      {result && (
        <div>
          <p className="feedback ok" role="status">Enviaste la prueba. Resultado: {result.score} de {result.total}.</p>
          <div className="actions-row">
            <button className="btn btn-blue" type="button" onClick={() => navigate("/app/cursos")}>Volver a mis cursos</button>
            <Link className="btn btn-green" to="/fif-learning">Volver al portal</Link>
          </div>
        </div>
      )}
    </section>
  );
}
