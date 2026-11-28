import { useNavigate } from "react-router-dom";
import { HTML_GAMES, gamesForSubject } from "../data/games";
import { getSubject } from "../data/teacher";

export default function MiniGames({ subjectId } = {}) {
  const navigate = useNavigate();
  const games = subjectId ? gamesForSubject(subjectId) : HTML_GAMES;
  const subject = subjectId ? getSubject(subjectId) : null;

  const play = (game) => {
    if (subjectId) navigate(`/app/materia/${subjectId}/juego/${game.id}`);
    else navigate(`/app/minijuegos/${game.id}`);
  };

  return (
    <section className="panel">
      <h2>Minijuegos</h2>
      <p>
        {subject
          ? `Juegos HTML de ${subject.label}.`
          : "Juegos HTML para practicar. Los refuerzos interactivos siguen dentro de cada curso."}
      </p>
      {games.length === 0 && <p>Aún no hay minijuegos HTML para esta materia.</p>}
      <div className="minigame-grid">
        {games.map((game) => (
          <button
            key={game.id}
            className={`html-game-card${game.featured ? " is-featured" : ""}`}
            type="button"
            onClick={() => play(game)}
          >
            <span className="mg-icon" aria-hidden="true">{game.icon}</span>
            <strong>{game.title}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
