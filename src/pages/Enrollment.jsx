import { useState } from "react";
import { Link } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { useGame } from "../context/GameContext";
import { assistanceWhatsAppUrl, formatEnrollmentPaymentMessage } from "../data/org";
import { ACADEMIC_GOALS, ENROLLMENT_FEES, SCHOLARSHIPS, SCHOOL_TYPES, emptyEnrollment } from "../data/enrollments";
import "./Enrollment.css";

const STEPS = [
  { id: 1, title: "Datos del representante" },
  { id: 2, title: "Datos del estudiante" },
  { id: 3, title: "Información académica" },
  { id: 4, title: "Modalidad y emergencia" },
  { id: 5, title: "Revisar y confirmar" },
];

function Field({ id, label, hint, children }) {
  return (
    <label className="en-field" htmlFor={id}>
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export default function Enrollment() {
  const { saveEnrollment } = useGame();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyEnrollment);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [consent, setConsent] = useState(false);

  const set = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const toggleGoal = (id) => {
    setForm((current) => {
      const has = current.goals.includes(id);
      return { ...current, goals: has ? current.goals.filter((item) => item !== id) : [...current.goals, id] };
    });
  };

  const toggleScholarship = (id) => {
    setForm((current) => {
      const has = current.scholarships.includes(id);
      return { ...current, scholarships: has ? current.scholarships.filter((item) => item !== id) : [...current.scholarships, id] };
    });
  };

  const fees = ENROLLMENT_FEES[form.schoolType];

  const validate = () => {
    if (step === 1 && (!form.guardianName || !form.guardianId || !form.relationship || !form.guardianPhone || !form.guardianEmail)) {
      return "Completa los datos del representante.";
    }
    if (step === 2 && (!form.studentName || !form.studentId || !form.birthDate || !form.school || !form.schoolType || !form.grade || !form.city || !form.sector)) {
      return "Completa los datos del estudiante, incluida la institución fiscal o particular.";
    }
    if (step === 3 && (!form.contests || !form.extraPrep || !form.goals.length)) {
      return "Indica la información académica y al menos una expectativa.";
    }
    if (step === 4 && (!form.modality || !form.emergencyName || !form.emergencyRelation || !form.emergencyPhone)) {
      return "Elige la modalidad y el contacto de emergencia.";
    }
    if (step === 5) {
      if (!consent) return "Debes aceptar el uso de los datos para gestionar la inscripción.";
      if (!form.payName || !form.payPhone || !form.payEmail || !form.payAmount) {
        return "Completa el formulario de pago: nombre, celular, correo y cantidad.";
      }
    }
    return "";
  };

  const next = (event) => {
    event.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    setError("");
    if (step < 5) {
      if (step === 4) {
        const fee = ENROLLMENT_FEES[form.schoolType];
        setForm((current) => ({
          ...current,
          payName: current.payName || current.guardianName,
          payPhone: current.payPhone || current.guardianPhone,
          payEmail: current.payEmail || current.guardianEmail,
          payAmount: current.payAmount || String(fee?.inscription || ""),
        }));
      }
      setStep((current) => current + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const record = {
      ...form,
      id: crypto.randomUUID(),
      status: "pendiente",
      createdAt: Date.now(),
      scholarshipLabels: form.scholarships.map((id) => SCHOLARSHIPS.find((item) => item.id === id)?.label || id),
    };
    saveEnrollment(record);
    window.open(assistanceWhatsAppUrl(formatEnrollmentPaymentMessage(record)), "_blank", "noopener,noreferrer");
    setDone(true);
  };

  const goalLabels = form.goals.map((id) => {
    if (id === "otro" && form.otherGoal) return form.otherGoal;
    return ACADEMIC_GOALS.find((item) => item.id === id)?.label || id;
  }).join(", ");

  if (done) {
    return (
      <div className="en-page">
        <header className="en-top">
          <Link to="/" className="en-brand"><img src="/images/LOGO_COLOR.png" alt="" /> FIF</Link>
          <Link to="/" className="en-back">Volver al inicio</Link>
        </header>
        <main className="en-card en-done">
          <h1>Inscripción enviada</h1>
          <p>Recibimos los datos de {form.studentName}. Se abrió WhatsApp para coordinar el pago de la inscripción. Coordinación revisará la solicitud y escribirá al correo {form.guardianEmail}.</p>
          <Link to="/" className="en-next">Ir al inicio</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="en-page">
      <header className="en-top">
        <Link to="/" className="en-brand"><img src="/images/LOGO_COLOR.png" alt="" /> FIF</Link>
        <p>Inscripción de estudiante · Paso {step} de 5</p>
      </header>

      <main className="en-card">
        <div className="en-progress" aria-hidden="true">
          <span style={{ width: `${(step / 5) * 100}%` }} />
        </div>
        <p className="en-kicker">Inscripción de estudiante</p>
        <h1>{STEPS[step - 1].title}</h1>

        <form onSubmit={next}>
          {step === 1 && (
            <div className="en-grid">
              <Field id="guardianName" label="Nombres y apellidos completos">
                <input id="guardianName" value={form.guardianName} onChange={(event) => set("guardianName", event.target.value)} />
              </Field>
              <Field id="guardianId" label="Cédula o pasaporte">
                <input id="guardianId" value={form.guardianId} onChange={(event) => set("guardianId", event.target.value)} />
              </Field>
              <Field id="relationship" label="Parentesco con el estudiante">
                <input id="relationship" value={form.relationship} onChange={(event) => set("relationship", event.target.value)} />
              </Field>
              <Field id="guardianPhone" label="Celular / WhatsApp">
                <input id="guardianPhone" value={form.guardianPhone} onChange={(event) => set("guardianPhone", event.target.value)} />
              </Field>
              <Field id="guardianEmail" label="Correo electrónico" hint="Se utilizará para la cuenta y para contactarte.">
                <input id="guardianEmail" type="email" value={form.guardianEmail} onChange={(event) => set("guardianEmail", event.target.value)} />
              </Field>
            </div>
          )}

          {step === 2 && (
            <>
            <div className="en-grid">
              <Field id="studentName" label="Nombres y apellidos completos">
                <input id="studentName" value={form.studentName} onChange={(event) => set("studentName", event.target.value)} />
              </Field>
              <Field id="studentId" label="Cédula o documento de identidad">
                <input id="studentId" value={form.studentId} onChange={(event) => set("studentId", event.target.value)} />
              </Field>
              <Field id="birthDate" label="Fecha de nacimiento">
                <input id="birthDate" type="date" value={form.birthDate} onChange={(event) => set("birthDate", event.target.value)} />
              </Field>
              <Field id="school" label="Institución educativa">
                <input id="school" value={form.school} onChange={(event) => set("school", event.target.value)} />
              </Field>
              <fieldset className="en-choice en-field">
                <legend>Tipo de institución</legend>
                {SCHOOL_TYPES.map((type) => (
                  <label key={type.id}>
                    <input
                      type="radio"
                      name="schoolType"
                      checked={form.schoolType === type.id}
                      onChange={() => {
                        const fees = ENROLLMENT_FEES[type.id];
                        setForm((current) => ({
                          ...current,
                          schoolType: type.id,
                          payAmount: current.payAmount || String(fees.inscription),
                        }));
                      }}
                    />
                    {type.label}
                  </label>
                ))}
              </fieldset>
              <Field id="grade" label="Grado / curso actual">
                <input id="grade" value={form.grade} onChange={(event) => set("grade", event.target.value)} />
              </Field>
              <Field id="city" label="Ciudad de residencia">
                <input id="city" value={form.city} onChange={(event) => set("city", event.target.value)} />
              </Field>
              <Field id="sector" label="Sector de residencia">
                <input id="sector" value={form.sector} onChange={(event) => set("sector", event.target.value)} />
              </Field>
            </div>
            {fees && (
              <div className="en-fees">
                <p>Inscripción {form.schoolType === "fiscal" ? "fiscal" : "particular"}: <strong>${fees.inscription}</strong></p>
                <p>{fees.extraLabel}: <strong>${fees.extra}</strong></p>
              </div>
            )}
            </>
          )}

          {step === 3 && (
            <>
              <fieldset className="en-choice">
                <legend>¿Ha participado anteriormente en concursos de Matemática?</legend>
                <label><input type="radio" name="contests" checked={form.contests === "si"} onChange={() => set("contests", "si")} /> Sí</label>
                <label><input type="radio" name="contests" checked={form.contests === "no"} onChange={() => set("contests", "no")} /> No</label>
              </fieldset>
              <fieldset className="en-choice">
                <legend>¿Ha recibido anteriormente preparación matemática adicional?</legend>
                <label><input type="radio" name="extraPrep" checked={form.extraPrep === "si"} onChange={() => set("extraPrep", "si")} /> Sí</label>
                <label><input type="radio" name="extraPrep" checked={form.extraPrep === "no"} onChange={() => set("extraPrep", "no")} /> No</label>
              </fieldset>
              <fieldset className="en-goals">
                <legend>¿Qué espera que su hijo/a encuentre en FIF?</legend>
                {ACADEMIC_GOALS.map((goal) => (
                  <label key={goal.id}>
                    <input type="checkbox" checked={form.goals.includes(goal.id)} onChange={() => toggleGoal(goal.id)} />
                    {goal.label}
                  </label>
                ))}
                {form.goals.includes("otro") && (
                  <input className="en-other" value={form.otherGoal} onChange={(event) => set("otherGoal", event.target.value)} placeholder="Especifica" />
                )}
              </fieldset>
            </>
          )}

          {step === 4 && (
            <>
              <fieldset className="en-choice">
                <legend>Modalidad</legend>
                <label><input type="radio" name="modality" checked={form.modality === "presencial"} onChange={() => set("modality", "presencial")} /> Presencial</label>
                <label><input type="radio" name="modality" checked={form.modality === "virtual"} onChange={() => set("modality", "virtual")} /> Virtual</label>
              </fieldset>
              <p className="en-note">La asignación del grupo (inicial / nivelación o regular) y del horario corresponde exclusivamente a la Fundación, de acuerdo con el nivel académico del estudiante.</p>
              <h2>Contacto de emergencia</h2>
              <div className="en-grid">
                <Field id="emergencyName" label="Nombre y apellido">
                  <input id="emergencyName" value={form.emergencyName} onChange={(event) => set("emergencyName", event.target.value)} />
                </Field>
                <Field id="emergencyRelation" label="Parentesco">
                  <input id="emergencyRelation" value={form.emergencyRelation} onChange={(event) => set("emergencyRelation", event.target.value)} />
                </Field>
                <Field id="emergencyPhone" label="Número celular">
                  <input id="emergencyPhone" value={form.emergencyPhone} onChange={(event) => set("emergencyPhone", event.target.value)} />
                </Field>
              </div>
              <Field id="emergencyNotes" label="En caso de emergencia, ¿existe alguna información indispensable que FIF deba conocer sobre el estudiante?">
                <textarea id="emergencyNotes" rows={4} value={form.emergencyNotes} onChange={(event) => set("emergencyNotes", event.target.value)} placeholder="Registra únicamente información necesaria para actuar adecuadamente ante una emergencia." />
              </Field>
            </>
          )}

          {step === 5 && (
            <>
              <dl className="en-review">
                <div><dt>Representante</dt><dd>{form.guardianName}</dd></div>
                <div><dt>Documento</dt><dd>{form.guardianId}</dd></div>
                <div><dt>Parentesco</dt><dd>{form.relationship}</dd></div>
                <div><dt>WhatsApp</dt><dd>{form.guardianPhone}</dd></div>
                <div><dt>Correo</dt><dd>{form.guardianEmail}</dd></div>
                <div><dt>Estudiante</dt><dd>{form.studentName}</dd></div>
                <div><dt>Documento del estudiante</dt><dd>{form.studentId}</dd></div>
                <div><dt>Nacimiento</dt><dd>{form.birthDate}</dd></div>
                <div><dt>Institución</dt><dd>{form.school} · {form.schoolType === "fiscal" ? "Fiscal" : "Particular"}</dd></div>
                <div><dt>Grado</dt><dd>{form.grade}</dd></div>
                <div><dt>Residencia</dt><dd>{form.city} · {form.sector}</dd></div>
                <div><dt>Concursos</dt><dd>{form.contests === "si" ? "Sí" : "No"}</dd></div>
                <div><dt>Preparación adicional</dt><dd>{form.extraPrep === "si" ? "Sí" : "No"}</dd></div>
                <div><dt>Expectativas</dt><dd>{goalLabels}</dd></div>
                <div><dt>Modalidad</dt><dd>{form.modality === "virtual" ? "Virtual" : "Presencial"}</dd></div>
                <div><dt>Emergencia</dt><dd>{form.emergencyName} · {form.emergencyRelation} · {form.emergencyPhone}</dd></div>
                {form.emergencyNotes && <div><dt>Nota de emergencia</dt><dd>{form.emergencyNotes}</dd></div>}
              </dl>
              <p className="en-note">
                Los datos registrados serán utilizados por la Fundación Integral de Familias para gestionar la inscripción,
                comunicación y participación del estudiante en sus actividades. La información proporcionada de emergencia
                se utilizará únicamente cuando sea necesario para precautelar el bienestar del estudiante. Cualquier uso
                de información con fines investigativos requerirá la autorización correspondiente.
              </p>
              {fees && (
                <div className="en-fees">
                  <h2>Valores {form.schoolType === "fiscal" ? "fiscal" : "particular"}</h2>
                  <p>Inscripción: <strong>${fees.inscription}</strong></p>
                  <p>{fees.extraLabel}: <strong>${fees.extra}</strong></p>
                </div>
              )}
              <fieldset className="en-goals">
                <legend>Información de becas (opcional)</legend>
                {SCHOLARSHIPS.map((item) => (
                  <label key={item.id}>
                    <input type="checkbox" checked={form.scholarships.includes(item.id)} onChange={() => toggleScholarship(item.id)} />
                    {item.label}
                  </label>
                ))}
              </fieldset>
              <h2>Formulario de pago</h2>
              <p className="en-note">No hay cobro en la web. Completa el formulario y se abre WhatsApp para coordinar el pago de la inscripción con FIF.</p>
              <div className="en-grid">
                <Field id="payName" label="Nombres y apellidos">
                  <input id="payName" value={form.payName} onChange={(event) => set("payName", event.target.value)} />
                </Field>
                <Field id="payPhone" label="Número celular">
                  <input id="payPhone" value={form.payPhone} onChange={(event) => set("payPhone", event.target.value)} />
                </Field>
                <Field id="payEmail" label="Correo electrónico">
                  <input id="payEmail" type="email" value={form.payEmail} onChange={(event) => set("payEmail", event.target.value)} />
                </Field>
                <Field id="payAmount" label="Cantidad a pagar">
                  <input id="payAmount" type="number" min="1" value={form.payAmount} onChange={(event) => set("payAmount", event.target.value)} />
                </Field>
              </div>
              <Field id="payNotes" label="Notas adicionales">
                <textarea id="payNotes" rows={3} value={form.payNotes} onChange={(event) => set("payNotes", event.target.value)} placeholder="ALEKS, mensualidad, hermanos u otra indicación." />
              </Field>
              <label className="en-consent">
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
                Acepto el uso de estos datos para la inscripción y autorizo enviar el formulario de pago por WhatsApp.
              </label>
            </>
          )}

          {error && <p className="en-error" role="alert">{error}</p>}
          <div className="en-actions">
            {step > 1 && (
              <button type="button" className="en-prev" onClick={() => { setError(""); setStep((current) => current - 1); }}>
                Atrás
              </button>
            )}
            <button type="submit" className="en-next">
              {step === 5 ? "Enviar inscripción y pago" : "Continuar"}
            </button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
