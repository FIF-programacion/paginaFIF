import { useEffect, useState } from "react";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")} s.`;
}

export default function TimedMathExercise({ exercise, onSubmit }) {
  const [left, setLeft] = useState(exercise.seconds);
  const [answers, setAnswers] = useState(exercise.equations.map(() => ""));
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState("");
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    if (stopped) return undefined;
    const id = setInterval(() => {
      setLeft((current) => {
        if (current <= 1) {
          clearInterval(id);
          setStopped(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [stopped]);

  const check = () => {
    const ok = exercise.equations.every(
      (eq, i) => Number(answers[i]) === eq.answer,
    );
    setFeedback(ok ? "ok" : "bad");
    onSubmit(ok);
  };

  return (
    <>
    <div className="math-panel">
      <div className="timer">{formatTime(left)}</div>
      {exercise.equations.map((eq, i) => (
        <div className="eq-row" key={eq.expr}>
          <span>{eq.expr.includes("=") ? eq.expr : `${eq.expr} =`}</span>
          <input
            aria-label={`Respuesta para ${eq.expr}`}
            inputMode="numeric"
            value={answers[i]}
            onChange={(event) => {
              const next = [...answers];
              next[i] = event.target.value;
              setAnswers(next);
            }}
          />
        </div>
      ))}
      <div className="notes">
        <label htmlFor="math-notes"><strong>Notas</strong></label>
        <textarea id="math-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Usa este espacio para calcular." />
      </div>
      {left === 0 && <p className="feedback bad">Se acabó el tiempo. Envía lo que lograste resolver.</p>}
      {feedback === "ok" && <p className="feedback ok">¡Impecable! Resolviste las ecuaciones.</p>}
      {feedback === "bad" && <p className="feedback bad">Hay un resultado que no cuadra. Recuerda: primero × y ÷, luego + y −.</p>}
    </div>
    <div className="center-btn">
      <button className="btn btn-blue" type="button" onClick={check}>
        ENVIAR
      </button>
    </div>
    </>
  );
}
