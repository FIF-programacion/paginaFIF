import { useMemo, useState } from "react";

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MatchingExercise({ exercise, onSubmit }) {
  const poolStart = useMemo(() => shuffle(exercise.pairs.map((pair) => pair.right)), [exercise]);
  const hinted = exercise.pairs[0];
  const [pool, setPool] = useState(poolStart.filter((item) => item !== hinted.right));
  const [slots, setSlots] = useState({ [hinted.id]: hinted.right });
  const [dragging, setDragging] = useState(null);
  const [feedback, setFeedback] = useState("");

  const assign = (targetId, value) => {
    setSlots((current) => {
      const previous = current[targetId];
      const next = { ...current, [targetId]: value };
      setPool((items) => {
        const without = items.filter((item) => item !== value);
        return previous ? [...without, previous] : without;
      });
      return next;
    });
  };

  const returnToPool = (targetId) => {
    setSlots((current) => {
      const value = current[targetId];
      if (!value) return current;
      const next = { ...current };
      delete next[targetId];
      setPool((items) => [...items, value]);
      return next;
    });
  };

  const handleDrop = (targetId) => {
    if (!dragging) return;
    assign(targetId, dragging);
    setDragging(null);
  };

  const check = () => {
    const ok = exercise.pairs.every((pair) => slots[pair.id] === pair.right);
    if (ok) {
      setFeedback("ok");
      onSubmit(true);
    } else {
      setFeedback("bad");
      onSubmit(false);
    }
  };

  return (
    <div>
      <div className="exercise-layout">
        <aside className="pool">
          <div className="chip-gray chip" style={{ minHeight: 40 }} />
          {pool.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip chip-blue ${dragging === item ? "ghost" : ""}`}
              draggable
              onDragStart={() => setDragging(item)}
              onDragEnd={() => setDragging(null)}
              onClick={() => setDragging(item)}
            >
              {item}
            </button>
          ))}
        </aside>
        <div>
          {exercise.pairs.map((pair) => (
            <div className="pair-row" key={pair.id}>
              <div className="chip chip-pink">{pair.left}</div>
              <div className="arrow">→</div>
              <div
                className={`drop-slot ${dragging ? "active" : ""}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(pair.id)}
                onClick={() => {
                  if (dragging) handleDrop(pair.id);
                  else if (slots[pair.id]) returnToPool(pair.id);
                }}
              >
                {slots[pair.id] ? <span className="chip chip-blue">{slots[pair.id]}</span> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
      {feedback === "ok" && <p className="feedback ok">¡Excelente! Todas las parejas coinciden.</p>}
      {feedback === "bad" && <p className="feedback bad">Revisa las parejas e inténtalo otra vez.</p>}
      <div className="center-btn">
        <button className="btn btn-blue" type="button" onClick={check}>
          ENVIAR
        </button>
      </div>
    </div>
  );
}
