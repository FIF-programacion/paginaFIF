import { useNavigate } from "react-router-dom";
import { CourseCover } from "../components/CourseCover";
import { getCourse } from "../data/courses";
import { subjectsForAge } from "../data/teacher";
import { useGame } from "../context/GameContext";

export default function Resources() {
  const { courseStats, user } = useGame();
  const navigate = useNavigate();
  const subjects = subjectsForAge(user?.ageGroup);

  return (
    <section className="panel">
      <h2 style={{ textAlign: "left" }}>Cursos de tu grupo</h2>
      <p className="pending-copy">Programación, matemática, música y arte (si corresponde a tu nivel). Dentro de cada uno están los trabajos del profesor y los minijuegos.</p>
      <div className="resources-grid">
        {subjects.map((subject) => {
          const games = subject.courses.map((id) => getCourse(id, user?.ageGroup)).filter(Boolean);
          const unlocked = games.some((course) => course.unlockedByDefault || courseStats(course.id).unlocked);
          return (
            <button
              key={subject.id}
              className={`resource-card ${unlocked ? "" : "locked"}`}
              type="button"
              onClick={() => navigate(`/app/materia/${subject.id}`)}
            >
              <div className={unlocked ? "" : "lock-wrap"}>
                <CourseCover type={subject.cover} title={subject.label.toUpperCase()} />
              </div>
              <h3>{subject.label}</h3>
              <p>{games.length} minijuegos de refuerzo, más trabajos y pruebas del profesor.</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
