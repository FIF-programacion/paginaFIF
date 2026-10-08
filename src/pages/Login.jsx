import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RainbowTitle } from "../components/Brand";
import { useGame } from "../context/GameContext";
import { homePath } from "../utils/roles";

export default function Login() {
  const { login } = useGame();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    const result = await login(email, password);
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate(homePath(result.account));
  };

  return (
    <div className="onboard">
      <p><Link to="/fif-learning" className="text-link">Volver al portal</Link></p>
      <RainbowTitle
        parts={[
          { text: "Hola de nuevo,", color: "#047857" },
          { text: "vamos", color: "#1d4ed8" },
          { text: "a aprender.", color: "#b91c1c" },
        ]}
      />
      <form className="onboard-grid" onSubmit={onSubmit}>
        <div className="form-stack login-card">
          <label htmlFor="email">Correo</label>
          <input id="email" className="pill-input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">Contraseña</label>
          <input id="password" className="pill-input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn-green" type="submit" disabled={busy}>{busy ? "Entrando…" : "Iniciar sesión"}</button>
          <p>El acceso lo crea coordinación FIF. Si aún no lo tienes, completa la <Link to="/inscripciones">inscripción</Link>.</p>
          <p>¿Eres del equipo? <Link to="/profesores">Entrar como equipo</Link></p>
        </div>
        <img src="/images/detective-glass.jpg" alt="Ilustración de un detective con lupa" className="detect-img" />
      </form>
    </div>
  );
}
