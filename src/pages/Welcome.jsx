import { Link, Navigate, useNavigate } from "react-router-dom";
import { RainbowTitle } from "../components/Brand";
import { StepBar } from "../components/AppHeader";
import { useGame } from "../context/GameContext";

export default function Welcome() {
  const { user, markTutorialSeen } = useGame();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="welcome-page">
      <p><Link to="/fif-learning" className="text-link">Volver al portal</Link></p>
      <RainbowTitle
        parts={[
          { text: "ESO ES TODO,", color: "#047857" },
          { text: "TE DAMOS", color: "#1d4ed8" },
          { text: "LA BIENVENIDA", color: "#6d28d9" },
          { text: `${user.firstName.toUpperCase()},`, color: "#b91c1c" },
        ]}
      />
      <RainbowTitle
        as="h2"
        parts={[
          { text: "DISFRUTA DE TU APRENDIZAJE EN", color: "#047857" },
          { text: "FIF LEARNING", color: "#b91c1c" },
        ]}
      />
      <StepBar value={100} />
      <blockquote className="quote">
        “Practicar un poco cada día construye el hábito de aprender. El equipo FIF te acompaña en el camino.”
      </blockquote>
      <div className="center-btn">
        <button
          className="btn btn-green"
          type="button"
          onClick={() => {
            markTutorialSeen();
            navigate("/app/cursos");
          }}
        >
          Ir a mis cursos
        </button>
      </div>
    </div>
  );
}
