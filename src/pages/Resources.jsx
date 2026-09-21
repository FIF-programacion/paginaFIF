import { useNavigate } from "react-router-dom";
import { CourseCover } from "../components/CourseCover";
import { getCourse } from "../data/courses";
import { useGame } from "../context/GameContext";

export default function Resources() {
  const { courseStats, visibleCourses, user } = useGame();
  const navigate = useNavigate();

  return (
    <section className="panel">
      <h2 style={{ textAlign: "left" }}>Cursos disponibles para tu edad</h2>
      <div className="resources-grid">
        {visibleCourses.map((item) => {
          const course = getCourse(item.id, user?.ageGroup);
          const stats = courseStats(item.id);
          const locked = !stats.unlocked;
          return (
            <button
              key={item.id}
              className={`resource-card ${locked ? "locked" : ""}`}
              type="button"
              disabled={locked}
              onClick={() => {
                if (!locked) navigate(`/app/curso/${item.id}`);
              }}
            >
              <div className={locked ? "lock-wrap" : ""}>
                <CourseCover type={course.cover} title={course.dashboardTitle} />
                {locked && <img src="/images/padlock.png" alt="" className="lock" />}
              </div>
              <h3>{course.title}</h3>
              <p>{locked ? "Bloqueado hasta completar el curso anterior." : course.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
