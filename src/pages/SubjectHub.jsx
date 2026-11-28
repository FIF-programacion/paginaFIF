import { useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { CourseCover } from "../components/CourseCover";
import { getCourse } from "../data/courses";
import { ACTIVITY_TYPES, getSubject, subjectsForAge } from "../data/teacher";
import { useGame } from "../context/GameContext";
import { isStudentActivity } from "../utils/activities";
import { formatLongDateEs } from "../utils/dates";
import TakeTest from "./TakeTest";
import StudentActivities from "./StudentActivities";
import StudentGrades from "./StudentGrades";
import Progress from "./Progress";
import MiniGames from "./MiniGames";

const SECTIONS = ["inicio", "actividades", "progreso", "contenido", "minijuegos", "silabo", "evaluacion", "calificaciones"];

export default function SubjectHub() {
  const { subjectId, section = "inicio" } = useParams();
  const navigate = useNavigate();
  const { user, activities, activityDone, tests, courseStats, syllabusItems } = useGame();
  const catalog = subjectsForAge(user?.ageGroup);
  const subject = catalog.find((item) => item.id === subjectId) || getSubject(subjectId);
  const current = SECTIONS.includes(section) ? section : "inicio";

  const games = useMemo(
    () => (subject?.courses || []).map((id) => getCourse(id, user?.ageGroup)).filter(Boolean),
    [subject, user?.ageGroup],
  );
  const syllabus = syllabusItems.filter((item) => item.teamId === subjectId).slice().reverse();

  const classroom = useMemo(() => {
    const courseIds = new Set(subject?.courses || []);
    const work = activities.filter((item) => (
      isStudentActivity(item) && (item.subjectId === subjectId || courseIds.has(item.courseId))
    )).slice().reverse();
    const exams = tests.filter((item) => item.subjectId === subjectId || courseIds.has(item.courseId)).slice().reverse();
    return { work, exams };
  }, [activities, tests, subject, subjectId]);

  const pending = classroom.work.filter((item) => (
    !activityDone.some((row) => row.activityId === item.id && row.studentEmail === user?.email)
  ));

  if (!subject || !catalog.some((item) => item.id === subject.id)) {
    return <Navigate to="/app/cursos" replace />;
  }
  if (section && !SECTIONS.includes(section)) {
    return <Navigate to={`/app/materia/${subjectId}`} replace />;
  }

  return (
    <div className="course-workspace">
      <div className="course-banner">
        <h2>{subject.label.toUpperCase()}</h2>
        <div className="course-dots" aria-hidden="true">
          <span className="is-green" />
          <span className="is-yellow" />
          <span className="is-red" />
        </div>
      </div>

      {current === "inicio" && (
        <div className="dash-grid course-home">
          <section className="panel resumen-panel">
            <h3>Resumen:</h3>
            <div className="resumen-list">
              <button type="button" onClick={() => navigate(`/app/materia/${subjectId}/contenido`)}>Refuerzos interactivos</button>
              <button type="button" onClick={() => navigate(`/app/materia/${subjectId}/minijuegos`)}>Minijuegos</button>
              <button type="button" onClick={() => navigate(`/app/materia/${subjectId}/silabo`)}>Sílabo del curso</button>
              <button type="button" onClick={() => navigate(`/app/materia/${subjectId}/actividades`)}>Actividades</button>
              <button type="button" onClick={() => navigate(`/app/materia/${subjectId}/progreso`)}>Progreso</button>
            </div>
          </section>
          <section className="panel pending-panel">
            <h3>Actividades pendientes</h3>
            <p className="pending-date">{formatLongDateEs()}</p>
            {pending.length === 0 && <p>No hay trabajos pendientes en esta materia.</p>}
            <div className="next-list">
              {pending.map((item) => (
                <button
                  key={item.id}
                  className="next-item pending-activity"
                  type="button"
                  onClick={() => navigate(`/app/materia/${subjectId}/actividades`)}
                >
                  <div>
                    <strong>{item.title}</strong>
                    <p>
                      {ACTIVITY_TYPES.find((type) => type.id === item.type)?.label || "Trabajo"}
                      {item.dueDate ? ` · ${item.dueDate}` : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {current === "actividades" && <StudentActivities subjectId={subjectId} />}
      {current === "progreso" && <Progress subjectId={subjectId} />}
      {current === "calificaciones" && <StudentGrades subjectId={subjectId} />}
      {current === "evaluacion" && <TakeTest />}

      {current === "minijuegos" && <MiniGames subjectId={subjectId} />}

      {current === "contenido" && (
        <section className="panel">
          <h3>Refuerzos interactivos</h3>
          <p>Ejercicios guiados de esta materia. Los minijuegos HTML están en la sección Minijuegos.</p>
          <div className="course-squares contenido-squares">
            {games.map((course) => {
              const stats = courseStats(course.id);
              const percent = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
              const locked = !stats.unlocked && !course.unlockedByDefault;
              return (
                <button
                  key={course.id}
                  className={`cover-card is-square contenido-tile${locked ? " locked" : ""}`}
                  type="button"
                  disabled={locked}
                  onClick={() => {
                    if (!locked) navigate(`/app/curso/${course.id}`);
                  }}
                >
                  <CourseCover type={course.cover} title={course.dashboardTitle} progress={percent} />
                  <span className="sr-only">{course.title}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {current === "silabo" && (
        <section className="panel">
          <h3>Sílabo</h3>
          {syllabus.length === 0 && <p>El equipo docente aún no publicó unidades de sílabo en este dispositivo.</p>}
          {syllabus.map((item) => (
            <article key={item.id} className="cred-card" style={{ marginBottom: 12 }}>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
