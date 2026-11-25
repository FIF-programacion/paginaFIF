import { Link, Navigate, useParams } from "react-router-dom";
import { getHtmlGame } from "../data/games";

export default function HtmlGame() {
  const { subjectId, gameId } = useParams();
  const game = getHtmlGame(gameId);

  if (!game) {
    return <Navigate to={subjectId ? `/app/materia/${subjectId}/minijuegos` : "/app/minijuegos"} replace />;
  }
  if (subjectId && game.subjectId !== subjectId) {
    return <Navigate to={`/app/materia/${subjectId}/minijuegos`} replace />;
  }

  const back = subjectId ? `/app/materia/${subjectId}/minijuegos` : "/app/minijuegos";

  return (
    <section className="panel html-game-panel">
      <div className="html-game-bar">
        <Link className="text-link" to={back}>← Minijuegos</Link>
        <h2>{game.title}</h2>
      </div>
      <iframe
        className="html-game-frame"
        title={game.title}
        src={game.src}
        allow="camera; microphone; fullscreen; clipboard-read; clipboard-write"
      />
    </section>
  );
}
