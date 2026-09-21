import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RainbowTitle } from "../components/Brand";
import { StepBar } from "../components/AppHeader";
import { AGE_GROUPS, DAILY_GOALS } from "../data/content";
import { useGame } from "../context/GameContext";

function strengthOf(password) {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[&$!?]/.test(password)) score += 2;
  return Math.min(score, 5);
}

export default function Register() {
  const navigate = useNavigate();
  const { register, user } = useGame();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    password: "",
    email: user?.email || "",
    ageGroup: user?.ageGroup || "",
    dailyGoal: user?.dailyGoal || "",
    tutorName: user?.tutorName || "",
    tutorEmail: user?.tutorEmail || "",
    privacy: false,
    parental: false,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const strength = strengthOf(form.password);
  const bar = useMemo(() => {
    if (strength <= 1) return { width: "30%", color: "#b91c1c" };
    if (strength <= 3) return { width: "62%", color: "#b45309" };
    return { width: "100%", color: "#047857" };
  }, [strength]);

  const onChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form.firstName || !form.lastName || !form.password || !form.email || !form.ageGroup || !form.dailyGoal) {
      setError("Completa los campos obligatorios para continuar.");
      return;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!form.privacy) {
      setError("Debes aceptar la política de privacidad y los términos.");
      return;
    }
    if (form.ageGroup === "under12" && (!form.tutorName || !form.tutorEmail || !form.parental)) {
      setError("Si hay menos de 12 años, hace falta el tutor o tutora y su autorización.");
      return;
    }
    setBusy(true);
    try {
      await register({
        ...form,
        role: "student",
        consents: { privacy: true, parental: form.ageGroup === "under12" },
      });
      navigate("/verificar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="onboard">
      <p><Link to="/fif-learning" className="text-link">Volver al portal</Link></p>
      <RainbowTitle
        parts={[
          { text: "Iniciemos", color: "#047857" },
          { text: "tu", color: "#0f766e" },
          { text: "aprendizaje,", color: "#1d4ed8" },
          { text: "queremos", color: "#6d28d9" },
          { text: "saber", color: "#9d174d" },
          { text: "de", color: "#be123c" },
          { text: "ti.", color: "#b91c1c" },
        ]}
      />
      <StepBar value={22} />
      <form className="onboard-grid" onSubmit={onSubmit}>
        <div className="form-stack">
          <label htmlFor="firstName">Nombre</label>
          <input id="firstName" className="pill-input" name="firstName" autoComplete="given-name" value={form.firstName} onChange={onChange} />
          <label htmlFor="lastName">Apellidos</label>
          <input id="lastName" className="pill-input" name="lastName" autoComplete="family-name" value={form.lastName} onChange={onChange} />
          <div className="password-wrap">
            <label htmlFor="password">Contraseña</label>
            <input id="password" className="pill-input" name="password" type="password" autoComplete="new-password" value={form.password} onChange={onChange} />
            {form.password && (
              <div className="strength" aria-hidden="true">
                <span style={{ width: bar.width, background: bar.color }} />
              </div>
            )}
          </div>
          <label htmlFor="email">Correo de contacto</label>
          <input id="email" className="pill-input" name="email" type="email" autoComplete="email" value={form.email} onChange={onChange} />
          <div className="form-row">
            <div>
              <label htmlFor="ageGroup">Edad</label>
              <select id="ageGroup" className="pill-select" name="ageGroup" value={form.ageGroup} onChange={onChange}>
                <option value="">Elige el grupo</option>
                {AGE_GROUPS.map((group) => (
                  <option key={group.id} value={group.id}>{group.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="dailyGoal">Meta diaria</label>
              <select id="dailyGoal" className="pill-select" name="dailyGoal" value={form.dailyGoal} onChange={onChange}>
                <option value="">Elige un tiempo</option>
                {DAILY_GOALS.map((goal) => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
            </div>
          </div>
          {form.ageGroup === "under12" && (
            <>
              <label htmlFor="tutorName">Nombre de madre, padre o tutor</label>
              <input id="tutorName" className="pill-input" name="tutorName" value={form.tutorName} onChange={onChange} />
              <label htmlFor="tutorEmail">Correo de madre, padre o tutor</label>
              <input id="tutorEmail" className="pill-input" name="tutorEmail" type="email" value={form.tutorEmail} onChange={onChange} />
              <label className="check-line">
                <input type="checkbox" name="parental" checked={form.parental} onChange={onChange} />
                <span>Soy madre, padre o tutor y autorizo esta cuenta de una persona menor de 12 años.</span>
              </label>
            </>
          )}
          <label className="check-line">
            <input type="checkbox" name="privacy" checked={form.privacy} onChange={onChange} />
            <span>
              Acepto la <Link to="/legal/privacidad">política de privacidad</Link>, los{" "}
              <Link to="/legal/terminos">términos</Link> y el tratamiento de los datos estrictamente necesarios.
            </span>
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn-green btn-wide" type="submit" disabled={busy}>
            {busy ? "Guardando…" : "Continuar a verificar datos"}
          </button>
        </div>
        <img src="/images/detective-glass.jpg" alt="Ilustración de un detective con lupa" className="detect-img" />
      </form>
      <div className="tip-bar">
        Consejo: usa al menos 8 caracteres, incluye un símbolo como & $ ! o ?, y no compartas la contraseña.
      </div>
    </div>
  );
}
