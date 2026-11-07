import { useNavigate } from "react-router-dom";
import { CourseCover } from "../components/CourseCover";
import { COURSES, courseAgeKey, getCourse } from "../data/courses";
import { ACTIVITY_TYPES, subjectsForAge } from "../data/teacher";
import { useGame } from "../context/GameContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { courseStats, user, activities, activityDone } = useGame();
  const subjects = subjectsForAge(user?.ageGroup);

  const pendingTeacher = activities
    .filter((item) => {
      const course = COURSES.find((entry) => entry.id === item.courseId);
      const matchesGroup = !course || course.ageGroups.includes(courseAgeKey(user?.ageGroup));
      const finished = activityDone.some((row) => row.activityId === item.id && row.studentEmail === user?.email);
      return matchesGroup && !finished;
    })
    .slice()
    .reverse();

  return (
    <div>
      <div className="greeting">
        ¿Qué hay de nuevo, {user?.firstName}?
        <img src="/images/kid-pointing.jpg" alt="" className="bunny" />
      </div>
      <div className="dash-grid">
        <section className="panel">
          <h2>Tus cursos</h2>
          <div className="progress-grid">
            {subjects.map((subject) => {
              const games = subject.courses.map((id) => getCourse(id, user?.ageGroup)).filter(Boolean);
              const totals = games.reduce(
                (acc, course) => {
                  const stats = courseStats(course.id);
                  acc.completed += stats.completed;
                  acc.total += stats.total;
                  return acc;
                },
                { completed: 0, total: 0 },
              );
              const percent = totals.total ? Math.round((totals.completed / totals.total) * 100) : 0;
              return (
                <button
                  key={subject.id}
                  className="cover-card"
                  type="button"
                  onClick={() => navigate(`/app/materia/${subject.id}`)}
                >
                  <CourseCover type={subject.cover} title={subject.label.toUpperCase()} progress={percent} />
                  <span className="sr-only">Abrir {subject.label}</span>
                </button>
              );
            })}
          </div>
        </section>
        <section className="panel">
          <h2>Actividades pendientes</h2>
          <p className="pending-copy">
            {pendingTeacher.length
              ? "Completa los trabajos que publicó tu profesor."
              : "No hay actividades pendientes. Entra a un curso para ver minijuegos y pruebas."}
          </p>
          <div className="next-list">
            {pendingTeacher.map((item) => {
              const course = COURSES.find((entry) => entry.id === item.courseId);
              return (
                <button
                  key={item.id}
                  className="next-item pending-activity"
                  type="button"
                  onClick={() => navigate("/app/actividades")}
                >
                  <div>
                    <strong>{item.title}</strong>
                    <p>
                      {ACTIVITY_TYPES.find((type) => type.id === item.type)?.label}
                      {course ? ` · ${course.title}` : ""}
                      {item.dueDate ? ` · Entrega ${item.dueDate}` : ""}
                    </p>
                  </div>
                </button>
              );
            })}
            {!pendingTeacher.length && (
              <button className="btn btn-green" type="button" onClick={() => navigate("/app/cursos")}>
                Ver cursos
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
