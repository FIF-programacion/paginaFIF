import { useNavigate } from "react-router-dom";
import { CourseCover } from "../components/CourseCover";
import { getCourse } from "../data/courses";
import { useGame } from "../context/GameContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { courseStats, isLessonOpen, isLessonDone, visibleCourses, user } = useGame();
  const catalog = visibleCourses.map((course) => getCourse(course.id, user?.ageGroup)).filter(Boolean);
  const inProgress = catalog.filter((course) => course.unlockedByDefault || courseStats(course.id).unlocked);

  const nextSteps = catalog.flatMap((course) => {
    const stats = courseStats(course.id);
    if (!stats.unlocked || stats.done) return [];
    const lesson = course.lessons.find(
      (item) => isLessonOpen(course.id, item.number) && !isLessonDone(course.id, item.id),
    );
    if (!lesson) return [];
    return [{ course, lesson, text: course.description }];
  });

  return (
    <div>
      <div className="greeting">
        ¿Qué hay de nuevo, {user?.firstName}?
        <img src="/images/kid-pointing.jpg" alt="" className="bunny" />
      </div>
      <div className="dash-grid">
        <section className="panel">
          <h2>Cursos en progreso</h2>
          <div className="progress-grid">
            {inProgress.slice(0, 4).map((course) => {
              const stats = courseStats(course.id);
              const percent = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
              return (
                <button
                  key={course.id}
                  className="cover-card"
                  type="button"
                  onClick={() => navigate(`/app/curso/${course.id}`)}
                >
                  <CourseCover type={course.cover} title={course.dashboardTitle} progress={percent} />
                  <span className="sr-only">Abrir {course.title}</span>
                </button>
              );
            })}
          </div>
        </section>
        <section className="panel">
          <h2>¿Cuál es el siguiente paso?</h2>
          <div className="next-list">
            {nextSteps.map((item) => (
              <button
                key={`${item.course.id}-${item.lesson.id}`}
                className="next-item"
                type="button"
                onClick={() => navigate(`/app/curso/${item.course.id}/leccion/${item.lesson.id}`)}
              >
                <CourseCover type={item.course.cover} title={item.course.dashboardTitle} compact />
                <div>
                  <strong>{item.course.title}</strong>
                  <p>{item.text}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
