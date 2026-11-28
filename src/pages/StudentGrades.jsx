import { subjectOfCourse } from "../data/teacher";
import { useGame } from "../context/GameContext";

export default function StudentGrades({ subjectId }) {
  const { user, attempts, submissions, activities } = useGame();

  const inSubject = (courseId, extraSubjectId) => {
    if (!subjectId) return true;
    if (extraSubjectId === subjectId) return true;
    return subjectOfCourse(courseId)?.id === subjectId;
  };

  const tests = attempts
    .filter((item) => item.studentEmail === user?.email && inSubject(item.courseId, item.subjectId))
    .slice()
    .reverse();

  const work = submissions
    .filter((item) => item.studentEmail === user?.email)
    .filter((item) => {
      const activity = activities.find((row) => row.id === item.activityId);
      return inSubject(activity?.courseId, activity?.subjectId);
    })
    .slice()
    .reverse();

  return (
    <section className="panel">
      <h2>Calificaciones</h2>
      <p>Notas de pruebas con código y de las tareas que ya calificó tu profesor.</p>
      <h3>Pruebas</h3>
      {tests.length === 0 && <p>Aún no hay pruebas calificadas.</p>}
      <ul className="activity-list">
        {tests.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong>
            <p>{item.score}/{item.total} puntos · {item.percent}%</p>
          </li>
        ))}
      </ul>
      <h3>Tareas</h3>
      {work.length === 0 && <p>Aún no hay tareas calificadas.</p>}
      <ul className="activity-list">
        {work.map((item) => (
          <li key={item.id}>
            <strong>{item.activityTitle}</strong>
            <p>
              {item.grade != null ? `${item.grade}/10` : "Sin nota todavía"}
              {item.teacherComment ? ` · ${item.teacherComment}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
