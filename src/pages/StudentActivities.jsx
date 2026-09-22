import { COURSES } from "../data/courses";
import { ACTIVITY_TYPES } from "../data/teacher";
import { useGame } from "../context/GameContext";

export default function StudentActivities() {
  const { user, activities, activityDone, completeActivity } = useGame();
  const mine = activities.filter((item) => {
    const course = COURSES.find((course) => course.id === item.courseId);
    if (!course) return true;
    return course.ageGroups.includes(user?.ageGroup || "over12");
  }).slice().reverse();

  const done = (activityId) => activityDone.some((item) => item.activityId === activityId && item.studentEmail === user.email);

  return (
    <section className="panel">
      <h2>Actividades</h2>
      <p>Tareas y prácticas que publicó tu docente en este dispositivo.</p>
      {mine.length === 0 && <p>Aún no hay actividades asignadas.</p>}
      <ul className="activity-list">
        {mine.map((item) => {
          const finished = done(item.id);
          return (
            <li key={item.id}>
              <strong>{item.title}</strong>
              <p>
                {ACTIVITY_TYPES.find((type) => type.id === item.type)?.label} · {COURSES.find((course) => course.id === item.courseId)?.title}
                {item.dueDate ? ` · Entrega ${item.dueDate}` : ""}
              </p>
              <p>{item.description}</p>
              {finished ? (
                <p className="feedback ok">Marcaste esta actividad como hecha.</p>
              ) : (
                <button className="btn btn-green" type="button" onClick={() => completeActivity(item.id, user.email)}>
                  Marcar como hecha
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
