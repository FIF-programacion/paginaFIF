import { useNavigate } from "react-router-dom";
import { CourseCover } from "../components/CourseCover";
import { COURSES, courseAgeKey, getCourse } from "../data/courses";
import { ACTIVITY_TYPES } from "../data/teacher";
import { useGame } from "../context/GameContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { courseStats, isLessonOpen, isLessonDone, visibleCourses, user, activities, activityDone } = useGame();
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

  const pendingTeacher = activities
    .filter((item) => {
      const course = COURSES.find((entry) => entry.id === item.courseId);
      const matchesGroup = !course || course.ageGroups.includes(courseAgeKey(user?.ageGroup));
      const finished = activityDone.some((row) => row.activityId === item.id && row.studentEmail === user?.email);
      return matchesGroup && !finished;
    })
    .slice()
    .reverse();

  const hasTeacherPending = pendingTeacher.length > 0;
  const hasCoursePending = nextSteps.length > 0;
  const pendingCopy = hasTeacherPending
    ? "Completa tus cursos de hoy y las actividades de profesor."
    : hasCoursePending
      ? "No hay actividades pendientes, pero aún puedes completar tus cursos del día."
      : "No hay actividades pendientes. ¿Te animas a completar otro curso y seguir sumando puntos?";

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
          <h2>Actividades pendientes</h2>
          <p className="pending-copy">{pendingCopy}</p>
          <div className="next-list">
            {hasTeacherPending && (
              <>
                <p className="pending-label">Actividades de profesor</p>
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
              </>
            )}
            {hasCoursePending && (
              <>
                <p className="pending-label">Cursos de hoy</p>
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
              </>
            )}
            {!hasTeacherPending && !hasCoursePending && (
              <button className="btn btn-green" type="button" onClick={() => navigate("/app/cursos")}>
                Explorar otro curso
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
