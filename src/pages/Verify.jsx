import { Link, Navigate, useNavigate } from "react-router-dom";
import { RainbowTitle } from "../components/Brand";
import { StepBar } from "../components/AppHeader";
import { ageLabel, needsGuardianConsent } from "../data/org";
import { useGame } from "../context/GameContext";

export default function Verify() {
  const { user } = useGame();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="onboard">
      <p><Link to="/fif-learning" className="text-link">Volver al portal</Link></p>
      <RainbowTitle
        parts={[
          { text: "verifica", color: "#047857" },
          { text: "tu", color: "#0f766e" },
          { text: "informacion", color: "#b91c1c" },
        ]}
      />
      <StepBar value={48} />
      <div className="onboard-grid">
        <div className="form-stack">
          <p className="pill-input">{user.firstName} {user.lastName}</p>
          <p className="pill-input">Correo: {user.email}</p>
          <div className="form-row">
            <p className="pill-input" style={{ textAlign: "center" }}>{ageLabel(user.ageGroup)}</p>
            <p className="pill-input" style={{ textAlign: "center" }}>{user.dailyGoal}</p>
          </div>
          {needsGuardianConsent(user.ageGroup) && (
            <p className="pill-input">Tutor: {user.tutorName} ({user.tutorEmail})</p>
          )}
          <div className="actions-row">
            <button className="btn btn-blue" type="button" onClick={() => navigate("/login")}>Volver al inicio de sesión</button>
            <button className="btn btn-green" type="button" onClick={() => navigate("/tutorial/1")}>Continuar al tutorial</button>
          </div>
        </div>
        <img src="/images/detective-clipboard.jpg" alt="Ilustración de un detective revisando una tabla" className="detect-img" />
      </div>
    </div>
  );
}
