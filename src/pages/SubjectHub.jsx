import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { CourseCover } from "../components/CourseCover";
import { getCourse } from "../data/courses";
import { ACTIVITY_TYPES, getSubject, subjectsForAge } from "../data/teacher";
import { useGame } from "../context/GameContext";
import TakeTest from "./TakeTest";

const TABS = [
  { id: "aula", label: "Aula" },
  { id: "juegos", label: "Minijuegos" },
  { id: "prueba", label: "Código de prueba" },
];

export default function SubjectHub() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user, activities, activityDone, tests, courseStats } = useGame();
  const catalog = subjectsForAge(user?.ageGroup);
  const subject = catalog.find((item) => item.id === subjectId) || getSubject(subjectId);
  const [tab, setTab] = useState("aula");

  const games = useMemo(
    () => (subject?.courses || []).map((id) => getCourse(id, user?.ageGroup)).filter(Boolean),
    [subject, user?.ageGroup],
  );

  const classroom = useMemo(() => {
    const courseIds = new Set(subject?.courses || []);
    const work = activities.filter((item) => courseIds.has(item.courseId)).slice().reverse();
    const exams = tests.filter((item) => courseIds.has(item.courseId)).slice().reverse();
    return { work, exams };
  }, [activities, tests, subject]);

  if (!subject || !catalog.some((item) => item.id === subject.id)) {
    return <Navigate to="/app/cursos" replace />;
  }

  return (
    <div>
      <h2 className="course-title">{subject.label}</h2>
      <p className="pending-copy">Trabajos del profesor, pruebas con código y los minijuegos de refuerzo de esta materia.</p>
      <div className="subject-tabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            className={tab === item.id ? "is-on" : ""}
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "aula" && (
        <section className="panel">
          <h3>Trabajos, deberes y pruebas</h3>
          {classroom.work.length === 0 && classroom.exams.length === 0 && (
            <p>Todavía no hay material publicado en esta materia.</p>
          )}
          <div className="next-list">
            {classroom.work.map((item) => {
              const finished = activityDone.some((row) => row.activityId === item.id && row.studentEmail === user?.email);
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
                      {ACTIVITY_TYPES.find((type) => type.id === item.type)?.label || "Trabajo"}
                      {item.dueDate ? ` · Entrega ${item.dueDate}` : ""}
                      {finished ? " · Entregado" : ""}
                    </p>
                  </div>
                </button>
              );
            })}
            {classroom.exams.map((item) => (
              <button
                key={item.id || item.code}
                className="next-item"
                type="button"
                onClick={() => setTab("prueba")}
              >
                <div>
                  <strong>{item.title}</strong>
                  <p>Prueba con código {item.code}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {tab === "juegos" && (
        <section className="panel">
          <h3>Minijuegos de refuerzo</h3>
          <div className="progress-grid">
            {games.map((course) => {
              const stats = courseStats(course.id);
              const percent = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
              const locked = !stats.unlocked && !course.unlockedByDefault;
              return (
                <button
                  key={course.id}
                  className={`cover-card${locked ? " locked" : ""}`}
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

      {tab === "prueba" && (
        <div>
          <p><Link to="/app/prueba" className="text-link">Abrir también desde la pestaña de código</Link></p>
          <TakeTest />
        </div>
      )}
    </div>
  );
}
