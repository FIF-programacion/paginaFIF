import { useState } from "react";

export default function DeductorExercise({ exercise, onSubmit }) {
  const [pool, setPool] = useState(exercise.blocks);
  const [slots, setSlots] = useState({});
  const [dragging, setDragging] = useState(null);
  const [output, setOutput] = useState("");
  const [feedback, setFeedback] = useState("");

  const assign = (slotId, value) => {
    setSlots((current) => {
      const previous = current[slotId];
      const next = { ...current, [slotId]: value };
      setPool((items) => {
        const without = items.filter((item) => item !== value);
        return previous ? [...without, previous] : without;
      });
      return next;
    });
  };

  const handleDrop = (slotId) => {
    if (!dragging) return;
    assign(slotId, dragging);
    setDragging(null);
  };

  const check = () => {
    const slotsOk = Object.entries(exercise.slots).every(
      ([id, meta]) => slots[id] === meta.accept,
    );
    const outOk = output.trim().toLowerCase() === exercise.output.toLowerCase();
    const ok = slotsOk && outOk;
    setFeedback(ok ? "ok" : "bad");
    onSubmit(ok);
  };

  return (
    <>
    <div className="code-panel">
      <div className="code-work">
        <aside className="form-stack">
          {pool.map((block) => (
            <button
              key={block}
              type="button"
              className={`chip chip-blue ${dragging === block ? "ghost" : ""}`}
              draggable
              onDragStart={() => setDragging(block)}
              onDragEnd={() => setDragging(null)}
              onClick={() => setDragging(block)}
            >
              {block}
            </button>
          ))}
        </aside>
        <div>
          <div className="code-window">
            {exercise.lines.map((line, i) => (
              <div key={i}>
                {line.text.startsWith("print") ? (
                  <>
                    <span className="kw">print</span>
                    {line.text.slice(5)}
                  </>
                ) : (
                  line.text
                )}
                {line.slot && (
                  <>
                    {exercise.slots[line.slot].prefix ? ` ${exercise.slots[line.slot].prefix} ` : ""}
                    <span
                      className={`inline-slot ${dragging ? "active" : ""}`}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => handleDrop(line.slot)}
                      onClick={() => dragging && handleDrop(line.slot)}
                    >
                      {slots[line.slot] ? <span className="chip chip-blue">{slots[line.slot]}</span> : null}
                    </span>
                  </>
                )}
                {line.afterText || ""}
              </div>
            ))}
          </div>
          <div className="output-line">
            <strong>IMPRIME:</strong>
            <input value={output} onChange={(event) => setOutput(event.target.value)} placeholder="¿Qué muestra el programa?" />
          </div>
        </div>
      </div>
      {feedback === "ok" && <p className="feedback ok">¡Correcto! El bloque imprime exactamente eso.</p>}
      {feedback === "bad" && <p className="feedback bad">Revisa los bloques y lo que imprime el programa.</p>}
    </div>
    <div className="center-btn">
      <button className="btn btn-blue" type="button" onClick={check}>
        ENVIAR
      </button>
    </div>
    </>
  );
}
