import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { RainbowTitle } from "../components/Brand";
import { StepBar } from "../components/AppHeader";
import { TUTORIAL_SLIDES } from "../data/content";
import { ageLabel } from "../data/org";
import { useGame } from "../context/GameContext";

export default function Tutorial() {
  const { user } = useGame();
  const navigate = useNavigate();
  const { step } = useParams();
  const index = Math.min(Math.max(Number(step || 1) - 1, 0), TUTORIAL_SLIDES.length - 1);
  const slide = TUTORIAL_SLIDES[index];
  const percents = [70, 82, 92];

  if (!user) return <Navigate to="/registro" replace />;

  const next = () => {
    if (index >= TUTORIAL_SLIDES.length - 1) navigate("/bienvenida");
    else navigate(`/tutorial/${index + 2}`);
  };

  return (
    <div className="onboard">
      <p><Link to="/fif-learning" className="text-link">Volver al portal</Link></p>
      <RainbowTitle
        parts={[
          { text: "Tu ruta está en", color: "#047857" },
          { text: ageLabel(user.ageGroup), color: "#1d4ed8" },
          { text: "Buen inicio.", color: "#b91c1c" },
        ]}
      />
      <StepBar value={percents[index]} />
      <p className="lesson-prompt">Cómo movernos en FIF Learning y en tus cursos.</p>
      <div className="slide-card">
        <div>
          <h2>{slide.title}</h2>
          <p><strong>{slide.heading}.</strong> {slide.text}</p>
        </div>
      </div>
      <div className="center-btn">
        <button className="btn btn-green btn-wide" type="button" onClick={next}>
          {index >= TUTORIAL_SLIDES.length - 1 ? "Ir a la bienvenida" : "Siguiente diapositiva"}
        </button>
      </div>
    </div>
  );
}
