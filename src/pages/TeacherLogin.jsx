import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrandLockup, RainbowTitle } from "../components/Brand";
import { useGame } from "../context/GameContext";
import { DEFAULT_ADMIN, DEFAULT_TEMP_PASSWORD, DEFAULT_TEMP_VOLUNTEERS } from "../data/staff";
import { homePath } from "../utils/roles";

export default function TeacherLogin() {
  const { login, register } = useGame();
  const navigate = useNavigate();
  const [mode, setMode] = useState("entrar");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    privacy: false,
    staff: false,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "entrar") {
        const result = await login(form.email, form.password);
        if (!result.ok) {
          setError(result.message);
          return;
        }
        if (result.account.role === "student") {
          setError("Esta cuenta es de estudiante. Usa Iniciar sesión del inicio.");
          return;
        }
        navigate(homePath(result.account));
        return;
      }
      if (!form.firstName || !form.lastName || !form.email || !form.password) {
        setError("Completa los campos obligatorios.");
        return;
      }
      if (!form.privacy || !form.staff) {
        setError("Confirma que eres docente de la fundación y acepta privacidad y términos.");
        return;
      }
      const account = await register({ ...form, role: "teacher", staffKind: "teacher", consents: { privacy: true, staff: true } });
      navigate(homePath(account));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="onboard">
      <header className="landing-header" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <BrandLockup to="/fif-learning" />
        <Link to="/fif-learning" className="btn btn-blue login-chip">Volver al portal</Link>
      </header>
      <RainbowTitle
        parts={[
          { text: "Docentes", color: "#047857" },
          { text: "y", color: "#1d4ed8" },
          { text: "coordinación", color: "#9d174d" },
        ]}
      />
      <form className="onboard-grid" onSubmit={onSubmit}>
        <div className="form-stack">
          <div className="form-row">
            <button type="button" className={`btn ${mode === "entrar" ? "btn-blue" : "btn-green"}`} onClick={() => setMode("entrar")}>
              Entrar
            </button>
            <button type="button" className={`btn ${mode === "crear" ? "btn-blue" : "btn-green"}`} onClick={() => setMode("crear")}>
              Crear acceso docente
            </button>
          </div>
          {mode === "crear" && (
            <>
              <label htmlFor="firstName">Nombre</label>
              <input id="firstName" className="pill-input" name="firstName" value={form.firstName} onChange={onChange} />
              <label htmlFor="lastName">Apellidos</label>
              <input id="lastName" className="pill-input" name="lastName" value={form.lastName} onChange={onChange} />
            </>
          )}
          <label htmlFor="email">Correo</label>
          <input id="email" className="pill-input" name="email" type="email" autoComplete="username" value={form.email} onChange={onChange} />
          <label htmlFor="password">Contraseña</label>
          <input id="password" className="pill-input" name="password" type="password" autoComplete={mode === "entrar" ? "current-password" : "new-password"} value={form.password} onChange={onChange} />
          {mode === "crear" && (
            <>
              <label className="check-line">
                <input type="checkbox" name="staff" checked={form.staff} onChange={onChange} />
                <span>Confirmo que soy docente o personal autorizado de la Fundación Integral de Familias.</span>
              </label>
              <label className="check-line">
                <input type="checkbox" name="privacy" checked={form.privacy} onChange={onChange} />
                <span>
                  Acepto la <Link to="/legal/privacidad">política de privacidad</Link> y los <Link to="/legal/terminos">términos</Link>.
                </span>
              </label>
            </>
          )}
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn-green" type="submit" disabled={busy}>
            {busy ? "Un momento…" : mode === "entrar" ? "Entrar" : "Crear acceso docente"}
          </button>
          <p className="login-hint">
            Coordinación FIF: {DEFAULT_ADMIN.email} / {DEFAULT_ADMIN.password}.
            Voluntarios temporales: {DEFAULT_TEMP_VOLUNTEERS.map((item) => item.email).join(", ")} / {DEFAULT_TEMP_PASSWORD}.
          </p>
        </div>
        <img src="/images/detective-clipboard.jpg" alt="Ilustración de un detective revisando una lista" className="detect-img" />
      </form>
    </div>
  );
}
