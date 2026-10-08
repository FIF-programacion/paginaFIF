import { useState } from "react";
import { assistanceWhatsAppUrl, formatDonationMessage, ORG } from "../data/org";

const EMPTY = { fullName: "", phone: "", email: "", amount: "", notes: "" };

export function RequestFormModal({
  title = "Formulario de donación",
  lead = "No es un pago en línea. Completa tus datos y coordinamos el aporte por WhatsApp.",
  amountLabel = "Cantidad a donar",
  packageName = "",
  initial = EMPTY,
  onClose,
}) {
  const [form, setForm] = useState({ ...EMPTY, ...initial, amount: initial.amount ?? "" });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("");
  const hasWhatsApp = String(ORG.whatsappNumber || "").replace(/\D/g, "").length >= 10;

  const set = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-form-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="request-form-title">{title}</h3>
        <p>{lead}</p>
        {packageName && <p><strong>{packageName}</strong></p>}
        <form
          className="help-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!consent) {
              setStatus("Marca el consentimiento para enviar el mensaje por WhatsApp.");
              return;
            }
            const payload = {
              fullName: form.fullName.trim(),
              phone: form.phone.trim(),
              email: form.email.trim(),
              amount: String(form.amount).trim(),
              notes: form.notes.trim(),
              packageName,
            };
            if (!payload.fullName || !payload.phone || !payload.email || !payload.amount) {
              setStatus("Completa nombre, celular, correo y la cantidad.");
              return;
            }
            window.open(assistanceWhatsAppUrl(formatDonationMessage(payload)), "_blank", "noopener,noreferrer");
            setConsent(false);
            setStatus(
              hasWhatsApp
                ? "Se abrió WhatsApp con el formulario listo para el equipo de FIF."
                : "Se abrió WhatsApp con el texto. Falta configurar el número institucional.",
            );
          }}
        >
          <label htmlFor="req-name">Nombres y apellidos</label>
          <input id="req-name" className="pill-input" value={form.fullName} onChange={(event) => set("fullName", event.target.value)} required />
          <label htmlFor="req-phone">Número celular</label>
          <input id="req-phone" className="pill-input" value={form.phone} onChange={(event) => set("phone", event.target.value)} required />
          <label htmlFor="req-email">Correo electrónico</label>
          <input id="req-email" className="pill-input" type="email" value={form.email} onChange={(event) => set("email", event.target.value)} required />
          <label htmlFor="req-amount">{amountLabel}</label>
          <input id="req-amount" className="pill-input" type="number" min="1" value={form.amount} onChange={(event) => set("amount", event.target.value)} required />
          <label htmlFor="req-notes">Notas adicionales</label>
          <textarea
            id="req-notes"
            className="pill-input"
            value={form.notes}
            onChange={(event) => set("notes", event.target.value)}
            style={{ borderRadius: 18, minHeight: 90 }}
          />
          <label className="check-line">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            <span>Autorizo enviar este formulario por WhatsApp al equipo de la Fundación Integral de Familias.</span>
          </label>
          {status && <p role="status">{status}</p>}
          <div className="actions-row">
            <button className="btn btn-green" type="submit">Enviar por WhatsApp</button>
            <button className="btn btn-blue" type="button" onClick={onClose}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
