import { useState } from "react";
import { Link } from "react-router-dom";
import { HELP_ITEMS, PARENT_GUIDE_SLIDES, PLATFORM_GUIDE_SLIDES } from "../data/content";
import { assistanceWhatsAppUrl, formatAssistanceMessage, ORG } from "../data/org";
import { useGame } from "../context/GameContext";

function GuideSlides({ slides, color }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const last = index >= slides.length - 1;

  return (
    <div className="help-slides">
      <div className="slide-card help-slide-card">
        <div>
          <h2 style={{ color }}>{slide.title}</h2>
          <p><strong>{slide.heading}.</strong> {slide.text}</p>
        </div>
      </div>
      <p className="slide-count">Diapositiva {index + 1} de {slides.length}</p>
      <div className="actions-row">
        <button
          className="btn btn-blue"
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((current) => Math.max(0, current - 1))}
        >
          Anterior
        </button>
        <button
          className="btn btn-green"
          type="button"
          disabled={last}
          onClick={() => setIndex((current) => Math.min(slides.length - 1, current + 1))}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default function Help() {
  const { saveMessage, user } = useGame();
  const [open, setOpen] = useState(null);
  const [guardianName, setGuardianName] = useState(user?.tutorName || "");
  const [studentName, setStudentName] = useState(
    [user?.firstName, user?.lastName].filter(Boolean).join(" "),
  );
  const [text, setText] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("");
  const item = HELP_ITEMS.find((entry) => entry.id === open);
  const hasWhatsApp = String(ORG.whatsappNumber || "").replace(/\D/g, "").length >= 10;

  const close = () => {
    setOpen(null);
    setStatus("");
  };

  return (
    <div className="help-layout">
      <div className="help-copy">
        <h2>Pedir ayuda nunca es malo</h2>
        <p>
          Aquí encuentras orientación para usar la plataforma. Asistencia FIF abre WhatsApp con un
          mensaje ya formateado para el equipo de la fundación.
        </p>
        <p><Link to="/profesores">Ir a la zona de docentes</Link></p>
        <div className="help-list">
          {HELP_ITEMS.map((entry) => (
            <button
              key={entry.id}
              className="help-btn"
              type="button"
              style={{ background: entry.color, color: entry.textColor }}
              onClick={() => {
                setOpen(entry.id);
                setStatus("");
              }}
            >
              {entry.title}
            </button>
          ))}
        </div>
      </div>
      <img src="/images/team.jpg" alt="Ilustración de un grupo diverso de personas de la fundación" className="help-art" />
      {item && (
        <div className="modal-backdrop" onClick={close}>
          <div
            className={`modal${item.slides ? " modal-slides" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="help-title" style={{ color: item.textColor }}>{item.title}</h3>
            <p>{item.body}</p>
            {item.id === "guia" && <GuideSlides slides={PLATFORM_GUIDE_SLIDES} color={item.textColor} />}
            {item.id === "padres" && <GuideSlides slides={PARENT_GUIDE_SLIDES} color={item.textColor} />}
            {item.id === "fif" && (
              <form
                className="help-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!consent) {
                    setStatus("Marca el consentimiento para enviar el mensaje por WhatsApp.");
                    return;
                  }
                  const payload = {
                    guardianName: guardianName.trim(),
                    studentName: studentName.trim(),
                    body: text.trim(),
                  };
                  if (!payload.guardianName || !payload.studentName || !payload.body) {
                    setStatus("Completa el nombre de madre, padre o tutor, el del estudiante y el mensaje.");
                    return;
                  }
                  const message = formatAssistanceMessage(payload);
                  saveMessage({ ...payload, channel: "whatsapp" });
                  window.open(assistanceWhatsAppUrl(message), "_blank", "noopener,noreferrer");
                  setText("");
                  setConsent(false);
                  setStatus(
                    hasWhatsApp
                      ? "Se abrió WhatsApp con el mensaje listo para el equipo de FIF."
                      : "Se abrió WhatsApp con el texto. Falta configurar el número institucional en src/data/org.js para enviarlo directo a la fundación.",
                  );
                }}
              >
                <label htmlFor="help-guardian">Nombre de mamá, papá o tutor</label>
                <input
                  id="help-guardian"
                  className="pill-input"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  required
                />
                <label htmlFor="help-student">Nombre del estudiante</label>
                <input
                  id="help-student"
                  className="pill-input"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
                <label htmlFor="help-msg">Contenido del mensaje</label>
                <textarea
                  id="help-msg"
                  className="pill-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  style={{ borderRadius: 18, minHeight: 90 }}
                />
                <label className="check-line">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>Autorizo enviar este mensaje por WhatsApp al equipo de la Fundación Integral de Familias.</span>
                </label>
                {!hasWhatsApp && (
                  <p className="help-note">
                    El número de WhatsApp de la fundación aún no está configurado. El envío directo se activará cuando se publique el número institucional.
                  </p>
                )}
                {status && <p role="status">{status}</p>}
                <div className="actions-row">
                  <button className="btn btn-green" type="submit">Enviar por WhatsApp</button>
                </div>
              </form>
            )}
            <div className="actions-row">
              <button className="btn btn-blue" type="button" onClick={close}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
