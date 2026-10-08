import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { homePath, isStaff } from "../utils/roles";
import "./Admin.css";

export default function TeacherLogin() {
  const { login, logout } = useGame();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const result = await login(email, password);
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    if (result.account.role === "student") {
      logout();
      setError("Esta cuenta es de estudiante. Usa Iniciar sesión del portal.");
      return;
    }
    if (result.account.role === "admin") {
      logout();
      setError("La coordinación entra por el acceso interno.");
      return;
    }
    if (!isStaff(result.account)) {
      logout();
      setError("Este acceso es solo para el equipo FIF.");
      return;
    }
    navigate(homePath(result.account));
  };

  return (
    <div className="ad-login">
      <form className="ad-login-card" onSubmit={onSubmit}>
        <p className="ad-kicker">Fundación Integral de Familias</p>
        <h1>Equipo FIF</h1>
        <p className="ad-lead">El acceso lo entrega coordinación. No hay alta libre de docentes ni voluntarios.</p>
        <label>
          Correo
          <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Contraseña
          <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p className="ad-error" role="alert">{error}</p>}
        <button type="submit" disabled={busy}>{busy ? "Entrando…" : "Entrar"}</button>
        <Link to="/fif-learning">Volver al portal</Link>
      </form>
    </div>
  );
}
