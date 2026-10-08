import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import "./Admin.css";

export default function AdminLogin() {
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
    if (result.account.role !== "admin") {
      logout();
      setError("Este acceso es solo para coordinación FIF.");
      return;
    }
    navigate("/admin/panel");
  };

  return (
    <div className="ad-login">
      <form className="ad-login-card" onSubmit={onSubmit}>
        <p className="ad-kicker">Fundación Integral de Familias</p>
        <h1>Coordinación</h1>
        <p className="ad-lead">Acceso reservado al equipo administrador.</p>
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
        <Link to="/">Volver al sitio</Link>
      </form>
    </div>
  );
}
