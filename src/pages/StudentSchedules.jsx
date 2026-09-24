import { useGame } from "../context/GameContext";
import { ageLabel } from "../data/org";
import { WEEKDAYS } from "../data/staff";

export default function StudentSchedules() {
  const { user, schedules } = useGame();
  const mine = schedules.filter((item) => item.ageGroup === "all" || item.ageGroup === (user?.ageGroup || "over12"));

  return (
    <section className="panel">
      <h2>Horarios</h2>
      <p>Turnos de tu grupo: {ageLabel(user?.ageGroup)}.</p>
      {mine.length === 0 && <p>Coordinación aún no publicó horarios para tu grupo en este dispositivo.</p>}
      <ul className="activity-list">
        {mine.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong>
            <p>
              {WEEKDAYS.find((day) => day.id === item.day)?.label} · {item.startTime}–{item.endTime}
              {item.teacherName ? ` · ${item.teacherName}` : ""}
            </p>
            {item.notes && <p>{item.notes}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
